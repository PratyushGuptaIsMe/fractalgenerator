window.addEventListener("load", () => {

    // ==========================
    // CLASS DEFINITION
    // ==========================
    class FractalObject {
        constructor() {
            this.length = length;
            this.sides = sides;
            this.branches = branches;
            this.fractalColor = fractalColor;
            this.spreadAngle = spreadAngle;
            this.scale = scale;
        }
    }

    // ==========================
    // CANVAS SETUP
    // ==========================
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // ==========================
    // FRACTAL SETTINGS
    // ==========================
    let length = Math.min(canvas.width, canvas.height) * 0.3;
    let sides = 10;
    let angle = (Math.PI * 2) / sides;
    let branches = 5;
    let scale = 1;
    let spreadAngle = 0.5;
    let fractalColor = "brown";
    let lineWidth = 5;
    let maxCount = branches;
    let shadowBblur = 10;

    // ==========================
    // CANVAS STYLING
    // ==========================
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = "black";
    ctx.strokeStyle = fractalColor;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowColor = "black";
    ctx.shadowBlur = shadowBblur;

    // Draw a tiny rectangle to test canvas
    ctx.fillRect(0, 0, 10, 10);

    // ==========================
    // MAIN FUNCTIONS
    // ==========================
    function drawBranch(count) {
        if (count <= maxCount) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(length, 0);
            ctx.stroke();

            // Branch to the right
            ctx.save();
            ctx.translate(length / 2, 0);
            ctx.rotate(spreadAngle);
            ctx.scale(scale, scale);
            drawBranch(count + 1);
            ctx.restore();

            // Branch to the left
            ctx.save();
            ctx.translate(length / 2, 0);
            ctx.rotate(-spreadAngle);
            ctx.scale(scale, scale);
            drawBranch(count + 1);
            ctx.restore();
        } else if (count > maxCount) {
            return "Completed fractal";
        }
    }

    function drawFractal(x, y) {
        ctx.translate(x, y);
        for (let i = 0; i < sides; i++) {
            drawBranch(0);
            ctx.rotate(angle);
        }
    }

    function getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function randomizeValues() {
        sides = Math.floor(Math.random() * 10 + 3);
        branches = Math.floor(Math.random() * 5 + 2);
        fractalColor = getRandomColor();
        spreadAngle = Math.random() * 3 + 0.1;
        scale = Math.random() * 0.6 + 0.3;
        angle = (Math.PI * 2) / sides;
        maxCount = branches;

        ctx.strokeStyle = fractalColor;

        const fObj = new FractalObject();
        console.log(fObj);
    }

    function drawNewRandomFractal(x, y) {
        randomizeValues();
        ctx.save();
        drawFractal(x, y);
        ctx.restore();
    }

    // ==========================
    // EXPORT/IMPORT FUNCTIONS
    // ==========================
    function exportFractal() {
        const fractalData = {
            sides: sides,
            branches: branches,
            spreadAngle: spreadAngle,
            scale: scale,
            lineWidth: lineWidth,
            fractalColor: fractalColor,
            version: "1.0"
        };
        
        const exportString = JSON.stringify(fractalData, null, 2);
        
        // Show mini window with export data
        showMiniWindow('Export Fractal', 'export', exportString);
    }

    function importFractal() {
        // Show mini window for import
        showMiniWindow('Import Fractal', 'import', '');
    }

    function applyImport() {
        const importText = document.getElementById('import-text');
        const importString = importText.value.trim();
        
        if (!importString) {
            alert('Please enter fractal data to import.');
            return;
        }
        
        try {
            const fractalData = JSON.parse(importString);
            
            // Validate the data structure
            if (!fractalData.sides || !fractalData.branches || !fractalData.spreadAngle || 
                !fractalData.scale || !fractalData.lineWidth || !fractalData.fractalColor) {
                throw new Error('Invalid fractal data format');
            }
            
            // Apply the imported settings
            sides = parseInt(fractalData.sides);
            branches = parseInt(fractalData.branches);
            spreadAngle = parseFloat(fractalData.spreadAngle);
            scale = parseFloat(fractalData.scale);
            lineWidth = parseInt(fractalData.lineWidth);
            fractalColor = fractalData.fractalColor;
            
            // Update derived values
            angle = (Math.PI * 2) / sides;
            maxCount = branches;
            
            // Update canvas context
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = fractalColor;
            
            // Update control panel values
            updateControlValues();
            
            // Redraw the fractal
            redrawFractal();
            
            // Hide the mini window
            hideMiniWindow();
            
            // Show success message on import button
            const importBtn = document.getElementById('import-btn');
            const originalText = importBtn.textContent;
            importBtn.textContent = 'Imported!';
            importBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                importBtn.textContent = originalText;
                importBtn.style.background = 'linear-gradient(45deg, #9C27B0, #7B1FA2)';
            }, 2000);
            
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import fractal data. Please check the format and try again.\n\nError: ' + error.message);
        }
    }

    function copyImportText() {
        const importText = document.getElementById('import-text');
        const textToCopy = importText.value;
        
        if (!textToCopy.trim()) {
            alert('No text to copy.');
            return;
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show temporary success message
            const copyBtn = document.getElementById('copy-import-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            alert('Failed to copy to clipboard. Please copy manually.');
        });
    }

    function showMiniWindow(title, type, data) {
        const overlay = document.getElementById('mini-window-overlay');
        const titleElement = document.getElementById('mini-window-title');
        const exportContent = document.getElementById('export-content');
        const importContent = document.getElementById('import-content');
        const exportText = document.getElementById('export-text');
        const importText = document.getElementById('import-text');
        
        // Set title
        titleElement.textContent = title;
        
        // Hide both content areas first
        exportContent.style.display = 'none';
        importContent.style.display = 'none';
        
        if (type === 'export') {
            exportContent.style.display = 'block';
            exportText.value = data;
            exportText.select(); // Select all text for easy copying
        } else if (type === 'import') {
            importContent.style.display = 'block';
            importText.value = '';
            // Focus the textarea after a short delay to ensure it's visible
            setTimeout(() => {
                importText.focus();
                importText.select();
            }, 150);
        }
        
        // Show overlay
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
    }

    function hideMiniWindow() {
        const overlay = document.getElementById('mini-window-overlay');
        overlay.classList.add('hidden');
        
        // Hide overlay after animation
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    function copyExportText() {
        const exportText = document.getElementById('export-text');
        const textToCopy = exportText.value;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show temporary success message
            const copyBtn = document.getElementById('copy-export-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            alert('Failed to copy to clipboard. Please copy manually.');
        });
    }

    // ==========================
    // INITIAL DRAW
    // ==========================
    drawNewRandomFractal(canvas.width / 2, canvas.height / 2);
    
    // Initialize control panel values after initial draw
    setTimeout(() => {
        updateControlValues();
    }, 100);

    // ==========================
    // REDRAW FUNCTION
    // ==========================
    function redrawFractal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        drawFractal(canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    // ==========================
    // CONTROL PANEL EVENT HANDLERS
    // ==========================
    function setupControlPanel() {
        // Get control elements
        const sidesSlider = document.getElementById('sides-slider');
        const branchesSlider = document.getElementById('branches-slider');
        const spreadAngleSlider = document.getElementById('spread-angle-slider');
        const scaleSlider = document.getElementById('scale-slider');
        const lineWidthSlider = document.getElementById('line-width-slider');
        const colorPicker = document.getElementById('color-picker');
        const randomizeBtn = document.getElementById('randomize-btn');
        const hideBtn = document.getElementById('hide-btn');
        const showBtn = document.getElementById('show-btn');
        const exportBtn = document.getElementById('export-btn');
        const importBtn = document.getElementById('import-btn');
        const copyExportBtn = document.getElementById('copy-export-btn');
        const copyImportBtn = document.getElementById('copy-import-btn');
        const applyImportBtn = document.getElementById('apply-import-btn');
        const closeMiniWindowBtn = document.getElementById('close-mini-window');

        // Value display elements
        const sidesValue = document.getElementById('sides-value');
        const branchesValue = document.getElementById('branches-value');
        const spreadAngleValue = document.getElementById('spread-angle-value');
        const scaleValue = document.getElementById('scale-value');
        const lineWidthValue = document.getElementById('line-width-value');

        // Sides slider
        sidesSlider.addEventListener('input', (e) => {
            sides = parseInt(e.target.value);
            angle = (Math.PI * 2) / sides;
            sidesValue.textContent = sides;
            redrawFractal();
        });

        // Branches slider
        branchesSlider.addEventListener('input', (e) => {
            branches = parseInt(e.target.value);
            maxCount = branches;
            branchesValue.textContent = branches;
            redrawFractal();
        });

        // Spread angle slider
        spreadAngleSlider.addEventListener('input', (e) => {
            spreadAngle = parseFloat(e.target.value);
            spreadAngleValue.textContent = spreadAngle.toFixed(2);
            redrawFractal();
        });

        // Scale slider
        scaleSlider.addEventListener('input', (e) => {
            scale = parseFloat(e.target.value);
            scaleValue.textContent = scale.toFixed(2);
            redrawFractal();
        });

        // Line width slider
        lineWidthSlider.addEventListener('input', (e) => {
            lineWidth = parseInt(e.target.value);
            ctx.lineWidth = lineWidth;
            lineWidthValue.textContent = lineWidth;
            redrawFractal();
        });

        // Color picker
        colorPicker.addEventListener('input', (e) => {
            fractalColor = e.target.value;
            ctx.strokeStyle = fractalColor;
            redrawFractal();
        });

        // Randomize button
        randomizeBtn.addEventListener('click', () => {
            randomizeValues();
            updateControlValues();
            redrawFractal();
        });

        // Hide button
        hideBtn.addEventListener('click', () => {
            const controlPanel = document.getElementById('control-panel');
            controlPanel.classList.add('hidden');
            
            // Show the show button after panel animation starts
            setTimeout(() => {
                showBtn.style.display = 'block';
                // Trigger reflow to ensure the element is rendered before animation
                showBtn.offsetHeight;
                showBtn.classList.remove('hidden');
            }, 100);
        });

        // Show button
        showBtn.addEventListener('click', () => {
            const controlPanel = document.getElementById('control-panel');
            
            // Hide show button first
            showBtn.classList.add('hidden');
            
            // Show control panel after show button animation starts
            setTimeout(() => {
                controlPanel.classList.remove('hidden');
                showBtn.style.display = 'none';
            }, 100);
        });

        // Export button
        exportBtn.addEventListener('click', () => {
            exportFractal();
        });

        // Import button
        importBtn.addEventListener('click', () => {
            importFractal();
        });

        // Mini window buttons
        copyExportBtn.addEventListener('click', () => {
            copyExportText();
        });

        copyImportBtn.addEventListener('click', () => {
            copyImportText();
        });

        applyImportBtn.addEventListener('click', () => {
            applyImport();
        });

        closeMiniWindowBtn.addEventListener('click', () => {
            hideMiniWindow();
        });

        // Close mini window when clicking overlay
        document.getElementById('mini-window-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                hideMiniWindow();
            }
        });

        // Allow Enter key to apply import
        document.getElementById('import-text').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                applyImport();
            }
        });

        // Ensure paste works properly
        document.getElementById('import-text').addEventListener('paste', (e) => {
            // Allow the default paste behavior
            setTimeout(() => {
                const importText = document.getElementById('import-text');
                if (importText.value.trim()) {
                    // Optional: Show a brief indication that content was pasted
                    console.log('Content pasted successfully');
                }
            }, 10);
        });

        // Ensure textarea gets focus when clicked
        document.getElementById('import-text').addEventListener('click', (e) => {
            e.target.focus();
        });
    }

    // Update control values to match current fractal parameters
    function updateControlValues() {
        document.getElementById('sides-slider').value = sides;
        document.getElementById('branches-slider').value = branches;
        document.getElementById('spread-angle-slider').value = spreadAngle;
        document.getElementById('scale-slider').value = scale;
        document.getElementById('line-width-slider').value = lineWidth;
        document.getElementById('color-picker').value = fractalColor;

        document.getElementById('sides-value').textContent = sides;
        document.getElementById('branches-value').textContent = branches;
        document.getElementById('spread-angle-value').textContent = spreadAngle.toFixed(2);
        document.getElementById('scale-value').textContent = scale.toFixed(2);
        document.getElementById('line-width-value').textContent = lineWidth;
    }

    // ==========================
    // INTERACTIONS
    // ==========================
    window.addEventListener("keydown", e => {
        // Only prevent spacebar scrolling if not in an input or textarea
        if (e.key === " " && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNewRandomFractal(canvas.width / 2, canvas.height / 2);
            updateControlValues();
        }
    });

    // Initialize control panel
    setupControlPanel();
});
