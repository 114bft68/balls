import FPS from "https://114bft68.github.io/FPS-Meter-for-JS-WebAPI-requestAnimationFrame/fps.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
setInterval(() => {
    canvas.style.height = window.innerHeight;
    canvas.style.width = window.innerWidth;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 1);
let balls = [];
const settings = JSON.parse(localStorage.getItem('settings'));

function play() {
    if (settings.bounceSound) {
        new Audio('./audio/bounce.wav').play();
    }
}

function spawnLocations(a, statement) {
    if (statement) {
        a.x = Math.random() * (canvas.width - a.r) + a.r;
        a.y = Math.random() * (canvas.height - a.r) + a.r;
        if (statement) {
            spawnLocations(a);
        }
    }
}

class ball {
    constructor() {
        this.r = Math.random() * (settings.radiusT - settings.radiusF) + settings.radiusF;
        this.x = Math.random() * (canvas.width - this.r) + this.r;
        this.y = Math.random() * (canvas.height - this.r) + this.r;
        spawnLocations(this, balls.some((b) => Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2)) < (b.r + this.r)));
        this.top = [true, false][Math.floor(Math.random() * 2)];
        this.left = [true, false][Math.floor(Math.random() * 2)];
        this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.XSpeed = Math.random() * (settings.speedT - settings.speedF) + settings.speedF;
        this.YSpeed = Math.random() * (settings.speedT - settings.speedF) + settings.speedF;
    }

    draw() {
        if (this.x - this.r <= 0) {
            this.left = false;
            play();
        } else if (this.x + this.r >= canvas.width) {
            this.left = true;
            play();
        }
        if (this.y - this.r <= 0) {
            this.top = false;
            play();
        } else if (this.y + this.r >= canvas.height) {
            this.top = true;
            play();
        }
        ctx.fillStyle = (settings.color ? `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` : this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    XYUpdate() {
        if (this.left == true) {
            this.x -= this.XSpeed;
        } else {
            this.x += this.XSpeed;
        }
        if (this.top == true) {
            this.y -= this.YSpeed;
        } else {
            this.y += this.YSpeed;
        }
    }

    collision() {
        balls.forEach((b) => {
            if (b !== this && Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2)) <= b.r + this.r) {
                [this.XSpeed, b.XSpeed] = [b.XSpeed, this.XSpeed];
                [this.YSpeed, b.YSpeed] = [b.YSpeed, this.YSpeed];
                [this.top, b.top] = [b.top, this.top];
                [this.left, b.left] = [b.left, this.left]; // yes this is insanely unrealistic
            }
        });
    }
}

let animationFrame = new FPS(() => {
    balls.forEach((ball) => {
        ball.draw();
        ball.XYUpdate();
        settings.collision ? ball.collision() : void(0);
    });
    particles.length > 0 ? particles.map((p) => p.draw()) : void(0);
});

animationFrame.start();

if (settings.fps) {
    let c = document.createElement('p');
    c.setAttribute('style', `position: absolute; top: 15px; left: 15px; padding: 0; margin: 0; color: white; font-size: 40px;`);
    document.body.insertBefore(c, canvas);
    c.innerHTML = 'FPS:';
    setInterval(() => {
        c.innerHTML = `FPS:${animationFrame.getCurrentFPS().toFixed(1)}`;
    }, 1000);
}

function spawn() {
    if (balls.length >= 100) {
        alert('EXCEEDED THE MAXIMUM AMOUNT OF BALLS');
    } else {
        balls.push(new ball());
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'S' || e.key === 's') {
        spawn();
    } else if (e.key === 'D' || e.key === 'd') {
        balls.splice(balls.length - 1, 1);
    }
});

document.getElementById('spawn').addEventListener('click', spawn);

document.getElementById('delete').addEventListener('click', () => {
    balls.splice(balls.length - 1, 1);
});

if (settings.aim) {
    canvas.addEventListener('click', (e) => {
        let ux = e.clientX;
        let uy = e.clientY;
        let targetBall = balls.find((b) => Math.sqrt(Math.pow(ux - b.x, 2) + Math.pow(uy - b.y, 2)) <= b.r);
        if (targetBall !== undefined) {
            settings.popSound ? new Audio('./audio/pop.wav').play() : void(0);
            if (settings.particles) {
                for (let i = 0; i < Math.round(Math.random() * 3 + 3); i++) {
                    particles.push(new particle(targetBall.r, targetBall.x, targetBall.y, targetBall.color));
                }
            }
            balls.splice(balls.indexOf(targetBall), 1);
        }
    });
}

let particles = [];
const regex = /0\.\d{2}\)/;
class particle {
    constructor(r, x, y, c) {
        this.r = Math.random() * r / 6 + r / 6;
        this.x = Math.random() * (r * 2) + (x - r);
        this.y = Math.random() * (r * 2) + (y - r);
        this.color = c.replace('rgb', 'rgba').replace(')', ', 0.70)');
    }

    draw() {
        regex.exec(this.color)[0] === '0.00)' ? particles.splice(particles.indexOf(this), 1) : void(0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        this.color = this.color.replace(regex , (Number(regex.exec(this.color)[0].split(')')[0]) - 0.01).toFixed(2) + ')');
    }
}