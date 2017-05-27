'use strict';
var player;
var jumping = false;
var gameOver = false;
var score = 0;
var block = {
    x: 0,
    y: 0,
    width: 25,
    height: 25
};

var blocks = [];

function setup() {
    blocks = [];
    score = 0;
    for (var i = 0; i < 10; i++) {
        var block1 = Object.create(block);
        Object.assign(block1, {
            x: Math.floor(Math.random() * 1000 + 20),
            y: Math.floor(Math.random() * 180 + 20)
        });
        blocks.push(block1);
    }
    createCanvas(1000, 200);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i] = createSprite(width + blocks[i].width + blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
    }
    player = createSprite(width / 2, height, 25, 25);

}
var gravity = 0.2;
var acceleration = {
    x: 0,
    y: 0
};
var velocity = {
    x: 0,
    y: 0
};
var blockVelocity = -5;


function draw() {

    if (gameOver) {
        background(0);
        textAlign(CENTER);
        fill("white");
        text("Game Over! Score:" + score.toString(), width / 2, height / 2);

        return;
    }

    console.log();
    background(0, 0, 100, 50);

    drawSprites();
    fill("white");
    text(score.toString(), width / 2, height / 2);
    if (player.position.y >= height - player.height / 2 && jumping) {
        jumping = false;
    }
    if (player.position.y >= height - player.height / 2) {
        acceleration.y = 0;
        velocity.y = 0;
    }
    if (player.position.x >= width - player.width / 2 || player.position.x <= 0 + player.width / 2) {
        velocity.x = 0;
    }
    if (jumping) {
        acceleration.y += gravity;
    }
    if (keyDown(UP_ARROW) && !jumping) {
        acceleration.y -= 1.5;
        jumping = true;
    }
    if (keyDown(LEFT_ARROW)) {
        velocity.x -= 0.05;
    }
    if (keyDown(RIGHT_ARROW)) {
        velocity.x += 0.05;
    }

    for (var i = 0; i < blocks.length; i++) {
        blocks[i].position.x += blockVelocity
        if (blocks[i].overlap(player)) {
            gameOver = true;
        }
        if (blocks[i].position.x < -blocks[i].width / 2) {
            blocks[i].position.x = width + blocks[i].width;
            blocks[i].position.y = Math.floor(Math.random() * 180 + 20);
            score += 1;
            blockVelocity -= 0.02;
        }
    }
    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
    player.position.x += velocity.x;
    player.position.y += velocity.y;
    player.position.x = Math.max(player.width / 2, Math.min(width - player.width / 2, player.position.x));
    player.position.y = Math.max(player.height / 2, Math.min(height - player.height / 2, player.position.y));
}
