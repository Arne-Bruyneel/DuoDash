document.addEventListener('DOMContentLoaded', () => {
    const left = document.querySelector('.js-left');
    const right = document.querySelector('.js-right');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const lanIP = `${window.location.hostname}:5000`;
    const socketio = io(`http://${lanIP}`);

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

     // Image properties
     const imgWidth = 8316 / 1.5// Adjust as needed
     const imgHeight = 261 / 1.5; // Adjust as needed
     const yPos = canvas.height - imgHeight; // Bottom of the screen
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
    
        // Draw first image
        ctx.globalAlpha = overlapping && currentX1 > currentX2 ? 0.5 : 1; // Reduce opacity if overlapped and in front
        ctx.drawImage(bike1Image, currentX1, yPos, imgWidth, imgHeight);
    
        // Draw second image
        ctx.globalAlpha = overlapping && currentX2 > currentX1 ? 0.5 : 1; // Reduce opacity if overlapped and in front
        ctx.drawImage(bike2Image, currentX2, yPos, imgWidth, imgHeight);
    
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

        if (animationNeeded) {
            requestAnimationFrame(animate);
        }
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
    

    // Initially draw the rectangles
    drawRectangles();

    // var spriteFrameWidth = 8316 / 30;
    // var spriteFrameHeight = 260; // Assuming 260px is the height of each frame
    // var currentFrame = 0;

    // var xPosition = canvas.width / 2 - spriteFrameWidth / 2; // Center the sprite horizontally
    // var yPosition = canvas.height / 2 - spriteFrameHeight / 2; // Center the sprite vertically

    // img.onload = function() {
    //     animate();
    // };

    // function animate() {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    //     // Draw a frame of the sprite
    //     ctx.drawImage(img, spriteFrameWidth * currentFrame, 0, spriteFrameWidth, spriteFrameHeight, xPosition, yPosition, spriteFrameWidth, spriteFrameHeight);

    //     // Update to the next frame
    //     currentFrame = (currentFrame + 1) % 30;

    //     requestAnimationFrame(animate);
    // }

    moveRectangle(2, 2);

    socketio.on('connect', function (jsonObject) {
        console.info('verbonden met de server');
    });
   

    socketio.on('B2F_data', function (jsonObject) {

        for (const device of jsonObject) {
            if (device["side"] == 'left') {
                left.innerHTML = device["data"]["speed"] + " km/u";
                moveRectangle(1, device["data"]["speed"]);
            } else {
                right.innerHTML = device["data"]["speed"] + " km/u";
                moveRectangle(2, device["data"]["speed"]);

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