window.addEventListener("load", () => {
    class FractalObject{
        constructor(){
            //Commit
            this.length = length;
            this.sides = sides;
            this.branches = branches;
            this.fractalColor = fractalColor;
            this.spreadAngle = spreadAngle;
            this.scale = scale;
        }
    }
    
    window.addEventListener("resize", ()=>{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })


    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let fObj = {};

    //fractal settings
    let length = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
    let sides = 10;
    let angle = (Math.PI*2) / sides;
    let branches = 5;
    let scale = 1;
    let spreadAngle = 0.5;

    let fractalColor = "brown";
    let lineWidth = 5;
    let maxCount = branches;

    
    //canvas general settings
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = "black";
    ctx.strokeStyle = fractalColor;

    //start drawing from here
    //canvas origin is center of the page;
    drawNewRandomFractal(canvas.width/2, canvas.height/2);
    

    window.addEventListener("keydown", e => {
        e.preventDefault();
        if(e.key === " "){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNewRandomFractal(canvas.width/2, canvas.height/2);
        }
    })

    ctx.fillRect(0, 0, 10, 10);

    function drawBranch(count){
        if(count <= maxCount){
            ctx.beginPath();    
            ctx.moveTo(0, 0);
            ctx.lineTo(length, 0);
            ctx.stroke();


            ctx.save();
            ctx.translate(length/2, 0);
            ctx.rotate(spreadAngle);
            ctx.scale(scale, scale);
            drawBranch(count + 1);
            ctx.restore();
            ctx.save();

            ctx.translate(length/2, 0);
            ctx.rotate(-spreadAngle);
            ctx.scale(scale, scale);
            drawBranch(count + 1);
            ctx.restore();
            
        }else if(count > maxCount) return `Completed fractal`;
    }
    function drawFractal(x, y){
        ctx.translate(x, y);

        for(let i = 0; i < sides; i++){
            drawBranch(0);
            ctx.rotate(angle);
        }
    }
    function getRandomColor(){
        return `rgb(${Math.random() * 255 + 1}, ${Math.random() * 255 + 1}, ${Math.random() * 255 + 1})`
    }
    function randomizeValues(){
        sides = Math.floor(Math.random() * 20 + 3);
        branches = Math.floor(Math.random() * 20 + 2);
        fractalColor = getRandomColor();
        spreadAngle = Math.random() * 3 + 0.1;
        scale = Math.random() * 0.8 + 0.3;
        angle = (Math.PI*2) / sides;
        ctx.strokeStyle = fractalColor;
        
        let fObj = new FractalObject();
        console.log(fObj);
    }
    function drawNewRandomFractal(x, y){
        randomizeValues();
        ctx.save();
        drawFractal(x, y);
        ctx.restore();
    }
    
});