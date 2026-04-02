(function() {
    const ALL_NOTES_CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let currentRotation = 0; // Tracks the continuous rotation state for the animation
    
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .modes-section-content {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px 10px;
                overflow: hidden;
            }
            .modes-circle-container {
                position: relative;
                width: 320px;
                height: 320px;
                border-radius: 50%;
                background: radial-gradient(circle, #2a2a2a 40%, #333 100%);
                box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3);
            }
            .modes-wheel {
                width: 100%;
                height: 100%;
                position: absolute;
                border-radius: 50%;
                transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
            }
            .mode-node {
                position: absolute;
                left: 50%;
                top: 50%;
                width: 44px;
                height: 44px;
                margin-left: -22px;
                margin-top: -22px;
                border-radius: 50%;
                background: #444;
                color: #777;
                border: 2px solid #222;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
                user-select: none;
                z-index: 2;
            }
            .mode-node.in-scale {
                background: #FFEB3B;
                color: #000;
                border-color: #FBC02D;
                cursor: pointer;
                box-shadow: 0 0 15px rgba(255, 235, 59, 0.4);
            }
            .mode-node.in-scale:hover {
                background: #fff59d;
                box-shadow: 0 0 20px rgba(255, 235, 59, 0.8);
                transform: scale(1.05); /* Slight pop effect inside the counter-rotated container */
            }
            .mode-content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.1em;
                transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); /* Counter-rotation transition */
            }
            .mode-label {
                position: absolute;
                top: 100%;
                margin-top: 8px;
                white-space: nowrap;
                font-size: 0.75em;
                color: #eee;
                background: rgba(0, 0, 0, 0.75);
                padding: 3px 8px;
                border-radius: 4px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
                font-weight: normal;
                box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            .mode-node.in-scale .mode-label {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    function buildModesSection() {
        // Create the draggable section wrapper
        const section = document.createElement('div');
        section.className = 'draggable-section';
        section.dataset.sectionId = 'modes-circle';
        
        section.innerHTML = `
            <div class="section-header" draggable="true">
                <h3>Modes & Chromatic Circle</h3>
                <button class="toggle-btn">-</button>
            </div>
            <div class="section-content modes-section-content">
                <div class="modes-circle-container">
                    <div class="modes-wheel" id="modesWheel">
                        <!-- Nodes will be injected here -->
                    </div>
                </div>
            </div>
        `;

        // Insert exactly after the Sheet Music section
        const sheetMusicSection = document.querySelector('[data-section-id="sheetmusic"]');
        if (sheetMusicSection) {
            sheetMusicSection.insertAdjacentElement('afterend', section);
        } else {
            document.getElementById('main-container').appendChild(section);
        }

        const wheel = document.getElementById('modesWheel');
        const radius = 135; // px distance from center

        // Create the 12 chromatic nodes around the circle
        ALL_NOTES_CHROMATIC.forEach((note, i) => {
            const angle = i * 30; // 360 / 12 = 30 degrees per note
            const node = document.createElement('div');
            node.className = 'mode-node';
            node.id = `mode-node-${note.replace('#', 'sharp')}`;
            
            // Position the node in a circle
            node.style.transform = `rotate(${angle}deg) translate(0, -${radius}px)`;

            // The content container counter-rotates so text stays upright
            const content = document.createElement('div');
            content.className = 'mode-content';
            content.id = `mode-content-${note.replace('#', 'sharp')}`;
            
            content.innerHTML = `
                <span class="mode-note-name">${note}</span>
                <span class="mode-label"></span>
            `;
            
            node.appendChild(content);
            wheel.appendChild(node);
        });
    }

    // Calculates the valid modes derived from the current step pattern
    function calculateModes(rootNote, stepsString) {
        const steps = stepsString.split('').map(Number).filter(n => !isNaN(n) && n > 0);
        if (steps.length === 0) return [];

        // Build cumulative semitone intervals
        const intervals = [0];
        let sum = 0;
        for (let i = 0; i < steps.length - 1; i++) {
            sum += steps[i];
            intervals.push(sum);
        }

        const rootIdx = ALL_NOTES_CHROMATIC.indexOf(rootNote);
        const modes = [];

        // Generate the step permutation for each note in the scale
        for (let i = 0; i < steps.length; i++) {
            // Rotate the steps array
            const rotatedSteps = [...steps.slice(i), ...steps.slice(0, i)].join('');
            const noteIdx = (rootIdx + intervals[i]) % 12;
            
            modes.push({
                note: ALL_NOTES_CHROMATIC[noteIdx],
                steps: rotatedSteps
            });
        }

        return modes;
    }

    function updateModesCircle() {
        const rootNoteSelect = document.getElementById('rootNoteSelect');
        const semistepsInput = document.getElementById('semistepsInput');
        const scaleSelect = document.getElementById('scaleSelect');

        const currentRoot = rootNoteSelect.value;
        const currentSteps = semistepsInput.value;
        const modes = calculateModes(currentRoot, currentSteps);

        // --- Calculate Rotation ---
        const rootIdx = ALL_NOTES_CHROMATIC.indexOf(currentRoot);
        const targetRotation = -(rootIdx * 30); // Negative to spin the target note to the top (0deg)

        // Find the shortest path for rotation to avoid 330-degree snapping spins
        let diff = targetRotation - (currentRotation % 360);
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        currentRotation += diff;

        // Apply rotation to the entire wheel
        const wheel = document.getElementById('modesWheel');
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        // --- Update Nodes ---
        ALL_NOTES_CHROMATIC.forEach((note, i) => {
            const node = document.getElementById(`mode-node-${note.replace('#', 'sharp')}`);
            const content = document.getElementById(`mode-content-${note.replace('#', 'sharp')}`);
            const label = content.querySelector('.mode-label');

            // Counter-rotate text so it remains upright
            // Base node angle is (i * 30). Total world rotation is (i * 30) + currentRotation. 
            // We apply the negative of that to the inner content.
            content.style.transform = `rotate(${- (i * 30 + currentRotation)}deg)`;

            // Check if this note is part of the current scale's modes
            const modeInfo = modes.find(m => m.note === note);
            if (modeInfo) {
                node.classList.add('in-scale');
                
                // Lookup the mode name in the current scale list
                let modeName = "Unknown Mode";
                for (let opt of scaleSelect.options) {
                    if (opt.value === modeInfo.steps) {
                        // Extract name, strip out the "(2212221)" step string from the display text
                        modeName = opt.text.replace(/\s*\([^)]*\)/, '').trim();
                        break;
                    }
                }
                
                // Add an indicator if it's the current root
                if (note === currentRoot) {
                    label.innerHTML = `<strong>${modeName}</strong> (Root)`;
                } else {
                    label.textContent = modeName;
                }

                // Attach click event to change scale and root
                node.onclick = () => {
                    if (note === currentRoot && currentSteps === modeInfo.steps) return; // Already selected
                    
                    rootNoteSelect.value = note;
                    semistepsInput.value = modeInfo.steps;
                    
                    // Dispatch events so the main app registers the change
                    rootNoteSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    semistepsInput.dispatchEvent(new Event('input', { bubbles: true }));
                };
            } else {
                node.classList.remove('in-scale');
                label.textContent = '';
                node.onclick = null;
            }
        });
    }

    // Initialize once the main DOM is ready
    function init() {
        injectStyles();
        buildModesSection();
        
        // Initial draw
        setTimeout(updateModesCircle, 100);

        // We use a MutationObserver on the text displays generated by main.js
        // This ensures our circle reacts to ALL scale updates (random buttons, direct drops, etc.)
        const targetDisplay = document.getElementById('scaleNotesDisplay');
        if (targetDisplay) {
            const observer = new MutationObserver(() => {
                updateModesCircle();
            });
            observer.observe(targetDisplay, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();