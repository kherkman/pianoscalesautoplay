/**
 * EnharmonicConversion.js
 * 
 * Algorithm to convert a generated scale into its proper diatonic sheet music spelling.
 * Enforces the rule that heptatonic (7-note) scales must use each letter name (A-G) exactly once.
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
     * Spells a scale diatonically starting from a specific formatted root (e.g., "Bb")
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
     * Determines the most readable enharmonic spelling of a given heptatonic scale.
     * 
     * @param {string} rootPitchClass - The UI's selected root (e.g., "A#")
     * @param {string} semistepPattern - The sequence of intervals (e.g., "2212221")
     * @returns {string[]} Array of formatted note strings.
     */
    function getOptimalEnharmonicSpelling(rootPitchClass, semistepPattern) {
        const steps = semistepPattern.split('').map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0);
        
        // The diatonic rule strictly applies to 7-note (heptatonic) scales.
        if (steps.length !== 7) {
            return ["N/A - Enharmonic diatonic spelling requires exactly a 7-note (heptatonic) scale."];
        }

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

        // Evaluate primary spelling (e.g., "A#")
        let bestSpelling = spellScale(primaryRoot, intervals);

        // Evaluate alternate spelling (e.g., "Bb") and compare
        if (alternateRoot) {
            let altSpelling = spellScale(alternateRoot, intervals);
            // If the alternate root uses fewer total accidentals/avoids double-accidentals, prefer it
            if (altSpelling.score < bestSpelling.score) {
                bestSpelling = altSpelling;
            }
        }

        return bestSpelling.scale;
    }

    // Expose function to global scope so main.js can access it
    window.getOptimalEnharmonicSpelling = getOptimalEnharmonicSpelling;

})(window);