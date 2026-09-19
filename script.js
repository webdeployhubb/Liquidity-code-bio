const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), 150 + i * 130);
    });
});

(() => {
    const glow = document.querySelector('.cursor-glow');
    let raf = null, gx = 0, gy = 0;

    window.addEventListener('pointermove', (e) => {
        gx = e.clientX; gy = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(() => {
            raf = null;
            if (glow) glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        });
    }, { passive: true });

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    });
})();

(() => {
    const cv = document.getElementById('bg');
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const STEP = 14;
    let W = 0, H = 0, dpr = 1, candles = [], pts = [], off = 0;
    let lineGrad, glowGrad, fillGrad, last = 0, resizeTimer;

    const rand = (a, b) => a + Math.random() * (b - a);

    function makeCandle(initial) {
        const body = rand(16, 64);
        const up = Math.random() > 0.42;
        const a = rand(0.05, 0.16);
        return {
            x: rand(0, W),
            y: initial ? rand(0, H) : H + rand(40, 160),
            w: rand(4, 8),
            body,
            wick: body * rand(1.35, 1.9),
            vy: rand(0.12, 0.38),
            color: `rgba(${up ? '52,211,153' : '248,113,113'},${a})`
        };
    }

    function nextPoint(prev) {
        const target = H * 0.76;
        let y = prev + rand(-13, 13) + (target - prev) * 0.03;
        return Math.min(H * 0.92, Math.max(H * 0.56, y));
    }

    function buildLine() {
        pts = [];
        let y = H * 0.76;
        const n = Math.ceil(W / STEP) + 4;
        for (let i = 0; i < n; i++) { y = nextPoint(y); pts.push(y); }
    }

    function resize() {
        const nw = window.innerWidth, nh = window.innerHeight;
        if (W && nw === W && Math.abs(nh - H) < 160) return;

        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = nw;
        H = nh;
        cv.width = W * dpr;
        cv.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        lineGrad = ctx.createLinearGradient(0, 0, W, 0);
        lineGrad.addColorStop(0, 'rgba(255,255,255,0)');
        lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.28)');
        lineGrad.addColorStop(1, 'rgba(52,211,153,0.6)');

        glowGrad = ctx.createLinearGradient(0, 0, W, 0);
        glowGrad.addColorStop(0, 'rgba(52,211,153,0)');
        glowGrad.addColorStop(0.5, 'rgba(52,211,153,0.06)');
        glowGrad.addColorStop(1, 'rgba(52,211,153,0.2)');

        fillGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
        fillGrad.addColorStop(0, 'rgba(52,211,153,0.09)');
        fillGrad.addColorStop(1, 'rgba(52,211,153,0)');

        const count = Math.min(Math.max(Math.round((W * H) / 26000), 16), 52);
        candles = Array.from({ length: count }, () => makeCandle(true));
        buildLine();
        draw();
    }

    function drawCandles() {
        ctx.lineWidth = 1;
        for (const c of candles) {
            ctx.strokeStyle = c.color;
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.moveTo(c.x, c.y - c.wick / 2);
            ctx.lineTo(c.x, c.y + c.wick / 2);
            ctx.stroke();
            ctx.fillRect(c.x - c.w / 2, c.y - c.body / 2, c.w, c.body);
        }
    }

    function drawLine() {
        const x = (i) => i * STEP - off;

        ctx.beginPath();
        ctx.moveTo(x(0), pts[0]);
        for (let i = 1; i < pts.length - 1; i++) {
            const mx = (x(i) + x(i + 1)) / 2;
            const my = (pts[i] + pts[i + 1]) / 2;
            ctx.quadraticCurveTo(x(i), pts[i], mx, my);
        }
        const lastX = x(pts.length - 1), lastY = pts[pts.length - 1];
        ctx.lineTo(lastX, lastY);

        ctx.lineJoin = 'round';
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.lineTo(lastX, H);
        ctx.lineTo(x(0), H);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        drawCandles();
        drawLine();
    }

    function tick(t) {
        const k = last ? Math.min((t - last) / 16.667, 3) : 1;
        last = t;

        for (const c of candles) {
            c.y -= c.vy * k;
            if (c.y < -120) Object.assign(c, makeCandle(false), { x: rand(0, W) });
        }
        off += 0.35 * k;
        while (off >= STEP) {
            off -= STEP;
            pts.shift();
            pts.push(nextPoint(pts[pts.length - 1]));
        }
        draw();
        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });
    resize();
    if (!prefersReduced) requestAnimationFrame(tick);
})();

(() => {
    document.addEventListener('touchstart', () => {}, { passive: true });

    document.querySelectorAll('.card, .social').forEach((el) => {
        el.addEventListener('pointerdown', (e) => {
            const r = el.getBoundingClientRect();
            const s = document.createElement('span');
            s.className = 'ripple';
            s.style.left = (e.clientX - r.left) + 'px';
            s.style.top = (e.clientY - r.top) + 'px';
            el.appendChild(s);
            const rm = () => s.remove();
            s.addEventListener('animationend', rm);
            setTimeout(rm, 900);
        });
    });
})();
