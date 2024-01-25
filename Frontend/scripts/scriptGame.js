document.addEventListener('DOMContentLoaded', () => {
    const left = document.querySelector('.js-speed-left');
    const right = document.querySelector('.js-speed-right');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    var spriteFrameWidth = 8316 / 30;
    var spriteFrameHeight = 260;
    var currentFrame1 = 0;
    var currentFrame2 = 0;
    var frameAccumulator1 = 0;
    var frameAccumulator2 = 0;
    var animationSpeed1 = 0.1;
    var animationSpeed2 = 0.1;

    const lanIP = `${window.location.hostname}:5000`;
    const socketio = io(`http://${lanIP}`);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const imgWidth = 8316 / 30 / 1.6;
    const imgHeight = 261 / 1.6;
    const yPos = canvas.height - imgHeight;
    let currentX1 = 0;
    let targetX1 = 0;
    let currentX2 = 0;
    let targetX2 = 0;
 
    const bike1Image = new Image();
    bike1Image.src = '../../img/Game/rood.png';
    const bike2Image = new Image();
    bike2Image.src = '../../img/Game/blauw.png';
 
    function isOverlapping(x1, x2, width) {
        return Math.abs(x1 - x2) < width;
    }

    function drawRectangles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const overlapping = isOverlapping(currentX1, currentX2, imgWidth);
    
        ctx.globalAlpha = overlapping && currentX1 < currentX2 ? 0.5 : 1;
        ctx.drawImage(bike1Image, spriteFrameWidth * currentFrame1, 0, spriteFrameWidth, spriteFrameHeight, currentX1, yPos, imgWidth, imgHeight);
    
        ctx.globalAlpha = overlapping && currentX2 < currentX1 ? 0.5 : 1;
        ctx.drawImage(bike2Image, spriteFrameWidth * currentFrame2, 0, spriteFrameWidth, spriteFrameHeight, currentX2, yPos, imgWidth, imgHeight);
    
        ctx.globalAlpha = 1;
    }

    function animate() {
        const distance1 = targetX1 - currentX1;
        const speed1 = distance1 / 20;
        const distance2 = targetX2 - currentX2;
        const speed2 = distance2 / 20;

        frameAccumulator1 += animationSpeed1;
        if (frameAccumulator1 >= 1) {
            currentFrame1 = (currentFrame1 + 1) % 30;
            frameAccumulator1 -= 1;
        }
    
        frameAccumulator2 += animationSpeed2;
        if (frameAccumulator2 >= 1) {
            currentFrame2 = (currentFrame2 + 1) % 30;
            frameAccumulator2 -= 1;
        }

        if (Math.abs(distance1) > 0.5) {
            currentX1 += speed1;
        } else {
            currentX1 = targetX1;
        }

        if (Math.abs(distance2) > 0.5) {
            currentX2 += speed2;
        } else {
            currentX2 = targetX2;
        }

        drawRectangles();
        requestAnimationFrame(animate);
    }

    function moveRectangle(bike, value) {
        if (bike === 1) {
            targetX1 = (canvas.width - imgWidth) * (value / 40);
        } else if (bike === 2) {
            targetX2 = (canvas.width - imgWidth) * (value / 40);
        }
    }

    function setAnimationSpeed(bike, speed) {
        if (bike === 1) {
            animationSpeed1 = speed / 13;
        } else if (bike === 2) {
            animationSpeed2 = speed / 130;
        }
    }

    drawRectangles();
    requestAnimationFrame(animate);

    socketio.on('connect', function (jsonObject) {
        console.info('verbonden met de server');
    });

    socketio.on('B2F_data', function (jsonObject) {
        for (const device of jsonObject) {
            let speed = device["data"]["speed"]
            if (device["side"] == 'left') {
                left.innerHTML = speed + " km/u";
                moveRectangle(1, speed);
                setAnimationSpeed(1, speed * 3); 
            } else {
                right.innerHTML = speed + " km/u";
                moveRectangle(2, speed);
                setAnimationSpeed(2, speed * 3); 
            }
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        targetX1 = currentX1 / (canvas.width - imgWidth) * 40;
        targetX2 = currentX2 / (canvas.width - imgWidth) * 40;
    });
});
