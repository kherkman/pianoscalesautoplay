/**
 * SheetMusic.js
 * 
 * Renders a Grand Staff (Treble and Bass clefs) on an HTML5 Canvas.
 * Plots diatonic notes across all octaves based on enharmonic spellings
 * and highlights active notes in real-time.
 */

const SheetMusic = (function() {
    let canvas, ctx;
    
    // Configurable layout parameters
    const STAFF_LINE_SPACING = 10;
    const HALF_SPACE = STAFF_LINE_SPACING / 2;
    // Gap between treble and bass staves (large enough to fit overlapping ledger lines cleanly)
    const CLEF_SPACING = STAFF_LINE_SPACING * 8; 
    const LEFT_MARGIN = 60;
    const NOTE_SPACING = 40;
    
    // Y-coordinate mapping for the very top line of the Treble staff (F5)
    let TOP_STAFF_Y = 60; 

    // Internal state
    let currentScaleNotes = [];
    let activeMidiNotes = new Set();

    // Map diatonic letters to a numerical vertical step (C = 0, D = 1, etc.)
    const LETTER_STEPS = { 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6 };
    
    // Absolute pitch steps for boundaries and anchors
    const STEP_E4 = (4 * 7) + LETTER_STEPS['E']; // 30 (Anchor for Treble: Lowest Line)
    const STEP_A3 = (3 * 7) + LETTER_STEPS['A']; // 26 (Anchor for Bass: Highest Line)
    const STEP_A4 = (4 * 7) + LETTER_STEPS['A']; // 33

    function init(canvasId) {
        canvas = document.getElementById(canvasId);
        if (!canvas) return;
        ctx = canvas.getContext('2d');
    }

    /**
     * Calculates the Y pixel coordinate relative to the Treble Staff (Anchor: E4)
     */
    function getTrebleY(absoluteStep) {
        const stepsFromE4 = absoluteStep - STEP_E4;
        const e4Y = TOP_STAFF_Y + (STAFF_LINE_SPACING * 4); // Lowest line of the treble staff
        return e4Y - (stepsFromE4 * HALF_SPACE); // Higher pitch = lower Y value
    }

    /**
     * Calculates the Y pixel coordinate relative to the Bass Staff (Anchor: A3)
     */
    function getBassY(absoluteStep) {
        const bassTopY = TOP_STAFF_Y + (STAFF_LINE_SPACING * 4) + CLEF_SPACING;
        const stepsFromA3 = absoluteStep - STEP_A3;
        const a3Y = bassTopY; // Highest line of the bass staff
        return a3Y - (stepsFromA3 * HALF_SPACE);
    }

    function drawGrandStaff(width) {
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1;

        // Draw Treble Clef Lines
        for (let i = 0; i < 5; i++) {
            let y = TOP_STAFF_Y + (i * STAFF_LINE_SPACING);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw Bass Clef Lines
        let bassTopY = TOP_STAFF_Y + (STAFF_LINE_SPACING * 4) + CLEF_SPACING;
        for (let i = 0; i < 5; i++) {
            let y = bassTopY + (i * STAFF_LINE_SPACING);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Connect the staves at the start
        ctx.beginPath();
        ctx.moveTo(0, TOP_STAFF_Y);
        ctx.lineTo(0, bassTopY + (STAFF_LINE_SPACING * 4));
        ctx.stroke();

        // Draw Clef Symbols (Unicode)
        ctx.font = "40px serif";
        ctx.fillText("\uD834\uDD1E", 10, TOP_STAFF_Y + 35); // Treble Clef
        ctx.fillText("\uD834\uDD22", 10, bassTopY + 30);  // Bass Clef
    }

    function drawTrebleLedgerLines(x, y) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        
        const topY = TOP_STAFF_Y;
        const bottomY = TOP_STAFF_Y + (STAFF_LINE_SPACING * 4);

        if (y < topY) {
            // High ledger lines (above treble staff)
            for (let ly = topY - STAFF_LINE_SPACING; ly >= y; ly -= STAFF_LINE_SPACING) {
                ctx.beginPath(); ctx.moveTo(x - 12, ly); ctx.lineTo(x + 12, ly); ctx.stroke();
            }
        } else if (y > bottomY) {
            // Low ledger lines (below treble staff)
            for (let ly = bottomY + STAFF_LINE_SPACING; ly <= y; ly += STAFF_LINE_SPACING) {
                ctx.beginPath(); ctx.moveTo(x - 12, ly); ctx.lineTo(x + 12, ly); ctx.stroke();
            }
        }
    }

    function drawBassLedgerLines(x, y) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        const topY = TOP_STAFF_Y + (STAFF_LINE_SPACING * 4) + CLEF_SPACING;
        const bottomY = topY + (STAFF_LINE_SPACING * 4);

        if (y < topY) {
            // High ledger lines (above bass staff)
            for (let ly = topY - STAFF_LINE_SPACING; ly >= y; ly -= STAFF_LINE_SPACING) {
                ctx.beginPath(); ctx.moveTo(x - 12, ly); ctx.lineTo(x + 12, ly); ctx.stroke();
            }
        } else if (y > bottomY) {
            // Low ledger lines (below bass staff)
            for (let ly = bottomY + STAFF_LINE_SPACING; ly <= y; ly += STAFF_LINE_SPACING) {
                ctx.beginPath(); ctx.moveTo(x - 12, ly); ctx.lineTo(x + 12, ly); ctx.stroke();
            }
        }
    }

    function drawSingleNote(x, y, note, isHighlighted, isTreble) {
        // Draw the appropriate ledger lines
        if (isTreble) {
            drawTrebleLedgerLines(x, y);
        } else {
            drawBassLedgerLines(x, y);
        }

        // Draw Accidental
        if (note.accidental) {
            ctx.fillStyle = isHighlighted ? '#f44336' : '#000';
            ctx.font = "18px sans-serif";
            ctx.fillText(note.accidental, x - 18, y + 6);
        }

        // Draw Notehead
        ctx.beginPath();
        ctx.ellipse(x, y, 6, 4.5, -0.2, 0, 2 * Math.PI);
        ctx.fillStyle = isHighlighted ? '#4CAF50' : '#000'; // Green for highlight, black for idle
        
        if (isHighlighted) {
            // Add a glow/halo effect for visibility
            ctx.shadowColor = '#4CAF50';
            ctx.shadowBlur = 10;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for next drawings
    }

    function render() {
        if (!canvas || !ctx) return;
        
        // Resize canvas width dynamically based on the amount of notes
        const requiredWidth = LEFT_MARGIN + (currentScaleNotes.length * NOTE_SPACING) + 50;
        canvas.width = Math.max(requiredWidth, canvas.parentElement.clientWidth);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrandStaff(canvas.width);

        let currentX = LEFT_MARGIN;

        currentScaleNotes.forEach(note => {
            const isHighlighted = activeMidiNotes.has(note.midi);
            
            // Calculate absolute diatonic step for this specific note
            const absoluteStep = (note.octave * 7) + LETTER_STEPS[note.letter];

            // Determine rendering rules based on the specific pitch range
            if (absoluteStep >= STEP_A3 && absoluteStep <= STEP_A4) {
                // OVERLAP RANGE: Draw on both Treble and Bass clefs simultaneously
                const trebleY = getTrebleY(absoluteStep);
                drawSingleNote(currentX, trebleY, note, isHighlighted, true);

                const bassY = getBassY(absoluteStep);
                drawSingleNote(currentX, bassY, note, isHighlighted, false);
                
            } else if (absoluteStep > STEP_A4) {
                // HIGH RANGE: Draw on Treble clef only
                const trebleY = getTrebleY(absoluteStep);
                drawSingleNote(currentX, trebleY, note, isHighlighted, true);
                
            } else if (absoluteStep < STEP_A3) {
                // LOW RANGE: Draw on Bass clef only
                const bassY = getBassY(absoluteStep);
                drawSingleNote(currentX, bassY, note, isHighlighted, false);
            }

            // Draw Note string underneath the staff for extra clarity
            ctx.fillStyle = isHighlighted ? '#4CAF50' : '#888';
            ctx.font = "10px sans-serif";
            ctx.fillText(`${note.letter}${note.accidental || ''}${note.octave}`, currentX - 8, canvas.height - 10);

            currentX += NOTE_SPACING;
        });
    }

    return {
        /**
         * Initializes the canvas element.
         * @param {string} canvasId - The ID of the canvas DOM element.
         */
        init: init,

        /**
         * Sets the current active scale and redraws.
         * @param {Array} notes - Array of objects: { letter: 'C', accidental: '#', octave: 4, midi: 61 }
         */
        drawScale: function(notes) {
            currentScaleNotes = notes;
            render();
        },

        /**
         * Updates which notes are highlighted and redraws.
         * @param {Array|Set} midiNumbers - Collection of currently sounding MIDI note numbers.
         */
        highlightNotes: function(midiNumbers) {
            activeMidiNotes = new Set(midiNumbers);
            // requestAnimationFrame ensures smooth repainting without blocking the audio thread
            requestAnimationFrame(render);
        }
    };
})();

// Export to global scope
window.SheetMusic = SheetMusic;