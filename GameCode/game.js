document.addEventListener('DOMContentLoaded', () => {
    const left = document.querySelector('.js-left');
    const right = document.querySelector('.js-right');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Cycling animation properties
    var spriteFrameWidth = 8316 / 30;
    var spriteFrameHeight = 260; // Adjusted for size
    var currentFrame1 = 0; // Current frame for the first bike
    var currentFrame2 = 0; // Current frame for the second bike

    var frameAccumulator1 = 0; // Accumulator for the first bike's animation
    var frameAccumulator2 = 0; // Accumulator for the second bike's animation


    var animationSpeed1 = 0.1; // Speed of animation for the first bike
    var animationSpeed2 = 0.1; // Speed of animation for the second bike


    const lanIP = `${window.location.hostname}:5000`;
    const socketio = io(`http://${lanIP}`);

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

     // Image properties
     const imgWidth = 8316 / 30 / 1.6; // Width of one frame of the sprite
     const imgHeight = 261 / 1.6; // Height of the sprite
     const yPos = canvas.height - imgHeight; // Position at the bottom with some margin
     let currentX1 = 0; // Current X position of the first image
     let targetX1 = 0; // Target X position for the first image
     let currentX2 = 0; // Current X position of the second image
     let targetX2 = 0; // Target X position for the second image
 
     // Load images
     const bike1Image = new Image();
     bike1Image.src = 'images/blauw.png'; // Replace with your image path
     const bike2Image = new Image();
     bike2Image.src = 'images/groen.png'; // Replace with your image path
 
    // Function to check overlap
    function isOverlapping(x1, x2, width) {
        return Math.abs(x1 - x2) < width;
    }

    // Function to draw the rectangles
    function drawRectangles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
        // Check if images are overlapping
        const overlapping = isOverlapping(currentX1, currentX2, imgWidth);
    
        // Draw first bike animation frame
        ctx.globalAlpha = overlapping && currentX1 > currentX2 ? 0.5 : 1;
        ctx.drawImage(bike1Image, spriteFrameWidth * currentFrame1, 0, spriteFrameWidth, spriteFrameHeight, currentX1, yPos, imgWidth, imgHeight);
    
        // Draw second bike animation frame
        ctx.globalAlpha = overlapping && currentX2 > currentX1 ? 0.5 : 1;
        ctx.drawImage(bike2Image, spriteFrameWidth * currentFrame2, 0, spriteFrameWidth, spriteFrameHeight, currentX2, yPos, imgWidth, imgHeight);
    
        // Reset globalAlpha to default
        ctx.globalAlpha = 1;
    }
    

    // Animation function
    function animate() {
        const distance1 = targetX1 - currentX1;
        const speed1 = distance1 / 20;

        const distance2 = targetX2 - currentX2;
        const speed2 = distance2 / 20;

        let animationNeeded = false;

        frameAccumulator1 += animationSpeed1;
        if (frameAccumulator1 >= 1) {
            currentFrame1 = (currentFrame1 + 1) % 30;
            frameAccumulator1 -= 1; // Reset the accumulator
        }
    
        frameAccumulator2 += animationSpeed2;
        if (frameAccumulator2 >= 1) {
            currentFrame2 = (currentFrame2 + 1) % 30;
            frameAccumulator2 -= 1; // Reset the accumulator
        }

        if (Math.abs(distance1) > 0.5) {
            currentX1 += speed1;
            animationNeeded = true;
        } else {
            currentX1 = targetX1;
        }

        if (Math.abs(distance2) > 0.5) {
            currentX2 += speed2;
            animationNeeded = true;
        } else {
            currentX2 = targetX2;
        }

        drawRectangles();

        // if (animationNeeded) {
        //     requestAnimationFrame(animate);
        // }
        requestAnimationFrame(animate);
    }

    // Function to move the rectangles
    function moveRectangle(bike, value) {
        if (bike === 1) {
            targetX1 = (canvas.width - imgWidth) * (value / 30); // Use imgWidth here
        } else if (bike === 2) {
            targetX2 = (canvas.width - imgWidth) * (value / 30); // Use imgWidth here
        }
        requestAnimationFrame(animate);
    }

    function setAnimationSpeed(bike, speed) {
        // Adjust the speed factor as needed for more control
        var adjustedSpeed = speed * 0.1; // Example adjustment
        if (bike === 1) {
            animationSpeed1 = adjustedSpeed;
        } else if (bike === 2) {
            animationSpeed2 = adjustedSpeed;
        }
    }
    

    // Initially draw the rectangles
    drawRectangles();

    moveRectangle(2, 2);
    // setAnimationSpeed(2, 1)
    animate();

    socketio.on('connect', function (jsonObject) {
        console.info('verbonden met de server');
    });
   

    socketio.on('B2F_data', function (jsonObject) {

        for (const device of jsonObject) {
            if (device["side"] == 'left') {
                left.innerHTML = device["data"]["speed"] + " km/u";
                moveRectangle(1, device["data"]["speed"]);
                setAnimationSpeed(2, device["data"]["speed"] / 100); 
            } else {
                right.innerHTML = device["data"]["speed"] + " km/u";
                moveRectangle(2, device["data"]["speed"]);
                setAnimationSpeed(2, device["data"]["speed"] / 100); 

            }   
        }
    });


    // Adjust canvas size on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        targetX1 = currentX1 / (canvas.width - rectWidth) * 30; // Adjust position based on new width
        targetX2 = currentX2 / (canvas.width - rectWidth) * 30; // Adjust position based on new width
        requestAnimationFrame(animate);
    });
});