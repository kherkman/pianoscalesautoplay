window.AutoPlaySystem = (function() {
    // --- DEPENDENCIES BRIDGE ---
    let deps = {
        playNote: null,
        getEffectiveBaseTempoMs: null,
        getFullScaleRange: null,
        initAudioContext: null,
        getKeysData: null,
        globalActiveMidiNotes: null,
        updateSheetMusicHighlight: null,
        stopSongMaker: null,
        getIsSongMakerPlaying: null
    };

    // --- CONSTANTS ---
    const RHYTHM_PATTERNS = { 
        "standard": [0.25, 0.5, 0.5, 0.5, 0.75, 1, 1, 1, 1, 1, 1.5, 2], 
        "blues_swing": [0.75, 0.25, 1, 0.75, 0.25, 1.5, 1, 0.75, 0.25], 
        "reggae_skank": [1, 0.5, 0.5, 1, 0.5, 0.5, 1, 0.5, 0.5], 
        "jazz_swing": [0.66, 0.33, 1, 0.66, 0.33, 1.5, 0.66, 0.33, 1], 
        "latino_sync": [0.5, 0.25, 0.25, 1, 0.5, 0.75, 0.25, 1.5, 0.5, 0.5] 
    }; 
    const RHYTHM_STYLE_PROBABILITY = 0.5; 
    const MELODY_REPETITIONS = 2; 
    const TRANSPOSITION_LEVEL_SEQUENCE = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; 
    const MIN_MELODIC_INTERVAL = 3; 
    const MONORHYTHM_PROBABILITY = 0.1; 
    const SCALE_RUN_PROBABILITY = 0.05; 
    const SCALE_RUN_NOTE_DURATION_FACTOR = 0.30; 
    const TIME_SIGNATURE_CONFIGS = [ 
        { sig: "4/4", notesPerBar: 4, bars: 2 }, 
        { sig: "3/4", notesPerBar: 3, bars: 2 }, 
        { sig: "4/4", notesPerBar: 2, bars: 4 } 
    ]; 
    const SLOW_TEMPO_PROBABILITY = 0.2; 
    const SLOW_TEMPO_MULTIPLIER = 1.6; 
    const TEMPO_VARIATION_PERCENT = 0.03; 
    const BASS_HARMONY_PROBABILITY = 0.4; 
    const BASS_HARMONY_GAIN_SCALE = 0.5; 
    const PROBABILITY_PLAY_CHORDAL = 0.7; 
    const CHORD_VOICING_GAIN_SCALE = 0.6; 
    const NOTE_REPETITION_PROBABILITY = 0.2; 
    const MAX_NOTE_REPETITIONS = 2; 
    const ARPEGGIO_PROBABILITY = 0.75; 
    const ARPEGGIO_TYPES = [ [0, 2, 4], [0, 2, 4, 6] ]; 
    const ARPEGGIO_NOTE_DURATION_FACTOR = 0.4; 
    const BASS_ALTERNATION_PROBABILITY = 0.6; 
    const REPEATING_CHORD_PROBABILITY = 0.3; 
    const REPEATING_CHORD_DURATION_FACTOR = 0.75; 
    const REPEATING_CHORD_DEGREES = [2, 4, 6]; 
    const DUAL_TRACK_PROBABILITY = 0.25;
    const INVERTED_CHORD_PROBABILITY = 0.20;

    // --- STATE VARIABLES ---
    let autoPlayTimeoutId = null; 
    let originalGeneratedMelody = []; 
    let currentMelody = []; 
    let currentMelodyNoteIndex = 0; 
    let currentMelodyRepetitionCount = 0; 
    let currentTranspositionCycleIndex = 0; 
    let isAutoPlaying = false; 
    let lastAutoPlayedChordKeyElements = []; 
    let autoPlaySettings = { 
        originalRootPitchClass: '', 
        originalScalePattern: '', 
        isMonorhythmic: false, 
        currentMelodyLength: 8, 
        currentTempoMs: 750, 
        isPlayingArpeggio: false, 
        isPlayingRepeatingChords: false, 
        isPlayingDualTrack: false,
        isPlayingInvertedChord: false,
        currentSongSection: 'A', 
        currentSongSectionIndex: 0, 
        repeatingBassPattern: [], 
        currentRepeatingBassIndex: 0, 
        chordToneMelodyChordProgression: [], 
        currentChordInProgressionIndex: 0 
    }; 
    const SONG_STRUCTURE = ['A', 'B', 'A', 'C', 'B']; 
    let fixedOriginalScalePalette = []; 
    let isPlayingScaleRun = false; 
    let currentArpeggioBassNote = null; 

    // --- GENERATOR FUNCTIONS ---

    function generateRandomMelody(scalePaletteForGeneration, initialMelodyRootPitchClass, isMonorhythmic, melodyLength) { 
        if (!scalePaletteForGeneration || scalePaletteForGeneration.length === 0) return []; 
        const melody = []; 
        let previousNote = null; 
        let firstNoteForMelody = null; 
        const targetOctaves = [4, 3, 5]; 
        
        for (const oct of targetOctaves) { 
            const rootNoteName = initialMelodyRootPitchClass + oct; 
            firstNoteForMelody = scalePaletteForGeneration.find(n => n.note === rootNoteName); 
            if (firstNoteForMelody) break; 
        } 
        if (!firstNoteForMelody) firstNoteForMelody = scalePaletteForGeneration.find(n => n.pitchClass === initialMelodyRootPitchClass) || scalePaletteForGeneration[0]; 
        if (!firstNoteForMelody) return []; 
        previousNote = firstNoteForMelody; 
        
        let currentRhythmPatternSource = RHYTHM_PATTERNS.standard; 
        if (!isMonorhythmic && Math.random() < RHYTHM_STYLE_PROBABILITY) { 
            const styleKeys = Object.keys(RHYTHM_PATTERNS); 
            currentRhythmPatternSource = RHYTHM_PATTERNS[styleKeys[Math.floor(Math.random() * styleKeys.length)]]; 
        } 
        melody.push({ ...previousNote, durationFactor: isMonorhythmic ? 1 : currentRhythmPatternSource[Math.floor(Math.random() * currentRhythmPatternSource.length)] }); 
        
        for (let i = 1; i < melodyLength; i++) { 
            let candidates = []; 
            if (i === 1) { 
                const rootOfMelody = melody[0]; 
                const targetIntervalsSemitones = [3, 4, 7, -3, -4, -7]; 
                const preferredCandidates = []; 
                targetIntervalsSemitones.forEach(interval => { 
                    const targetMidi = rootOfMelody.midi + interval; 
                    const targetNote = scalePaletteForGeneration.find(n => n.midi === targetMidi); 
                    if (targetNote) preferredCandidates.push(targetNote); 
                }); 
                if (preferredCandidates.length > 0) candidates = preferredCandidates; 
            } 
            if (candidates.length === 0) { 
                const upwardCandidates = []; 
                const downwardCandidates = []; 
                scalePaletteForGeneration.forEach(candidateNote => { 
                    if (candidateNote.note === previousNote.note) return; 
                    const semitoneDiff = candidateNote.midi - previousNote.midi; 
                    if (Math.abs(semitoneDiff) >= MIN_MELODIC_INTERVAL) { 
                        if (semitoneDiff > 0) upwardCandidates.push(candidateNote); 
                        else downwardCandidates.push(candidateNote); 
                    } 
                }); 
                const preferUp = Math.random() < 0.5; 
                if (preferUp && upwardCandidates.length > 0) candidates = upwardCandidates; 
                else if (downwardCandidates.length > 0) candidates = downwardCandidates; 
                else if (upwardCandidates.length > 0) candidates = upwardCandidates; 
                else candidates = scalePaletteForGeneration.filter(n => n.note !== previousNote.note); 
            } 
            let nextNoteInfo; 
            if (candidates.length > 0) { 
                nextNoteInfo = candidates[Math.floor(Math.random() * candidates.length)]; 
            } else if (melody.length > 0) { 
                nextNoteInfo = melody[0]; 
            } else { 
                break; 
            } 
            previousNote = nextNoteInfo; 
            melody.push({ ...nextNoteInfo, durationFactor: isMonorhythmic ? 1 : currentRhythmPatternSource[Math.floor(Math.random() * currentRhythmPatternSource.length)] }); 
            
            if (i < melodyLength -1 && Math.random() < NOTE_REPETITION_PROBABILITY) { 
                const numRepetitions = Math.floor(Math.random() * MAX_NOTE_REPETITIONS) + 1; 
                for (let r = 0; r < numRepetitions && i < melodyLength -1; r++) { 
                    melody.push({ ...previousNote, durationFactor: isMonorhythmic ? 1 : currentRhythmPatternSource[Math.floor(Math.random() * currentRhythmPatternSource.length)] }); 
                    i++; 
                } 
            } 
        } 
        return melody; 
    }
    
    function generateArpeggioMelody(scalePaletteForGeneration, initialMelodyRootPitchClass, melodyLength) { 
        if (!scalePaletteForGeneration || scalePaletteForGeneration.length === 0) return []; 
        const arpeggio = []; 
        let firstNoteForArpeggio = null; 
        const targetOctaves = [4, 3, 5]; 
        for (const oct of targetOctaves) { 
            const rootNoteName = initialMelodyRootPitchClass + oct; 
            firstNoteForArpeggio = scalePaletteForGeneration.find(n => n.note === rootNoteName); 
            if (firstNoteForArpeggio) break; 
        } 
        if (!firstNoteForArpeggio) firstNoteForArpeggio = scalePaletteForGeneration.find(n => n.pitchClass === initialMelodyRootPitchClass) || scalePaletteForGeneration[0]; 
        if (!firstNoteForArpeggio) return []; 
        
        const arpTypePattern = ARPEGGIO_TYPES[Math.floor(Math.random() * ARPEGGIO_TYPES.length)]; 
        const isAscending = Math.random() < 0.5; 
        let currentRootNoteInArpCycle = firstNoteForArpeggio; 
        let currentArpNoteIndexInPattern = 0; 
        
        for (let i = 0; i < melodyLength; i++) { 
            const scaleDegreeOffset = arpTypePattern[currentArpNoteIndexInPattern]; 
            let rootPaletteIndexOfCurrentCycle = scalePaletteForGeneration.findIndex(n => n.midi === currentRootNoteInArpCycle.midi); 
            if (rootPaletteIndexOfCurrentCycle === -1) rootPaletteIndexOfCurrentCycle = 0; 
            
            let targetNoteIndexInPalette; 
            targetNoteIndexInPalette = rootPaletteIndexOfCurrentCycle + scaleDegreeOffset; 
            targetNoteIndexInPalette = Math.max(0, Math.min(scalePaletteForGeneration.length - 1, targetNoteIndexInPalette)); 
            const noteForArpeggio = scalePaletteForGeneration[targetNoteIndexInPalette]; 
            
            if (noteForArpeggio) { 
                let durationFactor = ARPEGGIO_NOTE_DURATION_FACTOR; 
                arpeggio.push({ ...noteForArpeggio, durationFactor: durationFactor }); 
                currentArpNoteIndexInPattern = (currentArpNoteIndexInPattern + 1) % arpTypePattern.length; 
                if (currentArpNoteIndexInPattern === 0) { 
                    const nextOctaveRootMidi = currentRootNoteInArpCycle.midi + (isAscending ? 12 : -12); 
                    const nextOctaveRoot = scalePaletteForGeneration.find(n => n.midi === nextOctaveRootMidi); 
                    currentRootNoteInArpCycle = nextOctaveRoot || currentRootNoteInArpCycle; 
                } 
            } else { 
                break; 
            } 
        } 
        if (!isAscending && arpeggio.length > 1 && Math.random() < 0.7) { 
            return arpeggio.reverse(); 
        } 
        return arpeggio; 
    }
    
    function generateRepeatingChordVoicingSequence(scalePalette, rootPitchClass, melodyLength) { 
        if (!scalePalette || scalePalette.length < 3) return []; 
        const sequence = []; 
        let rootNoteForChord = scalePalette.find(n => n.pitchClass === rootPitchClass && n.octave === 3) || scalePalette.find(n => n.pitchClass === rootPitchClass && n.octave === 4) || scalePalette.find(n => n.pitchClass === rootPitchClass) || scalePalette[0]; 
        if (!rootNoteForChord) return []; 
        
        const rootIndexInPalette = scalePalette.indexOf(rootNoteForChord); 
        if (rootIndexInPalette === -1) return []; 
        const chordNotesData = []; 
        
        for (const degree of REPEATING_CHORD_DEGREES) { 
            if ((rootIndexInPalette + degree) < scalePalette.length) { 
                chordNotesData.push(scalePalette[rootIndexInPalette + degree]); 
            } 
        } 
        if (chordNotesData.length < 2) return []; 
        for (let i = 0; i < melodyLength; i++) { 
            sequence.push({ notes: chordNotesData, durationFactor: REPEATING_CHORD_DURATION_FACTOR, conceptualRoot: rootNoteForChord }); 
        } 
        return sequence; 
    }
    
    function generateChordToneMelody(scalePalette, rootPitchClass, melodyLength) { 
        if (!scalePalette || scalePalette.length === 0) return []; 
        const melody = []; 
        
        const diatonicChords = [];
        let rootIndex = scalePalette.findIndex(n => n.pitchClass === rootPitchClass && n.octave === 4);
        if (rootIndex === -1) rootIndex = 0;
        
        for (let i = 0; i < 7; i++) {
            let baseIdx = rootIndex + i;
            let chordNotes = [];
            if (scalePalette[baseIdx]) chordNotes.push(scalePalette[baseIdx]);
            if (scalePalette[baseIdx + 2]) chordNotes.push(scalePalette[baseIdx + 2]);
            if (scalePalette[baseIdx + 4]) chordNotes.push(scalePalette[baseIdx + 4]);
            if (chordNotes.length > 0) diatonicChords.push({ notes: chordNotes });
        }

        if (diatonicChords.length === 0) return generateRandomMelody(scalePalette, rootPitchClass, false, melodyLength); 
        
        const chordProgressionIndices = [0, 3 % diatonicChords.length, 4 % diatonicChords.length, 0]; 
        autoPlaySettings.chordToneMelodyChordProgression = chordProgressionIndices.map(idx => diatonicChords[idx]); 
        autoPlaySettings.currentChordInProgressionIndex = 0; 
        
        let notesInCurrentChord = autoPlaySettings.chordToneMelodyChordProgression[0].notes; 
        let previousNote = notesInCurrentChord.length > 0 ? notesInCurrentChord[Math.floor(Math.random() * notesInCurrentChord.length)] : scalePalette[Math.floor(Math.random() * scalePalette.length)]; 
        melody.push({ ...previousNote, durationFactor: RHYTHM_PATTERNS.standard[Math.floor(Math.random() * RHYTHM_PATTERNS.standard.length)] }); 
        
        for (let i = 1; i < melodyLength; i++) { 
            if (i % Math.ceil(melodyLength / chordProgressionIndices.length) === 0 && autoPlaySettings.currentChordInProgressionIndex < chordProgressionIndices.length -1) { 
                autoPlaySettings.currentChordInProgressionIndex++; 
                notesInCurrentChord = autoPlaySettings.chordToneMelodyChordProgression[autoPlaySettings.currentChordInProgressionIndex].notes; 
            } 
            let candidates = notesInCurrentChord.filter(n => n.note !== previousNote.note && Math.abs(n.midi - previousNote.midi) < 10); 
            if (candidates.length === 0) candidates = notesInCurrentChord.filter(n => n.note !== previousNote.note); 
            if (candidates.length === 0) candidates = scalePalette.filter(n => n.note !== previousNote.note && Math.abs(n.midi - previousNote.midi) < 7); 
            if (candidates.length === 0) candidates = [previousNote]; 
            
            previousNote = candidates[Math.floor(Math.random() * candidates.length)]; 
            melody.push({ ...previousNote, durationFactor: RHYTHM_PATTERNS.standard[Math.floor(Math.random() * RHYTHM_PATTERNS.standard.length)] }); 
        } 
        return melody; 
    }
    
    function generateDualTrackProgression(scalePalette, rootPitchClass) {
        if (!scalePalette || scalePalette.length === 0) return [];

        const diatonicChords = [];
        let rootIndex = scalePalette.findIndex(n => n.pitchClass === rootPitchClass && n.octave === 4);
        if (rootIndex === -1) rootIndex = 0;
        
        for (let i = 0; i < 7; i++) {
            let baseIdx = rootIndex + i;
            let chordNotes = [];
            if (scalePalette[baseIdx]) chordNotes.push(scalePalette[baseIdx]);
            if (scalePalette[baseIdx + 2]) chordNotes.push(scalePalette[baseIdx + 2]);
            if (scalePalette[baseIdx + 4]) chordNotes.push(scalePalette[baseIdx + 4]);
            if (chordNotes.length > 0) diatonicChords.push(chordNotes);
        }
        if (diatonicChords.length === 0) return [];

        const selectedChords = [];
        for(let i=0; i<4; i++) {
            selectedChords.push(diatonicChords[Math.floor(Math.random() * diatonicChords.length)]);
        }

        const arpPattern = ARPEGGIO_TYPES[Math.floor(Math.random() * ARPEGGIO_TYPES.length)];
        const styleKeys = Object.keys(RHYTHM_PATTERNS);
        const lowerRhythm = RHYTHM_PATTERNS[styleKeys[Math.floor(Math.random() * styleKeys.length)]];
        const upperRhythm = RHYTHM_PATTERNS[styleKeys[Math.floor(Math.random() * styleKeys.length)]];

        const rawEvents = [];
        let currentTime = 0;
        const chordDuration = 4.0; 

        selectedChords.forEach(chord => {
            const chordStartTime = currentTime;
            
            // Lower Arp Track
            let lowerTime = 0;
            let arpIndex = 0;
            let lowerRhythmIndex = 0;
            while (lowerTime < chordDuration) {
                const dur = lowerRhythm[lowerRhythmIndex % lowerRhythm.length];
                if (lowerTime + dur > chordDuration + 0.01) break; 
                
                const degree = arpPattern[arpIndex % arpPattern.length];
                const chordIndex = Math.floor(degree / 2);
                let noteSource = chord[chordIndex] || chord[0];
                
                let lowerMidi = noteSource.midi - 12;
                if (lowerMidi > 60) lowerMidi -= 12; 
                let lowerNote = fixedOriginalScalePalette.find(n => n.midi === lowerMidi) || noteSource; 

                rawEvents.push({ time: chordStartTime + lowerTime, type: 'lower', note: lowerNote });
                
                lowerTime += dur;
                arpIndex++;
                lowerRhythmIndex++;
            }

            // Upper Chordal Rhythm Track
            let upperTime = 0;
            let upperRhythmIndex = 0;
            while (upperTime < chordDuration) {
                const dur = upperRhythm[upperRhythmIndex % upperRhythm.length];
                if (upperTime + dur > chordDuration + 0.01) break;

                const numNotes = Math.floor(Math.random() * 3) + 1;
                const upperNotes = [];
                const chordCopy = [...chord]; 
                
                for(let n=0; n<numNotes; n++) {
                    if(chordCopy.length === 0) break;
                    const randIndex = Math.floor(Math.random() * chordCopy.length);
                    const randomChordNote = chordCopy.splice(randIndex, 1)[0];
                    let upperMidi = randomChordNote.midi + 12;
                    let targetNote = fixedOriginalScalePalette.find(nn => nn.midi === upperMidi);
                    if(!targetNote) targetNote = fixedOriginalScalePalette.find(nn => nn.pitchClass === randomChordNote.pitchClass && nn.octave === 5) || randomChordNote;
                    upperNotes.push(targetNote);
                }
                
                if(upperNotes.length === 0) upperNotes.push(chord[0]);

                rawEvents.push({ time: chordStartTime + upperTime, type: 'upper', notes: upperNotes });
                
                upperTime += dur;
                upperRhythmIndex++;
            }

            currentTime += chordDuration;
        });

        rawEvents.sort((a, b) => a.time - b.time);

        const mergedTimeline = [];
        let currentGroup = null;

        for (const event of rawEvents) {
            if (!currentGroup) {
                currentGroup = { time: event.time, notes: [] };
                if (event.type === 'lower') currentGroup.notes.push(event.note);
                if (event.type === 'upper') currentGroup.notes.push(...event.notes);
            } else if (Math.abs(event.time - currentGroup.time) < 0.01) {
                if (event.type === 'lower') currentGroup.notes.push(event.note);
                if (event.type === 'upper') currentGroup.notes.push(...event.notes);
            } else {
                mergedTimeline.push(currentGroup);
                currentGroup = { time: event.time, notes: [] };
                if (event.type === 'lower') currentGroup.notes.push(event.note);
                if (event.type === 'upper') currentGroup.notes.push(...event.notes);
            }
        }
        if (currentGroup) mergedTimeline.push(currentGroup);

        const finalMelody = [];
        for (let i = 0; i < mergedTimeline.length; i++) {
            const current = mergedTimeline[i];
            const next = mergedTimeline[i + 1];
            const durationFactor = next ? (next.time - current.time) : ((chordDuration * 4) - current.time); 
            
            if (durationFactor > 0.001) {
                finalMelody.push({
                    isDualTrack: true,
                    notes: current.notes,
                    durationFactor: durationFactor
                });
            }
        }

        return finalMelody;
    }

    function generateInvertedChordMelody(scalePalette, rootPitchClass) {
        if (!scalePalette || scalePalette.length === 0) return [];

        const diatonicChords = [];
        let rootIndex = scalePalette.findIndex(n => n.pitchClass === rootPitchClass && n.octave === 3);
        if (rootIndex === -1) rootIndex = scalePalette.findIndex(n => n.pitchClass === rootPitchClass);
        if (rootIndex === -1) rootIndex = 0;

        for (let i = 0; i < 7; i++) {
            let baseIdx = rootIndex + i;
            let chordNotes = [];
            if (scalePalette[baseIdx]) chordNotes.push(scalePalette[baseIdx]);
            if (scalePalette[baseIdx + 2]) chordNotes.push(scalePalette[baseIdx + 2]);
            if (scalePalette[baseIdx + 4]) chordNotes.push(scalePalette[baseIdx + 4]);
            if (chordNotes.length > 0) diatonicChords.push(chordNotes);
        }
        if (diatonicChords.length === 0) return [];

        const numChords = Math.floor(Math.random() * 5) + 2; 
        let validSplits = [];
        for(let i = 1; i < 16; i++) validSplits.push(i); 
        validSplits.sort(() => Math.random() - 0.5);
        let splits = validSplits.slice(0, numChords - 1).sort((a,b) => a - b);
        let durations = [];
        let last = 0;
        splits.forEach(s => { durations.push(s - last); last = s; });
        durations.push(16 - last);

        let selectedChords = [];
        for (let c = 0; c < numChords; c++) {
            let baseChord;
            if (c === 0) {
                baseChord = diatonicChords.find(ch => ch[0] && ch[0].pitchClass === rootPitchClass);
                if (!baseChord) baseChord = diatonicChords[0];
            } else {
                baseChord = diatonicChords[Math.floor(Math.random() * diatonicChords.length)];
            }
            
            let lowerBaseChord = baseChord.map(n => {
                let lowerMidi = n.midi;
                while (lowerMidi > 55) lowerMidi -= 12;
                while (lowerMidi < 36) lowerMidi += 12;
                let found = scalePalette.find(p => p.midi === lowerMidi);
                return found || n;
            });

            let voicedChord = [];
            if (c > 0) {
                let prevChord = selectedChords[c - 1];
                lowerBaseChord.forEach(n => {
                    let shared = prevChord.find(p => p.pitchClass === n.pitchClass);
                    if (shared) {
                        voicedChord.push(shared);
                    } else {
                        let prevCenter = prevChord.reduce((sum, p) => sum + p.midi, 0) / prevChord.length;
                        let bestNote = n;
                        let minDiff = 999;
                        for (let oct = -2; oct <= 2; oct++) {
                            let testMidi = n.midi + oct * 12;
                            let diff = Math.abs(testMidi - prevCenter);
                            if (diff < minDiff) {
                                minDiff = diff;
                                let candidate = scalePalette.find(p => p.midi === testMidi);
                                if (candidate) bestNote = candidate;
                            }
                        }
                        voicedChord.push(bestNote);
                    }
                });
            } else {
                voicedChord = lowerBaseChord;
            }

            if (c === 0 && voicedChord.length > 0) {
                let rootNote = voicedChord.find(n => n.pitchClass === rootPitchClass);
                if (rootNote) {
                    let minMidi = Math.min(...voicedChord.map(n => n.midi));
                    if (rootNote.midi > minMidi) {
                        let lowerRootMidi = rootNote.midi - 12;
                        let newRoot = scalePalette.find(p => p.midi === lowerRootMidi);
                        if (newRoot) voicedChord = voicedChord.map(n => n === rootNote ? newRoot : n);
                    }
                } else {
                    let pureRoot = scalePalette.find(n => n.pitchClass === rootPitchClass && n.midi >= 36 && n.midi <= 48) || scalePalette.find(n => n.pitchClass === rootPitchClass);
                    if (pureRoot) voicedChord = [pureRoot];
                }
            }

            voicedChord.sort((a,b) => a.midi - b.midi);
            selectedChords.push(voicedChord);
        }

        const generateMelodyForChord = (chord, dur) => {
            let mel = [];
            let t = 0;
            const allowedDurs = [0.25, 0.5, 0.5, 1.0, 1.0, 1.5];
            while (t < dur) {
                let d = allowedDurs[Math.floor(Math.random() * allowedDurs.length)];
                if (t + d > dur) d = dur - t; 
                
                let baseN = chord[Math.floor(Math.random() * chord.length)];
                let upperMidi = baseN.midi;
                while(upperMidi < 60) upperMidi += 12;
                if(upperMidi > 80) upperMidi -= 12;
                let upperN = scalePalette.find(p => p.midi === upperMidi) || baseN;
                
                mel.push({ offset: t, dur: d, note: upperN });
                t += d;
            }
            return mel;
        };

        let chordMelodies = [];
        let altLastChordMelody = [];
        for (let c = 0; c < numChords; c++) {
            chordMelodies.push(generateMelodyForChord(selectedChords[c], durations[c]));
            if (c === numChords - 1) {
                altLastChordMelody = generateMelodyForChord(selectedChords[c], durations[c]);
            }
        }

        let finalMelodyBlocks = [];
        for (let rep = 0; rep < 4; rep++) {
            for (let c = 0; c < numChords; c++) {
                let chord = selectedChords[c];
                let isLast = (c === numChords - 1);
                let melodyToPlay = (isLast && (rep === 1 || rep === 3)) ? altLastChordMelody : chordMelodies[c];
                
                melodyToPlay.forEach(m => {
                    finalMelodyBlocks.push({
                        isDualTrack: true, 
                        notes: [...chord, m.note],
                        durationFactor: m.dur
                    });
                });
            }
        }

        return finalMelodyBlocks;
    }

    function generateRepeatingBassPattern(scalePalette, rootPitchClass, patternLength = 4) { 
        const bassPattern = []; 
        let startNote = scalePalette.find(n => n.pitchClass === rootPitchClass && n.octave === 3) || scalePalette.find(n => n.pitchClass === rootPitchClass && n.octave === 2) || (scalePalette.length > 0 ? scalePalette[0] : null); 
        if (!startNote) return []; 
        let currentNote = startNote; 
        for (let i = 0; i < patternLength; i++) { 
            bassPattern.push(currentNote); 
            let currentIndex = scalePalette.indexOf(currentNote); 
            if(currentIndex === -1) currentIndex = 0; 
            let nextIndex = currentIndex + (Math.random() < 0.5 ? 1 : -1); 
            nextIndex = Math.max(0, Math.min(scalePalette.length - 1, nextIndex)); 
            currentNote = scalePalette[nextIndex]; 
        } 
        return bassPattern; 
    }
    
    function transposeAndSnapMelodyToPalette(baseMelody, semitonesToTranspose, targetScalePalette) { 
        const transposedAndSnapped = []; 
        if (!targetScalePalette || targetScalePalette.length === 0) return baseMelody; 
        
        for (const originalMelodyNote of baseMelody) { 
            if (Array.isArray(originalMelodyNote.notes)) { 
                const snappedChordNotes = []; 
                let allNotesSnapped = true; 
                for (const chordSubNote of originalMelodyNote.notes) { 
                    const targetMidi = chordSubNote.midi + semitonesToTranspose; 
                    let closestNoteInPalette = targetScalePalette[0]; 
                    let minDiff = Math.abs(targetMidi - closestNoteInPalette.midi); 
                    for (let k = 1; k < targetScalePalette.length; k++) { 
                        const diff = Math.abs(targetMidi - targetScalePalette[k].midi); 
                        if (diff < minDiff) { 
                            minDiff = diff; closestNoteInPalette = targetScalePalette[k]; 
                        } 
                    } 
                    if(closestNoteInPalette) snappedChordNotes.push(closestNoteInPalette); 
                    else allNotesSnapped = false; 
                } 
                if(allNotesSnapped && snappedChordNotes.length > 0) { 
                    transposedAndSnapped.push({ 
                        notes: snappedChordNotes, 
                        durationFactor: originalMelodyNote.durationFactor, 
                        conceptualRoot: snappedChordNotes[0], 
                        isDualTrack: originalMelodyNote.isDualTrack 
                    }); 
                } else { 
                    transposedAndSnapped.push({...originalMelodyNote}); 
                } 
            } else { 
                const targetMidi = originalMelodyNote.midi + semitonesToTranspose; 
                let closestNoteInPalette = targetScalePalette[0]; 
                let minDiff = Math.abs(targetMidi - closestNoteInPalette.midi); 
                for (let k = 1; k < targetScalePalette.length; k++) { 
                    const diff = Math.abs(targetMidi - targetScalePalette[k].midi); 
                    if (diff < minDiff) { 
                        minDiff = diff; closestNoteInPalette = targetScalePalette[k]; 
                    } 
                } 
                transposedAndSnapped.push({ ...closestNoteInPalette, durationFactor: originalMelodyNote.durationFactor }); 
            } 
        } 
        return transposedAndSnapped.length > 0 ? transposedAndSnapped : baseMelody; 
    }
    
    function generateScaleRun() { 
        if(fixedOriginalScalePalette.length === 0) return []; 
        const oneOctaveScale = []; 
        let preferredStart = fixedOriginalScalePalette.find(n => n.octave === 4 && n.pitchClass === autoPlaySettings.originalRootPitchClass) || fixedOriginalScalePalette.find(n => n.octave === 3 && n.pitchClass === autoPlaySettings.originalRootPitchClass) || fixedOriginalScalePalette.find(n => n.pitchClass === autoPlaySettings.originalRootPitchClass) || fixedOriginalScalePalette[0]; 
        let startIndex = fixedOriginalScalePalette.indexOf(preferredStart); 
        if(startIndex === -1) startIndex = 0; 
        const scalePatternLength = autoPlaySettings.originalScalePattern.split('').length; 
        
        for (let i = 0; i <= scalePatternLength; i++) { 
            const noteIndex = startIndex + i; 
            if (noteIndex < fixedOriginalScalePalette.length) { 
                oneOctaveScale.push({ ...fixedOriginalScalePalette[noteIndex], durationFactor: SCALE_RUN_NOTE_DURATION_FACTOR }); 
            } else break; 
        } 
        if (Math.random() < 0.5 && oneOctaveScale.length > 1) return oneOctaveScale.reverse(); 
        return oneOctaveScale; 
    }

    // --- PLAYBACK ENGINE ---

    function playNextMelodyNote() { 
        if (!isAutoPlaying) { stopAutoPlay(true); return; } 
        const playingNotesDisplay = document.getElementById('currentlyPlayingNotesDisplay'); 
        if(playingNotesDisplay) playingNotesDisplay.innerHTML = ''; 
        lastAutoPlayedChordKeyElements.forEach(el => el.classList.remove('auto-playing-note')); 
        lastAutoPlayedChordKeyElements = []; 
        
        if (deps.globalActiveMidiNotes) deps.globalActiveMidiNotes.clear();
        
        if (currentMelody.length === 0) { console.warn("Current melody empty."); stopAutoPlay(); return; } 
        const currentBeatData = currentMelody[currentMelodyNoteIndex]; 
        let mainNoteForBeatLogic, durationFactorForBeat; 
        
        if (currentBeatData.isDualTrack) {
            mainNoteForBeatLogic = currentBeatData.notes[0];
            durationFactorForBeat = currentBeatData.durationFactor;
        } else if (autoPlaySettings.isPlayingRepeatingChords && Array.isArray(currentBeatData.notes)) { 
            mainNoteForBeatLogic = currentBeatData.conceptualRoot || currentBeatData.notes[0]; 
            durationFactorForBeat = currentBeatData.durationFactor; 
        } else { 
            mainNoteForBeatLogic = currentBeatData; 
            durationFactorForBeat = currentBeatData.durationFactor; 
        } 
        
        if (!mainNoteForBeatLogic || (!mainNoteForBeatLogic.frequency && !currentBeatData.isDualTrack)) { 
            console.warn("Invalid main note for beat logic, skipping.", mainNoteForBeatLogic); 
            currentMelodyNoteIndex = (currentMelodyNoteIndex + 1) % currentMelody.length; 
            if (currentMelodyNoteIndex === 0) currentMelodyRepetitionCount++; 
            autoPlayTimeoutId = setTimeout(playNextMelodyNote, autoPlaySettings.currentTempoMs); 
            return; 
        } 
        
        const notesToPlayOnThisBeat = []; 
        if (currentBeatData.isDualTrack) {
            currentBeatData.notes.forEach(note => { notesToPlayOnThisBeat.push({ noteData: note, gain: 0.8 }); });
        } else if (autoPlaySettings.isPlayingRepeatingChords && Array.isArray(currentBeatData.notes)) { 
            currentBeatData.notes.forEach(note => { notesToPlayOnThisBeat.push({ noteData: note, gain: CHORD_VOICING_GAIN_SCALE }); }); 
        } else { 
            notesToPlayOnThisBeat.push({ noteData: mainNoteForBeatLogic, gain: 1 }); 
        } 
        
        if (!isPlayingScaleRun && !currentBeatData.isDualTrack) { 
            let bassRootForCurrentBeat = mainNoteForBeatLogic; 
            if (autoPlaySettings.isPlayingRepeatingChords && currentBeatData.conceptualRoot) { 
                bassRootForCurrentBeat = currentBeatData.conceptualRoot; 
            } else if (autoPlaySettings.repeatingBassPattern.length > 0 && autoPlaySettings.currentSongSection === 'B' && !autoPlaySettings.isPlayingArpeggio) { 
                bassRootForCurrentBeat = autoPlaySettings.repeatingBassPattern[autoPlaySettings.currentRepeatingBassIndex]; 
            } else if (autoPlaySettings.currentSongSection === 'C' && autoPlaySettings.chordToneMelodyChordProgression.length > 0) { 
                const currentChordForBass = autoPlaySettings.chordToneMelodyChordProgression[autoPlaySettings.currentChordInProgressionIndex]; 
                bassRootForCurrentBeat = currentChordForBass.notes[0] || mainNoteForBeatLogic; 
            } 
            
            const bassNoteMidiTarget = bassRootForCurrentBeat.midi - 12; 
            let actualBassNoteInScale = fixedOriginalScalePalette.find(n => n.midi === bassNoteMidiTarget); 
            
            if (autoPlaySettings.isPlayingArpeggio && currentMelodyNoteIndex > 0 && Math.random() < BASS_ALTERNATION_PROBABILITY) { 
                const arpRootMidi = originalGeneratedMelody[0].midi; 
                const currentTransposition = TRANSPOSITION_LEVEL_SEQUENCE[currentTranspositionCycleIndex]; 
                const effectiveArpRootMidi = arpRootMidi + currentTransposition; 
                const effectiveArpRootInPalette = fixedOriginalScalePalette.find(n => n.midi === effectiveArpRootMidi) || fixedOriginalScalePalette[0]; 
                const arpRootIndexInPalette = fixedOriginalScalePalette.indexOf(effectiveArpRootInPalette); 
                if (arpRootIndexInPalette !== -1 && (arpRootIndexInPalette + 4) < fixedOriginalScalePalette.length) { 
                    const fifthDegreeNote = fixedOriginalScalePalette[arpRootIndexInPalette + 4]; 
                    const fifthBassMidiTarget = fifthDegreeNote.midi - 12; 
                    const alternateBassTarget = fixedOriginalScalePalette.find(n => n.midi === fifthBassMidiTarget) || fixedOriginalScalePalette.find(n => n.midi === fifthDegreeNote.midi - 24); 
                    if(alternateBassTarget) actualBassNoteInScale = alternateBassTarget; 
                } 
            } 
            
            currentArpeggioBassNote = actualBassNoteInScale; 
            if (actualBassNoteInScale && actualBassNoteInScale.frequency) { 
                if(!notesToPlayOnThisBeat.find(n => n.noteData.midi === actualBassNoteInScale.midi)) { 
                    notesToPlayOnThisBeat.push({ noteData: actualBassNoteInScale, gain: 0.7 }); 
                } 
                if (Math.random() < BASS_HARMONY_PROBABILITY && fixedOriginalScalePalette.length > 0) { 
                    const bassNoteIndexInPalette = fixedOriginalScalePalette.findIndex(n => n.midi === actualBassNoteInScale.midi); 
                    if (bassNoteIndexInPalette !== -1) { 
                        if ((bassNoteIndexInPalette + 2) < fixedOriginalScalePalette.length) { 
                            const bassHarmony3rd = fixedOriginalScalePalette[bassNoteIndexInPalette + 2]; 
                            if (bassHarmony3rd && bassHarmony3rd.frequency && !notesToPlayOnThisBeat.find(n=>n.noteData.midi === bassHarmony3rd.midi)) { 
                                notesToPlayOnThisBeat.push({ noteData: bassHarmony3rd, gain: 0.7 * BASS_HARMONY_GAIN_SCALE }); 
                            } 
                        } 
                        if ((bassNoteIndexInPalette + 4) < fixedOriginalScalePalette.length) { 
                            const bassHarmony5th = fixedOriginalScalePalette[bassNoteIndexInPalette + 4]; 
                            if (bassHarmony5th && bassHarmony5th.frequency && !notesToPlayOnThisBeat.find(n=>n.noteData.midi === bassHarmony5th.midi)) { 
                                notesToPlayOnThisBeat.push({ noteData: bassHarmony5th, gain: 0.7 * BASS_HARMONY_GAIN_SCALE }); 
                            } 
                        } 
                    } 
                } 
            } 
        } 
        
        if (!isPlayingScaleRun && !currentBeatData.isDualTrack && !autoPlaySettings.isPlayingArpeggio && !autoPlaySettings.isPlayingRepeatingChords && autoPlaySettings.currentSongSection !== 'C' && Math.random() < PROBABILITY_PLAY_CHORDAL) { 
            if (fixedOriginalScalePalette && fixedOriginalScalePalette.length > 0) { 
                const mainMelodyNoteIndexInPalette = fixedOriginalScalePalette.findIndex(n => n.midi === mainNoteForBeatLogic.midi); 
                if (mainMelodyNoteIndexInPalette !== -1) { 
                    if ((mainMelodyNoteIndexInPalette - 2) >= 0) { 
                        const chordNote2 = fixedOriginalScalePalette[mainMelodyNoteIndexInPalette - 2]; 
                        if (chordNote2 && chordNote2.frequency && !notesToPlayOnThisBeat.find(n=>n.noteData.midi === chordNote2.midi)) { 
                            notesToPlayOnThisBeat.push({ noteData: chordNote2, gain: CHORD_VOICING_GAIN_SCALE }); 
                        } 
                    } 
                    if ((mainMelodyNoteIndexInPalette - 4) >= 0) { 
                        const chordNote3 = fixedOriginalScalePalette[mainMelodyNoteIndexInPalette - 4]; 
                        if (chordNote3 && chordNote3.frequency && !notesToPlayOnThisBeat.find(n=>n.noteData.midi === chordNote3.midi)) { 
                            notesToPlayOnThisBeat.push({ noteData: chordNote3, gain: CHORD_VOICING_GAIN_SCALE }); 
                        } 
                    } 
                } 
            } 
        } 
        
        const notesPlayedMidi = []; 
        notesToPlayOnThisBeat.forEach(item => { 
            if (item.noteData && item.noteData.frequency && deps.playNote) deps.playNote(item.noteData.frequency, item.gain, item.noteData.midi, true); 
            if (item.noteData) notesPlayedMidi.push(item.noteData.midi); 
            
            if (item.noteData && deps.globalActiveMidiNotes) deps.globalActiveMidiNotes.add(item.noteData.midi);

            const keyDataToHighlight = deps.getKeysData().find(kd => item.noteData && kd.note === item.noteData.note); 
            if (keyDataToHighlight) { 
                const domElement = document.getElementById('key' + keyDataToHighlight.idSuffix); 
                if (domElement && !domElement.classList.contains('auto-playing-note')) { 
                    domElement.classList.add('auto-playing-note'); 
                    lastAutoPlayedChordKeyElements.push(domElement); 
                } 
            } 
        }); 
        
        if (deps.updateSheetMusicHighlight) deps.updateSheetMusicHighlight();

        if(playingNotesDisplay) { 
            const uniqueDisplayNotes = [...new Set(notesPlayedMidi.map(midi => (deps.getKeysData().find(k => k.midi === midi) || {}).note).filter(Boolean))]; 
            uniqueDisplayNotes.sort().forEach(noteName => { 
                const noteEl = document.createElement('span'); 
                noteEl.classList.add('playing-note-item'); 
                noteEl.textContent = noteName; 
                playingNotesDisplay.appendChild(noteEl); 
            }); 
        } 
        
        const duration = durationFactorForBeat * autoPlaySettings.currentTempoMs; 
        currentMelodyNoteIndex++; 
        if (currentMelodyNoteIndex >= currentMelody.length) { 
            currentMelodyNoteIndex = 0; 
            currentMelodyRepetitionCount++; 
            const repsForCurrentSegment = autoPlaySettings.isPlayingInvertedChord ? 1 : (autoPlaySettings.isPlayingDualTrack ? 4 : (isPlayingScaleRun || autoPlaySettings.isPlayingRepeatingChords || autoPlaySettings.currentSongSection === 'C' ? 1 : MELODY_REPETITIONS)); 
            
            if (currentMelodyRepetitionCount >= repsForCurrentSegment) { 
                currentMelodyRepetitionCount = 0; 
                currentArpeggioBassNote = null; 
                if (autoPlaySettings.currentSongSection === 'B') autoPlaySettings.currentRepeatingBassIndex = (autoPlaySettings.currentRepeatingBassIndex + 1) % (autoPlaySettings.repeatingBassPattern.length || 1); 
                
                if (isPlayingScaleRun) { 
                    isPlayingScaleRun = false; 
                    currentTranspositionCycleIndex = (currentTranspositionCycleIndex + 1) % TRANSPOSITION_LEVEL_SEQUENCE.length; 
                    if (currentTranspositionCycleIndex === 0) autoPlaySettings.currentSongSectionIndex = (autoPlaySettings.currentSongSectionIndex + 1) % SONG_STRUCTURE.length; 
                } else if (Math.random() < SCALE_RUN_PROBABILITY && !autoPlaySettings.isPlayingDualTrack && !autoPlaySettings.isPlayingInvertedChord && !autoPlaySettings.isPlayingRepeatingChords && autoPlaySettings.currentSongSection !== 'C') { 
                    const scaleRun = generateScaleRun(); 
                    if (scaleRun.length > 0) { 
                        currentMelody = scaleRun; 
                        isPlayingScaleRun = true; 
                        autoPlaySettings.isPlayingArpeggio = false; 
                        autoPlaySettings.isPlayingRepeatingChords = false; 
                        autoPlaySettings.isPlayingDualTrack = false;
                        autoPlaySettings.isPlayingInvertedChord = false;
                    } else { 
                        isPlayingScaleRun = false; 
                        currentTranspositionCycleIndex = (currentTranspositionCycleIndex + 1) % TRANSPOSITION_LEVEL_SEQUENCE.length; 
                        if (currentTranspositionCycleIndex === 0) autoPlaySettings.currentSongSectionIndex = (autoPlaySettings.currentSongSectionIndex + 1) % SONG_STRUCTURE.length;
                    } 
                } else { 
                    isPlayingScaleRun = false; 
                    currentTranspositionCycleIndex = (currentTranspositionCycleIndex + 1) % TRANSPOSITION_LEVEL_SEQUENCE.length; 
                    if (currentTranspositionCycleIndex === 0) { autoPlaySettings.currentSongSectionIndex = (autoPlaySettings.currentSongSectionIndex + 1) % SONG_STRUCTURE.length; } 
                } 
                
                if (!isPlayingScaleRun) { 
                    if (currentTranspositionCycleIndex === 0) { 
                        autoPlaySettings.currentTempoMs = deps.getEffectiveBaseTempoMs() * (1 + (Math.random() - 0.5) * TEMPO_VARIATION_PERCENT * 2); 
                        if (Math.random() < SLOW_TEMPO_PROBABILITY) autoPlaySettings.currentTempoMs *= SLOW_TEMPO_MULTIPLIER; 
                        const sigChoice = TIME_SIGNATURE_CONFIGS[Math.floor(Math.random() * TIME_SIGNATURE_CONFIGS.length)]; 
                        autoPlaySettings.currentMelodyLength = sigChoice.notesPerBar * sigChoice.bars; 
                        autoPlaySettings.isMonorhythmic = Math.random() < MONORHYTHM_PROBABILITY; 
                        const currentSectionType = SONG_STRUCTURE[autoPlaySettings.currentSongSectionIndex]; 
                        autoPlaySettings.isPlayingArpeggio = false; 
                        autoPlaySettings.isPlayingRepeatingChords = false; 
                        autoPlaySettings.isPlayingDualTrack = false;
                        autoPlaySettings.isPlayingInvertedChord = false;
                        autoPlaySettings.repeatingBassPattern = []; 
                        autoPlaySettings.currentRepeatingBassIndex = 0; 
                        
                        if (Math.random() < INVERTED_CHORD_PROBABILITY) {
                            originalGeneratedMelody = generateInvertedChordMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
                            autoPlaySettings.isPlayingInvertedChord = (originalGeneratedMelody.length > 0);
                        } else if (Math.random() < DUAL_TRACK_PROBABILITY) {
                            originalGeneratedMelody = generateDualTrackProgression(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
                            autoPlaySettings.isPlayingDualTrack = (originalGeneratedMelody.length > 0);
                        }

                        if (!autoPlaySettings.isPlayingDualTrack && !autoPlaySettings.isPlayingInvertedChord) {
                            if (currentSectionType === 'A') { 
                                if (Math.random() < ARPEGGIO_PROBABILITY) { 
                                    originalGeneratedMelody = generateArpeggioMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                                    autoPlaySettings.isPlayingArpeggio = true; 
                                } else { 
                                    originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                                } 
                            } else if (currentSectionType === 'B') { 
                                if (Math.random() < REPEATING_CHORD_PROBABILITY) { 
                                    originalGeneratedMelody = generateRepeatingChordVoicingSequence(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                                    autoPlaySettings.isPlayingRepeatingChords = true; 
                                } else { 
                                    originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                                    if(Math.random() < 0.7) autoPlaySettings.repeatingBassPattern = generateRepeatingBassPattern(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass); 
                                } 
                            } else if (currentSectionType === 'C') { 
                                originalGeneratedMelody = generateChordToneMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                            } else { 
                                originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                            } 
                        }
                        if (originalGeneratedMelody.length === 0) { stopAutoPlay(); return; } 
                    } 
                    
                    const transpositionSemitones = TRANSPOSITION_LEVEL_SEQUENCE[currentTranspositionCycleIndex]; 
                    currentMelody = transposeAndSnapMelodyToPalette(originalGeneratedMelody, transpositionSemitones, fixedOriginalScalePalette); 
                    if (currentMelody.length === 0) { 
                        const currentSectionType = SONG_STRUCTURE[autoPlaySettings.currentSongSectionIndex]; 
                        autoPlaySettings.isPlayingDualTrack = false;
                        autoPlaySettings.isPlayingInvertedChord = false;

                        if (Math.random() < INVERTED_CHORD_PROBABILITY) {
                            originalGeneratedMelody = generateInvertedChordMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
                            autoPlaySettings.isPlayingInvertedChord = (originalGeneratedMelody.length > 0);
                        } else if (Math.random() < DUAL_TRACK_PROBABILITY) {
                            originalGeneratedMelody = generateDualTrackProgression(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
                            autoPlaySettings.isPlayingDualTrack = (originalGeneratedMelody.length > 0);
                        }

                        if (!autoPlaySettings.isPlayingDualTrack && !autoPlaySettings.isPlayingInvertedChord) {
                            if (currentSectionType === 'A') { 
                                originalGeneratedMelody = (Math.random() < ARPEGGIO_PROBABILITY) ? generateArpeggioMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength) : generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                                autoPlaySettings.isPlayingArpeggio = (originalGeneratedMelody[0] && originalGeneratedMelody[0].durationFactor === ARPEGGIO_NOTE_DURATION_FACTOR); 
                            } else if (currentSectionType === 'B') { 
                                originalGeneratedMelody = (Math.random() < REPEATING_CHORD_PROBABILITY) ? generateRepeatingChordVoicingSequence(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength) : generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                                autoPlaySettings.isPlayingRepeatingChords = (originalGeneratedMelody[0] && Array.isArray(originalGeneratedMelody[0].notes)); 
                                if(!autoPlaySettings.isPlayingRepeatingChords && Math.random() < 0.7) autoPlaySettings.repeatingBassPattern = generateRepeatingBassPattern(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
                            } else if (currentSectionType === 'C') { 
                                originalGeneratedMelody = generateChordToneMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                            } else {
                                originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength);
                            } 
                        }
                        currentMelody = [...originalGeneratedMelody]; 
                        currentTranspositionCycleIndex = 0; 
                        if(currentMelody.length === 0) { stopAutoPlay(); return; } 
                    } 
                } 
            } 
        } 
        autoPlayTimeoutId = setTimeout(playNextMelodyNote, duration); 
    }

    // --- PUBLIC METHODS ---

    function startAutoPlay() { 
        if (deps.getIsSongMakerPlaying && deps.getIsSongMakerPlaying()) { 
            deps.stopSongMaker(); 
        } 
        if (isAutoPlaying) return; 
        
        document.querySelectorAll('.song-maker-master-controls button, .song-maker-master-controls input').forEach(el => el.disabled = true); 
        autoPlaySettings.originalRootPitchClass = document.getElementById('rootNoteSelect').value; 
        autoPlaySettings.originalScalePattern = document.getElementById('semistepsInput').value; 
        
        if (deps.getFullScaleRange) {
            fixedOriginalScalePalette = deps.getFullScaleRange(autoPlaySettings.originalRootPitchClass, autoPlaySettings.originalScalePattern); 
        }
        
        if (fixedOriginalScalePalette.length < 2) { 
            alert("Not enough notes in selected scale."); 
            document.querySelectorAll('.song-maker-master-controls button, .song-maker-master-controls input').forEach(el => el.disabled = false); 
            return; 
        } 
        
        autoPlaySettings.currentSongSectionIndex = 0; 
        const initialSectionType = SONG_STRUCTURE[autoPlaySettings.currentSongSectionIndex]; 
        autoPlaySettings.currentTempoMs = deps.getEffectiveBaseTempoMs() * (1 + (Math.random() - 0.5) * TEMPO_VARIATION_PERCENT * 2); 
        if (Math.random() < SLOW_TEMPO_PROBABILITY) autoPlaySettings.currentTempoMs *= SLOW_TEMPO_MULTIPLIER; 
        
        const sigChoice = TIME_SIGNATURE_CONFIGS[Math.floor(Math.random() * TIME_SIGNATURE_CONFIGS.length)]; 
        autoPlaySettings.currentMelodyLength = sigChoice.notesPerBar * sigChoice.bars; 
        autoPlaySettings.isMonorhythmic = Math.random() < MONORHYTHM_PROBABILITY; 
        autoPlaySettings.isPlayingArpeggio = false; 
        autoPlaySettings.isPlayingRepeatingChords = false; 
        autoPlaySettings.isPlayingDualTrack = false;
        autoPlaySettings.isPlayingInvertedChord = false;
        autoPlaySettings.repeatingBassPattern = []; 
        autoPlaySettings.currentRepeatingBassIndex = 0; 
        
        if (Math.random() < INVERTED_CHORD_PROBABILITY) {
            originalGeneratedMelody = generateInvertedChordMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
            autoPlaySettings.isPlayingInvertedChord = (originalGeneratedMelody.length > 0);
        } else if (Math.random() < DUAL_TRACK_PROBABILITY) {
            originalGeneratedMelody = generateDualTrackProgression(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass);
            autoPlaySettings.isPlayingDualTrack = (originalGeneratedMelody.length > 0);
        }

        if (!autoPlaySettings.isPlayingDualTrack && !autoPlaySettings.isPlayingInvertedChord) {
            if (initialSectionType === 'A') { 
                if (Math.random() < ARPEGGIO_PROBABILITY) { 
                    originalGeneratedMelody = generateArpeggioMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                    autoPlaySettings.isPlayingArpeggio = true; 
                } else { 
                    originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                } 
            } else if (initialSectionType === 'B') { 
                if (Math.random() < REPEATING_CHORD_PROBABILITY) { 
                    originalGeneratedMelody = generateRepeatingChordVoicingSequence(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
                    autoPlaySettings.isPlayingRepeatingChords = true; 
                } else { 
                    originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
                    if(Math.random() < 0.6) autoPlaySettings.repeatingBassPattern = generateRepeatingBassPattern(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass); 
                } 
            } else if (initialSectionType === 'C') { 
                originalGeneratedMelody = generateChordToneMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.currentMelodyLength); 
            } else { 
                originalGeneratedMelody = generateRandomMelody(fixedOriginalScalePalette, autoPlaySettings.originalRootPitchClass, autoPlaySettings.isMonorhythmic, autoPlaySettings.currentMelodyLength); 
            } 
        }
        
        if (originalGeneratedMelody.length === 0) { 
            alert("Could not generate initial melody."); 
            document.querySelectorAll('.song-maker-master-controls button, .song-maker-master-controls input').forEach(el => el.disabled = false); 
            return; 
        } 
        
        isAutoPlaying = true; 
        const playBtn = document.getElementById('autoPlayBtn');
        if(playBtn) {
            playBtn.textContent = 'Stop'; 
            playBtn.classList.add('playing'); 
        }
        
        currentMelody = [...originalGeneratedMelody]; 
        currentMelodyNoteIndex = 0; 
        currentMelodyRepetitionCount = 0; 
        currentTranspositionCycleIndex = 0; 
        isPlayingScaleRun = false; 
        currentArpeggioBassNote = null; 
        playNextMelodyNote(); 
    }
    
    function stopAutoPlay(resetButtonUI = true) { 
        isAutoPlaying = false; 
        clearTimeout(autoPlayTimeoutId); 
        autoPlayTimeoutId = null; 
        isPlayingScaleRun = false; 
        autoPlaySettings.isPlayingArpeggio = false; 
        autoPlaySettings.isPlayingRepeatingChords = false; 
        autoPlaySettings.isPlayingDualTrack = false;
        autoPlaySettings.isPlayingInvertedChord = false;
        autoPlaySettings.repeatingBassPattern = []; 
        currentArpeggioBassNote = null; 
        
        lastAutoPlayedChordKeyElements.forEach(el => el.classList.remove('auto-playing-note')); 
        lastAutoPlayedChordKeyElements = []; 
        
        if (deps.globalActiveMidiNotes) deps.globalActiveMidiNotes.clear();
        if (deps.updateSheetMusicHighlight) deps.updateSheetMusicHighlight();

        const playingNotesDisplay = document.getElementById('currentlyPlayingNotesDisplay'); 
        if(playingNotesDisplay) playingNotesDisplay.innerHTML = ''; 
        document.querySelectorAll('.song-maker-master-controls button, .song-maker-master-controls input').forEach(el => el.disabled = false); 
        
        if (resetButtonUI) { 
            const autoPlayBtn = document.getElementById('autoPlayBtn'); 
            if (autoPlayBtn) { 
                autoPlayBtn.textContent = 'Start'; 
                autoPlayBtn.classList.remove('playing'); 
            } 
        } 
    }
    
    function toggleAutoPlay() { 
        if (deps.initAudioContext && !deps.initAudioContext()) return; 
        if (isAutoPlaying) stopAutoPlay(); else startAutoPlay(); 
    }

    return {
        init: function(dependencies) {
            deps = Object.assign(deps, dependencies);
        },
        toggle: toggleAutoPlay,
        stop: stopAutoPlay,
        isPlaying: function() { return isAutoPlaying; }
    };
})();
