/* ============================================================
   仙劍天下 - XIAN JIAN ONLINE
   Core Game Engine — Vanilla JavaScript
   Architecture: Chinese Fantasy Browser MMORPG
   ============================================================ */
'use strict';

// ============================================================
// ASSET GENERATOR - Procedural canvas art for tiles/sprites
// (Architecture compliant: generates base art at runtime init)
// ============================================================
const AssetGen = {
  makeTile(type, size = 32) {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    switch (type) {
      case 'grass1': {
        ctx.fillStyle = '#3a7a2a'; ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 12; i++) {
          ctx.fillStyle = `rgba(${30 + Math.floor(Math.random() * 40)},${100 + Math.floor(Math.random() * 40)},${20 + Math.floor(Math.random() * 20)},0.4)`;
          ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 1 + Math.random() * 2);
        }
        break;
      }
      case 'grass2': {
        ctx.fillStyle = '#2d6b22'; ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = `rgba(60,140,30,0.5)`;
          const x = Math.random() * size, y = Math.random() * size;
          ctx.beginPath(); ctx.ellipse(x, y, 3, 5, Math.random() * Math.PI, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,220,50,0.08)'; ctx.fillRect(0, 0, size / 2, size / 2);
        break;
      }
      case 'grass3': {
        ctx.fillStyle = '#4a8a32'; ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = 'rgba(80,160,40,0.4)';
          ctx.fillRect(Math.random() * size, Math.random() * size, 4, 6);
        }
        break;
      }
      case 'dirt1': {
        ctx.fillStyle = '#8b6040'; ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 10; i++) {
          const r = Math.random();
          ctx.fillStyle = r > 0.5 ? `rgba(${80 + Math.floor(Math.random() * 30)},${55 + Math.floor(Math.random() * 25)},${25 + Math.floor(Math.random() * 20)},0.5)` : `rgba(50,35,15,0.4)`;
          ctx.beginPath(); ctx.ellipse(Math.random() * size, Math.random() * size, 1 + Math.random() * 4, 1 + Math.random() * 2, Math.random() * Math.PI, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }
      case 'road': {
        ctx.fillStyle = '#a09080'; ctx.fillRect(0, 0, size, size);
        const stones = [[2, 2, 12, 10], [15, 1, 13, 8], [1, 13, 10, 11], [13, 12, 15, 12], [2, 25, 12, 6], [15, 22, 14, 9]];
        stones.forEach(([x, y, w, h]) => {
          if (y + h > size) h = size - y - 1;
          ctx.fillStyle = `rgba(${130 + Math.floor(Math.random() * 30)},${115 + Math.floor(Math.random() * 25)},${100 + Math.floor(Math.random() * 20)},0.9)`;
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(x + 1, y + 1, w - 2, 2);
          ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x, y + h - 1, w, 1);
        });
        break;
      }
      case 'stone1': {
        ctx.fillStyle = '#707070'; ctx.fillRect(0, 0, size, size);
        const tw = size / 3, th = size / 2;
        for (let r = 0; r < 2; r++) {
          for (let cc = 0; cc < 3; cc++) {
            const ox = cc * tw + (r % 2 === 0 ? 0 : tw / 2);
            const oy = r * th;
            ctx.fillStyle = `rgba(${100 + Math.floor(Math.random() * 30)},${90 + Math.floor(Math.random() * 25)},${80 + Math.floor(Math.random() * 20)},0.7)`;
            ctx.fillRect(ox + 1, oy + 1, tw - 2, th - 2);
            ctx.fillStyle = 'rgba(50,40,35,0.6)'; ctx.fillRect(ox, oy, tw, 1); ctx.fillRect(ox, oy, 1, th);
          }
        }
        break;
      }
      case 'stone2': {
        ctx.fillStyle = '#606060'; ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(${80 + Math.floor(Math.random() * 30)},${80 + Math.floor(Math.random() * 30)},${80 + Math.floor(Math.random() * 20)},0.5)`;
          ctx.fillRect(Math.random() * size, Math.random() * size, 3 + Math.random() * 6, 2 + Math.random() * 4);
        }
        break;
      }
      case 'water': {
        const wg = ctx.createLinearGradient(0, 0, size, size);
        wg.addColorStop(0, '#1a6a9a'); wg.addColorStop(0.5, '#2080b8'); wg.addColorStop(1, '#1560a0');
        ctx.fillStyle = wg; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(4, 6, 12, 2); ctx.fillRect(16, 14, 10, 2); ctx.fillRect(6, 22, 14, 1);
        break;
      }
      default: {
        ctx.fillStyle = '#444'; ctx.fillRect(0, 0, size, size);
      }
    }
    return c.toDataURL();
  },

  makeTree(variant = 1) {
    const c = document.createElement('canvas'); c.width = 48; c.height = 64;
    const ctx = c.getContext('2d');
    const colors = variant === 1
      ? [['#1a5a10', '#2a8a20', 'rgba(80,200,40,0.3)'], ['#2a3a10', '#3a5a18', 'rgba(100,180,60,0.3)']]
      : [['#4a7a20', '#6aaa30', 'rgba(120,220,80,0.2)'], ['#3a6a18', '#5a9a28', 'rgba(100,200,60,0.2)']];
    ctx.fillStyle = '#5a3010'; ctx.fillRect(20, 44, 8, 20);
    ctx.fillStyle = '#6a4018'; ctx.fillRect(22, 44, 4, 20);
    [[8, 48, 32, 28], [4, 36, 36, 32], [8, 24, 32, 28]].forEach(([x, y, w, h], i) => {
      const gc = ctx.createLinearGradient(x, y, x + w, y + h);
      const ci = Math.min(i, colors.length - 1);
      gc.addColorStop(0, colors[ci][2]); gc.addColorStop(0.5, colors[ci][1]); gc.addColorStop(1, colors[ci][0]);
      ctx.fillStyle = gc;
      ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath(); ctx.ellipse(x + w / 2 - 2, y + h / 3, w / 4, h / 4, -0.3, 0, Math.PI * 2); ctx.fill();
    });
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `hsl(${Math.random() > 0.5 ? 340 : 50},80%,60%)`;
      ctx.beginPath(); ctx.arc(8 + Math.random() * 32, 10 + Math.random() * 40, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    return c.toDataURL();
  },

  makeRock() {
    const c = document.createElement('canvas'); c.width = 32; c.height = 24;
    const ctx = c.getContext('2d');
    const rg = ctx.createRadialGradient(12, 8, 2, 16, 12, 14);
    rg.addColorStop(0, '#909090'); rg.addColorStop(1, '#505050');
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.ellipse(16, 14, 14, 10, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(10, 8, 5, 3, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(14, 10); ctx.lineTo(18, 16); ctx.stroke();
    return c.toDataURL();
  },

  makeFlower() {
    const c = document.createElement('canvas'); c.width = 16; c.height = 20;
    const ctx = c.getContext('2d');
    ctx.strokeStyle = '#2a8a20'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(8, 18); ctx.lineTo(8, 8); ctx.stroke();
    const petals = ['#ff6080', '#ff80a0', '#ffaacc', '#ff4060', '#cc2040'];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.fillStyle = petals[i];
      ctx.beginPath(); ctx.ellipse(8 + Math.cos(angle) * 4, 8 + Math.sin(angle) * 4, 3, 2, angle, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#ffee40'; ctx.beginPath(); ctx.arc(8, 8, 2.5, 0, Math.PI * 2); ctx.fill();
    return c.toDataURL();
  },

  makeCharacterFrame(dir, frame, type) {
    const c = document.createElement('canvas'); c.width = 32; c.height = 48;
    const ctx = c.getContext('2d');
    const isPlayer = type === 'player';
    const isGuard = type === 'npc_guard';
    const bodyColor = isPlayer ? '#c87832' : isGuard ? '#4060a0' : '#c09050';
    const clothColor = isPlayer ? '#3060c0' : isGuard ? '#2040a0' : '#8b4513';
    const hairColor = isPlayer ? '#1a0808' : '#2a1008';
    const skinColor = '#e8b080';
    const bobY = Math.sin(frame * Math.PI / 2) * (frame % 2 === 0 ? 1 : -1);
    const legSwing = Math.sin(frame * Math.PI / 2) * 4;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 46, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    if (dir !== 'up') {
      ctx.fillStyle = clothColor;
      ctx.fillRect(10, 24 + bobY, 6, 14);
      ctx.fillRect(16, 24 + bobY, 6, 14);
      ctx.fillStyle = skinColor;
      ctx.fillRect(10, 38 + bobY + (dir === 'down' ? legSwing : 0), 5, 8);
      ctx.fillRect(17, 38 + bobY - (dir === 'down' ? legSwing : 0), 5, 8);
    }
    ctx.fillStyle = clothColor;
    ctx.fillRect(8, 18 + bobY, 16, 18);
    ctx.fillStyle = skinColor;
    ctx.fillRect(6, 20 + bobY, 4, 12);
    ctx.fillRect(22, 20 + bobY, 4, 12);
    if (isPlayer) {
      ctx.fillStyle = '#c0a030';
      ctx.fillRect(8, 24 + bobY, 16, 3);
    }
    ctx.fillStyle = skinColor;
    ctx.beginPath(); ctx.ellipse(16, 12 + bobY, 8, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hairColor;
    if (dir === 'down' || dir === 'left' || dir === 'right') {
      ctx.beginPath(); ctx.ellipse(16, 6 + bobY, 9, 6, 0, Math.PI, Math.PI * 2); ctx.fill();
    }
    if (dir !== 'up') {
      ctx.fillStyle = '#1a0808';
      ctx.beginPath(); ctx.arc(13, 12 + bobY, 2, 0, Math.PI * 2); ctx.arc(19, 12 + bobY, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(13.5, 11.5 + bobY, 0.8, 0, Math.PI * 2); ctx.arc(19.5, 11.5 + bobY, 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cc4030';
      ctx.fillRect(13, 17 + bobY, 6, 1.5);
    }
    if (isPlayer) {
      ctx.fillStyle = '#c0a030';
      ctx.strokeStyle = '#e0c040'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (dir === 'right') { ctx.moveTo(22, 20 + bobY); ctx.lineTo(30, 12 + bobY); }
      else if (dir === 'left') { ctx.moveTo(10, 20 + bobY); ctx.lineTo(2, 12 + bobY); }
      else if (dir === 'down') { ctx.moveTo(22, 22 + bobY); ctx.lineTo(28, 30 + bobY); }
      else { ctx.moveTo(10, 20 + bobY); ctx.lineTo(4, 12 + bobY); }
      ctx.stroke();
    }
    return c.toDataURL();
  },

  makeAvatar() {
    const c = document.createElement('canvas'); c.width = 60; c.height = 60;
    const ctx = c.getContext('2d');
    const bg = ctx.createRadialGradient(22, 18, 3, 30, 30, 28);
    bg.addColorStop(0, '#8b6040'); bg.addColorStop(1, '#3a1e08');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(30, 30, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8b080'; ctx.beginPath(); ctx.ellipse(30, 28, 14, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a0808'; ctx.beginPath(); ctx.ellipse(30, 16, 15, 10, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a0808';
    ctx.beginPath(); ctx.arc(24, 28, 3, 0, Math.PI * 2); ctx.arc(36, 28, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.arc(25, 27, 1, 0, Math.PI * 2); ctx.arc(37, 27, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3060c0'; ctx.fillRect(16, 42, 28, 18);
    ctx.fillStyle = '#c0a030'; ctx.fillRect(16, 45, 28, 3);
    ctx.strokeStyle = 'rgba(200,160,40,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(30, 30, 28, 0, Math.PI * 2); ctx.stroke();
    return c.toDataURL();
  },

  makeSkillIcon(type, size = 48) {
    const c = document.createElement('canvas'); c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size / 2 - 2;
    const bgGrads = {
      fire: ['#ff6030', '#660000'], ice: ['#40b0ff', '#003080'],
      lightning: ['#f0e040', '#604000'], qi: ['#c060ff', '#400080'],
      wind: ['#40e080', '#004030'], sword: ['#c0c0e0', '#303060'],
      heal: ['#40ff80', '#004020'], shield: ['#ffa040', '#604000'],
    };
    const [c1, c2] = bgGrads[type] || bgGrads.fire;
    const bg = ctx.createRadialGradient(cx * 0.7, cy * 0.7, 1, cx, cy, r);
    bg.addColorStop(0, c1); bg.addColorStop(1, c2);
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy);
    const s = size / 48;
    switch (type) {
      case 'fire': {
        ctx.fillStyle = '#ffee00';
        ctx.beginPath(); ctx.moveTo(0, 12 * s); ctx.bezierCurveTo(-6 * s, 5 * s, -12 * s, -2 * s, 0, -14 * s);
        ctx.bezierCurveTo(4 * s, -8 * s, 8 * s, -4 * s, 6 * s, 0); ctx.bezierCurveTo(10 * s, -6 * s, 14 * s, -2 * s, 8 * s, 12 * s);
        ctx.bezierCurveTo(4 * s, 8 * s, -4 * s, 8 * s, 0, 12 * s); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ff8020';
        ctx.beginPath(); ctx.moveTo(0, 10 * s); ctx.bezierCurveTo(-4 * s, 4 * s, -8 * s, 0, 0, -10 * s);
        ctx.bezierCurveTo(3 * s, -4 * s, 6 * s, 2 * s, 4 * s, 10 * s); ctx.bezierCurveTo(2 * s, 8 * s, -2 * s, 8 * s, 0, 10 * s); ctx.closePath(); ctx.fill();
        break;
      }
      case 'ice': {
        ctx.strokeStyle = 'rgba(180,230,255,0.9)'; ctx.lineWidth = 2 * s;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 14 * s, Math.sin(a) * 14 * s); ctx.stroke();
        }
        ctx.fillStyle = '#c0e8ff'; ctx.beginPath(); ctx.arc(0, 0, 4 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'lightning': {
        ctx.fillStyle = '#ffee40';
        ctx.beginPath(); ctx.moveTo(4 * s, -14 * s); ctx.lineTo(-2 * s, -2 * s); ctx.lineTo(3 * s, -2 * s);
        ctx.lineTo(-4 * s, 14 * s); ctx.lineTo(2 * s, 2 * s); ctx.lineTo(-3 * s, 2 * s); ctx.closePath(); ctx.fill();
        break;
      }
      case 'qi': {
        ctx.strokeStyle = 'rgba(200,120,255,0.9)'; ctx.lineWidth = 2 * s;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.arc(0, 0, (6 + i * 4) * s, 0, Math.PI * 1.8); ctx.stroke();
        }
        ctx.fillStyle = '#e080ff'; ctx.beginPath(); ctx.arc(0, 0, 4 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'wind': {
        ctx.strokeStyle = 'rgba(80,240,160,0.9)'; ctx.lineWidth = 2 * s;
        [[0, -8], [4, -2], [-4, 4], [2, 10]].forEach(([px, py]) => {
          ctx.beginPath(); ctx.arc(px * s, py * s, 5 * s, 0, Math.PI * 1.5); ctx.stroke();
        });
        break;
      }
      case 'sword': {
        ctx.strokeStyle = '#d0d0f0'; ctx.lineWidth = 3 * s;
        ctx.beginPath(); ctx.moveTo(0, 14 * s); ctx.lineTo(0, -12 * s); ctx.stroke();
        ctx.strokeStyle = '#a0a0c0'; ctx.lineWidth = 2 * s;
        ctx.beginPath(); ctx.moveTo(-8 * s, -2 * s); ctx.lineTo(8 * s, -2 * s); ctx.stroke();
        ctx.fillStyle = '#c0a030'; ctx.beginPath(); ctx.arc(0, -12 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'heal': {
        ctx.fillStyle = '#40ff80';
        ctx.fillRect(-3 * s, -12 * s, 6 * s, 24 * s); ctx.fillRect(-12 * s, -3 * s, 24 * s, 6 * s);
        break;
      }
      case 'shield': {
        ctx.fillStyle = '#d4a820';
        ctx.beginPath(); ctx.moveTo(0, -14 * s); ctx.lineTo(12 * s, -8 * s); ctx.lineTo(12 * s, 4 * s);
        ctx.bezierCurveTo(12 * s, 10 * s, 6 * s, 14 * s, 0, 14 * s); ctx.bezierCurveTo(-6 * s, 14 * s, -12 * s, 10 * s, -12 * s, 4 * s);
        ctx.lineTo(-12 * s, -8 * s); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8b0000';
        ctx.beginPath(); ctx.moveTo(0, -10 * s); ctx.lineTo(9 * s, -5 * s); ctx.lineTo(9 * s, 3 * s);
        ctx.bezierCurveTo(9 * s, 8 * s, 4 * s, 11 * s, 0, 11 * s); ctx.bezierCurveTo(-4 * s, 11 * s, -9 * s, 8 * s, -9 * s, 3 * s);
        ctx.lineTo(-9 * s, -5 * s); ctx.closePath(); ctx.fill();
        break;
      }
    }
    const shine = ctx.createRadialGradient(-4 * s, -4 * s, 0, -4 * s, -4 * s, r * 0.6);
    shine.addColorStop(0, 'rgba(255,255,255,0.25)'); shine.addColorStop(1, 'transparent');
    ctx.fillStyle = shine; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return c.toDataURL();
  },

  makeMinimapTerrain(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2a5a18'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 40)},${50 + Math.floor(Math.random() * 60)},${Math.floor(Math.random() * 20)},0.3)`;
      ctx.beginPath(); ctx.ellipse(Math.random() * w, Math.random() * h, 5 + Math.random() * 20, 5 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(60,40,20,0.5)';
    ctx.fillRect(0, h * 0.48, w, h * 0.04);
    ctx.fillRect(w * 0.48, 0, w * 0.04, h);
    ctx.fillStyle = 'rgba(30,80,150,0.6)';
    ctx.beginPath(); ctx.ellipse(w * 0.15, h * 0.7, w * 0.08, h * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(90,60,30,0.4)';
    ctx.beginPath(); ctx.ellipse(w * 0.75, h * 0.25, w * 0.12, h * 0.15, 0.3, 0, Math.PI * 2); ctx.fill();
    return c.toDataURL();
  },

  makeUIFrame(w, h, style = 'default') {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const styles = {
      default: { bg: ['rgba(20,10,3,0.92)', 'rgba(40,20,6,0.88)'], border: '#b8860b', inner: '#f0c040', corner: '#f0c040' },
      blue: { bg: ['rgba(5,10,30,0.92)', 'rgba(10,20,50,0.88)'], border: '#3060c0', inner: '#60a0ff', corner: '#80c0ff' },
      red: { bg: ['rgba(30,5,5,0.92)', 'rgba(60,10,10,0.88)'], border: '#8b0000', inner: '#cc2020', corner: '#ff4040' },
    };
    const col = styles[style] || styles.default;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, col.bg[0]); grad.addColorStop(1, col.bg[1]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = col.border; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.strokeStyle = `${col.inner}40`; ctx.lineWidth = 1;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    const cs = 8;
    [[0, 0], [w - cs, 0], [0, h - cs], [w - cs, h - cs]].forEach(([cx, cy]) => {
      ctx.fillStyle = col.corner;
      ctx.fillRect(cx, cy, cs, 2); ctx.fillRect(cx, cy, 2, cs);
      if (cx > 0) { ctx.fillRect(cx + cs - 2, cy, 2, cs); }
      if (cy > 0) { ctx.fillRect(cx, cy + cs - 2, cs, 2); }
    });
    return c.toDataURL();
  },
};

// ============================================================
// GAME STATE
// ============================================================
const GameState = {
  tick: 0,
  lastTime: 0,
  animationId: null,
  keys: {},
  touch: { joystick: { active: false, startX: 0, startY: 0, dx: 0, dy: 0 } },
  camera: { x: 0, y: 0 },
  map: { width: 5120, height: 4096, tileSize: 32 },
  mapData: [],
  decorations: [],
  tiles: {},
  sprites: {},
  playerFrames: {},
  player: {
    x: 512, y: 512,
    vx: 0, vy: 0,
    speed: 2.5,
    dir: 'down',
    moving: false,
    animFrame: 0,
    animTimer: 0,
    name: '青雲劍士',
    level: 1,
    hp: 10000, maxHp: 10000,
    mp: 5000, maxMp: 5000,
    atk: 1500, def: 300,
    exp: 0,
    gold: 500,
  },
  monsters: [],
  npcs: [],
  effects: [],
  skills: [
    { name: '炎斬', type: 'fire', cd: 8, cdLeft: 0, icon: null },
    { name: '冰爆', type: 'ice', cd: 10, cdLeft: 0, icon: null },
    { name: '雷霆', type: 'lightning', cd: 6, cdLeft: 0, icon: null },
    { name: '氣功波', type: 'qi', cd: 12, cdLeft: 0, icon: null },
    { name: '疾風步', type: 'wind', cd: 20, cdLeft: 0, icon: null },
    { name: '金剛護甲', type: 'shield', cd: 15, cdLeft: 0, icon: null },
  ],
  buffs: [
    { type: 'positive', icon: '⚔', name: '劍意加持', timer: 600 },
    { type: 'positive', icon: '🛡', name: '護體真氣', timer: 420 },
  ],
  chatMessages: [
    { type: 'system', text: '歡迎來到仙劍天下！請使用WASD移動，技能鍵Q/W/E/R/F/G施展技能！' },
    { type: 'system', text: '【公告】點擊攻擊按鈕或靠近怪物發動攻擊！' },
    { type: 'world', sender: '烈焰天尊', text: '翠玉蛟王BOSS快出了，有人組隊嗎？' },
    { type: 'npc', sender: '青雲長老', text: '年輕人，你終於來了。村子需要你的幫助！' },
  ],
  autoMessages: [
    { type: 'world', sender: '月影刺客', text: '幽冥古城刷圖，求帶3人！' },
    { type: 'system', text: '【提示】靠近NPC按F鍵可以對話並接取任務！' },
    { type: 'world', sender: '天劍孤雁', text: '出售靈玉碎片×10，有意者聯繫！' },
    { type: 'npc', sender: '商人李四海', text: '客官，需要回血丹嗎？老夫這裡應有盡有！' },
    { type: 'system', text: '【提示】靠近典故石碑可以了解世界歷史！' },
    { type: 'world', sender: '赤炎劍客', text: '有人見過BOSS翠玉蛟王嗎？在哪裡重生的？' },
    { type: 'npc', sender: '鐵匠王老爺', text: '帶材料來找老夫，保你武器更上一層樓！' },
    { type: 'system', text: '【系統】使用地圖按鈕可查看所有區域並傳送！' },
  ],
  bosses: [],
  currentRegion: null,
  activeQuests: [],
  completedQuests: [],
  loreStones: [],
};

// ============================================================
// MAP GENERATOR
// ============================================================
const MapGen = {
  generate(state) {
    const { map } = state;
    const cols = Math.floor(map.width / map.tileSize);
    const rows = Math.floor(map.height / map.tileSize);
    const data = [];
    for (let r = 0; r < rows; r++) {
      data[r] = [];
      for (let c = 0; c < cols; c++) {
        const rnd = Math.random();
        const isRoadH = Math.abs(r - Math.floor(rows / 2)) < 2;
        const isRoadV = Math.abs(c - Math.floor(cols / 2)) < 2;
        const isEdge = r < 3 || r > rows - 3 || c < 3 || c > cols - 3;
        if (isRoadH && isRoadV) { data[r][c] = 'road'; }
        else if (isRoadH || isRoadV) { data[r][c] = rnd > 0.15 ? 'road' : 'stone1'; }
        else if (isEdge) { data[r][c] = rnd > 0.3 ? 'grass2' : 'grass3'; }
        else {
          if (rnd > 0.85) data[r][c] = 'grass3';
          else if (rnd > 0.65) data[r][c] = 'grass2';
          else if (rnd > 0.15) data[r][c] = 'grass1';
          else data[r][c] = 'dirt1';
        }
      }
    }
    state.mapData = data;
    // Decorations
    state.decorations = [];
    for (let i = 0; i < 400; i++) {
      const x = 80 + Math.random() * (map.width - 160);
      const y = 80 + Math.random() * (map.height - 160);
      const cx = Math.floor(x / map.tileSize);
      const cy = Math.floor(y / map.tileSize);
      if (!data[cy] || !data[cx]) continue;
      const tile = data[cy] ? data[cy][cx] : 'grass1';
      if (tile === 'road') continue;
      const types = ['tree1', 'tree1', 'tree2', 'rock', 'flower', 'flower'];
      state.decorations.push({ type: types[Math.floor(Math.random() * types.length)], x, y });
    }
    // Base NPCs
    state.npcs = [
      { id: 'npc_base_merchant', name: '旅行商人', type: 'npc_merchant', x: map.width / 2 + 60, y: map.height / 2 - 40, dir: 'down', animFrame: 0, animTimer: 0, fromExpansion: false },
      { id: 'npc_base_guard', name: '衛兵', type: 'npc_guard', x: map.width / 2 - 60, y: map.height / 2 + 20, dir: 'right', animFrame: 0, animTimer: 0, fromExpansion: false },
    ];
    // Base monsters
    state.monsters = [];
    const monsterTypes = [
      { name: '妖狐', level: 5, hp: 2000, maxHp: 2000, atk: 200, def: 50 },
      { name: '幽靈武士', level: 8, hp: 2800, maxHp: 2800, atk: 280, def: 80 },
      { name: '石魔', level: 12, hp: 4000, maxHp: 4000, atk: 380, def: 120 },
      { name: '火精靈', level: 10, hp: 2500, maxHp: 2500, atk: 350, def: 60 },
    ];
    for (let i = 0; i < 30; i++) {
      const mt = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
      state.monsters.push({
        ...mt,
        x: 200 + Math.random() * (map.width - 400),
        y: 200 + Math.random() * (map.height - 400),
        alive: true,
        aggro: false,
        aggroRange: 160,
        attackRange: 50,
        attackCooldown: 0,
        animFrame: 0,
        animTimer: 0,
        hitFlash: 0,
        wanderTimer: 0,
        wanderDir: { x: 0, y: 0 },
      });
    }
  }
};

// ============================================================
// RENDERER
// ============================================================
const Renderer = {
  canvas: null,
  ctx: null,
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },
  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  render(state, dt) {
    const ctx = this.ctx;
    if (!ctx) return;
    const W = this.canvas.width, H = this.canvas.height;
    const { camera, map, player } = state;
    camera.x = player.x - W / 2;
    camera.y = player.y - H / 2;
    camera.x = Math.max(0, Math.min(camera.x, map.width - W));
    camera.y = Math.max(0, Math.min(camera.y, map.height - H));
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    this.renderTiles(state, ctx, camera, W, H);
    this.renderDecorations(state, ctx);
    this.renderMonsters(state, ctx);
    this.renderNPCs(state, ctx);
    this.renderPlayer(state, ctx);
    this.renderEffects(state, ctx, dt);
    ctx.restore();
  },
  renderTiles(state, ctx, camera, W, H) {
    const { map, mapData, tiles } = state;
    const ts = map.tileSize;
    const startCol = Math.max(0, Math.floor(camera.x / ts));
    const endCol = Math.min(mapData[0]?.length || 0, Math.ceil((camera.x + W) / ts) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / ts));
    const endRow = Math.min(mapData.length, Math.ceil((camera.y + H) / ts) + 1);
    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const t = mapData[r] && mapData[r][c];
        if (!t) continue;
        const img = tiles[t];
        if (img) { ctx.drawImage(img, c * ts, r * ts, ts, ts); }
        else { ctx.fillStyle = '#3a7a2a'; ctx.fillRect(c * ts, r * ts, ts, ts); }
      }
    }
  },
  renderDecorations(state, ctx) {
    const { decorations, sprites } = state;
    const sorted = [...decorations].sort((a, b) => a.y - b.y);
    sorted.forEach(d => {
      const img = sprites[d.type];
      if (!img) return;
      switch (d.type) {
        case 'tree1': case 'tree2': ctx.drawImage(img, d.x - 24, d.y - 60, 48, 64); break;
        case 'rock': ctx.drawImage(img, d.x - 16, d.y - 20, 32, 24); break;
        case 'flower': ctx.drawImage(img, d.x - 8, d.y - 18, 16, 20); break;
      }
    });
  },
  renderMonsters(state, ctx) {
    state.monsters.forEach(m => {
      if (!m.alive) return;
      const x = Math.floor(m.x), y = Math.floor(m.y);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(x, y + 12, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (m.hitFlash > 0) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(m.hitFlash * 0.5);
      const bobY = Math.sin(state.tick * 0.05 + m.x * 0.01) * 1.5;
      this.drawMonster(ctx, x, y + bobY, m);
      ctx.globalAlpha = 1;
      // Elite indicator
      if (m.isElite) {
        ctx.fillStyle = 'rgba(100,0,120,0.7)';
        const nw = m.name.length * 7 + 14;
        ctx.fillRect(x - nw / 2, y - 42, nw, 13);
        ctx.font = '9px "Noto Serif SC"'; ctx.fillStyle = '#cc80ff'; ctx.textAlign = 'center';
        ctx.fillText(`★ Lv.${m.level} ${m.name}`, x, y - 32);
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        const nameW = m.name.length * 7 + 10;
        ctx.fillRect(x - nameW / 2, y - 34, nameW, 13);
        ctx.font = '9px "Noto Serif SC"'; ctx.fillStyle = '#ff9090'; ctx.textAlign = 'center';
        ctx.fillText(`Lv.${m.level} ${m.name}`, x, y - 24);
      }
      // HP bar
      const bw = 40, bh = 4;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - bw / 2, y - 20, bw, bh);
      const hpColor = m.isElite ? '#cc00ff' : '#cc2020';
      ctx.fillStyle = hpColor; ctx.fillRect(x - bw / 2, y - 20, bw * (m.hp / m.maxHp), bh);
      ctx.strokeStyle = '#8b0000'; ctx.lineWidth = 0.5; ctx.strokeRect(x - bw / 2, y - 20, bw, bh);
    });
    ctx.textAlign = 'left';
  },
  drawMonster(ctx, x, y, m) {
    const colors = {
      '妖狐': { body: '#cc4070', tail: '#ff80a0', eyes: '#ff2040' },
      '幽靈武士': { body: '#5060c0', tail: '#8090e0', eyes: '#c0d0ff' },
      '石魔': { body: '#707050', tail: '#909070', eyes: '#ffff40' },
      '火精靈': { body: '#d04020', tail: '#ff8040', eyes: '#ffff00' },
    };
    const mc = colors[m.name] || { body: '#808080', tail: '#a0a0a0', eyes: '#ffffff' };
    const animOff = Math.sin(m.animFrame * 0.8) * 2;
    ctx.fillStyle = `${mc.body}33`;
    ctx.beginPath(); ctx.ellipse(x, y + 10, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mc.body;
    ctx.beginPath(); ctx.ellipse(x, y, 10, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(x - 3, y - 5, 5, 6, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mc.body;
    ctx.beginPath(); ctx.ellipse(x, y - 13 + animOff, 8, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mc.eyes;
    ctx.beginPath(); ctx.arc(x - 3, y - 14 + animOff, 2, 0, Math.PI * 2); ctx.arc(x + 3, y - 14 + animOff, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.arc(x - 3, y - 14 + animOff, 1, 0, Math.PI * 2); ctx.arc(x + 3, y - 14 + animOff, 1, 0, Math.PI * 2); ctx.fill();
    if (m.name === '妖狐') {
      ctx.fillStyle = mc.body;
      ctx.beginPath(); ctx.moveTo(x - 6, y - 19 + animOff); ctx.lineTo(x - 10, y - 26 + animOff); ctx.lineTo(x - 2, y - 20 + animOff); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 6, y - 19 + animOff); ctx.lineTo(x + 10, y - 26 + animOff); ctx.lineTo(x + 2, y - 20 + animOff); ctx.fill();
      ctx.strokeStyle = mc.tail; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.quadraticCurveTo(x + 20, y, x + 15, y - 10); ctx.stroke();
    } else if (m.name === '幽靈武士') {
      ctx.fillStyle = `${mc.body}88`;
      ctx.beginPath(); ctx.moveTo(x - 10, y + 8); ctx.bezierCurveTo(x - 12, y + 16, x - 4, y + 18, x, y + 14);
      ctx.bezierCurveTo(x + 4, y + 18, x + 12, y + 16, x + 10, y + 8); ctx.fill();
      ctx.strokeStyle = '#c0c8ff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 10, y - 18 + animOff); ctx.lineTo(x + 10, y + 8); ctx.stroke();
      ctx.fillStyle = '#8090d0'; ctx.fillRect(x + 7, y - 5 + animOff, 6, 2);
    } else if (m.name === '石魔') {
      ctx.fillStyle = mc.tail;
      [[x - 12, y - 5], [x + 12, y - 5], [x - 8, y - 16 + animOff], [x + 8, y - 16 + animOff]].forEach(([rx, ry]) => {
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 3, y - 5); ctx.lineTo(x, y + 3); ctx.lineTo(x + 4, y); ctx.stroke();
    } else if (m.name === '火精靈') {
      ctx.fillStyle = '#ffee40';
      ctx.beginPath(); ctx.moveTo(x, y - 24 + animOff); ctx.bezierCurveTo(x - 5, y - 18 + animOff, x - 8, y - 14 + animOff, x, y - 10 + animOff);
      ctx.bezierCurveTo(x + 8, y - 14 + animOff, x + 5, y - 18 + animOff, x, y - 24 + animOff); ctx.fill();
      ctx.fillStyle = 'rgba(255,120,20,0.6)';
      ctx.beginPath(); ctx.arc(x - 6, y - 8 + animOff, 3, 0, Math.PI * 2); ctx.arc(x + 6, y - 8 + animOff, 3, 0, Math.PI * 2); ctx.fill();
    }
  },
  renderNPCs(state, ctx) {
    state.npcs.forEach(npc => {
      const x = Math.floor(npc.x), y = Math.floor(npc.y);
      const bobY = Math.sin(state.tick * 0.04 + npc.x * 0.02) * 0.8;
      // Draw NPC body
      const img = state.sprites[npc.type] && state.sprites[npc.type][npc.dir || 'down'];
      if (img) { ctx.drawImage(img, x - 16, y - 40 + bobY, 32, 48); }
      else {
        // Fallback NPC rendering
        ctx.fillStyle = npc.type === 'npc_guard' ? '#3060c0' : '#8b4513';
        ctx.beginPath(); ctx.ellipse(x, y - 10, 10, 14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e8b080'; ctx.beginPath(); ctx.ellipse(x, y - 28 + bobY, 8, 9, 0, 0, Math.PI * 2); ctx.fill();
        // Emoji portrait
        ctx.font = '16px serif'; ctx.textAlign = 'center';
        ctx.fillText(npc.emoji || '👤', x, y - 24 + bobY);
        ctx.textAlign = 'left';
      }
      const nameW = npc.name.length * 7 + 14;
      ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(x - nameW / 2, y - 54, nameW, 14);
      ctx.strokeStyle = 'rgba(200,160,40,0.5)'; ctx.lineWidth = 0.5; ctx.strokeRect(x - nameW / 2, y - 54, nameW, 14);
      ctx.font = 'bold 9px "Noto Serif SC"'; ctx.fillStyle = '#ffdd44'; ctx.textAlign = 'center';
      ctx.fillText(npc.name, x, y - 44);
      // Quest indicator
      const hasQuests = npc.quests && npc.quests.length > 0;
      if (hasQuests) {
        ctx.font = '12px serif'; ctx.fillText('！', x, y - 58);
      }
      // Interaction prompt
      const dist = Math.hypot(state.player.x - npc.x, state.player.y - npc.y);
      if (dist < 80) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(x - 22, y - 70, 44, 14);
        ctx.fillStyle = '#ffdd44'; ctx.font = '9px "Noto Serif SC"'; ctx.fillText('[F]對話', x, y - 60);
      }
      ctx.textAlign = 'left';
    });
  },
  renderPlayer(state, ctx) {
    const { player, sprites } = state;
    const x = Math.floor(player.x), y = Math.floor(player.y);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(x, y + 18, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    const img = sprites.player && sprites.player[player.dir];
    if (img) { ctx.drawImage(img, x - 16, y - 38, 32, 48); }
    else {
      ctx.fillStyle = '#3060c0'; ctx.fillRect(x - 10, y - 28, 20, 28);
      ctx.fillStyle = '#e8b080'; ctx.beginPath(); ctx.ellipse(x, y - 32, 9, 10, 0, 0, Math.PI * 2); ctx.fill();
    }
    // HP bar above player
    const bw = 44, bh = 4;
    const hpPct = player.hp / player.maxHp;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - bw / 2, y - 50, bw, bh);
    const hpColor = hpPct > 0.6 ? '#30cc30' : hpPct > 0.3 ? '#cc8020' : '#cc2020';
    ctx.fillStyle = hpColor; ctx.fillRect(x - bw / 2, y - 50, bw * hpPct, bh);
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 0.5; ctx.strokeRect(x - bw / 2, y - 50, bw, bh);
  },
  renderEffects(state, ctx, dt) {
    state.effects = state.effects.filter(e => {
      e.life -= dt;
      if (e.life <= 0) return false;
      const alpha = e.life / e.maxLife;
      ctx.save(); ctx.globalAlpha = alpha;
      const prog = 1 - alpha;
      switch (e.type) {
        case 'fire_slash': {
          ctx.strokeStyle = `rgba(255,${80 + Math.floor(prog * 120)},0,${alpha})`;
          ctx.lineWidth = 4 * alpha;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r * prog, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(255,200,0,${alpha * 0.3})`;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r * prog * 0.6, 0, Math.PI * 2); ctx.fill();
          break;
        }
        case 'ice_nova': {
          ctx.strokeStyle = `rgba(100,200,255,${alpha})`;
          ctx.lineWidth = 3 * alpha;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const r = e.r * prog;
            ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r); ctx.stroke();
          }
          break;
        }
        case 'lightning_bolt': {
          ctx.strokeStyle = `rgba(255,240,80,${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          let lx = e.x, ly = e.y - e.r;
          ctx.moveTo(lx, ly);
          for (let i = 0; i < 6; i++) { lx += (Math.random() - 0.5) * 30; ly += e.r / 3; ctx.lineTo(lx, ly); }
          ctx.stroke();
          break;
        }
        case 'qi_burst': {
          ctx.strokeStyle = `rgba(200,100,255,${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r * prog, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r * prog * 0.5, 0, Math.PI * 2); ctx.stroke();
          break;
        }
        case 'heal_burst': {
          ctx.fillStyle = `rgba(80,255,120,${alpha * 0.4})`;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r * prog, 0, Math.PI * 2); ctx.fill();
          break;
        }
      }
      ctx.restore(); return true;
    });
  },
};

// ============================================================
// MINIMAP RENDERER
// ============================================================
const MinimapRenderer = {
  canvas: null, ctx: null, size: 110, terrainImg: null,
  init(canvasId, state) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.canvas.width = this.size; this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d');
    const terrainData = AssetGen.makeMinimapTerrain(this.size, this.size);
    const img = new Image();
    img.onload = () => { this.terrainImg = img; };
    img.src = terrainData;
  },
  render(state) {
    const ctx = this.ctx; const s = this.size;
    if (!ctx) return;
    const { map, player, npcs, monsters } = state;
    ctx.clearRect(0, 0, s, s);
    ctx.save();
    ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); ctx.clip();
    if (this.terrainImg) { ctx.drawImage(this.terrainImg, 0, 0, s, s); }
    else { ctx.fillStyle = '#2a5a18'; ctx.fillRect(0, 0, s, s); }
    const scaleX = s / map.width, scaleY = s / map.height;
    ctx.strokeStyle = 'rgba(160,130,80,0.6)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, s / 2); ctx.lineTo(s, s / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s / 2, 0); ctx.lineTo(s / 2, s); ctx.stroke();
    monsters.forEach(m => {
      if (!m.alive) return;
      ctx.fillStyle = m.isElite ? '#cc40ff' : '#ff4040';
      ctx.beginPath(); ctx.arc(m.x * scaleX, m.y * scaleY, m.isElite ? 3 : 2, 0, Math.PI * 2); ctx.fill();
    });
    npcs.forEach(n => {
      ctx.fillStyle = '#ffdd44';
      ctx.beginPath(); ctx.arc(n.x * scaleX, n.y * scaleY, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    const px = player.x * scaleX, py = player.y * scaleY;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#40ff80'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.stroke();
    const vx = state.camera.x * scaleX, vy = state.camera.y * scaleY;
    const vw = window.innerWidth * scaleX, vh = window.innerHeight * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.strokeRect(vx, vy, vw, vh);
    ctx.restore();
    ctx.strokeStyle = 'rgba(200,160,40,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s / 2, s / 2, s / 2 - 1, 0, Math.PI * 2); ctx.stroke();
  }
};

// ============================================================
// INPUT HANDLER
// ============================================================
const InputHandler = {
  init(state) {
    window.addEventListener('keydown', e => {
      state.keys[e.key.toLowerCase()] = true;
      const skillKeys = { 'q': 0, 'w': 1, 'e': 2, 'r': 3 };
      if (skillKeys[e.key.toLowerCase()] !== undefined) {
        UIManager.triggerSkill(state, skillKeys[e.key.toLowerCase()]);
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
    });
    window.addEventListener('keyup', e => { state.keys[e.key.toLowerCase()] = false; });
    const joystickArea = document.getElementById('joystick-area');
    if (joystickArea) {
      joystickArea.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.touches[0], rect = joystickArea.getBoundingClientRect();
        state.touch.joystick.active = true;
        state.touch.joystick.startX = touch.clientX - rect.left;
        state.touch.joystick.startY = touch.clientY - rect.top;
        state.touch.joystick.dx = 0; state.touch.joystick.dy = 0;
      }, { passive: false });
      joystickArea.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!state.touch.joystick.active) return;
        const touch = e.touches[0], rect = joystickArea.getBoundingClientRect();
        const dx = (touch.clientX - rect.left) - state.touch.joystick.startX;
        const dy = (touch.clientY - rect.top) - state.touch.joystick.startY;
        const maxR = 40, dist = Math.min(Math.hypot(dx, dy), maxR), angle = Math.atan2(dy, dx);
        state.touch.joystick.dx = Math.cos(angle) * dist / maxR;
        state.touch.joystick.dy = Math.sin(angle) * dist / maxR;
        UIManager.updateJoystickVisual(state.touch.joystick.dx, state.touch.joystick.dy, maxR);
      }, { passive: false });
      const endJoystick = e => {
        e.preventDefault();
        state.touch.joystick.active = false; state.touch.joystick.dx = 0; state.touch.joystick.dy = 0;
        UIManager.resetJoystickVisual();
      };
      joystickArea.addEventListener('touchend', endJoystick, { passive: false });
      joystickArea.addEventListener('touchcancel', endJoystick, { passive: false });
    }
  }
};

// ============================================================
// PHYSICS
// ============================================================
const Physics = {
  update(state, dt) {
    const { player, keys, touch, map } = state;
    let dx = 0, dy = 0;
    if (keys['arrowleft'] || keys['a']) dx -= 1;
    if (keys['arrowright'] || keys['d']) dx += 1;
    if (keys['arrowup'] || keys['w']) dy -= 1;
    if (keys['arrowdown'] || keys['s']) dy += 1;
    if (touch.joystick.active) { dx = touch.joystick.dx; dy = touch.joystick.dy; }
    if (dx !== 0 && dy !== 0) { const len = Math.hypot(dx, dy); dx /= len; dy /= len; }
    player.moving = (dx !== 0 || dy !== 0);
    player.vx = dx * player.speed; player.vy = dy * player.speed;
    if (player.moving) {
      player.x = Math.max(20, Math.min(map.width - 20, player.x + player.vx * 60 * dt));
      player.y = Math.max(20, Math.min(map.height - 20, player.y + player.vy * 60 * dt));
      if (Math.abs(dx) >= Math.abs(dy)) player.dir = dx > 0 ? 'right' : 'left';
      else player.dir = dy > 0 ? 'down' : 'up';
    }
    // Monster AI
    state.monsters.forEach(m => {
      if (!m.alive) return;
      m.animTimer += dt;
      m.wanderTimer -= dt;
      if (m.wanderTimer <= 0) {
        m.wanderTimer = 1 + Math.random() * 3;
        m.wanderDir = { x: (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 1.2 };
      }
      const dist = Math.hypot(state.player.x - m.x, state.player.y - m.y);
      if (dist < m.aggroRange) m.aggro = true;
      if (dist > m.aggroRange * 2) m.aggro = false;
      if (m.aggro) {
        if (dist > m.attackRange) {
          const angle = Math.atan2(state.player.y - m.y, state.player.x - m.x);
          const spd = m.isElite ? 1.4 : 1.0;
          m.x += Math.cos(angle) * spd * 60 * dt;
          m.y += Math.sin(angle) * spd * 60 * dt;
        }
        if (dist < m.attackRange && m.attackCooldown <= 0) {
          m.attackCooldown = m.isElite ? 1.5 : 2.0;
          const dmg = Math.max(0, m.atk - (state.player.def || 0));
          state.player.hp = Math.max(0, state.player.hp - dmg);
          UIManager.addFloatingText && UIManager.addFloatingText(state,
            window.innerWidth / 2 + (Math.random() - 0.5) * 50,
            window.innerHeight / 2,
            `-${dmg}`, '#ff4040'
          );
          UIManager.updateHUD && UIManager.updateHUD(state);
        }
      } else {
        m.x = Math.max(80, Math.min(map.width - 80, m.x + m.wanderDir.x));
        m.y = Math.max(80, Math.min(map.height - 80, m.y + m.wanderDir.y));
      }
      if (m.attackCooldown > 0) m.attackCooldown -= dt;
      if (m.animTimer > 0.15) { m.animFrame = (m.animFrame + 1) % 4; m.animTimer = 0; }
      if (m.hitFlash > 0) m.hitFlash--;
    });
    // MP regen
    if (player.mp < player.maxMp) {
      player.mp = Math.min(player.maxMp, player.mp + 5 * dt);
    }
  },

  autoAttack(state) {
    const px = state.player.x, py = state.player.y;
    const attackRange = 70;
    let nearest = null, nearestDist = Infinity;
    state.monsters.forEach(m => {
      if (!m.alive) return;
      const d = Math.hypot(px - m.x, py - m.y);
      if (d < attackRange && d < nearestDist) { nearestDist = d; nearest = m; }
    });
    if (!nearest) {
      state.monsters.forEach(m => {
        if (!m.alive) return;
        const d = Math.hypot(px - m.x, py - m.y);
        if (d < nearestDist) { nearestDist = d; nearest = m; }
      });
    }
    if (!nearest) return;
    const dmg = Math.floor((state.player.atk || 1000) + Math.random() * 200);
    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(dmg * 2) : dmg;
    nearest.hp -= finalDmg;
    nearest.hitFlash = 8;
    state.effects && state.effects.push({ type: 'fire_slash', x: nearest.x, y: nearest.y, r: 40, angle: 0, life: 0.25, maxLife: 0.25 });
    UIManager.addFloatingText && UIManager.addFloatingText(state,
      nearest.x - state.camera.x + (Math.random() - 0.5) * 40,
      nearest.y - state.camera.y - 30,
      isCrit ? `爆擊! ${finalDmg}` : `-${finalDmg}`,
      isCrit ? '#ffee00' : '#ff8080'
    );
    if (isCrit && UIManager.addChatMessage) {
      UIManager.addChatMessage(state, { type: 'system', text: `【爆擊】對 ${nearest.name} 造成 ${finalDmg} 點傷害！` });
    }
    if (nearest.hp <= 0) {
      nearest.alive = false;
      const expGain = nearest.level * 2;
      state.player.exp = Math.min(100, (state.player.exp || 0) + expGain);
      const goldGain = nearest.level * 10 + Math.floor(Math.random() * nearest.level * 5);
      state.player.gold = (state.player.gold || 0) + goldGain;
      UIManager.updateHUD && UIManager.updateHUD(state);
      if (typeof QuestManager !== 'undefined') {
        QuestManager.onMonsterKill && QuestManager.onMonsterKill(state, nearest.name, nearest.isElite);
        if (nearest.isElite && typeof EliteManager !== 'undefined') {
          EliteManager.onEliteKill && EliteManager.onEliteKill(state, nearest);
        }
      }
      setTimeout(() => {
        nearest.hp = nearest.maxHp; nearest.alive = true;
        const angle = Math.random() * Math.PI * 2;
        nearest.x = state.player.x + Math.cos(angle) * (200 + Math.random() * 200);
        nearest.y = state.player.y + Math.sin(angle) * (200 + Math.random() * 200);
        nearest.x = Math.max(80, Math.min(state.map.width - 80, nearest.x));
        nearest.y = Math.max(80, Math.min(state.map.height - 80, nearest.y));
      }, 8000);
    }
  }
};

// ============================================================
// UI MANAGER
// ============================================================
const UIManager = {
  initSkillButtons(state) {
    const skillEls = document.querySelectorAll('.skill-btn');
    skillEls.forEach((el, i) => {
      if (i >= state.skills.length) return;
      const skill = state.skills[i];
      const iconEl = el.querySelector('.skill-icon-display');
      if (iconEl && skill.icon) {
        const iconImg = document.createElement('img');
        iconImg.src = skill.icon;
        iconImg.style.cssText = 'width:28px;height:28px;image-rendering:pixelated;border-radius:50%;display:block;';
        iconImg.draggable = false;
        iconEl.innerHTML = ''; iconEl.appendChild(iconImg);
      }
      el.addEventListener('click', () => this.triggerSkill(state, i));
      el.addEventListener('touchstart', e => { e.preventDefault(); this.triggerSkill(state, i); }, { passive: false });
    });
    const mainAttack = document.getElementById('main-attack');
    if (mainAttack) {
      mainAttack.addEventListener('click', () => Physics.autoAttack(state));
      mainAttack.addEventListener('touchstart', e => { e.preventDefault(); Physics.autoAttack(state); }, { passive: false });
    }
  },

  triggerSkill(state, index) {
    const skill = state.skills[index];
    if (!skill || skill.cdLeft > 0) return;
    skill.cdLeft = skill.cd;
    const px = state.player.x, py = state.player.y;
    switch (skill.type) {
      case 'fire': state.effects.push({ type: 'fire_slash', x: px, y: py, r: 60, angle: 0, life: 0.5, maxLife: 0.5 }); this.damageMonsters(state, px, py, 80, 1200, 1600); break;
      case 'ice': state.effects.push({ type: 'ice_nova', x: px, y: py, r: 80, life: 0.6, maxLife: 0.6 }); this.damageMonsters(state, px, py, 100, 900, 1200); break;
      case 'lightning': state.effects.push({ type: 'lightning_bolt', x: px, y: py, r: 120, life: 0.4, maxLife: 0.4 }); this.damageMonsters(state, px, py, 60, 1500, 2000); break;
      case 'qi': state.effects.push({ type: 'qi_burst', x: px, y: py, r: 100, life: 0.6, maxLife: 0.6 }); this.damageMonsters(state, px, py, 120, 800, 1000); break;
      case 'wind': state.player.speed = 5; setTimeout(() => { state.player.speed = 2.5; }, 2000); this.addChatMessage(state, { type: 'system', text: '【疾風步】速度大幅提升！' }); break;
      case 'shield': {
        state.effects.push({ type: 'heal_burst', x: px, y: py, r: 50, life: 0.8, maxLife: 0.8 });
        const healAmt = Math.floor(state.player.maxHp * 0.15);
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmt);
        this.addFloatingText(state, window.innerWidth / 2, window.innerHeight / 2, `+${healAmt}`, '#40ff80');
        this.updateHUD(state);
        break;
      }
    }
    const skillEl = document.querySelectorAll('.skill-btn')[index];
    if (skillEl) { skillEl.classList.add('on-cooldown', 'skill-active-flash'); setTimeout(() => skillEl.classList.remove('skill-active-flash'), 200); }
    state.player.mp = Math.max(0, state.player.mp - 80);
    this.updateHUD(state);
    if (typeof checkLevelUp === 'function') checkLevelUp(state);
  },

  damageMonsters(state, x, y, radius, minDmg, maxDmg) {
    state.monsters.forEach(m => {
      if (!m.alive) return;
      const dist = Math.hypot(m.x - x, m.y - y);
      if (dist < radius) {
        const dmg = Math.floor(minDmg + Math.random() * (maxDmg - minDmg));
        m.hp -= dmg; m.hitFlash = 8;
        this.addFloatingText(state, m.x - state.camera.x + (Math.random() - 0.5) * 30, m.y - state.camera.y - 20, `-${dmg}`, '#ffaa00');
        if (m.hp <= 0 && m.alive) {
          m.alive = false;
          state.player.exp = Math.min(100, (state.player.exp || 0) + m.level * 2);
          state.player.gold = (state.player.gold || 0) + m.level * 8;
          this.updateHUD(state);
          if (typeof QuestManager !== 'undefined') {
            QuestManager.onMonsterKill && QuestManager.onMonsterKill(state, m.name, m.isElite);
            if (m.isElite && typeof EliteManager !== 'undefined') {
              EliteManager.onEliteKill && EliteManager.onEliteKill(state, m);
            }
          }
          setTimeout(() => {
            m.hp = m.maxHp; m.alive = true;
            m.x = x + (Math.random() - 0.5) * 400; m.y = y + (Math.random() - 0.5) * 400;
            m.x = Math.max(80, Math.min(state.map.width - 80, m.x)); m.y = Math.max(80, Math.min(state.map.height - 80, m.y));
          }, 10000);
        }
      }
    });
  },

  updateJoystickVisual(dx, dy, maxR) {
    const thumb = document.getElementById('joystick-thumb');
    if (thumb) thumb.style.transform = `translate(calc(-50% + ${dx * maxR}px), calc(-50% + ${dy * maxR}px))`;
  },
  resetJoystickVisual() {
    const thumb = document.getElementById('joystick-thumb');
    if (thumb) thumb.style.transform = 'translate(-50%, -50%)';
  },

  updateHUD(state) {
    const { player } = state;
    const hpPct = (player.hp / player.maxHp * 100).toFixed(1);
    const hpBar = document.getElementById('hp-bar'); if (hpBar) hpBar.style.width = hpPct + '%';
    const hpVal = document.getElementById('hp-value'); if (hpVal) hpVal.textContent = `${Math.floor(player.hp).toLocaleString()}/${player.maxHp.toLocaleString()}`;
    const mpPct = (player.mp / player.maxMp * 100).toFixed(1);
    const mpBar = document.getElementById('mp-bar'); if (mpBar) mpBar.style.width = mpPct + '%';
    const mpVal = document.getElementById('mp-value'); if (mpVal) mpVal.textContent = `${Math.floor(player.mp).toLocaleString()}/${player.maxMp.toLocaleString()}`;
    const expBar = document.getElementById('exp-bar'); if (expBar) expBar.style.width = (player.exp || 0) + '%';
    const expVal = document.getElementById('exp-value'); if (expVal) expVal.textContent = Math.floor(player.exp || 0) + '%';
    const goldEl = document.getElementById('gold-display'); if (goldEl) goldEl.textContent = (player.gold || 0).toLocaleString();
    const lvlEl = document.getElementById('lvl-display'); if (lvlEl) lvlEl.textContent = player.level;
    const badge = document.getElementById('level-badge'); if (badge) badge.textContent = player.level;
    const atkEl = document.getElementById('atk-value'); if (atkEl) atkEl.textContent = player.atk;
    const defEl = document.getElementById('def-value'); if (defEl) defEl.textContent = player.def;
    const invGold = document.getElementById('inv-gold'); if (invGold) invGold.textContent = (player.gold || 0).toLocaleString();
  },

  updateSkillCooldowns(state, dt) {
    const skillEls = document.querySelectorAll('.skill-btn');
    state.skills.forEach((skill, i) => {
      if (skill.cdLeft > 0) {
        skill.cdLeft = Math.max(0, skill.cdLeft - dt);
        const cdEl = document.getElementById(`cd-${i}`);
        if (cdEl) cdEl.textContent = skill.cdLeft > 0 ? Math.ceil(skill.cdLeft) : '';
        if (skill.cdLeft === 0 && skillEls[i]) skillEls[i].classList.remove('on-cooldown');
      }
    });
  },

  addChatMessage(state, msg) {
    if (!state.chatMessages) state.chatMessages = [];
    state.chatMessages.push(msg);
    if (state.chatMessages.length > 50) state.chatMessages.shift();
    const chatEl = document.getElementById('chat-messages');
    if (!chatEl) return;
    const div = document.createElement('div');
    div.className = `chat-message ${msg.type || 'normal'}`;
    if (msg.sender) { div.innerHTML = `<span class="chat-sender">[${msg.sender}]</span> ${msg.text}`; }
    else { div.textContent = msg.text; }
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
    while (chatEl.children.length > 30) chatEl.removeChild(chatEl.firstChild);
  },

  addFloatingText(state, screenX, screenY, text, color) {
    const container = document.getElementById('ui-layer') || document.body;
    const el = document.createElement('div');
    el.className = 'floating-text' + (text.includes('爆擊') ? ' critical' : '');
    el.textContent = text;
    el.style.color = color || '#ff4040';
    el.style.left = (screenX + (Math.random() - 0.5) * 40) + 'px';
    el.style.top = (screenY - 20) + 'px';
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1500);
  },

  initBuffBar(state) {
    const buffBar = document.getElementById('buff-bar');
    if (!buffBar) return;
    buffBar.innerHTML = '';
    state.buffs.forEach(b => {
      const div = document.createElement('div');
      div.className = `buff-icon buff-${b.type}`;
      div.innerHTML = `${b.icon}<span class="buff-timer">${b.timer}s</span>`;
      div.title = b.name;
      buffBar.appendChild(div);
    });
  },

  updateBuffTimers(state) {
    const buffIcons = document.querySelectorAll('.buff-icon .buff-timer');
    buffIcons.forEach((el, i) => {
      if (state.buffs[i]) {
        state.buffs[i].timer = Math.max(0, state.buffs[i].timer - 1 / 60);
        el.textContent = Math.ceil(state.buffs[i].timer) + 's';
      }
    });
  },

  initPanels(state) {
    document.querySelector('.qb-bag')?.addEventListener('click', () => {
      const p = document.getElementById('inventory-panel'); if (p) { p.classList.toggle('visible'); this.populateInventory(state); }
    });
    document.querySelector('.qb-quest')?.addEventListener('click', () => {
      const p = document.getElementById('quest-panel'); if (p) p.classList.toggle('visible');
    });
    document.getElementById('qb-map')?.addEventListener('click', () => {
      const p = document.getElementById('region-map-panel'); if (p) p.classList.toggle('visible');
    });
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.game-panel')?.classList.remove('visible'));
    });
    const npcPanel = document.getElementById('npc-dialog-panel');
    if (npcPanel) {
      npcPanel.querySelector('.panel-close')?.addEventListener('click', () => {
        npcPanel.classList.remove('visible');
        if (typeof NPCDialogManager !== 'undefined') NPCDialogManager.currentNPC = null;
      });
    }
    const chatSend = document.querySelector('.chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    if (chatSend && chatInput) {
      chatSend.addEventListener('click', () => {
        if (chatInput.value.trim()) {
          this.addChatMessage(state, { type: 'normal', sender: state.player.name, text: chatInput.value.trim() });
          chatInput.value = '';
        }
      });
      chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') chatSend.click(); });
    }
  },

  populateInventory(state) {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const baseItems = [
      { name: '初學者長劍', icon: '⚔️', rarity: 'common', qty: 1 },
      { name: '回血丹', icon: '💊', rarity: 'common', qty: 15 },
      { name: '靈石', icon: '🔷', rarity: 'common', qty: 8 },
      { name: '狐妖靈珠', icon: '🔮', rarity: 'uncommon', qty: 2 },
    ];
    for (let i = 0; i < 15; i++) {
      const slot = document.createElement('div');
      const item = baseItems[i];
      slot.className = `inv-slot item-rarity-${item ? item.rarity : 'common'}`;
      if (item) {
        slot.innerHTML = `<div class="inv-item-icon">${item.icon}</div><div class="inv-item-qty">${item.qty > 1 ? item.qty : ''}</div>`;
        slot.title = `${item.name} [${item.rarity}]`;
      }
      grid.appendChild(slot);
    }
  },

  startAutoChatMessages(state) {
    let msgIndex = 0;
    setInterval(() => {
      const msg = state.autoMessages[msgIndex % state.autoMessages.length];
      if (msg) this.addChatMessage(state, msg);
      msgIndex++;
    }, 5000 + Math.random() * 3000);
  }
};

// ============================================================
// ASSET LOADER
// ============================================================
const AssetLoader = {
  async loadAll(state) {
    const tileTypes = ['grass1', 'grass2', 'grass3', 'dirt1', 'road', 'stone1', 'stone2', 'water'];
    await Promise.all(tileTypes.map(t => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.tiles[t] = img; resolve(); };
      img.onerror = resolve;
      img.src = AssetGen.makeTile(t);
    })));
    const decoTypes = ['tree1', 'tree2', 'rock', 'flower'];
    await Promise.all(decoTypes.map(t => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.sprites[t] = img; resolve(); };
      img.onerror = resolve;
      const src = t === 'tree1' ? AssetGen.makeTree(1) : t === 'tree2' ? AssetGen.makeTree(2) : t === 'rock' ? AssetGen.makeRock() : AssetGen.makeFlower();
      img.src = src;
    })));
    const dirs = ['down', 'up', 'left', 'right'];
    state.sprites.player = {};
    await Promise.all(dirs.map(dir => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.sprites.player[dir] = img; resolve(); };
      img.onerror = resolve;
      img.src = AssetGen.makeCharacterFrame(dir, 1, 'player');
    })));
    for (const npcType of ['npc_merchant', 'npc_guard']) {
      state.sprites[npcType] = {};
      await Promise.all(dirs.map(dir => new Promise(resolve => {
        const img = new Image();
        img.onload = () => { state.sprites[npcType][dir] = img; resolve(); };
        img.onerror = resolve;
        img.src = AssetGen.makeCharacterFrame(dir, 0, npcType);
      })));
    }
    state.skills.forEach(skill => { skill.icon = AssetGen.makeSkillIcon(skill.type, 48); });
    const avatarCanvas = document.getElementById('avatar-canvas');
    if (avatarCanvas) {
      const img = new Image();
      img.onload = () => { const ctx = avatarCanvas.getContext('2d'); avatarCanvas.width = 60; avatarCanvas.height = 60; ctx.drawImage(img, 0, 0, 60, 60); };
      img.src = AssetGen.makeAvatar();
    }
    state.playerFrames = {};
    for (const dir of dirs) {
      state.playerFrames[dir] = [];
      for (let frame = 0; frame < 4; frame++) {
        await new Promise(resolve => {
          const img = new Image();
          img.onload = () => { state.playerFrames[dir][frame] = img; resolve(); };
          img.onerror = resolve;
          img.src = AssetGen.makeCharacterFrame(dir, frame, 'player');
        });
      }
    }
  }
};

// ============================================================
// ANIMATION SYSTEM
// ============================================================
const AnimSystem = {
  update(state, dt) {
    state.tick++;
    state.player.animTimer += dt;
    if (state.player.moving) {
      if (state.player.animTimer > 0.12) {
        state.player.animFrame = (state.player.animFrame + 1) % 4;
        state.player.animTimer = 0;
        if (state.playerFrames) {
          const frames = state.playerFrames[state.player.dir];
          if (frames && frames[state.player.animFrame]) state.sprites.player[state.player.dir] = frames[state.player.animFrame];
        }
      }
    } else { state.player.animFrame = 0; state.player.animTimer = 0; }
  }
};

// ============================================================
// AMBIENT PARTICLES
// ============================================================
const AmbientSystem = {
  particles: [], maxParticles: 25,
  spawn(state) {
    if (this.particles.length >= this.maxParticles) return;
    const cam = state.camera, W = window.innerWidth, H = window.innerHeight;
    const types = ['leaf', 'firefly', 'dust'];
    const t = types[Math.floor(Math.random() * types.length)];
    this.particles.push({
      x: cam.x + Math.random() * W, y: cam.y + Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: -0.2 - Math.random() * 0.3,
      life: 1, maxLife: 3 + Math.random() * 4, size: 2 + Math.random() * 3,
      type: t,
      color: t === 'leaf' ? `hsl(${100 + Math.random() * 60},70%,40%)` : t === 'firefly' ? `hsl(${50 + Math.random() * 40},100%,70%)` : `rgba(200,180,140,0.5)`,
      angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.1,
    });
  },
  update(state) {
    if (Math.random() < 0.1) this.spawn(state);
    this.particles = this.particles.filter(p => {
      p.x += p.vx; p.y += p.vy; p.life -= 1 / 180; p.angle += p.spin;
      if (p.type === 'leaf') p.vx += Math.sin(p.angle * 2) * 0.02;
      if (p.type === 'firefly') { p.vy += Math.sin(p.angle) * 0.05; p.vx += Math.cos(p.angle) * 0.05; }
      return p.life > 0;
    });
  },
  render(ctx, state) {
    const cam = state.camera;
    this.particles.forEach(p => {
      ctx.save(); ctx.globalAlpha = p.life * 0.7;
      ctx.translate(p.x - cam.x, p.y - cam.y); ctx.rotate(p.angle);
      if (p.type === 'firefly') {
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
        g.addColorStop(0, p.color); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2); ctx.fill();
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.restore();
    });
  }
};

// ============================================================
// LEVEL UP SYSTEM
// ============================================================
function checkLevelUp(state) {
  if ((state.player.exp || 0) >= 100) {
    state.player.exp = 0;
    state.player.level++;
    state.player.maxHp += 200; state.player.hp = state.player.maxHp;
    state.player.maxMp += 100; state.player.mp = state.player.maxMp;
    state.player.atk += 150; state.player.def += 50;
    const notifArea = document.getElementById('notification-area');
    if (notifArea) {
      const div = document.createElement('div');
      div.className = 'system-notification';
      div.innerHTML = `✨ 升級！等級 ${state.player.level} ✨`;
      notifArea.appendChild(div);
      setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 3000);
    }
    UIManager.addChatMessage(state, { type: 'system', text: `【恭喜】你已升至 ${state.player.level} 級！氣血、靈力全滿！` });
    UIManager.updateHUD(state);
  }
}

// ============================================================
// MAIN GAME LOOP
// ============================================================
function gameLoop(timestamp) {
  const state = GameState;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.05);
  state.lastTime = timestamp;
  Physics.update(state, dt);
  AnimSystem.update(state, dt);
  AmbientSystem.update(state);
  Renderer.render(state, dt);
  // Patch ambient particles into renderer output
  if (Renderer.ctx) {
    AmbientSystem.render(Renderer.ctx, state);
  }
  MinimapRenderer.render(state);
  UIManager.updateSkillCooldowns(state, dt);
  UIManager.updateBuffTimers(state);
  checkLevelUp(state);
  state.animationId = requestAnimationFrame(gameLoop);
}

// ============================================================
// LOADING SCREEN
// ============================================================
async function showLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const progress = document.getElementById('loading-progress');
  const status = document.getElementById('loading-status');
  const steps = [
    { pct: 8, text: '連接伺服器...' },
    { pct: 18, text: '載入世界數據...' },
    { pct: 30, text: '生成地形紋理...' },
    { pct: 45, text: '載入角色精靈...' },
    { pct: 58, text: '初始化技能系統...' },
    { pct: 70, text: '載入NPC模型...' },
    { pct: 80, text: '載入副本數據...' },
    { pct: 88, text: '初始化BOSS系統...' },
    { pct: 94, text: '渲染UI界面...' },
    { pct: 100, text: '進入仙劍天下！' },
  ];
  for (const step of steps) {
    if (progress) progress.style.width = step.pct + '%';
    if (status) status.textContent = step.text;
    await new Promise(r => setTimeout(r, 120 + Math.random() * 180));
  }
  await new Promise(r => setTimeout(r, 400));
  if (screen) { screen.classList.add('fade-out'); setTimeout(() => { screen.style.display = 'none'; }, 800); }
}

// ============================================================
// GAME INITIALIZATION
// ============================================================
async function initGame() {
  const state = GameState;
  showLoadingScreen();
  Renderer.init('world-canvas');
  MapGen.generate(state);
  await AssetLoader.loadAll(state);
  MinimapRenderer.init('minimap-canvas', state);
  InputHandler.init(state);
  UIManager.initSkillButtons(state);
  UIManager.initBuffBar(state);
  UIManager.updateHUD(state);
  UIManager.initPanels(state);
  UIManager.startAutoChatMessages(state);
  state.chatMessages.forEach(msg => UIManager.addChatMessage(state, msg));
  state.lastTime = performance.now();
  state.animationId = requestAnimationFrame(gameLoop);
  // World ticker
  const ticker = document.querySelector('.ticker-text');
  if (ticker) {
    ticker.textContent = '【世界】歡迎來到仙劍天下！  ◆  【系統】全新區域：血色沼澤、天極仙山開放！  ◆  【公告】BOSS翠玉蛟王、幽冥魔君等待勇者挑戰！  ◆  【提示】使用地圖按鈕可查看所有區域並快速傳送！';
  }
  // Key hint
  const hint = document.createElement('div');
  hint.style.cssText = 'position:fixed;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.6);border:1px solid rgba(200,160,40,0.3);border-radius:4px;padding:3px 10px;font-size:9px;color:rgba(200,180,120,0.7);font-family:"Noto Serif SC",serif;pointer-events:none;z-index:100;white-space:nowrap;';
  hint.textContent = 'WASD/方向鍵移動 · Q/W/E/R/F/G 技能 · F鍵對話 · 攻擊按鈕攻擊';
  document.getElementById('ui-layer')?.appendChild(hint);
  setTimeout(() => { hint.style.transition = 'opacity 1s ease'; hint.style.opacity = '0'; setTimeout(() => hint.remove(), 1000); }, 7000);
}

// Start
document.addEventListener('DOMContentLoaded', () => { initGame(); });
