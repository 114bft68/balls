const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
setInterval(() => {
    canvas.style.height = window.innerHeight;
    canvas.style.width = window.innerWidth;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 1);
var balls = [];
const bounceSound = new Audio('BOUNCEBOUNCEBOUNCE.mp3');
const settings = JSON.parse(localStorage.getItem('settings'));

function play() {
    if (settings.sound) {
        bounceSound.play();
    }
}

class ball {
    constructor() {
        this.r = Math.random() * (settings.radiusT - settings.radiusF) + settings.radiusF;
        this.x = Math.random() * (canvas.width - this.r) + this.r;
        this.y = Math.random() * (canvas.height - this.r) + this.r;
        while (balls.some((b) => { Math.abs(this.x - b.x) <= 15 })) {
            this.x = Math.random() * (canvas.width - this.r) + this.r;
        }
        while (balls.some((b) => { Math.abs(this.y - b.y) <= 15 })) {
            this.y = Math.random() * (canvas.height - this.r) + this.r;
        }
        this.up = false;
        this.left = (Math.ceil(Math.random() * 100) / 2).toString().includes('.');
        settings.color ? void(0) : this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.XSpeed = Math.random() * (settings.speedT - settings.speedF) + settings.speedF;
        this.YSpeed = Math.random() * (settings.speedT - settings.speedF) + settings.speedF;
    }

    draw() {
        this.x - this.r <= 0 ? (this.left = false, play()) : void(0);
        this.x + this.r >= canvas.width ? (this.left = true, play()) : void(0);
        this.y - this.r <= 0 ? (this.up = false, play()) : void(0);
        this.y + this.r >= canvas.height ? (this.up = true, play()) : void(0);
        ctx.fillStyle = (settings.color ? `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` : this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    XYUpdate() {
        if (this.left == true) {
            this.x -= this.XSpeed;
        } else {
            this.x += this.XSpeed;
        }
        if (this.up == true) {
            this.y -= this.YSpeed;
        } else {
            this.y += this.YSpeed;
        }
    }

    collision() {
        balls.forEach((b) => {
            if (b !== this && Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2)) <= b.r + this.r) {
                //
            }
        });
    }
}

balls.push(new ball());

function drawBalls() {
    balls.forEach((ball) => {
        ball.draw();
        ball.XYUpdate();
        //settings.collision ? ball.collision() : void(0);
    });
    requestAnimationFrame(drawBalls);
}
requestAnimationFrame(drawBalls);

function spawn() {
    if (balls.length >= 120) {
        alert('EXCEEDED THE MAXIMUM AMOUNT OF BALLS');
    } else {
        balls.push(new ball());
    }
}

document.addEventListener('keydown', (e) => {
    if (e.isTrusted) {
        if (e.key === 'S' || e.key === 's') {
            spawn();
        }
        if (e.key === 'D' || e.key === 'd') {
            balls.splice(balls.length - 1, 1);
        }
    }
});

document.getElementById('spawn').addEventListener('click', (e) => {
    e.isTrusted ? spawn() : void(0);
});

document.getElementById('delete').addEventListener('click', (e) => {
    e.isTrusted ? balls.splice(balls.length - 1, 1) : void(0);
});

if (settings.aim) {
    canvas.addEventListener('click', (e) => {
        let ux = e.clientX;
        let uy = e.clientY;
        let targetBall = balls.find((b) => Math.sqrt(Math.pow(ux - b.x, 2) + Math.pow(uy - b.y, 2)) <= b.r);
        if (targetBall !== undefined) {
            balls.splice(balls.indexOf(targetBall), 1);
        }
    });
}