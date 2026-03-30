(function() {
    // Define notes locally so this script works even if main.js is encapsulated in an IIFE
    const ALL_NOTES_CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    window.initScaleDetection = function() {
        // 1. State Variables and Element Selectors
        let isSelectModeActive = false;
        let selectedPitchClasses = new Set();
        
        const selectBtn = document.getElementById('selectKeysBtn');
        const detectBtn = document.getElementById('detectScaleBtn');
        const infoText = document.getElementById('scaleDetectInfo');
        const rootSelect = document.getElementById('rootNoteSelect');
        const stepsInput = document.getElementById('semistepsInput');
        const pianoKeyboard = document.getElementById('pianoKeyboard');

        // Safety check to ensure elements are loaded
        if (!selectBtn || !detectBtn || !pianoKeyboard) return;

        // 2. Logic Functions

        // Pre-fill selection based on existing "Root Note" and "Steps"
        function prefillFromCurrentSteps() {
            selectedPitchClasses.clear();
            const root = rootSelect.value;
            const stepsStr = stepsInput.value;
            
            if (!root) return;
            
            const rootIdx = ALL_NOTES_CHROMATIC.indexOf(root);
            if (rootIdx === -1) return;

            // Always add the root
            selectedPitchClasses.add(root);

            if (stepsStr) {
                const steps = stepsStr.split('').map(Number).filter(n => !isNaN(n));
                let currentIdx = rootIdx;
                steps.forEach(step => {
                    currentIdx = (currentIdx + step) % 12; // Modulo 12 handles octave wrapping
                    selectedPitchClasses.add(ALL_NOTES_CHROMATIC[currentIdx]);
                });
            }
        }

        // Apply or remove visual highlights to piano keys
        function updateKeyHighlights() {
            document.querySelectorAll('.key').forEach(key => {
                const pc = key.dataset.pitchClass;
                if (selectedPitchClasses.has(pc)) {
                    key.classList.add('detect-selected');
                } else {
                    key.classList.remove('detect-selected');
                }
            });

            // Enable/Disable the Detect button based on selection
            if (selectedPitchClasses.size > 0) {
                detectBtn.disabled = false;
                detectBtn.style.opacity = '1';
            } else {
                detectBtn.disabled = true;
                detectBtn.style.opacity = '0.5';
            }
        }

        // Exit select mode and clean up UI
        function exitSelectMode() {
            isSelectModeActive = false;
            selectBtn.textContent = 'Select Keys';
            selectBtn.style.backgroundColor = '#4CAF50';
            infoText.textContent = "Click 'Select Keys' to start capturing notes from the keyboard.";
            document.body.classList.remove('scale-detect-mode');
            
            selectedPitchClasses.clear();
            updateKeyHighlights(); // Clears visuals
        }

        // 3. Event Listeners

        // "Select Keys" Button Logic
        selectBtn.addEventListener('click', () => {
            isSelectModeActive = !isSelectModeActive;
            
            if (isSelectModeActive) {
                // Turn ON
                selectBtn.textContent = 'Cancel Selection';
                selectBtn.style.backgroundColor = '#f44336';
                infoText.textContent = 'Click keys on the piano below to toggle them in your scale.';
                document.body.classList.add('scale-detect-mode');
                
                // Pre-fill if there are existing steps
                prefillFromCurrentSteps();
                updateKeyHighlights();
            } else {
                // Turn OFF
                exitSelectMode();
            }
        });

        // "Detect Scale" Button Logic
        detectBtn.addEventListener('click', () => {
            if (selectedPitchClasses.size === 0) return;

            const root = rootSelect.value;
            const rootIdx = ALL_NOTES_CHROMATIC.indexOf(root);
            
            // Force the Master Root Note into the calculation
            selectedPitchClasses.add(root);

            // Convert pitch classes to chromatic indices
            let indices = Array.from(selectedPitchClasses).map(pc => ALL_NOTES_CHROMATIC.indexOf(pc));
            
            // Calculate distance of each note from the Root (0 to 11)
            let distances = indices.map(idx => (idx - rootIdx + 12) % 12);
            
            // Sort ascending and remove duplicates
            distances.sort((a, b) => a - b);
            distances = [...new Set(distances)];

            // Calculate the step intervals
            let calculatedSteps = [];
            for (let i = 0; i < distances.length - 1; i++) {
                calculatedSteps.push(distances[i+1] - distances[i]);
            }
            
            // Calculate final step to return to the octave (if total sum < 12)
            const lastDistance = distances[distances.length - 1];
            if (lastDistance < 12) {
                calculatedSteps.push(12 - lastDistance);
            }

            const finalStepsString = calculatedSteps.join('');

            // Push the result to the input and trigger the app's existing logic
            stepsInput.value = finalStepsString;
            stepsInput.dispatchEvent(new Event('input'));

            // Clean up UI
            exitSelectMode();
        });

        // Intercept Piano Key Clicks via Event Delegation
        function handlePianoInteraction(e) {
            if (!isSelectModeActive) return;
            
            const keyElement = e.target.closest('.key');
            if (!keyElement) return;

            const pitchClass = keyElement.dataset.pitchClass;
            
            // Toggle the pitch class in our tracking set
            if (selectedPitchClasses.has(pitchClass)) {
                selectedPitchClasses.delete(pitchClass);
            } else {
                selectedPitchClasses.add(pitchClass);
            }
            
            updateKeyHighlights();
        }

        // Attach to both mousedown and touchstart to cover all devices.
        // We use { capture: true } so we catch the event before the main piano logic if needed.
        pianoKeyboard.addEventListener('mousedown', handlePianoInteraction, { capture: true });
        pianoKeyboard.addEventListener('touchstart', handlePianoInteraction, { passive: true, capture: true });
    };

    // Auto-initialize once the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initScaleDetection);
    } else {
        window.initScaleDetection();
    }
})();