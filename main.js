(function() {
    // --- GLOBAL VARIABLES ---
    let audioContext;
    let masterVolumeNode, effectsInputNode;
    let dryGain, reverbWetGain, delayWetGain;
    let reverbNode, delayNode, delayFeedbackGain;
    let isReverbOn = false, isDelayOn = false;
    let impulseResponseBuffer;
    let effectiveBaseTempoMs = 750;
    let activeSampleSources = new Map(); // Tracks active nodes { releaseGain, sources } for each MIDI note

    const SOUND_DURATION = 1.8;
    const NOTE_RELATIVE_MAX_GAIN = 1.0;
    const DEFAULT_ATTACK_TIME = 0.02, DEFAULT_DECAY_TIME = 0.3, DEFAULT_SUSTAIN_LEVEL = 0.6, DEFAULT_ADSR_RELEASE_CONSTANT = 0.1;

    let midiAccess = null, currentMidiOutput = null, isMidiOutEnabled = false, currentMidiInput = null, isMidiInEnabled = false;
    const activeMidiNotes = new Map(), activeComputerKeys = new Set(), userHeldNotes = new Set();
    const globalActiveMidiNotes = new Set(); // Tracks active auto-play and generative notes for UI highlighting
    
    const MIDI_BASE_VELOCITY = 80, MIDI_VELOCITY_VARIATION_RANGE = 30;
    const KEYBOARD_MAP = { 'z': 'C4', 's': 'C#4', 'x': 'D4', 'd': 'D#4', 'c': 'E4', 'v': 'F4', 'g': 'F#4', 'b': 'G4', 'h': 'G#4', 'n': 'A4', 'j': 'A#4', 'm': 'B4', 'q': 'C5', '2': 'C#5', 'w': 'D5', '3': 'D#5', 'e': 'E5', 'r': 'F5', '5': 'F#5', 't': 'G5', '6': 'G#5', 'y': 'A5', '7': 'A#5', 'u': 'B5' };
    
    const BASE_DIMENSIONS = { whiteKeyWidth: 60, whiteKeyHeight: 220, blackKeyWidth: 38, blackKeyHeight: 140, keyBorderRadius: 3 };
    let is88KeyMode = false;

    const noteFrequencies = {};
    const ALL_NOTES_CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    // EXPORT GLOBALLY FOR MODES.JS
    window.ALL_NOTES_CHROMATIC = ALL_NOTES_CHROMATIC;

    const A4_FREQ = 440.0, A4_MIDI_NUMBER = 69;
    
    for (let octave = 0; octave < 9; octave++) { 
        ALL_NOTES_CHROMATIC.forEach((noteBase, index) => { 
            const noteName = noteBase + octave; 
            const currentMidiNumber = 12 * (octave - 4) + (index - 9) + A4_MIDI_NUMBER; 
            noteFrequencies[noteName] = A4_FREQ * Math.pow(2, (currentMidiNumber - A4_MIDI_NUMBER) / 12); 
        }); 
    }
    const keysData = [];
    
    // --- DATA DEFINITIONS ---

    const BASIC_SCALES = [ { name: "Ionian (Major)", steps: "2212221" }, { name: "Dorian", steps: "2122212" }, { name: "Phrygian", steps: "1222122" }, { name: "Lydian", steps: "2221221" }, { name: "Mixolydian", steps: "2212212" }, { name: "Aeolian (Nat. Minor)", steps: "2122122" }, { name: "Locrian", steps: "1221222" }, { name: "Harmonic Minor", steps: "2122131" }, { name: "Melodic Minor (Asc.)", steps: "2122221" }, { name: "Major Pentatonic", steps: "22323" }, { name: "Minor Pentatonic", steps: "32232" }, { name: "Blues", steps: "321132" }, { name: "Chromatic", steps: "111111111111"}, { name: "Whole Tone", steps: "222222"}, { name: "Diminished (WH)", steps: "21212121"}, { name: "Diminished (HW)", steps: "12121212"}, { name: "Custom", steps: ""} ];
    
    let PREDEFINED_SCALES = BASIC_SCALES;
    // EXPORT FUNCTION TO ACCESS DYNAMIC PREDEFINED SCALES LIST FOR MODES.JS
    window.getPredefinedScales = () => PREDEFINED_SCALES;

    let isZeitlerSetCurrent = false;
    let isZeitlerLoaded = false;

    const INTERVAL_NAMES_BY_SEMITONE = { 0: "R", 1: "m2", 2: "M2", 3: "m3", 4: "M3", 5: "P4", 6: "TT", 7: "P5", 8: "m6", 9: "M6", 10: "m7", 11: "M7" };
    const TETRACHORDS = [ { name: "Ionian or Major", steps: "221" }, { name: "Dorian or (Lower) Minor", steps: "212" }, { name: "Phrygian or Upper Minor", steps: "122" }, { name: "Whole Tone or (Lower) Lydian", steps: "222" }, { name: "Aerynian or Harmonic", steps: "131" }, { name: "Ionacrian", steps: "113" }, { name: "Katarian or Mixolydian Blues", steps: "311" }, { name: "Dodimic or (Lower) Blues", steps: "321" }, { name: "Katalimic or Upper Blues", "steps": "132" }, { name: "Lythimic or (Lower) Hungarian Minor", steps: "213" }, { name: "Zyrimic or (Lower) Hungarian Major", steps: "312" }, { name: "Stylimic", steps: "231" }, { name: "Aeradimic", "steps": "123" }, { name: "Thodimic", "steps": "141" }, { "name": "Thonimic", "steps": "114" }, { "name": "Stadimic", "steps": "411" }, { "name": "Sorian or (Upper) Diminished", "steps": "121" }, { "name": "Phrodian", "steps": "112" }, { "name": "Godian", "steps": "211" }, { "name": "Chromatic", "steps": "111" } ];
    
    const ORDERED_CHORD_DEFINITIONS = [
        { key: '0,2,3,7,9,10', name: 'm13' }, { key: '0,2,4,7,9,10', name: '13' }, { key: '0,2,4,7,9,11', name: 'maj13' },
        { key: '0,3,5,7,10', name: 'm11' }, { key: '0,4,5,7,10', name: '11' }, { key: '0,4,6,7,10', name: '7#11' },
        { key: '0,2,4,7,11', name: 'maj9' }, { key: '0,2,3,7,10', name: 'm9' }, { key: '0,2,4,7,10', name: '9' },
        { key: '0,3,6,9', name: 'dim7' }, { key: '0,3,6,10', name: 'm7b5' }, { key: '0,4,7,11', name: 'maj7' }, { key: '0,3,7,10', name: 'm7' }, { key: '0,4,7,10', name: '7' },
        { key: '0,4,8', name: 'aug' }, { key: '0,3,6', name: 'dim' }, { key: '0,2,7', name: 'sus2' }, { key: '0,5,7', name: 'sus4' }, { key: '0,4,7', name: 'maj' }, { key: '0,3,7', name: 'm' },
        { key: '0,7', name: '5' }
    ];

    let PREDEFINED_SOUNDS = [];
    let loadedSampleBuffers = new Map();
    const C4_FREQ = noteFrequencies['C4'];

    const DEFAULT_WAV_SAMPLES = [
        { file: 'PianoC4.wav', name: 'Piano C4 wav' },
        { file: 'sound1.wav',  name: 'Sound 1 wav' },
        { file: 'sound2.wav',  name: 'Sound 2 wav' },
        { file: 'sound3.wav',  name: 'Sound 3 wav' },
        { file: 'sound4.wav',  name: 'Sound 4 wav' }
    ];

    function initializeDefaultSounds() { 
        PREDEFINED_SOUNDS = [ 
            { id: "classic_piano", name: "Classic Piano", params: { oscillators: [ { type: 'triangle', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }, { type: 'sine', freqFactor: 2, gainFactor: 0.4, stopFactor: 1.0 }, { type: 'sine', freqFactor: 3, gainFactor: 0.15, stopFactor: 1.0 } ], envelope: { type: 'piano', attackTime: 0.005, attackPeakFactor: 0.8, decayToExpMinTimeFactor: 0.8 } } }, 
            { id: "lullaby_pluck", name: "Lullaby Pluck", params: { oscillators: [ { type: 'triangle', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }, { type: 'sine', freqFactor: 0.5, gainFactor: 0.3, stopFactor: 1.0 } ], filter: { type: 'lowpass', Q: 1, envelope: [ { type: 'set', timeOffset: 0, valueCalc: (freq) => Math.min(8000, freq * 4) }, { type: 'exp', timeOffset: 0.05, valueCalc: (freq) => Math.min(1500, freq * 1.5) }, { type: 'lin', timeOffset: 0.3, valueCalc: (freq) => freq } ] }, envelope: { type: 'adsr', attackTime: DEFAULT_ATTACK_TIME, decayTime: DEFAULT_DECAY_TIME, sustainLevel: DEFAULT_SUSTAIN_LEVEL, releaseConstant: DEFAULT_ADSR_RELEASE_CONSTANT } } }, 
            { id: "mellow_pad", name: "Mellow Pad", params: { oscillators: [ { type: 'sawtooth', freqFactor: 1, detune: -7, gainFactor: 0.33, stopFactor: 1.0 }, { type: 'sawtooth', freqFactor: 1, detune: 0,  gainFactor: 0.33, stopFactor: 1.0 }, { type: 'sawtooth', freqFactor: 1, detune: 7,  gainFactor: 0.33, stopFactor: 1.0 } ], envelope: { type: 'pad', attackTime: 0.3, attackPeakFactor: 0.7, decayStartOffset: 0.4, sustainTargetLevel: 0.6, sustainTimeConstant: 0.2 } } }, 
            { id: "warm_saw", name: "Warm Saw", params: { oscillators: [{ type: 'sawtooth', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }], filter: { type: 'lowpass', Q: 4, baseFreqFactor: 3, fixedBaseFreq: null }, envelope: { type: 'adsr', attackTime: 0.03, decayTime: 0.2, sustainLevel: 0.5, releaseConstant: 0.15 } } }, 
            { id: "gentle_sine", name: "Gentle Sine", params: { oscillators: [{ type: 'sine', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }], envelope: { type: 'adsr', attackTime: 0.1, decayTime: 0.4, sustainLevel: 0.7, releaseConstant: 0.2 } } }, 
            { id: "filtered_noise_pluck", name: "Noise Pluck", params: { noiseSource: { type: 'white', duration: 0.2, gainFactor: 0.8 }, filter: { type: 'bandpass', Q: 15, fixedBaseFreq: 1000, envelope: [ { type: 'set', timeOffset: 0, valueCalc: () => 4000 }, { type: 'exp', timeOffset: 0.15, valueCalc: () => 500 } ] }, envelope: { type: 'adsr', attackTime: 0.005, decayTime: 0.15, sustainLevel: 0.0, releaseConstant: 0.05 } } }, 
            { id: "soft_square", name: "Soft Square", params: { oscillators: [{ type: 'square', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }], filter: { type: 'lowpass', Q: 2, baseFreqFactor: 2.5 }, envelope: { type: 'adsr', attackTime: 0.01, decayTime: 0.25, sustainLevel: 0.4, releaseConstant: 0.1 } } }, 
            { id: "harmonic_bell", name: "Harmonic Bell", params: { oscillators: [ { type: 'sine', freqFactor: 1,    gainFactor: 1.0, stopFactor: 0.9 }, { type: 'sine', freqFactor: 2.3,  gainFactor: 0.7, stopFactor: 0.8 }, { type: 'sine', freqFactor: 3.8,  gainFactor: 0.5, stopFactor: 0.7 }, { type: 'sine', freqFactor: 5.1,  gainFactor: 0.3, stopFactor: 0.6 } ], envelope: { type: 'simple_decay', attackTime: 0.005, decayTime: SOUND_DURATION * 0.95 } } }, 
            { id: "echoing_filter", name: "Echoing Filter", params: { oscillators: [{ type: 'sawtooth', freqFactor: 1, gainFactor: 0.7, stopFactor: 1.0 }], filter: { type: 'lowpass', Q: 12, envelope: [ { type: 'set', timeOffset: 0, valueCalc: (freq) => freq * 5 }, { type: 'exp', timeOffset: 0.1, valueCalc: (freq) => freq * 0.8 }, { type: 'exp', timeOffset: 0.4, valueCalc: (freq) => freq * 3 }, { type: 'exp', timeOffset: SOUND_DURATION * 0.7, valueCalc: (freq) => freq * 0.5 } ] }, envelope: { type: 'adsr', attackTime: 0.02, decayTime: SOUND_DURATION * 0.8, sustainLevel: 0.1, releaseConstant: 0.1 } } }, 
            { id: "default_triangle", name: "Default Triangle", params: { oscillators: [{ type: 'triangle', freqFactor: 1, gainFactor: 1.0, stopFactor: 1.0 }], envelope: { type: 'adsr', attackTime: DEFAULT_ATTACK_TIME, decayTime: DEFAULT_DECAY_TIME, sustainLevel: DEFAULT_SUSTAIN_LEVEL, releaseConstant: DEFAULT_ADSR_RELEASE_CONSTANT } } } 
        ]; 
    }
    initializeDefaultSounds(); 

    // --- AUDIO ENGINE ---
    function createImpulseResponse() { 
        if (!audioContext) return null; 
        const sampleRate = audioContext.sampleRate; 
        const duration = 2.0; 
        const decay = 2.5; 
        const impulse = audioContext.createBuffer(2, sampleRate * duration, sampleRate); 
        const impulseL = impulse.getChannelData(0); 
        const impulseR = impulse.getChannelData(1); 
        for (let i = 0; i < impulse.length; i++) { 
            const n = (Math.random() * 2 - 1) * Math.pow(1 - i / impulse.length, decay); 
            impulseL[i] = n; 
            impulseR[i] = n; 
        } 
        return impulse; 
    }
    
    function setupAudioEffects() {
        masterVolumeNode = audioContext.createGain(); 
        masterVolumeNode.gain.value = parseFloat(document.getElementById('volumeSlider').value); 
        masterVolumeNode.connect(audioContext.destination);
        effectsInputNode = audioContext.createGain();
        dryGain = audioContext.createGain(); 
        effectsInputNode.connect(dryGain); 
        dryGain.connect(masterVolumeNode);
        
        reverbWetGain = audioContext.createGain(); 
        reverbNode = audioContext.createConvolver(); 
        impulseResponseBuffer = createImpulseResponse(); 
        if (impulseResponseBuffer) { reverbNode.buffer = impulseResponseBuffer; } 
        effectsInputNode.connect(reverbNode); 
        reverbNode.connect(reverbWetGain); 
        reverbWetGain.connect(masterVolumeNode);
        
        delayWetGain = audioContext.createGain(); 
        delayNode = audioContext.createDelay(1.5); 
        delayFeedbackGain = audioContext.createGain(); 
        effectsInputNode.connect(delayNode); 
        delayNode.connect(delayWetGain); 
        delayWetGain.connect(masterVolumeNode); 
        delayNode.connect(delayFeedbackGain); 
        delayFeedbackGain.connect(delayNode);
        
        dryGain.gain.value = 1.0;
        reverbWetGain.gain.value = 0.0;
        delayWetGain.gain.value = 0.0;
        delayNode.delayTime.value = parseFloat(document.getElementById('delayTimeSlider').value);
        delayFeedbackGain.gain.value = parseFloat(document.getElementById('delayFeedbackSlider').value);
    }
    
    function initAudioContext() { 
        if (!audioContext) { 
            try { 
                audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
                if (!audioContext) { console.error("Web Audio API not supported."); alert("Web Audio API not supported."); return false; } 
                setupAudioEffects(); 
            } catch (e) { 
                console.error("Could not create AudioContext:", e); alert("Could not create AudioContext: " + e.message); return false; 
            } 
        } 
        if (audioContext.state === 'suspended') { 
            audioContext.resume().catch(err => console.error("Error resuming AudioContext:", err));
        } 
        return true; 
    }

    // Helper to completely stop the audio for a specific MIDI note when released early
    function stopAudioForNote(midiNoteNum) {
        if (midiNoteNum === null || !audioContext) return;
        const activeNote = activeSampleSources.get(midiNoteNum);
        
        if (activeNote) {
            const now = audioContext.currentTime;
            
            // Rapid fade out the main release gain to prevent audio clicking on release
            activeNote.releaseGain.gain.cancelScheduledValues(now);
            activeNote.releaseGain.gain.setValueAtTime(activeNote.releaseGain.gain.value, now);
            activeNote.releaseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            
            // Forcibly stop the sources slightly after the fade
            activeNote.sources.forEach(source => {
                try {
                    source.stop(now + 0.15);
                } catch(e) { /* ignore if naturally stopped */ }
            });
            
            activeSampleSources.delete(midiNoteNum);
        }
    }
    // EXPOSE GLOBAL FOR AUTOPLAY USAGE
    window.stopAudioForNote = stopAudioForNote;

    // Helper to push highlighted notes to SheetMusic Canvas
    function updateSheetMusicHighlight() {
        if (window.SheetMusic) {
            const combined = new Set([...userHeldNotes, ...globalActiveMidiNotes]);
            window.SheetMusic.highlightNotes(combined);
        }
    }
    
    function playNote(baseFrequency, gainScale = 1, midiNoteNum = null, isAutoPlayed = false) { 
        if (!initAudioContext() || !audioContext || !baseFrequency) return; 
        
        // Ensure previously playing note of the same pitch is properly cleared/stopped 
        if (midiNoteNum !== null) {
            stopAudioForNote(midiNoteNum);
        }

        const selectedSoundId = document.getElementById('soundTypeSelect').value; 
        const now = audioContext.currentTime; 
        const velocity = Math.min(1.0, Math.max(0.01, gainScale)); // Normalize velocity (0-1)
        
        const noteGain = audioContext.createGain(); 
        
        // Create an outer release gain layer that will be manipulated upon key release
        const releaseGain = audioContext.createGain();
        releaseGain.gain.setValueAtTime(1.0, now);
        
        noteGain.connect(releaseGain); 
        releaseGain.connect(effectsInputNode);
        
        const trackedSources = [];

        if (loadedSampleBuffers.has(selectedSoundId)) { 
            const source = audioContext.createBufferSource(); 
            source.buffer = loadedSampleBuffers.get(selectedSoundId); 
            source.playbackRate.value = baseFrequency / C4_FREQ; 
            
            // --- DYNAMIC FILTER BASED ON VELOCITY ---
            const filterNode = audioContext.createBiquadFilter();
            filterNode.type = 'lowpass';
            const minCutoff = 400;    
            const maxCutoff = 12000;  
            const cutoffFreq = minCutoff + (maxCutoff - minCutoff) * Math.pow(velocity, 0.7);
            filterNode.frequency.setValueAtTime(cutoffFreq, now);
            
            const minResonance = 0.7;
            const maxResonance = 3.5;
            const resonance = minResonance + (maxResonance - minResonance) * velocity;
            filterNode.Q.setValueAtTime(resonance, now);
            
            let highShelfNode = null;
            if (velocity > 0.5) {
                highShelfNode = audioContext.createBiquadFilter();
                highShelfNode.type = 'highshelf';
                highShelfNode.frequency.setValueAtTime(2000, now);
                const shelfGain = (velocity - 0.5) * 12; 
                highShelfNode.gain.setValueAtTime(shelfGain, now);
            }
            
            // --- DYNAMIC VOLUME ENVELOPE ---
            const envelopeGain = audioContext.createGain();
            const minAttack = 0.001;
            const maxAttack = 0.05;
            const attackTime = minAttack + (maxAttack - minAttack) * (1 - velocity);
            
            const minDecay = 0.05;
            const maxDecay = 0.4;
            const decayTime = minDecay + (maxDecay - minDecay) * (1 - velocity);
            const sustainLevel = 0.3 + (velocity * 0.5); 
            
            envelopeGain.gain.setValueAtTime(0.001, now);
            envelopeGain.gain.linearRampToValueAtTime(velocity, now + attackTime);
            envelopeGain.gain.setTargetAtTime(velocity * sustainLevel, now + attackTime + decayTime, 0.15);
            
            source.connect(filterNode);
            if (highShelfNode) {
                filterNode.connect(highShelfNode);
                highShelfNode.connect(envelopeGain);
            } else {
                filterNode.connect(envelopeGain);
            }
            envelopeGain.connect(noteGain);
            
            source.start(now);
            
            const sampleDuration = source.buffer.duration;
            const stopTime = now + sampleDuration;
            source.stop(stopTime); // Natural conclusion at the exact end of the sample buffer
            
            // Standard decay to prevent click when WAV audio strictly ends
            envelopeGain.gain.setTargetAtTime(0.001, stopTime - 0.05, 0.05);
            
            trackedSources.push(source);
            
        } else { 
            // --- EXISTING SYNTHESIZER CODE FOR NON-WAV SOUNDS ---
            let soundDef = PREDEFINED_SOUNDS.find(s => s.id === selectedSoundId) || PREDEFINED_SOUNDS.find(s => s.id === "default_triangle") || PREDEFINED_SOUNDS[0]; 
            if (!soundDef) { console.error("Sound definition missing!"); return; } 
            
            const params = soundDef.params; 
            let lastNodeInOutChain = noteGain; 
            
            if (params.filter) { 
                const filterNode = audioContext.createBiquadFilter(); 
                filterNode.type = params.filter.type || 'lowpass'; 
                filterNode.Q.value = params.filter.Q || 1; 
                
                if (params.filter.gain && (filterNode.type === 'peaking' || filterNode.type === 'lowshelf' || filterNode.type === 'highshelf')) { 
                    filterNode.gain.value = params.filter.gain; 
                } 
                
                let initialFilterFreq = params.filter.fixedBaseFreq != null ? params.filter.fixedBaseFreq : baseFrequency * (params.filter.baseFreqFactor || 1); 
                
                const velAdjustedFreq = initialFilterFreq * (0.5 + velocity);
                filterNode.frequency.setValueAtTime(velAdjustedFreq, now); 
                
                if (params.filter.envelope && Array.isArray(params.filter.envelope)) { 
                    params.filter.envelope.forEach(stage => { 
                        const targetTime = now + (stage.timeOffset || 0); 
                        let value = typeof stage.valueCalc === 'function' ? stage.valueCalc(baseFrequency) : (stage.value || initialFilterFreq);
                        value = value * (0.5 + velocity);
                        if (stage.type === 'set') filterNode.frequency.setValueAtTime(value, targetTime); 
                        else if (stage.type === 'lin') filterNode.frequency.linearRampToValueAtTime(value, targetTime); 
                        else if (stage.type === 'exp') filterNode.frequency.exponentialRampToValueAtTime(Math.max(0.001, value), targetTime); 
                    }); 
                } 
                filterNode.connect(noteGain); 
                lastNodeInOutChain = filterNode; 
            } 
            
            if (params.oscillators && Array.isArray(params.oscillators)) { 
                params.oscillators.forEach(oscDef => { 
                    const osc = audioContext.createOscillator(); 
                    osc.type = oscDef.type || 'sine'; 
                    
                    const pitchVariation = 1 + ((velocity - 0.5) * 0.02); 
                    osc.frequency.setValueAtTime(baseFrequency * (oscDef.freqFactor || 1) * pitchVariation, now); 
                    
                    if (oscDef.detune) osc.detune.setValueAtTime(oscDef.detune + (velocity * 5), now); 
                    const stopTime = now + SOUND_DURATION * (oscDef.stopFactor || 1.0); 
                    
                    const oscGainMultiplier = oscDef.gainFactor || 1.0;
                    const finalGain = velocity * oscGainMultiplier;
                    
                    if (finalGain !== 1.0 || oscDef.gainFactor != null) { 
                        const oscGainNode = audioContext.createGain(); 
                        oscGainNode.gain.setValueAtTime(finalGain, now); 
                        osc.connect(oscGainNode).connect(lastNodeInOutChain); 
                    } else { 
                        osc.connect(lastNodeInOutChain); 
                    } 
                    osc.start(now); 
                    osc.stop(stopTime); 
                    trackedSources.push(osc);
                }); 
            } 
            
            if (params.noiseSource) { 
                const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * (params.noiseSource.duration || 0.2), audioContext.sampleRate); 
                const output = noiseBuffer.getChannelData(0); 
                for (let i = 0; i < output.length; i++) { output[i] = (Math.random() * 2 - 1); } 
                const noise = audioContext.createBufferSource(); 
                noise.buffer = noiseBuffer; 
                
                const noiseGainValue = (params.noiseSource.gainFactor != null ? params.noiseSource.gainFactor : 1.0) * velocity;
                if (noiseGainValue !== 1.0) { 
                    const noiseGainNode = audioContext.createGain(); 
                    noiseGainNode.gain.setValueAtTime(noiseGainValue, now); 
                    noise.connect(noiseGainNode).connect(lastNodeInOutChain); 
                } else { 
                    noise.connect(lastNodeInOutChain); 
                } 
                noise.start(now); 
                noise.stop(now + (params.noiseSource.duration || SOUND_DURATION)); 
                trackedSources.push(noise);
            } 
        } 
        
        // --- APPLY STANDARD ENVELOPE ---
        if (!loadedSampleBuffers.has(selectedSoundId)) {
            const soundDefForEnv = PREDEFINED_SOUNDS.find(s => s.id === selectedSoundId) || PREDEFINED_SOUNDS.find(s=>s.id === "default_triangle"); 
            const env = (soundDefForEnv && soundDefForEnv.params.envelope) || PREDEFINED_SOUNDS.find(s=>s.id === "default_triangle").params.envelope; 
            
            noteGain.gain.setValueAtTime(0, now); 
            
            if (env.type === 'piano') { 
                noteGain.gain.linearRampToValueAtTime(NOTE_RELATIVE_MAX_GAIN * gainScale * (env.attackPeakFactor || 0.8), now + (env.attackTime || 0.005)); 
                noteGain.gain.exponentialRampToValueAtTime(0.0001, now + SOUND_DURATION * (env.decayToExpMinTimeFactor || 0.8)); 
            } else if (env.type === 'adsr') { 
                noteGain.gain.linearRampToValueAtTime(NOTE_RELATIVE_MAX_GAIN * gainScale, now + (env.attackTime || DEFAULT_ATTACK_TIME)); 
                noteGain.gain.setTargetAtTime( NOTE_RELATIVE_MAX_GAIN * gainScale * (env.sustainLevel != null ? env.sustainLevel : DEFAULT_SUSTAIN_LEVEL), now + (env.attackTime || DEFAULT_ATTACK_TIME) + (env.decayTime || DEFAULT_DECAY_TIME), env.releaseConstant || DEFAULT_ADSR_RELEASE_CONSTANT ); 
            } else if (env.type === 'pad') { 
                noteGain.gain.linearRampToValueAtTime(NOTE_RELATIVE_MAX_GAIN * gainScale * (env.attackPeakFactor || 0.7), now + (env.attackTime || 0.3)); 
                noteGain.gain.setTargetAtTime( NOTE_RELATIVE_MAX_GAIN * gainScale * (env.sustainTargetLevel != null ? env.sustainTargetLevel : 0.6), now + (env.attackTime || 0.3) + (env.decayStartOffset || 0.4), env.sustainTimeConstant || 0.2 ); 
            } else if (env.type === 'simple_decay') { 
                noteGain.gain.linearRampToValueAtTime(NOTE_RELATIVE_MAX_GAIN * gainScale, now + (env.attackTime || 0.005)); 
                noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (env.decayTime || SOUND_DURATION * 0.95)); 
            } else { 
                noteGain.gain.linearRampToValueAtTime(NOTE_RELATIVE_MAX_GAIN * gainScale, now + DEFAULT_ATTACK_TIME); 
                noteGain.gain.setTargetAtTime( NOTE_RELATIVE_MAX_GAIN * gainScale * DEFAULT_SUSTAIN_LEVEL, now + DEFAULT_ATTACK_TIME + DEFAULT_DECAY_TIME, DEFAULT_ADSR_RELEASE_CONSTANT ); 
            } 
        }

        // Register played sources internally so they can be aborted on Key Release
        if (midiNoteNum !== null) {
            activeSampleSources.set(midiNoteNum, {
                releaseGain: releaseGain,
                sources: trackedSources
            });
        }
        
        // --- MIDI OUTPUT (unchanged) ---
        if (isMidiOutEnabled && midiNoteNum !== null) { 
            let velocityOut = isAutoPlayed ? (MIDI_BASE_VELOCITY + Math.floor(Math.random() * MIDI_VELOCITY_VARIATION_RANGE) - MIDI_VELOCITY_VARIATION_RANGE / 2) : Math.round(110 * gainScale); 
            velocityOut = Math.max(1, Math.min(127, velocityOut)); 
            sendMidiNoteOn(midiNoteNum, velocityOut); 
            const noteOffTimeout = setTimeout(() => { 
                sendMidiNoteOff(midiNoteNum); 
                activeMidiNotes.delete(midiNoteNum); 
            }, SOUND_DURATION * 1000 * 0.95); 
            activeMidiNotes.set(midiNoteNum, noteOffTimeout); 
        } 
    }

    // --- THEORY & DISPLAY ---
    
    function getChordName(midiNotes) { 
        if (midiNotes.size < 2) return '--'; 
        const pitchClasses = [...new Set([...midiNotes].map(n => n % 12))]; 
        if (pitchClasses.length < 2) return '--'; 
        
        for (const rootPitchClass of pitchClasses) { 
            const intervals = pitchClasses.map(p => (p - rootPitchClass + 12) % 12).sort((a, b) => a - b); 
            const intervalKey = intervals.join(','); 
            const match = ORDERED_CHORD_DEFINITIONS.find(def => def.key === intervalKey); 
            
            if (match) { 
                const rootNoteName = ALL_NOTES_CHROMATIC[rootPitchClass]; 
                const bassNoteMidi = [...midiNotes].sort((a,b) => a-b)[0]; 
                const bassNotePitchClass = bassNoteMidi % 12; 
                let chordName = `${rootNoteName}${match.name}`; 
                
                if (pitchClasses.length === 3 && (match.name === 'maj' || match.name === 'm')) { 
                    const thirdInterval = (match.name === 'maj') ? 4 : 3; 
                    if (bassNotePitchClass === (rootPitchClass + thirdInterval) % 12) { 
                        chordName += ' (1st inv.)'; 
                    } else if (bassNotePitchClass === (rootPitchClass + 7) % 12) { 
                        chordName += ' (2nd inv.)'; 
                    } 
                } else if (bassNotePitchClass !== rootPitchClass) { 
                    chordName += `/${ALL_NOTES_CHROMATIC[bassNotePitchClass]}`; 
                } 
                return chordName; 
            } 
        } 
        return 'Unknown'; 
    }
    
    function updateChordDisplay() { 
        document.getElementById('chordNameDisplay').textContent = getChordName(userHeldNotes); 
    }
    
    // --- PIANO UI & LAYOUT ---
    function generateKeysData(startNoteName = 'C3', endNoteName = 'B5') { 
        keysData.length = 0; 
        const startPitch = startNoteName.slice(0, -1); 
        const startOctave = parseInt(startNoteName.slice(-1)); 
        const endPitch = endNoteName.slice(0, -1); 
        const endOctave = parseInt(endNoteName.slice(-1)); 
        const startIndex = ALL_NOTES_CHROMATIC.indexOf(startPitch); 
        const endIndex = ALL_NOTES_CHROMATIC.indexOf(endPitch); 
        let currentId = 1; 
        
        for (let octave = startOctave; octave <= endOctave; octave++) { 
            let noteStartIdx = (octave === startOctave) ? startIndex : 0; 
            let noteEndIdx = (octave === endOctave) ? endIndex : 11; 
            for (let i = noteStartIdx; i <= noteEndIdx; i++) { 
                const noteBase = ALL_NOTES_CHROMATIC[i]; 
                const noteName = noteBase + octave; 
                const midiNum = (octave - 4) * 12 + (i - 9) + A4_MIDI_NUMBER; 
                keysData.push({ note: noteName, pitchClass: noteBase, octave: octave, idSuffix: currentId++, type: noteBase.includes("#") ? "black" : "white", frequency: noteFrequencies[noteName], midi: midiNum }); 
            } 
        } 
    }
    
    function createPianoKeys() { 
        const pianoKeyboard = document.getElementById('pianoKeyboard'); 
        pianoKeyboard.innerHTML = ''; 
        keysData.forEach(keyInfo => { 
            const keyElement = document.createElement('div'); 
            keyElement.classList.add('key', keyInfo.type + '-key'); 
            keyElement.id = 'key' + keyInfo.idSuffix; 
            keyElement.dataset.frequency = keyInfo.frequency; 
            keyElement.dataset.pitchClass = keyInfo.pitchClass; 
            keyElement.dataset.octave = keyInfo.octave; 
            keyElement.dataset.originalNoteName = keyInfo.note; 
            keyElement.dataset.midi = keyInfo.midi; 
            const keyLabel = document.createElement('div'); 
            keyLabel.classList.add('key-label'); 
            keyLabel.textContent = keyInfo.note; 
            keyElement.appendChild(keyLabel); 
            pianoKeyboard.appendChild(keyElement); 
            
            const handlePress = (event) => { 
                if (event.type === 'touchstart') event.preventDefault(); 
                if (keyElement.classList.contains('key-disabled') && !document.body.classList.contains('scale-detect-mode')) return; 
                if (!initAudioContext()) return; 
                
                const freq = parseFloat(keyElement.dataset.frequency); 
                const midi = parseInt(keyElement.dataset.midi); 
                userHeldNotes.add(midi); 
                updateChordDisplay();
                updateSheetMusicHighlight();
                
                if (audioContext.state === 'suspended') { 
                    audioContext.resume().then(() => { playNote(freq, 1, midi, false); }); 
                } else { 
                    playNote(freq, 1, midi, false); 
                } 
                keyElement.classList.add('pressed'); 
            }; 
            
            const handleRelease = () => { 
                const midi = parseInt(keyElement.dataset.midi); 
                userHeldNotes.delete(midi); 
                
                stopAudioForNote(midi); // Early-stop note audio upon release
                
                updateChordDisplay();
                updateSheetMusicHighlight();
                keyElement.classList.remove('pressed'); 
                if (isMidiOutEnabled) { sendMidiNoteOff(midi); } 
            }; 
            
            keyElement.addEventListener('touchstart', handlePress, { passive: false }); 
            keyElement.addEventListener('touchend', handleRelease); 
            keyElement.addEventListener('touchcancel', handleRelease); 
            keyElement.addEventListener('mousedown', handlePress); 
            keyElement.addEventListener('mouseup', handleRelease); 
            keyElement.addEventListener('mouseleave', () => { if (keyElement.classList.contains('pressed')) { handleRelease(); } }); 
        }); 
        updatePianoLayout(parseFloat(document.getElementById('zoomSlider').value)); 
        initialScroll(); 
    }
    
    function updatePianoLayout(zoomFactor) { 
        document.documentElement.style.setProperty('--white-key-width', `${BASE_DIMENSIONS.whiteKeyWidth * zoomFactor}px`); 
        document.documentElement.style.setProperty('--white-key-height', `${BASE_DIMENSIONS.whiteKeyHeight * zoomFactor}px`); 
        document.documentElement.style.setProperty('--black-key-width', `${BASE_DIMENSIONS.blackKeyWidth * zoomFactor}px`); 
        document.documentElement.style.setProperty('--black-key-height', `${BASE_DIMENSIONS.blackKeyHeight * zoomFactor}px`); 
        document.documentElement.style.setProperty('--key-border-radius', `${BASE_DIMENSIONS.keyBorderRadius * zoomFactor}px`); 
        
        const pianoKeyboard = document.getElementById('pianoKeyboard'); 
        const whiteKeyWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-width')); 
        const blackKeyWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--black-key-width')); 
        let whiteKeyVisualIndex = 0; 
        let totalWhiteKeys = 0; 
        
        keysData.forEach(keyInfo => { 
            const keyElement = document.getElementById('key' + keyInfo.idSuffix); 
            if (!keyElement) return; 
            
            if (keyInfo.type === 'white') { 
                totalWhiteKeys++; 
                whiteKeyVisualIndex++; 
            } else { 
                const precedingWhiteKeyVisualIndex = whiteKeyVisualIndex - 1; 
                keyElement.style.left = `calc(${precedingWhiteKeyVisualIndex * whiteKeyWidth}px + ${whiteKeyWidth}px - (${blackKeyWidth / 2}px))`; 
            } 
        }); 
        pianoKeyboard.style.width = (totalWhiteKeys * whiteKeyWidth) + (totalWhiteKeys > 0 ? 5 : 0) + 'px'; 
    }
    
    function initialScroll() { 
        const pianoContainer = document.getElementById('pianoContainer'); 
        const whiteKeyWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-width')); 
        let c4WhiteKeyIndex = -1; 
        let currentWhiteKeyIdx = 0; 
        
        for(let i=0; i < keysData.length; i++) { 
            if (keysData[i].type === 'white') { 
                if (keysData[i].note === "C4") { 
                    c4WhiteKeyIndex = currentWhiteKeyIdx; break; 
                } 
                currentWhiteKeyIdx++; 
            } 
        } 
        if (c4WhiteKeyIndex !== -1) { 
            const scrollPosition = (c4WhiteKeyIndex * whiteKeyWidth) - (pianoContainer.clientWidth / 2) + (whiteKeyWidth / 2); 
            pianoContainer.scrollLeft = Math.max(0, scrollPosition); 
        } else { 
            pianoContainer.scrollLeft = 0; 
        } 
    }

    // --- SCALE, CHORD LOGIC ---
    function getFullScaleRange(rootPitchClass, semistepPattern) { 
        const allScaleNotes = []; 
        const rootIdx = ALL_NOTES_CHROMATIC.indexOf(rootPitchClass); 
        if (rootIdx === -1) return []; 
        
        const steps = semistepPattern.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0); 
        if (steps.length === 0) return []; 
        
        for (let oct = 0; oct < 9; oct++) { 
            let totalSemitonesFromOctaveRoot = 0; 
            const rootNoteNameCandidate = ALL_NOTES_CHROMATIC[rootIdx] + oct; 
            const rootKeyData = keysData.find(k => k.note === rootNoteNameCandidate); 
            if (rootKeyData) { 
                allScaleNotes.push({ ...rootKeyData, semitonesFromScaleRoot: 0 % 12, interval: INTERVAL_NAMES_BY_SEMITONE[0] }); 
            } 
            steps.forEach(step => { 
                totalSemitonesFromOctaveRoot += step; 
                let nextNoteAbsIndexChromatic = rootIdx + totalSemitonesFromOctaveRoot; 
                let nextOctaveCandidate = oct + Math.floor(nextNoteAbsIndexChromatic / 12); 
                let nextPitchClassIndexInChromatic = nextNoteAbsIndexChromatic % 12; 
                const noteNameCandidate = ALL_NOTES_CHROMATIC[nextPitchClassIndexInChromatic] + nextOctaveCandidate; 
                const keyDataInstance = keysData.find(k => k.note === noteNameCandidate); 
                if (keyDataInstance) { 
                    allScaleNotes.push({ ...keyDataInstance, semitonesFromScaleRoot: totalSemitonesFromOctaveRoot % 12, interval: INTERVAL_NAMES_BY_SEMITONE[totalSemitonesFromOctaveRoot % 12] || `+${totalSemitonesFromOctaveRoot % 12}` }); 
                } 
            }); 
        } 
        const uniqueNotes = Array.from(new Map(allScaleNotes.map(item => [item.note, item])).values()); 
        return uniqueNotes.sort((a,b) => a.frequency - b.frequency); 
    }
    
    function getScaleNotesWithOctaves(rootPitchClass, semistepPattern, startOctave = 4) { 
        const scaleNotes = []; 
        const rootIndex = ALL_NOTES_CHROMATIC.indexOf(rootPitchClass); 
        if (rootIndex === -1) return { notesWithIntervals: [], fullNoteNames: [], notesForPlayback: [] }; 
        
        let currentOctave = startOctave; 
        const steps = semistepPattern.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0); 
        let totalSemitonesFromRoot = 0; 
        let firstNoteName = ALL_NOTES_CHROMATIC[rootIndex] + currentOctave; 
        
        while(!keysData.find(k => k.note === firstNoteName) && currentOctave <= 5) { 
            currentOctave++; firstNoteName = ALL_NOTES_CHROMATIC[rootIndex] + currentOctave; 
        } 
        while(!keysData.find(k => k.note === firstNoteName) && currentOctave >= 3) { 
            currentOctave--; firstNoteName = ALL_NOTES_CHROMATIC[rootIndex] + currentOctave; 
        } 
        
        const firstNoteKeyData = keysData.find(k => k.note === firstNoteName); 
        if (firstNoteKeyData) scaleNotes.push({ ...firstNoteKeyData, interval: INTERVAL_NAMES_BY_SEMITONE[0], semitonesFromRoot: 0 }); 
        
        steps.forEach(step => { 
            totalSemitonesFromRoot += step; 
            let nextNoteAbsIndexChromatic = rootIndex + totalSemitonesFromRoot; 
            let nextOctave = currentOctave + Math.floor(nextNoteAbsIndexChromatic / 12); 
            let nextPitchClassIndexInChromatic = nextNoteAbsIndexChromatic % 12; 
            const noteName = ALL_NOTES_CHROMATIC[nextPitchClassIndexInChromatic] + nextOctave; 
            const keyDataInstance = keysData.find(k => k.note === noteName); 
            if (keyDataInstance) scaleNotes.push({ ...keyDataInstance, interval: INTERVAL_NAMES_BY_SEMITONE[totalSemitonesFromRoot % 12] || `+${totalSemitonesFromRoot % 12}`, semitonesFromRoot: totalSemitonesFromRoot }); 
        }); 
        
        const notesInOneOctave = scaleNotes.slice(0, steps.length + 1).filter(n => n.frequency); 
        return { notesWithIntervals: notesInOneOctave, fullNoteNames: notesInOneOctave.map(n => n.note), notesForPlayback: notesInOneOctave.map(n => ({note: n.note, frequency: n.frequency, pitchClass: n.pitchClass, octave: n.octave, midi: n.midi})) }; 
    }
    
    function getDiatonicTriads(rootPitchClass, semistepPattern) { 
        const { notesWithIntervals: scaleInfo } = getScaleNotesWithOctaves(rootPitchClass, semistepPattern, 4); 
        if (scaleInfo.length < 3) return []; 
        const triads = []; 
        const scaleLength = scaleInfo.length -1; 
        
        for (let i = 0; i < scaleLength; i++) { 
            const n1 = scaleInfo[i]; 
            const n3 = scaleInfo[(i + 2) % scaleLength]; 
            const n5 = scaleInfo[(i + 4) % scaleLength]; 
            let actualChordNotes = [n1.note]; 
            let tempNote = n1; 
            
            let thirdInfo = keysData.find(kd => kd.pitchClass === n3.pitchClass && kd.octave >= tempNote.octave && kd.frequency > tempNote.frequency); 
            if(!thirdInfo) thirdInfo = keysData.find(kd => kd.pitchClass === n3.pitchClass && kd.octave === tempNote.octave + 1); 
            if(thirdInfo && thirdInfo.frequency) actualChordNotes.push(thirdInfo.note); else continue; 
            tempNote = thirdInfo; 
            
            let fifthInfo = keysData.find(kd => kd.pitchClass === n5.pitchClass && kd.octave >= tempNote.octave && kd.frequency > tempNote.frequency); 
            if(!fifthInfo) fifthInfo = keysData.find(kd => kd.pitchClass === n5.pitchClass && kd.octave === tempNote.octave + 1); 
            if(fifthInfo && fifthInfo.frequency) actualChordNotes.push(fifthInfo.note); else continue; 
            
            const semitonesToThird = (ALL_NOTES_CHROMATIC.indexOf(n3.pitchClass) - ALL_NOTES_CHROMATIC.indexOf(n1.pitchClass) + 12) % 12; 
            const semitonesToFifth = (ALL_NOTES_CHROMATIC.indexOf(n5.pitchClass) - ALL_NOTES_CHROMATIC.indexOf(n1.pitchClass) + 12) % 12; 
            let type = "", labelSuffix = ""; 
            
            if (semitonesToThird === 4 && semitonesToFifth === 7) { type = "Major"; labelSuffix = "maj"; } 
            else if (semitonesToThird === 3 && semitonesToFifth === 7) { type = "minor"; labelSuffix = "m"; } 
            else if (semitonesToThird === 3 && semitonesToFifth === 6) { type = "diminished"; labelSuffix = "dim"; } 
            else if (semitonesToThird === 4 && semitonesToFifth === 8) { type = "Augmented"; labelSuffix = "aug"; } 
            else continue; 
            
            triads.push({ rootNoteName: n1.note, type: type, notes: actualChordNotes, label: `${n1.pitchClass}${labelSuffix}` }); 
        } 
        return triads; 
    }

    // --- Song Maker ---
    let isSongMakerPlaying = false;
    let isSongMakerRepeatOn = false;
    let songMakerPlaybackTimeouts = [];

    function stopSongMaker(resetButtonUI = true) {
        isSongMakerPlaying = false;
        songMakerPlaybackTimeouts.forEach(clearTimeout);
        songMakerPlaybackTimeouts = [];
        document.querySelectorAll('.key.auto-playing-note').forEach(k => k.classList.remove('auto-playing-note'));
        
        // Immediately halt any actively playing sequence audio generated by the Song Maker
        globalActiveMidiNotes.forEach(midi => stopAudioForNote(midi));
        globalActiveMidiNotes.clear();
        updateSheetMusicHighlight();

        if (resetButtonUI) {
            const playBtn = document.getElementById('songMakerPlayBtn');
            if (playBtn) {
                playBtn.textContent = 'Play Song';
                playBtn.classList.remove('playing');
            }
        }
        document.getElementById('autoPlayBtn').disabled = false;
    }

    function toggleSongMaker() {
        if (!initAudioContext()) return;
        if (isSongMakerPlaying) {
            stopSongMaker();
        } else {
            if (window.AutoPlaySystem && window.AutoPlaySystem.isPlaying()) {
                window.AutoPlaySystem.stop();
            }
            playSongMaker();
        }
    }

    function playSongMaker() {
        const tracksContainer = document.getElementById('songMakerTracksContainer');
        let trackDivs = Array.from(tracksContainer.querySelectorAll('.song-maker-track'));
        const playBtn = document.getElementById('songMakerPlayBtn');
        const mainRootPitchClass = document.getElementById('rootNoteSelect').value;
        const scalePalette = getFullScaleRange(mainRootPitchClass, document.getElementById('semistepsInput').value);

        if (scalePalette.length === 0) {
            alert("The current scale is empty. Cannot play song.");
            return;
        }

        const mainRootNote = scalePalette.find(n => n.pitchClass === mainRootPitchClass && n.octave === 4) ||
                             scalePalette.find(n => n.pitchClass === mainRootPitchClass);

        if (!mainRootNote) {
            alert(`Master root note "${mainRootPitchClass}" not found in the generated scale range.`);
            return;
        }
        const mainRootNoteIndex = scalePalette.indexOf(mainRootNote);

        let trackData = trackDivs.map(div => ({
            startingIntervals: div.querySelector('.track-roots-input').value.split(',').map(s => parseInt(s.trim(), 10)).filter(s => !isNaN(s)),
            intervals: div.querySelector('.track-intervals-input').value.split(',').map(s => s.trim()),
            isMuted: div.querySelector('.track-button.mute').classList.contains('active'),
            isSolo: div.querySelector('.track-button.solo').classList.contains('active'),
            velocity: parseFloat(div.querySelector('.track-velocity-slider').value),
            octaveOffset: parseInt(div.querySelector('.track-octave-input').value, 10) || 0,
            element: div
        }));

        const isAnySolo = trackData.some(t => t.isSolo);
        let activeTracks = isAnySolo ? trackData.filter(t => t.isSolo) : trackData.filter(t => !t.isMuted);

        if (activeTracks.length === 0 && !isSongMakerRepeatOn) {
            alert("No active tracks to play. Un-mute a track or de-activate solo mode.");
            return;
        }

        isSongMakerPlaying = true;
        playBtn.textContent = 'Stop';
        playBtn.classList.add('playing');
        document.getElementById('autoPlayBtn').disabled = true;
        
        let masterTimeline = [];
        const isHumanizerActive = document.getElementById('humanizerToggleBtn').classList.contains('active');
        const timingVariation = isHumanizerActive ? parseInt(document.getElementById('humanizerTimingSlider').value, 10) : 0;
        const velocityVariation = isHumanizerActive ? parseInt(document.getElementById('humanizerVelocitySlider').value, 10) : 0;

        activeTracks.forEach(track => {
            let currentTime = 0;

            track.startingIntervals.forEach(startInterval => {
                const startNoteIndex = mainRootNoteIndex + (startInterval - 1);
                const rootNoteData = scalePalette[startNoteIndex];
                
                if (!rootNoteData) {
                     console.warn(`Starting interval "${startInterval}" is out of the scale's range. Skipping.`);
                     return; 
                }
                const rootNoteIndexInPalette = scalePalette.indexOf(rootNoteData);
                let currentNoteEvent = null;

                track.intervals.forEach(intervalStr => {
                    let noteToPlay = null;
                    if(intervalStr === '-') { 
                        if (currentNoteEvent) {
                            currentNoteEvent.duration += effectiveBaseTempoMs; // Effectively ties/holds the previous note
                        }
                    } else {
                        const interval = parseInt(intervalStr, 10);
                        if (!isNaN(interval)) {
                            if (interval !== 0) { 
                                const targetIndex = rootNoteIndexInPalette + (interval - (interval > 0 ? 1 : 0));
                                if (targetIndex >= 0 && targetIndex < scalePalette.length) {
                                    let baseNote = scalePalette[targetIndex];
                                    let targetMidi = baseNote.midi + (track.octaveOffset * 12);
                                    let actualKey = keysData.find(k => k.midi === targetMidi);
                                    
                                    if (actualKey) {
                                        noteToPlay = actualKey;
                                    } else {
                                        noteToPlay = {
                                            midi: Math.max(0, Math.min(127, targetMidi)),
                                            frequency: baseNote.frequency * Math.pow(2, track.octaveOffset),
                                            idSuffix: null
                                        };
                                    }
                                } else {
                                    console.warn(`Interval ${interval} from start interval ${startInterval} is out of range.`);
                                }
                            }
                        }
                    }
                    
                    if (noteToPlay) {
                        let humanizedTime = currentTime;
                        if (isHumanizerActive) {
                            const timeOffset = (effectiveBaseTempoMs * (timingVariation / 100)) * (Math.random() * 2 - 1);
                            humanizedTime += timeOffset;
                        }
                        
                        let humanizedVelocity = track.velocity;
                        if(isHumanizerActive) {
                            const velOffset = Math.floor(velocityVariation * (Math.random() * 2 - 1));
                            humanizedVelocity = Math.max(0, Math.min(1, humanizedVelocity + velOffset / 127));
                        }

                        currentNoteEvent = {
                            time: humanizedTime,
                            note: noteToPlay,
                            velocity: humanizedVelocity,
                            duration: effectiveBaseTempoMs // Default to 1 interval tick
                        };
                        masterTimeline.push(currentNoteEvent);
                    } else if (intervalStr !== '-') {
                        currentNoteEvent = null; // A rest breaks the hold chain
                    }
                    currentTime += effectiveBaseTempoMs;
                });
            });
        });
        
        masterTimeline.sort((a,b) => a.time - b.time);

        masterTimeline.forEach(event => {
            const timeoutId = setTimeout(() => {
                if (!isSongMakerPlaying) return;
                playNote(event.note.frequency, event.velocity, event.note.midi, true);
                globalActiveMidiNotes.add(event.note.midi);
                updateSheetMusicHighlight();

                if (event.note.idSuffix) {
                    const keyElement = document.getElementById('key' + event.note.idSuffix);
                    if (keyElement) {
                        keyElement.classList.add('auto-playing-note');
                    }
                }
                
                // Calculate physical duration for audio cutoff & visuals
                const stopTime = event.duration * 0.95; 
                
                const stopTimeout = setTimeout(() => {
                    if (!isSongMakerPlaying) return; 
                    
                    stopAudioForNote(event.note.midi); // End sequence hold dynamically
                    globalActiveMidiNotes.delete(event.note.midi);
                    updateSheetMusicHighlight();
                    
                    if (event.note.idSuffix) {
                        const keyElement = document.getElementById('key' + event.note.idSuffix);
                        if (keyElement) keyElement.classList.remove('auto-playing-note');
                    }
                }, stopTime);
                songMakerPlaybackTimeouts.push(stopTimeout);

            }, event.time);
            songMakerPlaybackTimeouts.push(timeoutId);
        });
        
        const totalDuration = masterTimeline.length > 0 ? Math.max(...masterTimeline.map(e => e.time + e.duration)) : 
                              (activeTracks.length > 0 ? Math.max(...activeTracks.map(t => (t.startingIntervals.length * t.intervals.length) || 0)) * effectiveBaseTempoMs : effectiveBaseTempoMs);

        const endTimeout = setTimeout(() => {
            if (isSongMakerPlaying) {
                if (isSongMakerRepeatOn) {
                    document.querySelectorAll('.key.auto-playing-note').forEach(k => k.classList.remove('auto-playing-note'));
                    songMakerPlaybackTimeouts = [];
                    globalActiveMidiNotes.clear();
                    updateSheetMusicHighlight();
                    playSongMaker(); // Loop
                } else {
                    stopSongMaker();
                }
            }
        }, totalDuration);
        songMakerPlaybackTimeouts.push(endTimeout);
    }
    
    // --- General UI ---
    function updateSemitoneSum() { 
        const semistepsInput = document.getElementById('semistepsInput'); 
        const sumDisplay = document.getElementById('semistepsSumDisplay'); 
        const sum = semistepsInput.value.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0); 
        sumDisplay.textContent = `(Sum: ${sum})`; 
        sumDisplay.classList.toggle('non-octave', sum !== 12 && sum !== 0); 
    }
    
    function applyScaleFilter() { 
        if (window.AutoPlaySystem) window.AutoPlaySystem.stop(true);
        stopSongMaker(true); 
        const rootNote = document.getElementById('rootNoteSelect').value; 
        const semisteps = document.getElementById('semistepsInput').value; 
        const { notesWithIntervals, fullNoteNames } = getScaleNotesWithOctaves(rootNote, semisteps); 
        
        document.querySelectorAll('.key').forEach(keyElement => { 
            keyElement.classList.remove('chord-note-active', 'auto-playing-note'); 
            const keyPitchClass = keyElement.dataset.pitchClass; 
            const originalNoteName = keyElement.dataset.originalNoteName; 
            const labelElement = keyElement.querySelector('.key-label'); 
            const noteInfoInScaleForInterval = notesWithIntervals.find(sci => sci.note === originalNoteName); 
            const isPitchClassInScale = notesWithIntervals.some(sci => sci.pitchClass === keyPitchClass); 
            
            if (isPitchClassInScale) { 
                keyElement.classList.remove('key-disabled'); 
                if (noteInfoInScaleForInterval) { 
                    labelElement.innerHTML = `${originalNoteName}<br>(${noteInfoInScaleForInterval.interval})`; 
                } else { 
                    const anyIntervalForPitchClass = notesWithIntervals.find(sci => sci.pitchClass === keyPitchClass); 
                    if (anyIntervalForPitchClass) { 
                        labelElement.innerHTML = `${originalNoteName}<br>(${anyIntervalForPitchClass.interval})`; 
                    } else { 
                        labelElement.textContent = originalNoteName; 
                    }
                } 
            } else { 
                keyElement.classList.add('key-disabled'); 
                labelElement.textContent = originalNoteName; 
            } 
        }); 
        
        const scaleNotesDisplay = document.getElementById('scaleNotesDisplay'); 
        scaleNotesDisplay.innerHTML = ''; 
        fullNoteNames.forEach(noteName => { 
            const noteEl = document.createElement('span'); 
            noteEl.classList.add('scale-note-item'); 
            noteEl.textContent = noteName; 
            scaleNotesDisplay.appendChild(noteEl); 
        }); 

        // Enharmonic Conversion Display
        const enharmonicNotesDisplay = document.getElementById('enharmonicNotesDisplay');
        let enharmonicSpelling = [];
        if (enharmonicNotesDisplay) {
            enharmonicNotesDisplay.innerHTML = '';
            if (typeof window.getOptimalEnharmonicSpelling === 'function') {
                enharmonicSpelling = window.getOptimalEnharmonicSpelling(rootNote, semisteps);
                enharmonicSpelling.forEach(noteStr => {
                    const noteEl = document.createElement('span');
                    noteEl.classList.add('scale-note-item');
                    noteEl.textContent = noteStr;
                    enharmonicNotesDisplay.appendChild(noteEl);
                });
            } else {
                enharmonicNotesDisplay.textContent = 'EnharmonicConversion.js not loaded.';
            }
        }

        // SheetMusic Canvas Multi-Octave Array Builder
        if (window.SheetMusic && typeof window.getOptimalEnharmonicSpelling === 'function') {
            const sheetMusicNotes = [];
            const scaleLength = enharmonicSpelling.length;
            const pitchClassToEnharmonic = {};
            
            if (scaleLength > 0 && !enharmonicSpelling[0].includes("N/A")) {
                for(let i = 0; i < notesWithIntervals.length && i < scaleLength; i++) {
                    pitchClassToEnharmonic[notesWithIntervals[i].pitchClass] = enharmonicSpelling[i];
                }
            }

            keysData.forEach(key => {
                const isPitchClassInScale = notesWithIntervals.some(sci => sci.pitchClass === key.pitchClass);
                if (isPitchClassInScale) {
                    let spelling = pitchClassToEnharmonic[key.pitchClass] || key.pitchClass;
                    let letter = spelling.charAt(0);
                    let accidental = spelling.substring(1).replace('♯', '#').replace('♭', 'b').replace('𝄫', 'bb').replace('𝄪', 'x'); 
                    
                    sheetMusicNotes.push({
                        letter: letter,
                        accidental: accidental,
                        octave: key.octave,
                        midi: key.midi
                    });
                }
            });
            
            window.SheetMusic.drawScale(sheetMusicNotes);
        }
        
        const chordButtonsDisplay = document.getElementById('chordButtonsDisplay'); 
        chordButtonsDisplay.innerHTML = ''; 
        const triads = getDiatonicTriads(rootNote, semisteps); 
        triads.forEach(triad => { 
            const button = document.createElement('button'); 
            button.classList.add('chord-button'); 
            button.textContent = triad.label; 
            button.dataset.chordNotes = JSON.stringify(triad.notes); 
            button.addEventListener('click', () => playAndHighlightChord(triad.notes)); 
            chordButtonsDisplay.appendChild(button); 
        }); 
        updateSemitoneSum();

        // EXPORT CUSTOM EVENT FOR MODES.JS OR OTHER EXTERNAL SCRIPTS
        window.dispatchEvent(new CustomEvent('scaleFilterApplied', { 
            detail: { rootNote, semisteps } 
        }));
    }
    
    let activeChordHighlightTimeout; 
    function playAndHighlightChord(chordNoteNames) { 
        if (!initAudioContext()) return; 
        clearTimeout(activeChordHighlightTimeout); 
        document.querySelectorAll('.key.chord-note-active').forEach(k => k.classList.remove('chord-note-active')); 
        globalActiveMidiNotes.clear();

        chordNoteNames.forEach(noteName => { 
            const keyToPlay = keysData.find(kd => kd.note === noteName); 
            if (keyToPlay && keyToPlay.frequency) { 
                playNote(keyToPlay.frequency, 1, keyToPlay.midi, false); 
                globalActiveMidiNotes.add(keyToPlay.midi);
                const keyElement = document.getElementById('key' + keyToPlay.idSuffix); 
                if (keyElement) keyElement.classList.add('chord-note-active'); 
            } 
        }); 
        
        updateSheetMusicHighlight();

        activeChordHighlightTimeout = setTimeout(() => { 
            document.querySelectorAll('.key.chord-note-active').forEach(k => k.classList.remove('chord-note-active')); 
            globalActiveMidiNotes.clear();
            updateSheetMusicHighlight();
        }, 1000); 
    }

    // --- MIDI I/O ---
    function sendMidiNoteOn(midiNoteNumber, velocity = 100) { 
        if (isMidiOutEnabled && currentMidiOutput) { 
            if (activeMidiNotes.has(midiNoteNumber)) { 
                clearTimeout(activeMidiNotes.get(midiNoteNumber)); 
                activeMidiNotes.delete(midiNoteNumber); 
            } 
            currentMidiOutput.send([0x90, midiNoteNumber, Math.max(1, Math.min(127, velocity))]); 
        } 
    }
    function sendMidiNoteOff(midiNoteNumber, velocity = 0) { 
        if (isMidiOutEnabled && currentMidiOutput) { 
            if (activeMidiNotes.has(midiNoteNumber)) { 
                clearTimeout(activeMidiNotes.get(midiNoteNumber)); 
                activeMidiNotes.delete(midiNoteNumber); 
            } 
            currentMidiOutput.send([0x80, midiNoteNumber, velocity]); 
        } 
    }
    function initMidiOut() { 
        const midiOutToggleBtn = document.getElementById('midiOutToggleBtn'); 
        const midiOutSelect = document.getElementById('midiOutSelect'); 
        if (isMidiOutEnabled) { 
            isMidiOutEnabled = false; 
            currentMidiOutput = null; 
            midiOutSelect.innerHTML = '<option value="">(Off)</option>'; 
            midiOutSelect.disabled = true; 
            midiOutToggleBtn.textContent = 'Enable'; 
            midiOutToggleBtn.classList.remove('active'); 
            activeMidiNotes.forEach(timeoutId => clearTimeout(timeoutId)); 
            activeMidiNotes.clear(); 
            return; 
        } 
        if (navigator.requestMIDIAccess) { 
            navigator.requestMIDIAccess({ sysex: false }).then(onMIDIOutSuccess, onMIDIFailure); 
        } else { 
            alert("Web MIDI API is not supported."); 
            midiOutToggleBtn.textContent = 'Enable'; 
            midiOutToggleBtn.classList.remove('active'); 
        } 
    }
    function onMIDIOutSuccess(mAccess) { 
        midiAccess = mAccess; 
        const midiOutSelect = document.getElementById('midiOutSelect'); 
        const midiOutToggleBtn = document.getElementById('midiOutToggleBtn'); 
        const outputs = midiAccess.outputs.values(); 
        midiOutSelect.innerHTML = ''; 
        let firstOutput = null; 
        for (let output = outputs.next(); output && !output.done; output = outputs.next()) { 
            if (!firstOutput) firstOutput = output.value; 
            const option = document.createElement('option'); 
            option.value = output.value.id; 
            option.textContent = output.value.name; 
            midiOutSelect.appendChild(option); 
        } 
        if (firstOutput) { 
            currentMidiOutput = firstOutput; 
            midiOutSelect.value = firstOutput.id; 
            midiOutSelect.disabled = false; 
            isMidiOutEnabled = true; 
            midiOutToggleBtn.textContent = 'Disable'; 
            midiOutToggleBtn.classList.add('active'); 
        } else { 
            midiOutSelect.innerHTML = '<option value="">No devices</option>'; 
            midiOutSelect.disabled = true; 
            isMidiOutEnabled = false; 
            midiOutToggleBtn.textContent = 'Enable'; 
            midiOutToggleBtn.classList.remove('active'); 
            alert("No MIDI output devices found."); 
        } 
    }
    function onMIDIFailure(msg) { 
        console.error(`Failed to get MIDI access - ${msg}`); 
        alert(`Failed to get MIDI access: ${msg}`); 
        document.getElementById('midiOutToggleBtn').classList.remove('active'); 
        document.getElementById('midiInToggleBtn').classList.remove('active'); 
        isMidiOutEnabled = false; 
        isMidiInEnabled = false; 
    }
    function initMidiIn() { 
        const midiInToggleBtn = document.getElementById('midiInToggleBtn'); 
        const midiInSelect = document.getElementById('midiInSelect'); 
        if (isMidiInEnabled) { 
            if(currentMidiInput) currentMidiInput.onmidimessage = null; 
            isMidiInEnabled = false; 
            currentMidiInput = null; 
            midiInSelect.innerHTML = '<option value="">(Off)</option>'; 
            midiInSelect.disabled = true; 
            midiInToggleBtn.textContent = 'Enable'; 
            midiInToggleBtn.classList.remove('active'); 
            return; 
        } 
        if (navigator.requestMIDIAccess) { 
            navigator.requestMIDIAccess({ sysex: false }).then(onMIDIInSuccess, onMIDIFailure); 
        } else { 
            alert("Web MIDI API is not supported."); 
            midiInToggleBtn.classList.remove('active'); 
        } 
    }
    function onMIDIInSuccess(mAccess) { 
        midiAccess = mAccess; 
        const midiInSelect = document.getElementById('midiInSelect'); 
        const midiInToggleBtn = document.getElementById('midiInToggleBtn'); 
        const inputs = midiAccess.inputs.values(); 
        midiInSelect.innerHTML = ''; 
        let firstInput = null; 
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) { 
            if (!firstInput) firstInput = input.value; 
            const option = document.createElement('option'); 
            option.value = input.value.id; 
            option.textContent = input.value.name; 
            midiInSelect.appendChild(option); 
        } 
        if (firstInput) { 
            setMidiInputDevice(firstInput.id); 
            midiInSelect.value = firstInput.id; 
            midiInSelect.disabled = false; 
            isMidiInEnabled = true; 
            midiInToggleBtn.textContent = 'Disable'; 
            midiInToggleBtn.classList.add('active'); 
        } else { 
            midiInSelect.innerHTML = '<option value="">No devices</option>'; 
            midiInSelect.disabled = true; 
            isMidiInEnabled = false; 
            midiInToggleBtn.textContent = 'Enable'; 
            midiInToggleBtn.classList.remove('active'); 
            alert("No MIDI input devices found."); 
        } 
    }
    function setMidiInputDevice(deviceId) { 
        if (currentMidiInput) { 
            currentMidiInput.onmidimessage = null; 
        } 
        currentMidiInput = midiAccess.inputs.get(deviceId); 
        if (currentMidiInput) { 
            currentMidiInput.onmidimessage = handleMidiMessage; 
        } 
    }
    function handleMidiMessage(message) { 
        const [commandByte, noteNumber, velocity] = message.data; 
        const command = commandByte >> 4; 
        const keyData = keysData.find(k => k.midi === noteNumber); 
        if (!keyData) return; 
        const keyElement = document.getElementById('key' + keyData.idSuffix); 
        
        if (command === 9 && velocity > 0) { 
            if (!initAudioContext()) return; 
            userHeldNotes.add(noteNumber); 
            updateChordDisplay();
            updateSheetMusicHighlight();
            const gainScale = velocity / 127; 
            playNote(keyData.frequency, gainScale, keyData.midi, false); 
            if (keyElement) keyElement.classList.add('pressed'); 
        } else if (command === 8 || (command === 9 && velocity === 0)) { 
            userHeldNotes.delete(noteNumber); 
            
            stopAudioForNote(noteNumber); // Early-stop audio upon MIDI note off
            
            updateChordDisplay(); 
            updateSheetMusicHighlight();
            if (keyElement) keyElement.classList.remove('pressed'); 
        } 
    }
    
    // --- DATA I/O & SAMPLER LOADING ---
    function exportScales() { 
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PREDEFINED_SCALES, null, 2)); 
        const downloadAnchorNode = document.createElement('a'); 
        downloadAnchorNode.setAttribute("href", dataStr); 
        downloadAnchorNode.setAttribute("download", "custom_piano_scales.json"); 
        document.body.appendChild(downloadAnchorNode); 
        downloadAnchorNode.click(); 
        downloadAnchorNode.remove(); 
    }
    function importScales() { document.getElementById('scalesFileInput').click(); }
    function handleScaleFileImport(event) { 
        const file = event.target.files[0]; 
        if (!file) return; 
        const reader = new FileReader(); 
        reader.onload = function(e) { 
            try { 
                const importedScales = JSON.parse(e.target.result); 
                if (Array.isArray(importedScales) && importedScales.every(s => s && typeof s.name === 'string' && typeof s.steps === 'string')) { 
                    PREDEFINED_SCALES = importedScales; 
                    populateScaleDropdowns(); 
                    const scaleSelect = document.getElementById('scaleSelect'); 
                    if (scaleSelect.options.length > 0) { 
                        scaleSelect.selectedIndex = 0; 
                        document.getElementById('semistepsInput').value = scaleSelect.value; 
                    } 
                    applyScaleFilter(); 
                    alert("Scales imported successfully!"); 
                } else { 
                    alert("Invalid scale file format."); 
                } 
            } catch (error) { 
                console.error("Error parsing scale file:", error); 
                alert("Error parsing scale file: " + error.message); 
            } 
        }; 
        reader.readAsText(file); 
        event.target.value = null; 
    }
    function exportSounds() { 
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PREDEFINED_SOUNDS, null, 2)); 
        const downloadAnchorNode = document.createElement('a'); 
        downloadAnchorNode.setAttribute("href", dataStr); 
        downloadAnchorNode.setAttribute("download", "custom_piano_sounds.json"); 
        document.body.appendChild(downloadAnchorNode); 
        downloadAnchorNode.click(); 
        downloadAnchorNode.remove(); 
    }
    function importSounds() { document.getElementById('soundsFileInput').click(); }
    function handleSoundFileImport(event) { 
        const file = event.target.files[0]; 
        if (!file) return; 
        const reader = new FileReader(); 
        reader.onload = function(e) { 
            try { 
                const importedSounds = JSON.parse(e.target.result); 
                if (Array.isArray(importedSounds) && importedSounds.every(s => s && s.id && s.name && s.params)) { 
                    PREDEFINED_SOUNDS = importedSounds; 
                    populateSoundSelect(); 
                    alert("Sounds imported successfully!"); 
                } else { 
                    alert("Invalid sound file format."); 
                } 
            } catch (error) { 
                console.error("Error parsing sound file:", error); 
                alert("Error parsing sound file: " + error.message); 
            } 
        }; 
        reader.readAsText(file); 
        event.target.value = null; 
    }
    function loadSample() { document.getElementById('sampleFileInput').click(); }
    function handleSampleFileImport(event) { 
        const file = event.target.files[0]; 
        if (!file) return; 
        if (!initAudioContext()) { 
            alert("Audio context must be initialized first. Please click the piano."); 
            return; 
        } 
        const reader = new FileReader(); 
        reader.onload = function(e) { 
            audioContext.decodeAudioData(e.target.result, (buffer) => { 
                loadedSampleBuffers.set('sampler', buffer); 
                updateSamplerOptionInSelect(true); 
                alert('Sample loaded successfully!'); 
            }, (error) => { 
                console.error("Error decoding audio data:", error); 
                alert("Error decoding audio file: " + error.message); 
            }); 
        }; 
        reader.readAsArrayBuffer(file); 
        event.target.value = null; 
    }

    // --- UI INITIALIZATION & EVENT LISTENERS ---
    async function loadDefaultWavSamples() {
        let loadedSomething = false;
        for (const soundInfo of [...DEFAULT_WAV_SAMPLES].reverse()) {
            try {
                const response = await fetch(soundInfo.file);
                if (!response.ok) {
                    console.log(`'${soundInfo.file}' not found, skipping.`);
                    continue;
                }
                const arrayBuffer = await response.arrayBuffer();
                const decodedBuffer = await new Promise((resolve, reject) => {
                    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
                });
                
                const soundId = `wav_${soundInfo.file.split('.')[0].toLowerCase()}`;
                loadedSampleBuffers.set(soundId, decodedBuffer);

                if (!PREDEFINED_SOUNDS.some(s => s.id === soundId)) {
                   PREDEFINED_SOUNDS.unshift({ id: soundId, name: soundInfo.name, params: {} });
                }
                loadedSomething = true;
                console.log(`'${soundInfo.file}' loaded successfully.`);

            } catch (error) {
                console.error(`Error loading or decoding ${soundInfo.file}:`, error);
            }
        }

        if (loadedSomething) {
            populateSoundSelect();
            const pianoC4Id = `wav_pianoc4`;
            if (loadedSampleBuffers.has(pianoC4Id)) {
                document.getElementById('soundTypeSelect').value = pianoC4Id;
            }
        }
    }
    
    function populateScaleDropdowns() { 
        const rootNoteSelect = document.getElementById('rootNoteSelect'); 
        const currentRoot = rootNoteSelect.value; 
        rootNoteSelect.innerHTML = ''; 
        ALL_NOTES_CHROMATIC.forEach(note => { 
            const option = document.createElement('option'); 
            option.value = note; 
            option.textContent = note; 
            rootNoteSelect.appendChild(option); 
        }); 
        rootNoteSelect.value = ALL_NOTES_CHROMATIC.includes(currentRoot) ? currentRoot : "C"; 
        
        const scaleSelect = document.getElementById('scaleSelect'); 
        const currentScaleSteps = scaleSelect.value; 
        scaleSelect.innerHTML = ''; 
        PREDEFINED_SCALES.forEach(scale => { 
            const option = document.createElement('option'); 
            option.value = scale.steps; 
            option.textContent = scale.steps ? `${scale.name} (${scale.steps})` : scale.name; 
            scaleSelect.appendChild(option); 
        }); 
        
        let foundSelected = false; 
        const ionianIndex = PREDEFINED_SCALES.findIndex(s => s.name === "Ionian (Major)" || s.name === "Ionian"); 
        for(let i=0; i < scaleSelect.options.length; i++){ 
            if(scaleSelect.options[i].value === currentScaleSteps){ 
                scaleSelect.selectedIndex = i; 
                foundSelected = true; 
                break; 
            } 
        } 
        if(!foundSelected && scaleSelect.options.length > 0){ 
            scaleSelect.selectedIndex = ionianIndex !== -1 ? ionianIndex : 0; 
        } 
        if(scaleSelect.value) document.getElementById('semistepsInput').value = scaleSelect.value; 
        else if (scaleSelect.options.length > 0) document.getElementById('semistepsInput').value = scaleSelect.options[0].value; 
    }
    
    function updateSamplerOptionInSelect(selectAfterAdding = false) { 
        const soundSelect = document.getElementById('soundTypeSelect'); 
        let samplerOption = soundSelect.querySelector('option[value="sampler"]'); 
        if (loadedSampleBuffers.has('sampler')) { 
            if (!samplerOption) { 
                samplerOption = document.createElement('option'); 
                samplerOption.value = 'sampler'; 
                samplerOption.textContent = 'Sampler (User)'; 
                soundSelect.appendChild(samplerOption); 
            } 
            if (selectAfterAdding) { 
                soundSelect.value = 'sampler'; 
            } 
        } else { 
            if (samplerOption) { 
                if (soundSelect.value === 'sampler') { 
                    soundSelect.selectedIndex = 0; 
                } 
                samplerOption.remove(); 
            } 
        } 
    }
    
    function populateSoundSelect() { 
        const soundTypeSelect = document.getElementById('soundTypeSelect'); 
        const currentSoundId = soundTypeSelect.value; 
        soundTypeSelect.innerHTML = ''; 
        PREDEFINED_SOUNDS.forEach(sound => { 
            const option = document.createElement('option'); 
            option.value = sound.id; 
            option.textContent = sound.name; 
            soundTypeSelect.appendChild(option); 
        }); 
        updateSamplerOptionInSelect(false); 
        if (PREDEFINED_SOUNDS.some(s => s.id === currentSoundId)) { 
            soundTypeSelect.value = currentSoundId; 
        } else if (soundTypeSelect.value !== 'sampler') { 
            const classicPiano = PREDEFINED_SOUNDS.find(s => s.id === "classic_piano"); 
            soundTypeSelect.value = classicPiano ? classicPiano.id : (PREDEFINED_SOUNDS[0] ? PREDEFINED_SOUNDS[0].id : ''); 
        } 
    }
    
    function toggleScaleSet() { 
        const toggleBtn = document.getElementById('scaleSetToggleBtn'); 
        const scaleSelect = document.getElementById('scaleSelect'); 
        const semistepsInput = document.getElementById('semistepsInput'); 
        
        if (!isZeitlerLoaded && typeof ZEITLER_SCALES_DATA !== 'undefined') {
            ZEITLER_SCALES = ZEITLER_SCALES_DATA;
            if (!ZEITLER_SCALES.some(s => s.name === "Custom")) {
                ZEITLER_SCALES.push({ name: "Custom", steps: "" });
            }
            isZeitlerLoaded = true;
        }

        isZeitlerSetCurrent = !isZeitlerSetCurrent; 
        
        if (isZeitlerSetCurrent) { 
            PREDEFINED_SCALES = ZEITLER_SCALES; 
            toggleBtn.textContent = 'Basic'; 
        } else { 
            PREDEFINED_SCALES = BASIC_SCALES; 
            toggleBtn.textContent = 'Zeitler'; 
        } 
        
        populateScaleDropdowns(); 
        
        if (scaleSelect.options.length > 0) { 
            scaleSelect.selectedIndex = 0; 
            semistepsInput.value = scaleSelect.value; 
        } 
        applyScaleFilter(); 
    }
    
    function toggle88Keys() { 
        is88KeyMode = !is88KeyMode; 
        const btn = document.getElementById('toggle88KeysBtn'); 
        if (window.AutoPlaySystem) window.AutoPlaySystem.stop(true);
        stopSongMaker(true); 
        if (is88KeyMode) { 
            generateKeysData('A0', 'C8'); 
            btn.textContent = '3 Octave'; 
        } else { 
            generateKeysData('C3', 'B5'); 
            btn.textContent = '88 Keys'; 
        } 
        createPianoKeys(); 
        applyScaleFilter(); 
    }
    
    function populateDropdowns() { 
        populateScaleDropdowns(); 
        populateSoundSelect(); 
    }
    
    function setupTetrachordControls() { 
        const lowerSelect = document.getElementById('lowerTetrachordSelect'); 
        const upperSelect = document.getElementById('upperTetrachordSelect'); 
        const middleStepDisplay = document.getElementById('middleStepDisplay'); 
        const createBtn = document.getElementById('createScaleFromTetrachordsBtn'); 
        const semistepsInput = document.getElementById('semistepsInput'); 
        
        function populateTetrachordSelects() { 
            lowerSelect.innerHTML = ''; 
            upperSelect.innerHTML = ''; 
            TETRACHORDS.forEach(t => { 
                const option = document.createElement('option'); 
                option.value = t.steps; 
                option.textContent = `${t.name} (${t.steps})`; 
                lowerSelect.appendChild(option.cloneNode(true)); 
                upperSelect.appendChild(option); 
            }); 
            lowerSelect.value = "221"; 
            upperSelect.value = "212"; 
        } 
        
        function updateTetrachordScale() { 
            const lowerSteps = lowerSelect.value; 
            const upperSteps = upperSelect.value; 
            const lowerSum = lowerSteps.split('').reduce((sum, s) => sum + parseInt(s, 10), 0); 
            const upperSum = upperSteps.split('').reduce((sum, s) => sum + parseInt(s, 10), 0); 
            const middleStep = 12 - lowerSum - upperSum; 
            middleStepDisplay.textContent = middleStep >= 0 ? `+${middleStep}` : `${middleStep}`; 
            middleStepDisplay.style.color = (middleStep < 0) ? '#f44336' : '#8f8'; 
        } 
        
        populateTetrachordSelects(); 
        updateTetrachordScale(); 
        lowerSelect.addEventListener('change', updateTetrachordScale); 
        upperSelect.addEventListener('change', updateTetrachordScale); 
        
        createBtn.addEventListener('click', () => { 
            const lowerSteps = lowerSelect.value; 
            const upperSteps = upperSelect.value; 
            const lowerSum = lowerSteps.split('').reduce((sum, s) => sum + parseInt(s, 10), 0); 
            const upperSum = upperSteps.split('').reduce((sum, s) => sum + parseInt(s, 10), 0); 
            const middleStep = 12 - lowerSum - upperSum; 
            if (middleStep < 0) { alert("Tetrachord combination is too long."); return; } 
            semistepsInput.value = `${lowerSteps}${middleStep}${upperSteps}`; 
            semistepsInput.dispatchEvent(new Event('input')); 
        }); 
    }
    
    // --- Song Maker UI ---
    function generateSongMakerTracks(count) {
        const container = document.getElementById('songMakerTracksContainer');
        container.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const trackDiv = document.createElement('div');
            trackDiv.className = 'song-maker-track';
            trackDiv.innerHTML = `
                <div class="song-maker-track-header">
                    <span class="track-title">Track ${i}</span>
                    <button class="track-button solo">Solo</button>
                    <button class="track-button mute">Mute</button>
                    <button class="track-button random-track">Random</button>
                    <label>Oct:</label>
                    <input type="number" class="track-octave-input" value="0" min="-4" max="4" style="width: 45px;" title="Octave Offset">
                    <label>Vel:</label>
                    <input type="range" class="track-velocity-slider" min="0" max="1" step="0.01" value="0.7">
                </div>
                <div class="track-inputs">
                    <input type="text" class="track-roots-input" placeholder="Starting Intervals (relative to Root) e.g., 1, 5, -2">
                    <input type="text" class="track-intervals-input" placeholder="Scale Intervals (relative to Start) e.g., 1, 3, 5, 0, -">
                </div>
            `;
            container.appendChild(trackDiv);
        }
        
        container.querySelectorAll('.track-button.solo').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('active')));
        container.querySelectorAll('.track-button.mute').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('active')));
        container.querySelectorAll('.track-button.random-track').forEach(btn => btn.addEventListener('click', (e) => randomizeTrack(e.target.closest('.song-maker-track'))));
    }
    
    function randomizeTrack(track) {
        const rootsInput = track.querySelector('.track-roots-input');
        const intervalsInput = track.querySelector('.track-intervals-input');

        const numRoots = Math.floor(Math.random() * 3) + 1; 
        let roots = [];
        for (let i = 0; i < numRoots; i++) {
            roots.push(Math.floor(Math.random() * 15) - 7); 
        }
        rootsInput.value = roots.join(', ');

        const numIntervals = Math.floor(Math.random() * 9) + 8; 
        let intervals = [];
        for (let i = 0; i < numIntervals; i++) {
            const rand = Math.random();
            if (rand < 0.75) { 
                intervals.push(Math.floor(Math.random() * 8) + 1); 
            } else if (rand < 0.9) { 
                intervals.push('0');
            } else { 
                intervals.push('-');
            }
        }
        intervalsInput.value = intervals.join(', ');
    }

    function generateRandomSongData() {
        document.querySelectorAll('.song-maker-track').forEach(randomizeTrack);
    }

    function setupSongMakerControls() {
        const trackCountInput = document.getElementById('songMakerTrackCount');
        trackCountInput.addEventListener('change', () => {
            const count = parseInt(trackCountInput.value, 10);
            if (count > 0 && count <= 16) {
                generateSongMakerTracks(count);
            }
        });

        document.getElementById('humanizerToggleBtn').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            document.getElementById('humanizerControls').classList.toggle('visible');
        });
        
        document.getElementById('saveSongBtn').addEventListener('click', saveSongToFile);
        document.getElementById('loadSongBtn').addEventListener('click', () => document.getElementById('songFileInput').click());
        document.getElementById('songFileInput').addEventListener('change', loadSongFromFile);
        document.getElementById('saveMidiBtn').addEventListener('click', saveToMidiFile);
        document.getElementById('songMakerRandomBtn').addEventListener('click', generateRandomSongData);

        generateSongMakerTracks(parseInt(trackCountInput.value, 10)); 
    }

    // --- Song Maker File I/O ---
    function saveSongToFile() {
        const tracks = Array.from(document.querySelectorAll('.song-maker-track')).map(div => ({
            startingIntervals: div.querySelector('.track-roots-input').value,
            intervals: div.querySelector('.track-intervals-input').value,
            isMuted: div.querySelector('.track-button.mute').classList.contains('active'),
            isSolo: div.querySelector('.track-button.solo').classList.contains('active'),
            velocity: div.querySelector('.track-velocity-slider').value,
            octaveOffset: parseInt(div.querySelector('.track-octave-input').value, 10) || 0
        }));

        const humanizer = {
            active: document.getElementById('humanizerToggleBtn').classList.contains('active'),
            timing: document.getElementById('humanizerTimingSlider').value,
            velocity: document.getElementById('humanizerVelocitySlider').value
        };

        const songData = {
            trackCount: tracks.length,
            tracks: tracks,
            humanizer: humanizer,
            tempo: document.getElementById('tempoInput').value,
            repeat: isSongMakerRepeatOn
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "piano_song.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function loadSongFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const songData = JSON.parse(e.target.result);
                if (!songData || !songData.tracks) throw new Error("Invalid format");
                
                stopSongMaker();
                
                document.getElementById('tempoInput').value = songData.tempo || 80;
                document.getElementById('tempoSlider').value = songData.tempo || 80;
                syncTempo(songData.tempo || 80);

                const trackCountInput = document.getElementById('songMakerTrackCount');
                trackCountInput.value = songData.trackCount;
                generateSongMakerTracks(songData.trackCount);

                const trackDivs = document.querySelectorAll('.song-maker-track');
                songData.tracks.forEach((track, index) => {
                    if (trackDivs[index]) {
                        const div = trackDivs[index];
                        div.querySelector('.track-roots-input').value = track.startingIntervals;
                        div.querySelector('.track-intervals-input').value = track.intervals;
                        div.querySelector('.track-velocity-slider').value = track.velocity;
                        div.querySelector('.track-octave-input').value = track.octaveOffset || 0;
                        div.querySelector('.track-button.mute').classList.toggle('active', track.isMuted);
                        div.querySelector('.track-button.solo').classList.toggle('active', track.isSolo);
                    }
                });

                const humanizerBtn = document.getElementById('humanizerToggleBtn');
                const humanizerControls = document.getElementById('humanizerControls');
                humanizerBtn.classList.toggle('active', songData.humanizer.active);
                humanizerControls.classList.toggle('visible', songData.humanizer.active);
                document.getElementById('humanizerTimingSlider').value = songData.humanizer.timing;
                document.getElementById('humanizerVelocitySlider').value = songData.humanizer.velocity;
                
                const repeatBtn = document.getElementById('songMakerRepeatBtn');
                isSongMakerRepeatOn = songData.repeat || false;
                repeatBtn.textContent = isSongMakerRepeatOn ? 'Repeat On' : 'Repeat Off';
                repeatBtn.classList.toggle('active', isSongMakerRepeatOn);

                alert("Song loaded successfully!");
            } catch (error) {
                alert("Failed to load song file. Error: " + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = null; 
    }

    // --- MIDI Export ---
    function saveToMidiFile() {
        const mainRootPitchClass = document.getElementById('rootNoteSelect').value;
        const scalePalette = getFullScaleRange(mainRootPitchClass, document.getElementById('semistepsInput').value);
        const trackDivs = Array.from(document.querySelectorAll('.song-maker-track'));

        const mainRootNote = scalePalette.find(n => n.pitchClass === mainRootPitchClass && n.octave === 4) ||
                             scalePalette.find(n => n.pitchClass === mainRootPitchClass);

        if (!mainRootNote) {
            alert(`Master root note "${mainRootPitchClass}" not found for MIDI export.`);
            return;
        }
        const mainRootNoteIndex = scalePalette.indexOf(mainRootNote);

        let trackData = trackDivs.map((div, i) => ({
            channel: i,
            startingIntervals: div.querySelector('.track-roots-input').value.split(',').map(s => parseInt(s.trim(), 10)).filter(s => !isNaN(s)),
            intervals: div.querySelector('.track-intervals-input').value.split(',').map(s => s.trim()),
            isMuted: div.querySelector('.track-button.mute').classList.contains('active'),
            isSolo: div.querySelector('.track-button.solo').classList.contains('active'),
            baseVelocity: parseFloat(div.querySelector('.track-velocity-slider').value) * 127,
            octaveOffset: parseInt(div.querySelector('.track-octave-input').value, 10) || 0
        }));

        const isAnySolo = trackData.some(t => t.isSolo);
        let activeTracks = isAnySolo ? trackData.filter(t => t.isSolo) : trackData.filter(t => !t.isMuted);
        
        const isHumanizerActive = document.getElementById('humanizerToggleBtn').classList.contains('active');
        const timingVariation = isHumanizerActive ? parseInt(document.getElementById('humanizerTimingSlider').value, 10) : 0;
        const velocityVariation = isHumanizerActive ? parseInt(document.getElementById('humanizerVelocitySlider').value, 10) : 0;

        const ticksPerBeat = 480;
        const bpm = parseInt(document.getElementById('tempoInput').value, 10);
        const beatDurationTicks = ticksPerBeat;

        let midiTracks = [];

        activeTracks.forEach(track => {
            let noteEvents = [];
            let currentTimeTicks = 0;

            track.startingIntervals.forEach(startInterval => {
                const startNoteIndex = mainRootNoteIndex + (startInterval - 1);
                const rootNoteData = scalePalette[startNoteIndex];

                if (!rootNoteData) return; 
                const rootNoteIndexInPalette = scalePalette.indexOf(rootNoteData);

                track.intervals.forEach(intervalStr => {
                    let noteToPlay = null;
                    let isHold = false;
                    
                    if (intervalStr === '-') {
                       isHold = true;
                    } else {
                        const interval = parseInt(intervalStr, 10);
                        if (!isNaN(interval) && interval !== 0) {
                            const targetIndex = rootNoteIndexInPalette + (interval - (interval > 0 ? 1 : 0));
                            if (targetIndex >= 0 && targetIndex < scalePalette.length) {
                                let baseNote = scalePalette[targetIndex];
                                let targetMidi = baseNote.midi + (track.octaveOffset * 12);
                                noteToPlay = { midi: Math.max(0, Math.min(127, targetMidi)) };
                            }
                        }
                    }
                    
                    if (isHold && noteEvents.length > 0) {
                       const lastEvent = noteEvents[noteEvents.length - 1];
                       if(lastEvent.type === 'off') {
                            const onEvent = noteEvents.find(e => e.type === 'on' && e.note === lastEvent.note && e.tick < lastEvent.tick);
                            if(onEvent) {
                                lastEvent.tick += beatDurationTicks;
                            }
                       }
                    } else if(noteToPlay) {
                        let humanizedTick = currentTimeTicks;
                        if(isHumanizerActive) {
                            const timeOffsetRatio = (timingVariation / 100) * (Math.random() * 2 - 1);
                            humanizedTick += Math.round(beatDurationTicks * timeOffsetRatio);
                        }
                         let humanizedVelocity = track.baseVelocity;
                        if(isHumanizerActive) {
                            const velOffset = Math.floor(velocityVariation * (Math.random() * 2 - 1) * (127/50));
                            humanizedVelocity += velOffset;
                        }
                        humanizedVelocity = Math.max(1, Math.min(127, Math.round(humanizedVelocity)));

                        noteEvents.push({ type: 'on', tick: humanizedTick, note: noteToPlay.midi, velocity: humanizedVelocity, channel: track.channel });
                        noteEvents.push({ type: 'off', tick: humanizedTick + beatDurationTicks, note: noteToPlay.midi, channel: track.channel });
                    }
                    currentTimeTicks += beatDurationTicks;
                });
            });
            
            if (noteEvents.length > 0) {
                midiTracks.push(noteEvents);
            }
        });

        if (midiTracks.length === 0) {
            alert("No notes to export.");
            return;
        }

        const writeStringToBytes = (str) => Array.from(str).map(c => c.charCodeAt(0));
        const write32 = (n) => [(n >> 24) & 0xFF, (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF];
        const write16 = (n) => [(n >> 8) & 0xFF, n & 0xFF];
        
        const writeVariableLength = (n) => {
            let buf = [n & 0x7F];
            n >>= 7;
            while (n > 0) {
                buf.unshift((n & 0x7F) | 0x80);
                n >>= 7;
            }
            return buf;
        };

        const header = [
            ...writeStringToBytes('MThd'),
            ...write32(6),
            ...write16(1),
            ...write16(midiTracks.length),
            ...write16(ticksPerBeat)
        ];

        let allTrackBytes = [];
        midiTracks.forEach((events, i) => {
            events.sort((a, b) => a.tick - b.tick);
            let trackBytes = [];
            let lastTick = 0;
            events.forEach(event => {
                const delta = event.tick - lastTick;
                trackBytes.push(...writeVariableLength(delta));
                let status = (event.type === 'on' ? 0x90 : 0x80) | event.channel;
                trackBytes.push(status, event.note, event.velocity || 0);
                lastTick = event.tick;
            });
            
            trackBytes.push(...writeVariableLength(0));
            trackBytes.push(0xFF, 0x2F, 0x00);
            
            const trackHeader = [
                ...writeStringToBytes('MTrk'),
                ...write32(trackBytes.length)
            ];
            allTrackBytes.push(...trackHeader, ...trackBytes);
        });
        
        const midiBytes = new Uint8Array([...header, ...allTrackBytes]);
        const blob = new Blob([midiBytes], { type: 'audio/midi' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano_song.mid';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Sync Tempo helper
    function syncTempo(sourceValue) { 
        const bpm = parseInt(sourceValue, 10); 
        if (isNaN(bpm)) return; 
        document.getElementById('tempoSlider').value = bpm; 
        document.getElementById('tempoInput').value = bpm; 
        effectiveBaseTempoMs = 60000 / bpm; 
    }

    // EXPORT HELPER FUNCTION TO PROGRAMMATICALLY UPDATE ROOT/SCALE FROM EXTERNAL SCRIPTS
    window.setMainAppScale = function(rootNote, steps) {
        const rootSelect = document.getElementById('rootNoteSelect');
        const stepsInput = document.getElementById('semistepsInput');
        
        if (rootSelect && stepsInput) {
            rootSelect.value = rootNote;
            stepsInput.value = steps;
            
            // Trigger the input event which handles the rest of the dropdown sync and UI updates
            stepsInput.dispatchEvent(new Event('input'));
            rootSelect.dispatchEvent(new Event('change'));
        }
    };

    function setupControls() {
        populateDropdowns(); setupTetrachordControls(); setupSongMakerControls();
        const elements = { rootNoteSelect: 'rootNoteSelect', scaleSelect: 'scaleSelect', semistepsInput: 'semistepsInput', randomRootBtn: 'randomRootBtn', randomScaleBtn: 'randomScaleBtn', autoPlayBtn: 'autoPlayBtn', scaleSetToggleBtn: 'scaleSetToggleBtn', loadJsScalesBtn: 'loadJsScalesBtn', toggle88KeysBtn: 'toggle88KeysBtn', exportScalesBtn: 'exportScalesBtn', importScalesBtn: 'importScalesBtn', scalesFileInput: 'scalesFileInput', exportSoundsBtn: 'exportSoundsBtn', importSoundsBtn: 'importSoundsBtn', soundsFileInput: 'soundsFileInput', midiOutToggleBtn: 'midiOutToggleBtn', midiOutSelect: 'midiOutSelect', midiInToggleBtn: 'midiInToggleBtn', midiInSelect: 'midiInSelect', loadSampleBtn: 'loadSampleBtn', sampleFileInput: 'sampleFileInput', volumeSlider: 'volumeSlider', tempoSlider: 'tempoSlider', tempoInput: 'tempoInput', reverbToggleBtn: 'reverbToggleBtn', reverbMixSlider: 'reverbMixSlider', delayToggleBtn: 'delayToggleBtn', delayMixSlider: 'delayMixSlider', delayTimeSlider: 'delayTimeSlider', delayFeedbackSlider: 'delayFeedbackSlider', songMakerPlayBtn: 'songMakerPlayBtn', songMakerRepeatBtn: 'songMakerRepeatBtn' };
        for(let key in elements) { elements[key] = document.getElementById(elements[key]); }

        elements.rootNoteSelect.addEventListener('change', applyScaleFilter);
        elements.scaleSelect.addEventListener('change', () => { elements.semistepsInput.value = elements.scaleSelect.value; applyScaleFilter(); });
        elements.semistepsInput.addEventListener('input', () => { const matchedScale = PREDEFINED_SCALES.find(s => s.steps === elements.semistepsInput.value); if (matchedScale) { elements.scaleSelect.value = matchedScale.steps; } else { for (let i = 0; i < elements.scaleSelect.options.length; i++) { if (elements.scaleSelect.options[i].text === "Custom") { elements.scaleSelect.selectedIndex = i; break;}}} applyScaleFilter(); });
        elements.randomRootBtn.addEventListener('click', () => { elements.rootNoteSelect.value = ALL_NOTES_CHROMATIC[Math.floor(Math.random() * ALL_NOTES_CHROMATIC.length)]; applyScaleFilter(); });
        elements.randomScaleBtn.addEventListener('click', () => { const actualScales = PREDEFINED_SCALES.filter(s => s.name !== "Custom" || s.steps !== ""); const randomIdx = Math.floor(Math.random() * actualScales.length); elements.scaleSelect.value = actualScales[randomIdx].steps; elements.semistepsInput.value = actualScales[randomIdx].steps; applyScaleFilter(); });
        
        elements.autoPlayBtn.addEventListener('click', () => {
            if (window.AutoPlaySystem) window.AutoPlaySystem.toggle();
        }); 

        elements.scaleSetToggleBtn.addEventListener('click', toggleScaleSet);
        elements.loadJsScalesBtn.addEventListener('click', loadScalesFromJs);
        elements.toggle88KeysBtn.addEventListener('click', toggle88Keys);
        elements.exportScalesBtn.addEventListener('click', exportScales); elements.importScalesBtn.addEventListener('click', importScales); elements.scalesFileInput.addEventListener('change', handleScaleFileImport);
        elements.exportSoundsBtn.addEventListener('click', exportSounds); elements.importSoundsBtn.addEventListener('click', importSounds); elements.soundsFileInput.addEventListener('change', handleSoundFileImport);
        elements.loadSampleBtn.addEventListener('click', loadSample); elements.sampleFileInput.addEventListener('change', handleSampleFileImport);
        elements.midiOutToggleBtn.addEventListener('click', initMidiOut); elements.midiOutSelect.addEventListener('change', (event) => { if (midiAccess && event.target.value) { currentMidiOutput = midiAccess.outputs.get(event.target.value); } else { currentMidiOutput = null; } });
        elements.midiInToggleBtn.addEventListener('click', initMidiIn); elements.midiInSelect.addEventListener('change', (event) => setMidiInputDevice(event.target.value));
        elements.volumeSlider.addEventListener('input', (event) => { if (masterVolumeNode) masterVolumeNode.gain.value = parseFloat(event.target.value); });
        elements.songMakerPlayBtn.addEventListener('click', toggleSongMaker);
        elements.songMakerRepeatBtn.addEventListener('click', () => {
            isSongMakerRepeatOn = !isSongMakerRepeatOn;
            elements.songMakerRepeatBtn.textContent = isSongMakerRepeatOn ? 'Repeat On' : 'Repeat Off';
            elements.songMakerRepeatBtn.classList.toggle('active', isSongMakerRepeatOn);
        });
        
        elements.tempoSlider.addEventListener('input', (event) => syncTempo(event.target.value));
        elements.tempoInput.addEventListener('input', (event) => syncTempo(event.target.value));
        syncTempo(elements.tempoSlider.value);

        elements.reverbToggleBtn.addEventListener('click', () => { if (!initAudioContext()) return; isReverbOn = !isReverbOn; elements.reverbToggleBtn.textContent = isReverbOn ? 'On' : 'Off'; elements.reverbToggleBtn.classList.toggle('active', isReverbOn); elements.reverbMixSlider.disabled = !isReverbOn; reverbWetGain.gain.value = isReverbOn ? parseFloat(elements.reverbMixSlider.value) : 0; });
        elements.reverbMixSlider.addEventListener('input', (e) => { if (isReverbOn && reverbWetGain) reverbWetGain.gain.value = parseFloat(e.target.value); });

        elements.delayToggleBtn.addEventListener('click', () => { if (!initAudioContext()) return; isDelayOn = !isDelayOn; elements.delayToggleBtn.textContent = isDelayOn ? 'On' : 'Off'; elements.delayToggleBtn.classList.toggle('active', isDelayOn); [elements.delayMixSlider, elements.delayTimeSlider, elements.delayFeedbackSlider].forEach(s => s.disabled = !isDelayOn); if (isDelayOn) { delayWetGain.gain.value = parseFloat(elements.delayMixSlider.value); delayNode.delayTime.value = parseFloat(elements.delayTimeSlider.value); delayFeedbackGain.gain.value = parseFloat(elements.delayFeedbackSlider.value); } else { delayWetGain.gain.value = 0; } });
        elements.delayMixSlider.addEventListener('input', (e) => { if (isDelayOn && delayWetGain) delayWetGain.gain.value = parseFloat(e.target.value); });
        elements.delayTimeSlider.addEventListener('input', (e) => { if (isDelayOn && delayNode) delayNode.delayTime.value = parseFloat(e.target.value); });
        elements.delayFeedbackSlider.addEventListener('input', (e) => { if (isDelayOn && delayFeedbackGain) delayFeedbackGain.gain.value = parseFloat(e.target.value); });
    }
    
    function loadScalesFromJs() {
        if (typeof scalesList === 'undefined' || !Array.isArray(scalesList)) {
            alert("scalesList.js is not loaded or the variable is not an array.");
            return;
        }

        const convertedScales = scalesList.map(scale => ({
            name: scale.name,
            steps: Array.isArray(scale.steps) ? scale.steps.join('') : scale.steps
        }));

        convertedScales.push({ name: "Custom", steps: "" });
        PREDEFINED_SCALES = convertedScales;
        document.getElementById('scaleSetToggleBtn').disabled = true;

        populateScaleDropdowns();
        const scaleSelect = document.getElementById('scaleSelect');
        if (scaleSelect.options.length > 0) {
            scaleSelect.selectedIndex = 0;
            document.getElementById('semistepsInput').value = scaleSelect.value;
        }
        applyScaleFilter();
        alert(`Loaded ${convertedScales.length -1} scales successfully!`);
    }

    function handleKeyDown(e) { 
        if (e.repeat || document.activeElement.tagName === 'INPUT') return; 
        const noteName = KEYBOARD_MAP[e.key.toLowerCase()]; 
        if (noteName && !activeComputerKeys.has(noteName)) { 
            const keyData = keysData.find(k => k.note === noteName); 
            if (keyData) { 
                const keyElement = document.getElementById('key' + keyData.idSuffix); 
                if (keyElement && !keyElement.classList.contains('key-disabled')) { 
                    if (!initAudioContext()) return; 
                    userHeldNotes.add(keyData.midi); 
                    updateChordDisplay(); 
                    updateSheetMusicHighlight();
                    playNote(keyData.frequency, 1, keyData.midi, false); 
                    keyElement.classList.add('pressed'); 
                    activeComputerKeys.add(noteName); 
                } 
            } 
        } 
    }
    
    function handleKeyUp(e) { 
        const noteName = KEYBOARD_MAP[e.key.toLowerCase()]; 
        if (noteName) { 
            const keyData = keysData.find(k => k.note === noteName); 
            if (keyData) { 
                userHeldNotes.delete(keyData.midi); 
                
                stopAudioForNote(keyData.midi); // Stop computer keyboard note early
                
                updateChordDisplay();
                updateSheetMusicHighlight();
                const keyElement = document.getElementById('key' + keyData.idSuffix); 
                if (keyElement) keyElement.classList.remove('pressed'); 
            } 
            activeComputerKeys.delete(noteName); 
        } 
    }

    function setupSectionManagement() {
        const container = document.getElementById('main-container');
        container.addEventListener('click', e => { 
            if (e.target.classList.contains('toggle-btn')) { 
                const content = e.target.closest('.draggable-section').querySelector('.section-content'); 
                if (content) { 
                    const isHidden = content.classList.toggle('hidden'); 
                    e.target.textContent = isHidden ? '+' : '-'; 
                    content.style.maxHeight = isHidden ? '0px' : content.scrollHeight + 'px'; 
                } 
            } 
        });
        document.querySelectorAll('.section-content:not(.hidden)').forEach(content => { 
            content.style.maxHeight = content.scrollHeight + 'px'; 
        });
        
        let dragged = null;
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';

        container.addEventListener('dragstart', e => {
            if (e.target.classList.contains('section-header')) {
                dragged = e.target.closest('.draggable-section');
                dragged.classList.add('dragging');
            } else { 
                e.preventDefault(); 
            }
        });

        container.addEventListener('dragend', () => {
            if (dragged) {
                dragged.classList.remove('dragging');
                if (placeholder.parentNode) {
                    placeholder.parentNode.replaceChild(dragged, placeholder);
                }
                dragged = null;
            }
        });

        container.addEventListener('dragover', e => {
            e.preventDefault();
            if (dragged) {
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) { 
                    container.appendChild(placeholder); 
                } else { 
                    container.insertBefore(placeholder, afterElement); 
                }
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable-section:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) { 
                    return { offset: offset, element: child }; 
                } else { 
                    return closest; 
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // --- App Initialization ---
    let audioUnlocked = false; 
    async function unlockAudioEvent() {
        if (!audioUnlocked) {
            if (initAudioContext()) {
                document.body.removeEventListener('click', unlockAudioEvent, true);
                document.body.removeEventListener('touchstart', unlockAudioEvent, true);
                document.body.removeEventListener('keydown', unlockAudioEvent, true);
                console.log("AudioContext active.");
                audioUnlocked = true;
                await loadDefaultWavSamples();
            }
        }
    }
    document.body.addEventListener('click', unlockAudioEvent, true);
    document.body.addEventListener('touchstart', unlockAudioEvent, true);
    document.body.addEventListener('keydown', unlockAudioEvent, true);

    document.addEventListener('DOMContentLoaded', () => {
        if (window.SheetMusic) window.SheetMusic.init('sheetMusicCanvas');
        generateKeysData();
        createPianoKeys(); 
        setupControls(); 
        applyScaleFilter();
        setupSectionManagement();
        
        const zoomSlider = document.getElementById('zoomSlider');
        zoomSlider.addEventListener('input', (event) => { updatePianoLayout(parseFloat(event.target.value)); });
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // --- Pass Dependencies to the Extracted AutoPlay System ---
        if (window.AutoPlaySystem) {
            window.AutoPlaySystem.init({
                playNote: playNote,
                getEffectiveBaseTempoMs: () => effectiveBaseTempoMs,
                getFullScaleRange: getFullScaleRange,
                initAudioContext: initAudioContext,
                getKeysData: () => keysData,
                globalActiveMidiNotes: globalActiveMidiNotes,
                updateSheetMusicHighlight: updateSheetMusicHighlight,
                stopSongMaker: stopSongMaker,
                getIsSongMakerPlaying: () => isSongMakerPlaying
            });
        }
    });

})();
