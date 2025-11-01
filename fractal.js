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
        } else {
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
    // EXPORT/IMPORT FUNCTIONS (Base64 string)
    // ==========================
    function exportFractal() {
        const fractalData = { sides, branches, spreadAngle, scale, lineWidth, fractalColor };
        const jsonString = JSON.stringify(fractalData);
        const exportString = btoa(jsonString); // Convert to single-line string
        showMiniWindow('Export Fractal', 'export', exportString);
    }

    function importFractal() {
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
            const jsonString = atob(importString);
            const fractalData = JSON.parse(jsonString);

            sides = parseInt(fractalData.sides);
            branches = parseInt(fractalData.branches);
            spreadAngle = parseFloat(fractalData.spreadAngle);
            scale = parseFloat(fractalData.scale);
            lineWidth = parseInt(fractalData.lineWidth);
            fractalColor = fractalData.fractalColor;

            angle = (Math.PI * 2) / sides;
            maxCount = branches;

            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = fractalColor;

            updateControlValues();
            redrawFractal();
            hideMiniWindow();

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
            alert('Failed to import fractal data. Please check the string and try again.');
        }
    }

    function copyImportText() {
        const importText = document.getElementById('import-text');
        if (!importText.value.trim()) return alert('No text to copy.');
        navigator.clipboard.writeText(importText.value).then(() => {
            const copyBtn = document.getElementById('copy-import-btn');
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            setTimeout(() => {
                copyBtn.textContent = original;
                copyBtn.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
            }, 1500);
        });
    }

    function copyExportText() {
        const exportText = document.getElementById('export-text');
        navigator.clipboard.writeText(exportText.value).then(() => {
            const copyBtn = document.getElementById('copy-export-btn');
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            setTimeout(() => {
                copyBtn.textContent = original;
                copyBtn.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
            }, 1500);
        });
    }

    function showMiniWindow(title, type, data) {
        const overlay = document.getElementById('mini-window-overlay');
        const titleElement = document.getElementById('mini-window-title');
        const exportContent = document.getElementById('export-content');
        const importContent = document.getElementById('import-content');
        const exportText = document.getElementById('export-text');
        const importText = document.getElementById('import-text');

        titleElement.textContent = title;
        exportContent.style.display = 'none';
        importContent.style.display = 'none';

        if (type === 'export') {
            exportContent.style.display = 'block';
            exportText.value = data;
            exportText.select();
        } else if (type === 'import') {
            importContent.style.display = 'block';
            importText.value = '';
            setTimeout(() => {
                importText.focus();
            }, 150);
        }

        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
    }

    function hideMiniWindow() {
        const overlay = document.getElementById('mini-window-overlay');
        overlay.classList.add('hidden');
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }

    // ==========================
    // INITIAL DRAW
    // ==========================
    drawNewRandomFractal(canvas.width / 2, canvas.height / 2);
    setTimeout(updateControlValues, 100);

    function redrawFractal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        drawFractal(canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    // ==========================
    // CONTROL PANEL SETUP
    // ==========================
    function setupControlPanel() {
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

        const sidesValue = document.getElementById('sides-value');
        const branchesValue = document.getElementById('branches-value');
        const spreadAngleValue = document.getElementById('spread-angle-value');
        const scaleValue = document.getElementById('scale-value');
        const lineWidthValue = document.getElementById('line-width-value');

        sidesSlider.addEventListener('input', e => {
            sides = parseInt(e.target.value);
            angle = (Math.PI * 2) / sides;
            sidesValue.textContent = sides;
            redrawFractal();
        });

        branchesSlider.addEventListener('input', e => {
            branches = parseInt(e.target.value);
            maxCount = branches;
            branchesValue.textContent = branches;
            redrawFractal();
        });

        spreadAngleSlider.addEventListener('input', e => {
            spreadAngle = parseFloat(e.target.value);
            spreadAngleValue.textContent = spreadAngle.toFixed(2);
            redrawFractal();
        });

        scaleSlider.addEventListener('input', e => {
            scale = parseFloat(e.target.value);
            scaleValue.textContent = scale.toFixed(2);
            redrawFractal();
        });

        lineWidthSlider.addEventListener('input', e => {
            lineWidth = parseInt(e.target.value);
            ctx.lineWidth = lineWidth;
            lineWidthValue.textContent = lineWidth;
            redrawFractal();
        });

        colorPicker.addEventListener('input', e => {
            fractalColor = e.target.value;
            ctx.strokeStyle = fractalColor;
            redrawFractal();
        });

        randomizeBtn.addEventListener('click', () => {
            randomizeValues();
            updateControlValues();
            redrawFractal();
        });

        hideBtn.addEventListener('click', () => {
            const controlPanel = document.getElementById('control-panel');
            controlPanel.classList.add('hidden');
            setTimeout(() => {
                showBtn.style.display = 'block';
                showBtn.offsetHeight;
                showBtn.classList.remove('hidden');
            }, 100);
        });

        showBtn.addEventListener('click', () => {
            const controlPanel = document.getElementById('control-panel');
            showBtn.classList.add('hidden');
            setTimeout(() => {
                controlPanel.classList.remove('hidden');
                showBtn.style.display = 'none';
            }, 100);
        });

        exportBtn.addEventListener('click', exportFractal);
        importBtn.addEventListener('click', importFractal);
        copyExportBtn.addEventListener('click', copyExportText);
        copyImportBtn.addEventListener('click', copyImportText);
        applyImportBtn.addEventListener('click', applyImport);
        closeMiniWindowBtn.addEventListener('click', hideMiniWindow);

        document.getElementById('mini-window-overlay').addEventListener('click', e => {
            if (e.target === e.currentTarget) hideMiniWindow();
        });

        document.getElementById('import-text').addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.ctrlKey) applyImport();
        });

        document.getElementById('import-text').addEventListener('click', e => e.target.focus());
    }

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

    setupControlPanel();
});