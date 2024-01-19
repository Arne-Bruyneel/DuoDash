const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game-container',
};

var game = new Phaser.Game(config);
var cyclist;

function preload() {
    this.load.image('cyclist', 'images/fietser01.png'); // Make sure the path is correct 

}

function create() {
    // Define the road dimensions and the cyclist's start position
    const roadWidth = this.physics.world.bounds.width;
    const roadHeight = this.physics.world.bounds.height;
    const startX = roadWidth * (3 / 60); // Start at the extreme left of the screen
    const startY = roadHeight - 65; // Adjust this to place the cyclist on the road
    
    // Create the cyclist sprite
    cyclist = this.physics.add.sprite(startX, startY, 'cyclist');
    cyclist.setScale(0.5); // Adjust this to scale the cyclist
    
    this.roadLine = this.add.graphics();
    this.roadLine.clear(); // Clear any previous line style
    this.roadLine.lineStyle(5, 0xFFFF00, 1); // Set line thickness to 5 and color to yellow
    this.roadLine.beginPath();
    this.roadLine.moveTo(0, roadHeight); // Start at the left of the screen, on the bottom
    this.roadLine.lineTo(roadWidth, roadHeight); // Draw to the right, on the bottom
    this.roadLine.strokePath();
    
    // Create a reference to the scene for use in the Socket.IO callback
    const self = this;

    // Setup Socket.IO client
    socketio.on('B2F_data', function (jsonObject) {
        if (jsonObject && typeof jsonObject['value'] === 'number') {
            console.log('Data received:', jsonObject['value']);
            const value = jsonObject['value'];
            const newX = Phaser.Math.Clamp(roadWidth * (value / 100), 0, roadWidth - cyclist.width);

            // Move the cyclist smoothly to the new position
            self.tweens.add({
                targets: cyclist,
                x: newX,
                ease: 'Linear',
                duration: 500, // Adjust duration for faster/slower movement
            });
        } else {
            console.error('Unexpected data format:', jsonObject);
        }
    });
}


function update() {
    // Handle game updates here if necessary
    
}

window.onload = () => {
    game = new Phaser.Game(config);
}