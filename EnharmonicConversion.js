/**
 * EnharmonicConversion.js
 * 
 * Algorithm to convert a generated scale into its proper diatonic sheet music spelling.
 * Enforces strict diatonic rules for 7-note scales, and optimized readable spelling 
 * for scales with fewer or greater than 7 notes.
 */

(function(window) {
    const BASE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const LETTER_PITCHES = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    // Maps exact semitone distances to standard musical accidentals
    const ACCIDENTALS = {
        '-2': '𝄫', // Double Flat
        '-1': '♭', // Flat
        '0': '',   // Natural
        '1': '♯',  // Sharp
        '2': '𝄪'   // Double Sharp
    };

    // Enharmonic root equivalents for checking optimal spelling
    const ENHARMONIC_ROOTS = {
        'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };

    /**
     * Spells a heptatonic scale diatonically starting from a specific formatted root.
     * Original algorithm: strictly maps exactly one letter name per scale degree.
     * @returns {Object} An object containing the spelled scale array and an "accidental penalty" score.
     */
    function spellScale(rootName, intervals) {
        const rootLetter = rootName.charAt(0);
        const rootAccidentalStr = rootName.substring(1);
        
        // Calculate the absolute starting pitch based on the root string
        let startingPitch = LETTER_PITCHES[rootLetter];
        if (rootAccidentalStr === '#') startingPitch += 1;
        if (rootAccidentalStr === 'b') startingPitch -= 1;
        
        let rootLetterIndex = BASE_LETTERS.indexOf(rootLetter);
        let spelledScale = [];
        let totalPenaltyScore = 0;

        for (let i = 0; i < intervals.length; i++) {
            // Force the letter name to increment exactly by 1 scale degree per note
            const currentLetterIndex = (rootLetterIndex + i) % 7;
            const targetLetter = BASE_LETTERS[currentLetterIndex];
            const targetBasePitch = LETTER_PITCHES[targetLetter];
            
            // Calculate the exact chromatic pitch we need to hit
            const targetExactPitch = (startingPitch + intervals[i]) % 12;
            
            // Calculate the difference between the natural letter pitch and the target pitch
            let pitchDifference = (targetExactPitch - targetBasePitch) % 12;
            
            // Normalize difference to find the shortest accidental distance (e.g., -5 to +6)
            if (pitchDifference > 6) pitchDifference -= 12;
            if (pitchDifference < -6) pitchDifference += 12;

            // Apply penalties to find the "cleanest" scale to read
            // 1 point for a standard sharp/flat, 10 points for a double sharp/flat.
            if (Math.abs(pitchDifference) === 1) totalPenaltyScore += 1;
            if (Math.abs(pitchDifference) >= 2) totalPenaltyScore += 10; 

            // Fallback for extreme theoretical scales beyond double accidentals
            let accidentalSymbol = ACCIDENTALS[pitchDifference.toString()];
            if (accidentalSymbol === undefined) {
                accidentalSymbol = `[err:${pitchDifference}]`;
                totalPenaltyScore += 100; 
            }

            spelledScale.push(`${targetLetter}${accidentalSymbol}`);
        }

        return {
            scale: spelledScale,
            score: totalPenaltyScore
        };
    }

    /**
     * Dynamic pathfinding algorithm for spelling non-heptatonic scales (<7 or >7 notes).
     * Calculates the most readable spelling using letter progression rules.
     * @returns {Object} An object containing the spelled scale array and its penalty score.
     */
    function spellScaleDynamic(rootName, intervals, isLessThanSeven) {
        const rootLetter = rootName.charAt(0);
        const rootAccidentalStr = rootName.substring(1);
        
        let startingPitch = LETTER_PITCHES[rootLetter];
        if (rootAccidentalStr === '#') startingPitch += 1;
        if (rootAccidentalStr === 'b') startingPitch -= 1;
        
        let rootLetterIndex = BASE_LETTERS.indexOf(rootLetter);
        
        // Generate the exact target pitches (0-11) for all notes in the scale
        let targetPitches = intervals.map(interval => (startingPitch + interval) % 12);
        
        let bestScore = Infinity;
        let bestScale = [];

        // Depth-First Search to test all spelling combinations
        function search(index, prevLetterIdx, currentScore, path) {
            // Prune unoptimal branches. Account for the max possible flat bonus (-0.5 per note)
            if (currentScore - ((targetPitches.length - index) * 0.5) >= bestScore) return;

            // If we've spelled the whole scale, save it if it's the best score
            if (index === targetPitches.length) {
                if (currentScore < bestScore) {
                    bestScore = currentScore;
                    bestScale = [...path];
                }
                return;
            }

            let targetExactPitch = targetPitches[index];
            
            for (let i = 0; i < 7; i++) {
                // The first note must match the requested root exactly
                if (index === 0 && i !== rootLetterIndex) continue;
                
                // If the last note perfectly completes an octave, force it to be the root letter
                if (index === targetPitches.length - 1 && targetExactPitch === targetPitches[0] && i !== rootLetterIndex) continue;

                let targetLetter = BASE_LETTERS[i];
                let targetBasePitch = LETTER_PITCHES[targetLetter];
                
                let diff = (targetExactPitch - targetBasePitch) % 12;
                if (diff > 6) diff -= 12;
                if (diff < -6) diff += 12;

                let accidentalScore = 0;
                let accidentalSymbol = ACCIDENTALS[diff.toString()];
                if (accidentalSymbol === undefined) {
                    accidentalSymbol = `[err:${diff}]`;
                    accidentalScore += 100;
                } else {
                    if (Math.abs(diff) === 1) accidentalScore += 1;
                    if (Math.abs(diff) >= 2) accidentalScore += 10;
                }

                let stepDistance = index === 0 ? 0 : (i - prevLetterIdx + 7) % 7;
                let progressionScore = 0;

                if (index > 0) {
                    if (isLessThanSeven) {
                        // For < 7 notes: Heavy penalty for reusing a letter. Forces strictly advancing A-G progression.
                        if (stepDistance === 0) progressionScore += 50; 
                    } else {
                        // For > 7 notes: Repeats are allowed, but penalized to stretch letters as long as possible.
                        // Penalty is 4, which is less than a double accidental (10), making a repeated letter preferable to a double sharp.
                        if (stepDistance === 0) progressionScore += 4; 
                    }
                }

                let flatBonus = 0;
                // Specific preference modifiers for super-heptatonic scales
                if (!isLessThanSeven && index > 0) {
                    let spelling = targetLetter + accidentalSymbol;
                    if (spelling === 'Eb' || spelling === 'Bb') flatBonus = -0.5; // Slight preference
                    if (spelling === 'D#' || spelling === 'A#') flatBonus = 0.5;  // Slight aversion
                }

                let nodeScore = accidentalScore + progressionScore + flatBonus;
                
                path.push(targetLetter + accidentalSymbol);
                search(index + 1, i, currentScore + nodeScore, path);
                path.pop(); // Backtrack
            }
        }

        // Start pathfinding from index 0
        search(0, rootLetterIndex, 0, []);

        return {
            scale: bestScale,
            score: bestScore
        };
    }

    /**
     * Determines the most readable enharmonic spelling of a given scale sequence.
     * 
     * @param {string} rootPitchClass - The UI's selected root (e.g., "A#")
     * @param {string} semistepPattern - The sequence of intervals (e.g., "2212221")
     * @returns {string[]} Array of formatted note strings.
     */
    function getOptimalEnharmonicSpelling(rootPitchClass, semistepPattern) {
        const steps = semistepPattern.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0);
        
        const isHeptatonic = steps.length === 7;
        const isLessThanSeven = steps.length < 7;

        // Convert step pattern into cumulative intervals from the root [0, 2, 4, 5, 7, 9, 11, 12]
        let currentInterval = 0;
        let intervals = [0];
        for (let i = 0; i < steps.length; i++) {
            currentInterval += steps[i];
            intervals.push(currentInterval);
        }

        // Clean up UI root pitch notation to handle standard flats/sharps evaluation
        let primaryRoot = rootPitchClass.replace('♯', '#').replace('♭', 'b');
        let alternateRoot = ENHARMONIC_ROOTS[primaryRoot];

        let bestSpelling;

        if (isHeptatonic) {
            // Evaluate primary spelling (e.g., "A#") using strict 7-note diatonic rule
            bestSpelling = spellScale(primaryRoot, intervals);
            // Evaluate alternate spelling (e.g., "Bb") and compare
            if (alternateRoot) {
                let altSpelling = spellScale(alternateRoot, intervals);
                if (altSpelling.score < bestSpelling.score) {
                    bestSpelling = altSpelling;
                }
            }
        } else {
            // Evaluate using the dynamic pathfinding rule for < 7 or > 7 scales
            bestSpelling = spellScaleDynamic(primaryRoot, intervals, isLessThanSeven);
            if (alternateRoot) {
                let altSpelling = spellScaleDynamic(alternateRoot, intervals, isLessThanSeven);
                if (altSpelling.score < bestSpelling.score) {
                    bestSpelling = altSpelling;
                }
            }
        }

        return bestSpelling.scale;
    }

    // Expose function to global scope so main.js can access it
    window.getOptimalEnharmonicSpelling = getOptimalEnharmonicSpelling;

})(window);
