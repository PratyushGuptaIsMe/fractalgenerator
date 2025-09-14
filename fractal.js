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
        e.preventDefault();
        if (e.key === " ") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNewRandomFractal(canvas.width / 2, canvas.height / 2);
            // Update slider values to match the new random fractal
            updateControlValues();
        }
    });

    // Initialize control panel
    setupControlPanel();
});
