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
        return `rgb(${Math.random() * 255 + 1}, ${Math.random() * 255 + 1}, ${Math.random() * 255 + 1})`;
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

    // ==========================
    // INTERACTIONS
    // ==========================
    window.addEventListener("keydown", e => {
        e.preventDefault();
        if (e.key === " ") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNewRandomFractal(canvas.width / 2, canvas.height / 2);
        }
    });
});
