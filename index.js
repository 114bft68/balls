function id(a) {
    return document.getElementById(a);
}

let [t1, t2, t3, t4] = [id('t1'), id('t2'), id('t3'), id('t4')];
let tbs = [t1, t2, t3, t4];

let settings = JSON.parse(localStorage.getItem('settings')) || '';
t1.value = settings.speedF || '1';
t2.value = settings.speedT || '2.5';
t3.value = settings.radiusF || '15';
t4.value = settings.radiusT || '15';
id('cb0').checked = settings.collision || false;
id('cb1').checked = settings.bounceSound || false;
id('cb2').checked = settings.color || false;
id('cb3').checked = settings.aim || false;
id('cb4').checked = settings.particles || false;
id('cb5').checked = settings.popSound || false;
id('cb6').checked = settings.tail || false;
id('cb7').checked = settings.fps || false;

let text = 'before you proceed...';
let i = 0;
let interval = setInterval(() => {
    if (i < text.length) { 
        id('t0').innerHTML += text[i];
        i++;
    } else {
        clearInterval(interval);
        id('options').style.transition = 'all 0.95s';
        id('options').style.opacity ='1'; 
        setTimeout(() => {
            id('cB').style.transition = 'all 0.75s';
            id('cB').style.opacity = '1';
            id('cB').style.transition = 'all 0.35s';
        }, 200);
    }
}, 25);

setInterval(() => {
    tbs.forEach((tb) => {
        if (tb.value === '' || (tb.value <= 0 && tb.value !== '') || (tb.value > 5 && (tb === t1 || tb === t2)) || (tb.value > 25 && (tb === t3 || tb === t4))) {
            tb.style.borderBottom = 'var(--size0p1) solid rgba(255, 215, 0, .4)';
        } else {
            tb.style.borderBottom = 'var(--size0p1) solid rgba(192, 192, 192, 0.3)';
        }
    });

    if (id('cb3').checked === false) id('cb4').checked = id('cb5').checked = false;// cb4 and cb5 requires cb3 to be selected
}, 1);

id('cB').addEventListener('click', () => {
    if (tbs.every((tb) => tb.value > 0) && t1.value <= 5 && t2.value <= 5 && t3.value <= 25 && t4.value <= 25) {
        settings = {
            "speedF": Math.min(Number(t1.value), Number(t2.value)),
            "speedT": Math.max(Number(t1.value), Number(t2.value)),
            "radiusF": Math.min(Number(t3.value), Number(t4.value)),
            "radiusT": Math.max(Number(t3.value), Number(t4.value)),
            "collision": id('cb0').checked,
            "bounceSound": id('cb1').checked,
            "color": id('cb2').checked,
            "aim": id('cb3').checked,
            "particles": id('cb4').checked,
            "popSound": id('cb5').checked,
            "tail": id('cb6').checked,
            "fps": id('cb7').checked
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        location.href = 'balls.html';
    } else {
        tbs.forEach((tb) => {
            if (tb.style.borderBottom === 'var(--size0p1) solid rgba(255, 215, 0, 0.4)') {
                tb.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    tb.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
});

let elements = [id('cb4'), id('cb5')];
for (let element in elements) {
    elements[element].addEventListener('click', (e) => {
        if (!id('cb3').checked) {
            e.target.checked = false;

            let t = id('cb3').labels[0];
            t.style.color = 'red';
            setTimeout(() => {
                t.style.color = 'white';
            }, 400);
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') e.preventDefault();
});

id('cb0').addEventListener('click', () => {
    if (id('cb0').checked) {
        window.alert(`I suggest unchecking "${id('cb0').labels[0].innerText}"`);
    }
}, { passive: true });