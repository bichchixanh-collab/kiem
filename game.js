/* ============================================================
   CHINESE FANTASY MMORPG - GAME.JS
   Full Game Engine - Vanilla JavaScript
   ============================================================ */

'use strict';

// ============================================================
// ASSET GENERATOR - Creates all PNG assets via canvas
// ============================================================

const AssetGen = {
  // Generate a complete tile texture as data URL
  makeTile(type, size = 32) {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');

    switch(type) {
      case 'grass1': {
        // Base grass
        ctx.fillStyle = '#3a7a2a';
        ctx.fillRect(0, 0, size, size);
        // Texture variation
        for(let i = 0; i < 40; i++) {
          const x = Math.random()*size, y = Math.random()*size;
          const g = ctx.createRadialGradient(x,y,0,x,y,3);
          g.addColorStop(0, 'rgba(50,110,30,0.6)');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.fillRect(0,0,size,size);
        }
        // Grass blades
        for(let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${40+Math.random()*30},${120+Math.random()*40},${20+Math.random()*20},0.7)`;
          ctx.lineWidth = 1;
          const bx = Math.random()*size, by = Math.random()*size;
          ctx.moveTo(bx, by+4);
          ctx.quadraticCurveTo(bx+(Math.random()*4-2), by, bx+(Math.random()*3-1), by-4);
          ctx.stroke();
        }
        break;
      }
      case 'grass2': {
        ctx.fillStyle = '#2d6b20';
        ctx.fillRect(0, 0, size, size);
        for(let i = 0; i < 35; i++) {
          const x = Math.random()*size, y = Math.random()*size;
          ctx.fillStyle = `rgba(${30+Math.floor(Math.random()*40)},${80+Math.floor(Math.random()*50)},${15+Math.floor(Math.random()*25)},0.5)`;
          ctx.fillRect(x, y, 2+Math.random()*3, 2+Math.random()*3);
        }
        for(let i = 0; i < 6; i++) {
          ctx.fillStyle = 'rgba(80,140,40,0.5)';
          ctx.beginPath();
          ctx.arc(Math.random()*size, Math.random()*size, 1+Math.random()*2, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      }
      case 'grass3': {
        ctx.fillStyle = '#4a9030';
        ctx.fillRect(0, 0, size, size);
        for(let i = 0; i < 25; i++) {
          ctx.fillStyle = `rgba(${60+Math.floor(Math.random()*40)},${130+Math.floor(Math.random()*60)},${20+Math.floor(Math.random()*30)},0.6)`;
          const rx = Math.random()*size, ry = Math.random()*size;
          ctx.beginPath();
          ctx.ellipse(rx, ry, 2+Math.random()*3, 1+Math.random()*2, Math.random()*Math.PI, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      }
      case 'stone1': {
        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(0, 0, size, size);
        // Stone tiles pattern
        const tw = 16, th = 16;
        const offsets = [[0,0],[tw,th],[0,th],[tw,0]];
        offsets.forEach(([ox,oy]) => {
          ctx.fillStyle = `rgba(${100+Math.floor(Math.random()*30)},${90+Math.floor(Math.random()*25)},${80+Math.floor(Math.random()*20)},0.7)`;
          ctx.fillRect(ox+1, oy+1, tw-2, th-2);
          // Grout lines
          ctx.fillStyle = 'rgba(50,40,35,0.6)';
          ctx.fillRect(ox, oy, tw, 1);
          ctx.fillRect(ox, oy, 1, th);
        });
        // Highlights
        for(let i = 0; i < 15; i++) {
          ctx.fillStyle = 'rgba(200,190,180,0.2)';
          ctx.fillRect(Math.random()*size, Math.random()*size, 1+Math.random()*2, 1);
        }
        break;
      }
      case 'stone2': {
        ctx.fillStyle = '#706050';
        ctx.fillRect(0, 0, size, size);
        // Random stone chunks
        for(let i = 0; i < 8; i++) {
          const sx = Math.random()*size, sy = Math.random()*size;
          const sw = 4+Math.random()*8, sh = 3+Math.random()*6;
          ctx.fillStyle = `rgba(${90+Math.floor(Math.random()*40)},${80+Math.floor(Math.random()*30)},${70+Math.floor(Math.random()*25)},0.7)`;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(sx, sy, sw, sh, 1) : ctx.rect(sx, sy, sw, sh);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(40,30,25,0.4)';
        ctx.lineWidth = 0.5;
        for(let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random()*size, Math.random()*size);
          ctx.lineTo(Math.random()*size, Math.random()*size);
          ctx.stroke();
        }
        break;
      }
      case 'dirt1': {
        ctx.fillStyle = '#6b4a28';
        ctx.fillRect(0, 0, size, size);
        for(let i = 0; i < 30; i++) {
          const dr = Math.random();
          ctx.fillStyle = dr > 0.5
            ? `rgba(${80+Math.floor(Math.random()*30)},${55+Math.floor(Math.random()*25)},${25+Math.floor(Math.random()*20)},0.5)`
            : `rgba(50,35,15,0.4)`;
          ctx.beginPath();
          ctx.ellipse(Math.random()*size, Math.random()*size, 1+Math.random()*4, 1+Math.random()*2, Math.random()*Math.PI, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      }
      case 'road': {
        // Stone path tile
        ctx.fillStyle = '#a09080';
        ctx.fillRect(0, 0, size, size);
        // Individual cobblestones
        const stones = [
          [2,2,12,10], [15,1,13,8], [1,13,10,11], [13,12,15,12],
          [2,25,12,6], [15,22,14,9]
        ];
        stones.forEach(([x,y,w,h]) => {
          if(y+h > size) h = size-y-1;
          ctx.fillStyle = `rgba(${130+Math.floor(Math.random()*30)},${115+Math.floor(Math.random()*25)},${100+Math.floor(Math.random()*20)},0.9)`;
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(x+1, y+1, w-2, 2);
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(x, y+h-1, w, 1);
        });
        // Grout
        ctx.fillStyle = 'rgba(60,50,40,0.5)';
        for(let i = 0; i < 5; i++) {
          ctx.fillRect(Math.random()*size, Math.random()*size, 1, 1);
        }
        break;
      }
      case 'water': {
        ctx.fillStyle = '#1a5a8a';
        ctx.fillRect(0, 0, size, size);
        // Shimmer
        for(let i = 0; i < 4; i++) {
          const x = Math.random()*size;
          const g = ctx.createLinearGradient(x,0,x+8,size);
          g.addColorStop(0,'rgba(80,160,220,0.3)');
          g.addColorStop(0.5,'rgba(40,120,180,0.1)');
          g.addColorStop(1,'rgba(80,160,220,0.3)');
          ctx.fillStyle = g;
          ctx.fillRect(0,0,size,size);
        }
        // Ripples
        for(let i = 0; i < 3; i++) {
          ctx.strokeStyle = 'rgba(120,200,255,0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(Math.random()*size, Math.random()*size, 4+Math.random()*4, 2+Math.random()*2, 0, 0, Math.PI*2);
          ctx.stroke();
        }
        break;
      }
    }
    return c.toDataURL();
  },

  // Generate character sprite frames
  makeCharacterFrame(direction, frame, type = 'player') {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 48;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const walkOffset = (frame === 1) ? -1 : (frame === 3) ? 1 : 0;
    const legSwing = frame === 1 ? 3 : frame === 3 ? -3 : 0;

    if(type === 'player') {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 46, 8, 3, 0, 0, Math.PI*2);
      ctx.fill();

      // Legs/feet
      ctx.fillStyle = '#4a3060';
      ctx.fillRect(12+legSwing, 34+walkOffset, 5, 10);
      ctx.fillRect(15-legSwing, 34-walkOffset, 5, 10);

      // Boot
      ctx.fillStyle = '#2a1840';
      ctx.fillRect(11+legSwing, 42+walkOffset, 7, 3);
      ctx.fillRect(14-legSwing, 42-walkOffset, 7, 3);

      // Robe body
      const robeGrad = ctx.createLinearGradient(8, 15, 24, 40);
      robeGrad.addColorStop(0, '#c05050');
      robeGrad.addColorStop(0.4, '#902030');
      robeGrad.addColorStop(1, '#601020');
      ctx.fillStyle = robeGrad;
      ctx.beginPath();
      ctx.moveTo(8, 18);
      ctx.lineTo(24, 18);
      ctx.lineTo(26, 36);
      ctx.lineTo(6, 36);
      ctx.closePath();
      ctx.fill();

      // Robe trim - gold
      ctx.fillStyle = '#d4a820';
      ctx.fillRect(8, 18, 16, 1);
      ctx.fillRect(8, 33, 16, 1);
      ctx.fillRect(15, 18, 1, 16); // center line
      // Trim detail
      for(let i = 0; i < 4; i++) {
        ctx.fillRect(9+i*4, 18, 1, 2);
      }

      // Arms
      ctx.fillStyle = '#a04040';
      if(direction === 'left') {
        ctx.fillRect(22, 19, 5, 12);
        ctx.fillRect(5, 20+walkOffset, 5, 11);
      } else if(direction === 'right') {
        ctx.fillRect(3, 19, 5, 12);
        ctx.fillRect(22, 20+walkOffset, 5, 11);
      } else {
        ctx.fillRect(4, 19+walkOffset, 5, 11);
        ctx.fillRect(23, 19-walkOffset, 5, 11);
      }

      // Hands
      ctx.fillStyle = '#e8c090';
      if(direction === 'left') {
        ctx.fillRect(23, 30, 4, 4);
        ctx.fillRect(6, 30+walkOffset, 4, 4);
      } else if(direction === 'right') {
        ctx.fillRect(4, 30, 4, 4);
        ctx.fillRect(23, 30+walkOffset, 4, 4);
      } else {
        ctx.fillRect(4, 29+walkOffset, 4, 4);
        ctx.fillRect(24, 29-walkOffset, 4, 4);
      }

      // Neck
      ctx.fillStyle = '#e8c090';
      ctx.fillRect(14, 12, 4, 7);

      // Head base
      const headGrad = ctx.createRadialGradient(16, 8, 1, 16, 9, 8);
      headGrad.addColorStop(0, '#f0cca0');
      headGrad.addColorStop(0.7, '#d8a870');
      headGrad.addColorStop(1, '#b07840');
      ctx.fillStyle = headGrad;
      ctx.fillRect(10, 4, 12, 12);

      // Hat - Chinese style
      ctx.fillStyle = '#1a0808';
      ctx.fillRect(8, 3, 16, 3);
      ctx.fillRect(10, 0, 12, 5);
      ctx.fillStyle = '#d4a820';
      ctx.fillRect(8, 5, 16, 1);
      ctx.fillRect(11, 1, 10, 1);
      // Hat ornament
      ctx.fillStyle = '#ff6040';
      ctx.beginPath();
      ctx.arc(16, 0, 2, 0, Math.PI*2);
      ctx.fill();

      // Face details
      if(direction !== 'up') {
        ctx.fillStyle = '#2a1808';
        // Eyes
        if(direction === 'left') {
          ctx.fillRect(17, 8, 2, 2);
          ctx.fillRect(14, 9, 1, 1);
        } else if(direction === 'right') {
          ctx.fillRect(11, 8, 2, 2);
          ctx.fillRect(16, 9, 1, 1);
        } else {
          ctx.fillRect(12, 8, 2, 2);
          ctx.fillRect(18, 8, 2, 2);
          // Brows
          ctx.fillStyle = '#301808';
          ctx.fillRect(12, 7, 2, 1);
          ctx.fillRect(18, 7, 2, 1);
        }
        // Mouth
        ctx.fillStyle = '#b07050';
        ctx.fillRect(14, 13, 4, 1);
      }

      // Sword (on back or side)
      ctx.fillStyle = '#c0c0d0';
      ctx.fillRect(24, 10, 2, 22);
      ctx.fillStyle = '#8080a0';
      ctx.fillRect(24, 31, 2, 4);
      ctx.fillStyle = '#d4a820';
      ctx.fillRect(22, 15, 6, 2);

      // Aura glow bottom
      ctx.fillStyle = 'rgba(180,100,200,0.2)';
      ctx.beginPath();
      ctx.ellipse(16, 45, 10, 4, 0, 0, Math.PI*2);
      ctx.fill();

    } else if(type === 'npc_merchant') {
      // NPC merchant
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(16, 46, 8, 3, 0, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = '#4a3010';
      ctx.fillRect(12, 34, 4, 10);
      ctx.fillRect(16, 34, 4, 10);

      const robeG = ctx.createLinearGradient(8,15,24,40);
      robeG.addColorStop(0,'#d4a020');
      robeG.addColorStop(1,'#8a6010');
      ctx.fillStyle = robeG;
      ctx.fillRect(8,18,16,17);

      ctx.fillStyle = '#8a5010';
      ctx.fillRect(3,20,5,12);
      ctx.fillRect(24,20,5,12);

      ctx.fillStyle = '#e8c090';
      ctx.fillRect(14,12,4,7);
      ctx.fillRect(10,4,12,12);

      ctx.fillStyle = '#2a1008';
      ctx.fillRect(9,2,14,4);
      ctx.fillRect(11,0,10,4);
      ctx.fillStyle = '#ff8020';
      ctx.fillRect(9,4,14,1);

      ctx.fillStyle = '#2a1808';
      ctx.fillRect(12,8,2,2);
      ctx.fillRect(18,8,2,2);
      ctx.fillStyle = '#b07050';
      ctx.fillRect(13,13,5,1);

    } else if(type === 'npc_guard') {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 46, 8, 3, 0, 0, Math.PI*2);
      ctx.fill();

      // Armor legs
      ctx.fillStyle = '#506070';
      ctx.fillRect(11, 34, 5, 11);
      ctx.fillRect(16, 34, 5, 11);

      // Armor body
      const armorG = ctx.createLinearGradient(8,14,24,38);
      armorG.addColorStop(0,'#7080a0');
      armorG.addColorStop(0.5,'#506080');
      armorG.addColorStop(1,'#304050');
      ctx.fillStyle = armorG;
      ctx.fillRect(8,18,16,17);

      // Armor plate detail
      ctx.fillStyle = 'rgba(160,180,200,0.4)';
      ctx.fillRect(10,20,12,2);
      ctx.fillRect(10,24,12,2);
      ctx.fillRect(10,28,12,2);

      ctx.fillStyle = '#607090';
      ctx.fillRect(3,19,5,13);
      ctx.fillRect(24,19,5,13);

      ctx.fillStyle = '#e8c090';
      ctx.fillRect(14,12,4,7);
      ctx.fillRect(10,4,12,12);

      // Helmet
      ctx.fillStyle = '#506070';
      ctx.fillRect(9,1,14,6);
      ctx.fillStyle = '#607090';
      ctx.fillRect(10,0,12,4);
      ctx.fillStyle = 'rgba(160,200,220,0.5)';
      ctx.fillRect(11,7,10,4);
      ctx.fillStyle = '#2a1808';
      ctx.fillRect(12,8,2,2);
      ctx.fillRect(18,8,2,2);

      // Spear
      ctx.fillStyle = '#8a6030';
      ctx.fillRect(25, 5, 2, 38);
      ctx.fillStyle = '#c0c0d0';
      ctx.fillRect(23, 2, 6, 8);
      ctx.beginPath();
      ctx.moveTo(26,0); ctx.lineTo(23,8); ctx.lineTo(29,8);
      ctx.fillStyle = '#e0e0f0'; ctx.fill();
    }

    return c.toDataURL();
  },

  // Generate tree sprites
  makeTree(type = 1) {
    const c = document.createElement('canvas');
    c.width = 48; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(24, 62, 14, 5, 0, 0, Math.PI*2);
    ctx.fill();

    if(type === 1) {
      // Pine/Chinese style tree
      // Trunk
      const trunkG = ctx.createLinearGradient(20,38,28,62);
      trunkG.addColorStop(0,'#6a4020');
      trunkG.addColorStop(1,'#3a2010');
      ctx.fillStyle = trunkG;
      ctx.fillRect(20,42,8,20);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(23,42,2,20);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(20,42,2,20);

      // Foliage layers
      const colors = [
        ['#1a6010','#2a8020','#3aa030'],
        ['#156010','#258020','#35a028'],
        ['#106010','#208018','#30a020'],
      ];
      [[0,22,32,20],[4,14,28,18],[8,8,24,16],[12,2,20,14]].forEach(([x,y,w,h],i) => {
        const gc = ctx.createLinearGradient(x,y,x+w,y+h);
        const ci = Math.min(i, colors.length-1);
        gc.addColorStop(0, colors[ci][2]);
        gc.addColorStop(0.5, colors[ci][1]);
        gc.addColorStop(1, colors[ci][0]);
        ctx.fillStyle = gc;
        ctx.beginPath();
        ctx.ellipse(x+w/2, y+h/2, w/2, h/2, 0, 0, Math.PI*2);
        ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.ellipse(x+w/2-2, y+h/3, w/4, h/4, -0.3, 0, Math.PI*2);
        ctx.fill();
      });

      // Flowers/blossom dots
      for(let i = 0; i < 6; i++) {
        ctx.fillStyle = ['#ff8080','#ff6060','#ffaaaa'][i%3];
        ctx.beginPath();
        ctx.arc(10+Math.random()*28, 8+Math.random()*24, 1+Math.random()*1.5, 0, Math.PI*2);
        ctx.fill();
      }

    } else if(type === 2) {
      // Broad deciduous tree
      const trunkG2 = ctx.createLinearGradient(20,40,28,64);
      trunkG2.addColorStop(0,'#5a3818');
      trunkG2.addColorStop(1,'#2a1808');
      ctx.fillStyle = trunkG2;
      ctx.fillRect(19,44,10,20);

      // Large round canopy
      const canopyG = ctx.createRadialGradient(24,24,2,24,24,20);
      canopyG.addColorStop(0,'#3a9830');
      canopyG.addColorStop(0.5,'#2a7820');
      canopyG.addColorStop(1,'#1a5010');
      ctx.fillStyle = canopyG;
      ctx.beginPath();
      ctx.arc(24, 24, 20, 0, Math.PI*2);
      ctx.fill();

      // Sub-canopy clusters
      for(let i = 0; i < 5; i++) {
        const angle = (i/5)*Math.PI*2;
        const rx = 24+Math.cos(angle)*12, ry = 24+Math.sin(angle)*10;
        ctx.fillStyle = '#2a7820';
        ctx.beginPath();
        ctx.arc(rx, ry, 8, 0, Math.PI*2);
        ctx.fill();
      }

      // Top highlight
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.ellipse(20,18,8,5,-0.4,0,Math.PI*2);
      ctx.fill();
    }

    return c.toDataURL();
  },

  // Generate rocks
  makeRock() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 24;
    const ctx = c.getContext('2d');

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(16, 22, 12, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Main rock body
    const rockG = ctx.createLinearGradient(4,4,28,20);
    rockG.addColorStop(0, '#a09080');
    rockG.addColorStop(0.4, '#808070');
    rockG.addColorStop(1, '#504840');
    ctx.fillStyle = rockG;
    ctx.beginPath();
    ctx.moveTo(6,18); ctx.lineTo(2,12); ctx.lineTo(5,6);
    ctx.lineTo(12,3); ctx.lineTo(20,4); ctx.lineTo(28,8);
    ctx.lineTo(30,15); ctx.lineTo(26,19); ctx.lineTo(6,18);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = 'rgba(200,190,180,0.4)';
    ctx.beginPath();
    ctx.moveTo(7,7); ctx.lineTo(14,4); ctx.lineTo(20,6); ctx.lineTo(15,9); ctx.lineTo(7,7);
    ctx.closePath();
    ctx.fill();

    // Cracks
    ctx.strokeStyle = 'rgba(40,30,25,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(14,8); ctx.lineTo(12,14); ctx.lineTo(15,18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20,7); ctx.lineTo(22,12);
    ctx.stroke();

    return c.toDataURL();
  },

  // Generate flower decorations
  makeFlower() {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 20;
    const ctx = c.getContext('2d');

    // Stem
    ctx.strokeStyle = '#2a7020';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8,18); ctx.lineTo(8,8);
    ctx.stroke();

    // Petals
    const petalColors = ['#ff8080','#ffaaaa','#ff6060','#ff9090'];
    const numPetals = 5;
    for(let i = 0; i < numPetals; i++) {
      const angle = (i/numPetals)*Math.PI*2;
      ctx.fillStyle = petalColors[i%petalColors.length];
      ctx.beginPath();
      ctx.ellipse(8+Math.cos(angle)*4, 8+Math.sin(angle)*4, 2.5, 2, angle, 0, Math.PI*2);
      ctx.fill();
    }

    // Center
    ctx.fillStyle = '#ffee20';
    ctx.beginPath();
    ctx.arc(8,8,2,0,Math.PI*2);
    ctx.fill();

    return c.toDataURL();
  },

  // Generate UI frames
  makeUIFrame(w, h, style = 'brown') {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    const colors = {
      brown: { bg: 'rgba(25,12,4,0.92)', border: '#8b6010', inner: '#d4a020', corner: '#f0c040' },
      red: { bg: 'rgba(30,5,5,0.92)', border: '#8b1010', inner: '#d04020', corner: '#ff8040' },
      blue: { bg: 'rgba(5,12,30,0.92)', border: '#102888', inner: '#2050d0', corner: '#40a0ff' },
    };
    const col = colors[style] || colors.brown;

    // Background
    const bg = ctx.createLinearGradient(0,0,w,h);
    bg.addColorStop(0, col.bg);
    bg.addColorStop(1, 'rgba(10,5,2,0.96)');
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,w,h);

    // Outer border
    ctx.strokeStyle = col.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(1,1,w-2,h-2);

    // Inner border
    ctx.strokeStyle = col.inner;
    ctx.lineWidth = 1;
    ctx.strokeRect(4,4,w-8,h-8);

    // Corner ornaments
    const cs = 12;
    [[0,0],[w-cs,0],[0,h-cs],[w-cs,h-cs]].forEach(([cx,cy]) => {
      ctx.fillStyle = col.corner;
      ctx.fillRect(cx, cy, cs, 2);
      ctx.fillRect(cx, cy, 2, cs);
      if(cx > 0) { ctx.fillRect(cx+cs-2, cy, 2, cs); }
      if(cy > 0) { ctx.fillRect(cx, cy+cs-2, cs, 2); }
    });

    // Center decorative line
    ctx.strokeStyle = `${col.inner}80`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w/2-30,6); ctx.lineTo(w/2+30,6);
    ctx.moveTo(w/2-30,h-6); ctx.lineTo(w/2+30,h-6);
    ctx.stroke();

    return c.toDataURL();
  },

  // Generate skill icons
  makeSkillIcon(type, size = 48) {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const cx = size/2, cy = size/2, r = size/2-2;

    // Background circle
    const bgGrads = {
      fire: ['#ff6030','#660000'],
      ice: ['#40b0ff','#003080'],
      lightning: ['#f0e040','#604000'],
      qi: ['#c060ff','#400080'],
      wind: ['#40e080','#004030'],
      sword: ['#c0c0e0','#303060'],
      heal: ['#40ff80','#004020'],
      shield: ['#ffa040','#604000'],
    };
    const [c1,c2] = bgGrads[type] || bgGrads.fire;
    const bg = ctx.createRadialGradient(cx*0.7,cy*0.7,1,cx,cy,r);
    bg.addColorStop(0, c1);
    bg.addColorStop(1, c2);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fill();

    // Rim
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx,cy);

    const s = size/48;

    switch(type) {
      case 'fire': {
        // Flame shape
        ctx.fillStyle = '#ffee00';
        ctx.beginPath();
        ctx.moveTo(0,12*s); ctx.bezierCurveTo(-6*s,5*s,-12*s,-2*s,0,-14*s);
        ctx.bezierCurveTo(4*s,-8*s,8*s,-4*s,6*s,0);
        ctx.bezierCurveTo(10*s,-6*s,14*s,-2*s,8*s,12*s);
        ctx.bezierCurveTo(4*s,8*s,-4*s,8*s,0,12*s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ff8020';
        ctx.beginPath();
        ctx.moveTo(0,10*s); ctx.bezierCurveTo(-4*s,4*s,-8*s,0,0,-10*s);
        ctx.bezierCurveTo(3*s,-4*s,6*s,2*s,4*s,10*s);
        ctx.bezierCurveTo(2*s,8*s,-2*s,8*s,0,10*s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,200,0.8)';
        ctx.beginPath();
        ctx.ellipse(0,-4*s,2*s,4*s,0,0,Math.PI*2);
        ctx.fill();
        break;
      }
      case 'ice': {
        // Snowflake/crystal
        ctx.strokeStyle = 'rgba(180,230,255,0.9)';
        ctx.lineWidth = 2*s;
        for(let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((i/6)*Math.PI*2);
          ctx.beginPath();
          ctx.moveTo(0,0); ctx.lineTo(0,13*s);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-4*s,7*s); ctx.lineTo(0,9*s); ctx.lineTo(4*s,7*s);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(120,200,255,0.9)';
        ctx.beginPath();
        ctx.arc(0,0,3*s,0,Math.PI*2);
        ctx.fill();
        // Icicles
        for(let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((i/6)*Math.PI*2+(Math.PI/6));
          ctx.fillStyle = 'rgba(160,220,255,0.5)';
          ctx.beginPath();
          ctx.moveTo(-1.5*s,8*s); ctx.lineTo(1.5*s,8*s); ctx.lineTo(0,14*s);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        break;
      }
      case 'lightning': {
        // Lightning bolt
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(4*s,-14*s); ctx.lineTo(-2*s,-2*s); ctx.lineTo(4*s,-2*s);
        ctx.lineTo(-2*s,14*s); ctx.lineTo(8*s,0); ctx.lineTo(2*s,0);
        ctx.lineTo(8*s,-14*s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,240,100,0.8)';
        ctx.beginPath();
        ctx.moveTo(3*s,-12*s); ctx.lineTo(-1*s,-3*s); ctx.lineTo(3*s,-3*s);
        ctx.lineTo(-1*s,11*s); ctx.lineTo(6*s,1*s); ctx.lineTo(2*s,1*s);
        ctx.lineTo(6*s,-12*s);
        ctx.closePath();
        ctx.fill();
        // Spark particles
        ctx.fillStyle = 'rgba(255,255,200,0.8)';
        [[-8,-5],[9,-3],[-9,4],[8,6]].forEach(([px,py])=>{
          ctx.beginPath();
          ctx.arc(px*s,py*s,1.5*s,0,Math.PI*2);
          ctx.fill();
        });
        break;
      }
      case 'qi': {
        // Yin-yang / qi energy spiral
        ctx.strokeStyle = 'rgba(200,120,255,0.9)';
        ctx.lineWidth = 2*s;
        for(let i = 0; i < 3; i++) {
          ctx.save();
          ctx.rotate(i*Math.PI*2/3);
          ctx.beginPath();
          for(let t = 0; t < Math.PI*2; t += 0.1) {
            const rs = (4+8*t/(Math.PI*2))*s;
            const x = Math.cos(t)*rs, y = Math.sin(t)*rs;
            t === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
          }
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(220,160,255,0.9)';
        ctx.beginPath();
        ctx.arc(0,0,3*s,0,Math.PI*2);
        ctx.fill();
        // Energy orbs
        for(let i = 0; i < 3; i++) {
          const a = (i/3)*Math.PI*2;
          ctx.fillStyle = 'rgba(180,100,255,0.8)';
          ctx.beginPath();
          ctx.arc(Math.cos(a)*8*s, Math.sin(a)*8*s, 2.5*s, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      }
      case 'wind': {
        // Wind swirl
        ctx.strokeStyle = 'rgba(100,240,140,0.9)';
        ctx.lineWidth = 2.5*s;
        ctx.lineCap = 'round';
        for(let i = 0; i < 3; i++) {
          ctx.save();
          ctx.rotate(i*Math.PI*2/3);
          ctx.beginPath();
          ctx.arc(0,5*s,7*s, Math.PI*1.2, Math.PI*2.2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(80,220,120,0.8)';
        ctx.beginPath();
        ctx.arc(0,0,3*s,0,Math.PI*2);
        ctx.fill();
        break;
      }
      case 'sword': {
        // Sword icon
        ctx.fillStyle = '#e0e0f0';
        ctx.beginPath();
        ctx.moveTo(0,-14*s); ctx.lineTo(3*s,-10*s); ctx.lineTo(2*s,4*s);
        ctx.lineTo(-2*s,4*s); ctx.lineTo(-3*s,-10*s);
        ctx.closePath();
        ctx.fill();
        // Guard
        ctx.fillStyle = '#d4a820';
        ctx.fillRect(-8*s, 3*s, 16*s, 3*s);
        // Handle
        ctx.fillStyle = '#8a4020';
        ctx.fillRect(-2*s, 6*s, 4*s, 8*s);
        ctx.fillStyle = '#d4a820';
        ctx.fillRect(-3*s, 6*s, 6*s, 1.5*s);
        ctx.fillRect(-3*s, 12.5*s, 6*s, 1.5*s);
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(-0.5*s,-13*s); ctx.lineTo(0.5*s,-13*s); ctx.lineTo(1.5*s,3*s); ctx.lineTo(-0.5*s,3*s);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'heal': {
        // Heal cross with sparkle
        ctx.fillStyle = '#80ff80';
        ctx.fillRect(-3.5*s,-12*s,7*s,24*s);
        ctx.fillRect(-12*s,-3.5*s,24*s,7*s);
        ctx.fillStyle = 'rgba(200,255,200,0.7)';
        ctx.fillRect(-2*s,-10*s,4*s,20*s);
        ctx.fillRect(-10*s,-2*s,20*s,4*s);
        // Sparkles
        [[-8,-8],[8,-8],[-8,8],[8,8]].forEach(([px,py])=>{
          ctx.fillStyle = 'rgba(255,255,200,0.8)';
          ctx.beginPath();
          ctx.moveTo(px*s,(py-3)*s); ctx.lineTo((px+1)*s,py*s); ctx.lineTo(px*s,(py+3)*s); ctx.lineTo((px-1)*s,py*s);
          ctx.closePath();
          ctx.fill();
        });
        break;
      }
      case 'shield': {
        // Shield
        ctx.fillStyle = '#d4a820';
        ctx.beginPath();
        ctx.moveTo(0,-14*s); ctx.lineTo(12*s,-8*s); ctx.lineTo(12*s,4*s);
        ctx.bezierCurveTo(12*s,10*s,6*s,14*s,0,14*s);
        ctx.bezierCurveTo(-6*s,14*s,-12*s,10*s,-12*s,4*s);
        ctx.lineTo(-12*s,-8*s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(0,-10*s); ctx.lineTo(9*s,-5*s); ctx.lineTo(9*s,3*s);
        ctx.bezierCurveTo(9*s,8*s,4*s,11*s,0,11*s);
        ctx.bezierCurveTo(-4*s,11*s,-9*s,8*s,-9*s,3*s);
        ctx.lineTo(-9*s,-5*s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,180,50,0.8)';
        ctx.beginPath();
        ctx.moveTo(0,-7*s); ctx.lineTo(2*s,-3*s); ctx.lineTo(6*s,-2*s);
        ctx.lineTo(3*s,2*s); ctx.lineTo(4*s,6*s); ctx.lineTo(0,4*s);
        ctx.lineTo(-4*s,6*s); ctx.lineTo(-3*s,2*s); ctx.lineTo(-6*s,-2*s);
        ctx.lineTo(-2*s,-3*s);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    // Shine overlay
    const shine = ctx.createRadialGradient(-4*s,-4*s,0,-4*s,-4*s,r*0.6);
    shine.addColorStop(0,'rgba(255,255,255,0.25)');
    shine.addColorStop(1,'transparent');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(0,0,r,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
    return c.toDataURL();
  },

  // Generate minimap terrain
  makeMinimapTerrain(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Base grassland
    ctx.fillStyle = '#2a5a18';
    ctx.fillRect(0,0,w,h);

    // Noise-based terrain patches
    for(let i = 0; i < 30; i++) {
      const x = Math.random()*w, y = Math.random()*h;
      const r = 8+Math.random()*20;
      const g = ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(40,80,20,0.6)');
      g.addColorStop(1,'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }

    // Roads
    ctx.strokeStyle = '#9a8060';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w*0.2,h*0.5); ctx.lineTo(w*0.8,h*0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w*0.5,h*0.1); ctx.lineTo(w*0.5,h*0.9);
    ctx.stroke();

    // Water area
    ctx.fillStyle = 'rgba(30,80,140,0.6)';
    ctx.beginPath();
    ctx.ellipse(w*0.15,h*0.2,15,10,0.3,0,Math.PI*2);
    ctx.fill();

    // Dark trees at edges
    ctx.fillStyle = 'rgba(10,40,8,0.7)';
    for(let i = 0; i < 12; i++) {
      const side = Math.random();
      let tx, ty;
      if(side < 0.25) { tx=Math.random()*w; ty=Math.random()*15; }
      else if(side < 0.5) { tx=Math.random()*w; ty=h-Math.random()*15; }
      else if(side < 0.75) { tx=Math.random()*15; ty=Math.random()*h; }
      else { tx=w-Math.random()*15; ty=Math.random()*h; }
      ctx.beginPath();
      ctx.arc(tx,ty,4+Math.random()*4,0,Math.PI*2);
      ctx.fill();
    }

    return c.toDataURL();
  },

  // Generate avatar portrait
  makeAvatar() {
    const c = document.createElement('canvas');
    c.width = 60; c.height = 60;
    const ctx = c.getContext('2d');

    // Background
    const bg = ctx.createRadialGradient(20,20,2,30,30,30);
    bg.addColorStop(0,'#3a2010');
    bg.addColorStop(1,'#1a0808');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(30,30,30,0,Math.PI*2);
    ctx.fill();

    // Character bust
    // Body robe
    ctx.fillStyle = '#902030';
    ctx.beginPath();
    ctx.moveTo(10,60); ctx.lineTo(10,40); ctx.lineTo(30,32); ctx.lineTo(50,40); ctx.lineTo(50,60);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d4a820';
    ctx.fillRect(10,40,40,2);
    ctx.fillRect(28,32,4,20);

    // Neck
    ctx.fillStyle = '#e8c090';
    ctx.fillRect(26,26,8,10);

    // Head
    const faceG = ctx.createRadialGradient(27,22,2,30,23,10);
    faceG.addColorStop(0,'#f0cca0');
    faceG.addColorStop(0.7,'#d8a870');
    faceG.addColorStop(1,'#b07840');
    ctx.fillStyle = faceG;
    ctx.fillRect(20,14,20,16);

    // Hair/hat
    ctx.fillStyle = '#1a0808';
    ctx.fillRect(18,12,24,5);
    ctx.fillRect(20,8,20,7);
    ctx.fillStyle = '#d4a820';
    ctx.fillRect(18,15,24,1);
    ctx.fillRect(21,9,18,1);
    ctx.fillStyle = '#ff4040';
    ctx.beginPath();
    ctx.arc(30,7,3,0,Math.PI*2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2a1808';
    ctx.fillRect(23,20,3,3);
    ctx.fillRect(34,20,3,3);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(24,20,1,1);
    ctx.fillRect(35,20,1,1);

    // Brows
    ctx.fillStyle = '#301808';
    ctx.fillRect(22,19,5,1);
    ctx.fillRect(33,19,5,1);

    // Mouth - slight smile
    ctx.strokeStyle = '#b07050';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(30,27,3,0.1*Math.PI,0.9*Math.PI);
    ctx.stroke();

    return c.toDataURL();
  },

  // Generate particle/effect assets
  makeParticle(type) {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    const cx = 8, cy = 8;

    switch(type) {
      case 'spark': {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,7);
        g.addColorStop(0,'rgba(255,220,100,1)');
        g.addColorStop(0.4,'rgba(255,120,20,0.8)');
        g.addColorStop(1,'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0,0,16,16);
        break;
      }
      case 'ice_shard': {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,7);
        g.addColorStop(0,'rgba(180,230,255,1)');
        g.addColorStop(0.5,'rgba(60,140,220,0.7)');
        g.addColorStop(1,'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0,0,16,16);
        break;
      }
      case 'heal_orb': {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,7);
        g.addColorStop(0,'rgba(120,255,140,1)');
        g.addColorStop(0.5,'rgba(20,180,60,0.7)');
        g.addColorStop(1,'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0,0,16,16);
        break;
      }
    }
    return c.toDataURL();
  }
};

// ============================================================
// GAME STATE
// ============================================================

const GameState = {
  player: {
    x: 800, y: 600,
    hp: 4820, maxHp: 6200,
    mp: 2340, maxMp: 3600,
    exp: 42, maxExp: 100,
    level: 47,
    name: '劍仙無痕',
    class: '劍客',
    atk: 3842,
    def: 1256,
    spd: 188,
    vx: 0, vy: 0,
    speed: 2.5,
    dir: 'down',
    animFrame: 0,
    animTimer: 0,
    moving: false,
    gold: 98420,
    gems: 168,
  },
  camera: { x: 0, y: 0 },
  map: {
    width: 2000,
    height: 1500,
    tileSize: 32,
    name: '翠玉仙境',
    subName: 'Jade Immortal Realm',
    server: '青龍一服',
  },
  npcs: [],
  monsters: [],
  keys: {},
  touch: { joystick: { active: false, startX: 0, startY: 0, dx: 0, dy: 0 } },
  skills: [
    { id: 's1', name: '烈焰斬', type: 'fire', icon: null, cd: 4, cdLeft: 0, damage: '1200-1600', desc: '召喚烈焰斬擊', key: 'Q' },
    { id: 's2', name: '寒冰破', type: 'ice', icon: null, cd: 6, cdLeft: 0, damage: '900-1200', desc: '凍結目標', key: 'W' },
    { id: 's3', name: '雷霆擊', type: 'lightning', icon: null, cd: 8, cdLeft: 0, damage: '1500-2000', desc: '連鎖閃電', key: 'E' },
    { id: 's4', name: '紫氣東來', type: 'qi', icon: null, cd: 12, cdLeft: 0, damage: '800-1000', desc: '氣功衝擊', key: 'R' },
    { id: 's5', name: '疾風步', type: 'wind', icon: null, cd: 15, cdLeft: 0, damage: '0', desc: '瞬間移動', key: 'F' },
    { id: 's6', name: '玄龍護盾', type: 'shield', icon: null, cd: 20, cdLeft: 0, damage: '0', desc: '護盾吸收傷害', key: 'G' },
  ],
  buffs: [
    { icon: '⚡', name: '雷霆祝福', timer: 180, type: 'positive' },
    { icon: '🌊', name: '冰心決', timer: 94, type: 'positive' },
    { icon: '❤️', name: '氣血充盈', timer: 230, type: 'positive' },
  ],
  effects: [],
  floatingTexts: [],
  chatMessages: [
    { type: 'system', text: '【系統】歡迎來到翠玉仙境！' },
    { type: 'world', sender: '天外飛仙', text: '收42服裝圖紙，高價！' },
    { type: 'npc', sender: '守衛陳刀', text: '進入禁地需要通行令。' },
    { type: 'normal', sender: '月影千殤', text: '大佬帶我啊😭' },
    { type: 'guild', sender: '【龍騎士團】', text: '今晚21:00攻城戰！' },
    { type: 'system', text: '【世界】玩家 烈焰戰神 擊殺了BOSS 暗龍王！' },
    { type: 'trade', sender: '商人', text: '靈石×100 = 500金幣，快來！' },
  ],
  autoMessages: [
    { type: 'world', sender: '天降神器', text: '出售神級武器！加我' },
    { type: 'system', text: '【系統】雙倍經驗活動開始！剩餘1小時' },
    { type: 'guild', sender: '【神風幫主】', text: '招收高戰力成員！' },
    { type: 'normal', sender: '小白菜', text: '有沒有人帶新手副本？' },
    { type: 'system', text: '【公告】維護預告：今晚00:00停機30分鐘' },
    { type: 'world', sender: '暗黑戰士', text: '收購靈獸蛋 出高價！' },
    { type: 'npc', sender: '長老張三豐', text: '年輕人，你的修為已達化境，可以挑戰下一境界了！' },
    { type: 'trade', sender: '丹藥商人', text: '大還丹×10 特惠！限時半小時' },
  ],
  tiles: {},
  sprites: { player: {}, npcs: {} },
  decorations: [],
  mapData: [],
  animationId: null,
  lastTime: 0,
  tick: 0,
  minimapTerrain: null,
  combatActive: false,
  targetMonster: null,
  autoAttackTimer: 0,
};

// ============================================================
// MAP GENERATOR
// ============================================================

const MapGen = {
  generate(state) {
    const { map } = state;
    const cols = Math.ceil(map.width / map.tileSize);
    const rows = Math.ceil(map.height / map.tileSize);
    const data = [];

    for(let r = 0; r < rows; r++) {
      data[r] = [];
      for(let c = 0; c < cols; c++) {
        const rnd = Math.random();
        // Roads
        const isRoadH = (r === Math.floor(rows/2) || r === Math.floor(rows/2)+1);
        const isRoadV = (c === Math.floor(cols/2) || c === Math.floor(cols/2)+1);
        const isEdge = (r < 2 || r > rows-3 || c < 2 || c > cols-3);

        if(isRoadH && isRoadV) {
          data[r][c] = 'road';
        } else if(isRoadH || isRoadV) {
          data[r][c] = rnd > 0.15 ? 'road' : 'stone1';
        } else if(isEdge) {
          data[r][c] = rnd > 0.3 ? 'grass2' : 'grass3';
        } else {
          if(rnd > 0.85) data[r][c] = 'grass3';
          else if(rnd > 0.65) data[r][c] = 'grass2';
          else if(rnd > 0.15) data[r][c] = 'grass1';
          else data[r][c] = 'dirt1';
        }
      }
    }

    state.mapData = data;

    // Generate decorations
    state.decorations = [];
    for(let i = 0; i < 80; i++) {
      const x = 80 + Math.random()*(map.width-160);
      const y = 80 + Math.random()*(map.height-160);
      const rnd = Math.random();
      let type;
      if(rnd < 0.3) type = 'tree1';
      else if(rnd < 0.5) type = 'tree2';
      else if(rnd < 0.65) type = 'rock';
      else type = 'flower';
      state.decorations.push({ x, y, type });
    }

    // Generate NPCs
    state.npcs = [
      { x: 820, y: 500, type: 'npc_merchant', name: '靈丹商人', hp: 100, maxHp: 100, dir: 'down', animFrame: 0 },
      { x: 920, y: 520, type: 'npc_guard', name: '守護將軍', hp: 100, maxHp: 100, dir: 'down', animFrame: 0 },
      { x: 700, y: 600, type: 'npc_merchant', name: '裝備鑄造師', hp: 100, maxHp: 100, dir: 'right', animFrame: 0 },
      { x: 900, y: 650, type: 'npc_guard', name: '境界守衛', hp: 100, maxHp: 100, dir: 'left', animFrame: 0 },
    ];

    // Generate monsters
    state.monsters = [];
    const monsterTypes = [
      { name: '妖狐', hp: 1200, maxHp: 1200, level: 45, color: '#ff6080', reward: 80 },
      { name: '幽靈武士', hp: 2400, maxHp: 2400, level: 48, color: '#8080ff', reward: 150 },
      { name: '石魔', hp: 1800, maxHp: 1800, level: 46, color: '#808060', reward: 100 },
      { name: '火精靈', hp: 1500, maxHp: 1500, level: 47, color: '#ff8040', reward: 120 },
    ];
    for(let i = 0; i < 20; i++) {
      const mt = monsterTypes[Math.floor(Math.random()*monsterTypes.length)];
      state.monsters.push({
        x: 200 + Math.random()*(map.width-400),
        y: 200 + Math.random()*(map.height-400),
        ...mt,
        hp: mt.maxHp,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5,
        dir: 'down',
        animFrame: 0,
        animTimer: 0,
        wanderTimer: Math.random()*180,
        alive: true,
        hitFlash: 0,
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
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  render(state, dt) {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const { camera, map, player } = state;

    // Update camera
    camera.x = player.x - W/2;
    camera.y = player.y - H/2;
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

    for(let r = startRow; r < endRow; r++) {
      for(let c = startCol; c < endCol; c++) {
        const tileType = mapData[r]?.[c] || 'grass1';
        const img = tiles[tileType];
        if(img) {
          ctx.drawImage(img, c*ts, r*ts, ts, ts);
        } else {
          // Fallback solid color
          const colors = { grass1:'#3a7a2a', grass2:'#2d6b20', grass3:'#4a9030', dirt1:'#6b4a28', road:'#a09080', stone1:'#8a7a6a', water:'#1a5a8a' };
          ctx.fillStyle = colors[tileType] || '#3a7a2a';
          ctx.fillRect(c*ts, r*ts, ts, ts);
        }
      }
    }
  },

  renderDecorations(state, ctx) {
    const { decorations, sprites } = state;
    // Sort by y for depth
    const sorted = [...decorations].sort((a,b) => a.y - b.y);
    sorted.forEach(d => {
      const img = sprites[d.type];
      if(!img) return;
      switch(d.type) {
        case 'tree1': case 'tree2':
          ctx.drawImage(img, d.x-24, d.y-60, 48, 64);
          break;
        case 'rock':
          ctx.drawImage(img, d.x-16, d.y-20, 32, 24);
          break;
        case 'flower':
          ctx.drawImage(img, d.x-8, d.y-18, 16, 20);
          break;
      }
    });
  },

  renderMonsters(state, ctx) {
    state.monsters.forEach(m => {
      if(!m.alive) return;

      const x = Math.floor(m.x), y = Math.floor(m.y);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(x, y+12, 10, 4, 0, 0, Math.PI*2);
      ctx.fill();

      // Monster body - stylized pixel art
      if(m.hitFlash > 0) {
        ctx.globalAlpha = 0.5 + 0.5*Math.sin(m.hitFlash*0.5);
      }

      const bobY = Math.sin(state.tick * 0.05 + m.x * 0.01) * 1.5;
      this.drawMonster(ctx, x, y + bobY, m);

      ctx.globalAlpha = 1;

      // Name label
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      const nameW = m.name.length * 7 + 10;
      ctx.fillRect(x - nameW/2, y-34, nameW, 13);
      ctx.font = '9px "Noto Serif SC"';
      ctx.fillStyle = '#ff9090';
      ctx.textAlign = 'center';
      ctx.fillText(`Lv.${m.level} ${m.name}`, x, y-24);

      // HP bar
      const bw = 40, bh = 4;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x-bw/2, y-20, bw, bh);
      ctx.fillStyle = '#cc2020';
      ctx.fillRect(x-bw/2, y-20, bw*(m.hp/m.maxHp), bh);
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x-bw/2, y-20, bw, bh);
    });
    ctx.textAlign = 'left';
  },

  drawMonster(ctx, x, y, m) {
    // Each monster type gets a distinct look
    const colors = {
      '妖狐': { body: '#cc4070', tail: '#ff80a0', eyes: '#ff2040' },
      '幽靈武士': { body: '#5060c0', tail: '#8090e0', eyes: '#c0d0ff' },
      '石魔': { body: '#707050', tail: '#909070', eyes: '#ffff40' },
      '火精靈': { body: '#d04020', tail: '#ff8040', eyes: '#ffff00' },
    };
    const mc = colors[m.name] || { body: '#808080', tail: '#a0a0a0', eyes: '#ffffff' };

    // Shadow aura
    ctx.fillStyle = `${mc.body}33`;
    ctx.beginPath();
    ctx.ellipse(x, y+10, 14, 5, 0, 0, Math.PI*2);
    ctx.fill();

    const animOff = Math.sin(m.animFrame * 0.8) * 2;

    // Body
    ctx.fillStyle = mc.body;
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 12, 0, 0, Math.PI*2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(x-3, y-5, 5, 6, -0.4, 0, Math.PI*2);
    ctx.fill();

    // Head
    ctx.fillStyle = mc.body;
    ctx.beginPath();
    ctx.ellipse(x, y-13+animOff, 8, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Eyes glow
    ctx.fillStyle = mc.eyes;
    ctx.beginPath();
    ctx.arc(x-3, y-14+animOff, 2, 0, Math.PI*2);
    ctx.arc(x+3, y-14+animOff, 2, 0, Math.PI*2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.arc(x-3, y-14+animOff, 1, 0, Math.PI*2);
    ctx.arc(x+3, y-14+animOff, 1, 0, Math.PI*2);
    ctx.fill();

    // Type-specific details
    if(m.name === '妖狐') {
      // Ears
      ctx.fillStyle = mc.body;
      ctx.beginPath();
      ctx.moveTo(x-6, y-19+animOff); ctx.lineTo(x-10, y-26+animOff); ctx.lineTo(x-2, y-20+animOff);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x+6, y-19+animOff); ctx.lineTo(x+10, y-26+animOff); ctx.lineTo(x+2, y-20+animOff);
      ctx.fill();
      // Tail
      ctx.strokeStyle = mc.tail;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y+10);
      ctx.quadraticCurveTo(x+20, y, x+15, y-10);
      ctx.stroke();
    } else if(m.name === '幽靈武士') {
      // Ghostly wisp bottom
      ctx.fillStyle = `${mc.body}88`;
      ctx.beginPath();
      ctx.moveTo(x-10, y+8);
      ctx.bezierCurveTo(x-12, y+16, x-4, y+18, x, y+14);
      ctx.bezierCurveTo(x+4, y+18, x+12, y+16, x+10, y+8);
      ctx.fill();
      // Sword
      ctx.strokeStyle = '#c0c8ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x+10, y-18+animOff); ctx.lineTo(x+10, y+8);
      ctx.stroke();
      ctx.fillStyle = '#8090d0';
      ctx.fillRect(x+7, y-5+animOff, 6, 2);
    } else if(m.name === '石魔') {
      // Rock protrusions
      ctx.fillStyle = mc.tail;
      [[x-12,y-5],[x+12,y-5],[x-8,y-16+animOff],[x+8,y-16+animOff]].forEach(([rx,ry])=>{
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI*2);
        ctx.fill();
      });
      // Cracked texture lines
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x-3,y-5); ctx.lineTo(x,y+3); ctx.lineTo(x+4,y);
      ctx.stroke();
    } else if(m.name === '火精靈') {
      // Flame top
      ctx.fillStyle = '#ffee40';
      ctx.beginPath();
      ctx.moveTo(x, y-24+animOff);
      ctx.bezierCurveTo(x-5, y-18+animOff, x-8, y-14+animOff, x, y-10+animOff);
      ctx.bezierCurveTo(x+8, y-14+animOff, x+5, y-18+animOff, x, y-24+animOff);
      ctx.fill();
      // Fire particles
      ctx.fillStyle = 'rgba(255,120,20,0.6)';
      ctx.beginPath();
      ctx.arc(x-6, y-8+animOff, 3, 0, Math.PI*2);
      ctx.arc(x+6, y-8+animOff, 3, 0, Math.PI*2);
      ctx.fill();
    }
  },

  renderNPCs(state, ctx) {
    state.npcs.forEach(npc => {
      const img = state.sprites[npc.type] && state.sprites[npc.type][npc.dir];
      const x = Math.floor(npc.x), y = Math.floor(npc.y);
      const bobY = Math.sin(state.tick * 0.04 + npc.x * 0.02) * 0.8;

      if(img) {
        ctx.drawImage(img, x-16, y-40+bobY, 32, 48);
      }

      // NPC name
      const nameW = npc.name.length * 7 + 14;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(x - nameW/2, y-52, nameW, 14);
      ctx.strokeStyle = 'rgba(200,160,40,0.5)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x - nameW/2, y-52, nameW, 14);
      ctx.font = 'bold 9px "Noto Serif SC"';
      ctx.fillStyle = '#ffdd44';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, x, y-42);

      // NPC interaction prompt (if nearby)
      const dist = Math.hypot(state.player.x - npc.x, state.player.y - npc.y);
      if(dist < 80) {
        ctx.fillStyle = 'rgba(240,192,64,0.9)';
        ctx.font = 'bold 10px "Noto Serif SC"';
        ctx.fillText('【對話】', x, y-56);
      }
    });
    ctx.textAlign = 'left';
  },

  renderPlayer(state, ctx) {
    const { player, sprites } = state;
    const x = Math.floor(player.x), y = Math.floor(player.y);
    const img = sprites.player[player.dir];
    const bobY = player.moving ? Math.sin(state.tick * 0.18) * 1.5 : 0;

    // Aura
    const auraSize = 20 + Math.sin(state.tick*0.05)*3;
    const auraG = ctx.createRadialGradient(x, y+8, 0, x, y+8, auraSize);
    auraG.addColorStop(0,'rgba(180,100,255,0.25)');
    auraG.addColorStop(1,'transparent');
    ctx.fillStyle = auraG;
    ctx.beginPath();
    ctx.ellipse(x, y+10, auraSize, auraSize*0.4, 0, 0, Math.PI*2);
    ctx.fill();

    if(img) {
      ctx.drawImage(img, x-16, y-44+bobY, 32, 48);
    }

    // Name tag above
    const nameW = player.name.length * 9 + 14;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x - nameW/2, y-64, nameW, 16);
    ctx.strokeStyle = 'rgba(240,192,64,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - nameW/2, y-64, nameW, 16);
    ctx.font = 'bold 10px "Noto Serif SC"';
    ctx.fillStyle = '#f0e060';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, x, y-52);

    // HP bar
    const bw = 50, bh = 5;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x-bw/2, y-48, bw, bh);
    const hpPct = player.hp / player.maxHp;
    const hpColor = hpPct > 0.6 ? '#30cc30' : hpPct > 0.3 ? '#cc8020' : '#cc2020';
    ctx.fillStyle = hpColor;
    ctx.fillRect(x-bw/2, y-48, bw*hpPct, bh);
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x-bw/2, y-48, bw, bh);

    ctx.textAlign = 'left';
  },

  renderEffects(state, ctx, dt) {
    state.effects = state.effects.filter(e => {
      e.life -= dt;
      if(e.life <= 0) return false;
      const alpha = e.life / e.maxLife;
      ctx.globalAlpha = alpha;

      switch(e.type) {
        case 'fire_slash': {
          const progress = 1 - alpha;
          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.rotate(e.angle || 0);
          // Fire wave
          const g = ctx.createLinearGradient(-e.r, 0, e.r, 0);
          g.addColorStop(0,'transparent');
          g.addColorStop(0.3+progress*0.3,'rgba(255,120,30,0.9)');
          g.addColorStop(0.5+progress*0.2,'rgba(255,220,40,0.9)');
          g.addColorStop(0.7+progress*0.1,'rgba(255,80,20,0.7)');
          g.addColorStop(1,'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(0, 0, e.r*progress*2+20, 8+progress*12, 0, 0, Math.PI*2);
          ctx.fill();
          // Sparks
          for(let i = 0; i < 4; i++) {
            const a = (i/4)*Math.PI*2 + e.life*3;
            ctx.fillStyle = 'rgba(255,200,50,0.7)';
            ctx.beginPath();
            ctx.arc(Math.cos(a)*(e.r*0.5+progress*20), Math.sin(a)*8, 3, 0, Math.PI*2);
            ctx.fill();
          }
          ctx.restore();
          break;
        }
        case 'ice_nova': {
          ctx.save();
          ctx.translate(e.x, e.y);
          const progress2 = 1 - alpha;
          ctx.strokeStyle = `rgba(120,200,255,${alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, e.r * progress2, 0, Math.PI*2);
          ctx.stroke();
          // Shards
          for(let i = 0; i < 8; i++) {
            const a = (i/8)*Math.PI*2;
            const sr = e.r * progress2;
            ctx.fillStyle = `rgba(180,230,255,${alpha*0.7})`;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a)*sr, Math.sin(a)*sr);
            ctx.lineTo(Math.cos(a+0.2)*sr*0.7, Math.sin(a+0.2)*sr*0.7);
            ctx.lineTo(Math.cos(a)*sr*1.2, Math.sin(a)*sr*1.2);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
          break;
        }
        case 'lightning_bolt': {
          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.strokeStyle = `rgba(240,240,80,${alpha})`;
          ctx.lineWidth = 2 + Math.random()*2;
          ctx.shadowColor = 'rgba(200,200,60,0.8)';
          ctx.shadowBlur = 10;
          // Zigzag
          let lx = 0, ly = -50;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          for(let i = 0; i < 6; i++) {
            lx += (Math.random()-0.5)*20;
            ly += 17;
            ctx.lineTo(lx, ly);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();
          break;
        }
        case 'qi_burst': {
          ctx.save();
          ctx.translate(e.x, e.y);
          const p = 1-alpha;
          for(let i = 0; i < 6; i++) {
            const a = (i/6)*Math.PI*2 + p*2;
            ctx.fillStyle = `rgba(180,80,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(Math.cos(a)*e.r*p*1.5, Math.sin(a)*e.r*p, 5+p*8, 0, Math.PI*2);
            ctx.fill();
          }
          ctx.strokeStyle = `rgba(220,140,255,${alpha*0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0,0,e.r*p,0,Math.PI*2);
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'hit_flash': {
          ctx.save();
          ctx.translate(e.x, e.y);
          const flashG = ctx.createRadialGradient(0,0,0,0,0,e.r);
          flashG.addColorStop(0,`rgba(255,100,50,${alpha})`);
          flashG.addColorStop(0.5,`rgba(255,50,20,${alpha*0.5})`);
          flashG.addColorStop(1,'transparent');
          ctx.fillStyle = flashG;
          ctx.beginPath();
          ctx.arc(0,0,e.r,0,Math.PI*2);
          ctx.fill();
          ctx.restore();
          break;
        }
        case 'heal_burst': {
          ctx.save();
          ctx.translate(e.x, e.y);
          const hp = 1-alpha;
          for(let i = 0; i < 8; i++) {
            const a = (i/8)*Math.PI*2;
            ctx.fillStyle = `rgba(80,255,120,${alpha})`;
            ctx.beginPath();
            ctx.arc(Math.cos(a)*e.r*hp*2, Math.sin(a)*e.r*hp*2, 4, 0, Math.PI*2);
            ctx.fill();
          }
          const hg = ctx.createRadialGradient(0,0,0,0,0,e.r*0.5);
          hg.addColorStop(0,`rgba(100,255,150,${alpha*0.8})`);
          hg.addColorStop(1,'transparent');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(0,0,e.r*0.5,0,Math.PI*2);
          ctx.fill();
          ctx.restore();
          break;
        }
      }

      ctx.globalAlpha = 1;
      return true;
    });
  }
};

// ============================================================
// MINIMAP RENDERER
// ============================================================

const MinimapRenderer = {
  canvas: null,
  ctx: null,
  terrainImg: null,
  size: 100,

  init(canvasId, state) {
    this.canvas = document.getElementById(canvasId);
    this.size = 100;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d');

    // Generate terrain image
    const terrainData = AssetGen.makeMinimapTerrain(200, 200);
    const img = new Image();
    img.onload = () => { this.terrainImg = img; };
    img.src = terrainData;
  },

  render(state) {
    const ctx = this.ctx;
    const s = this.size;
    const { map, player, npcs, monsters } = state;

    ctx.clearRect(0, 0, s, s);

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(s/2, s/2, s/2, 0, Math.PI*2);
    ctx.clip();

    // Draw terrain
    if(this.terrainImg) {
      ctx.drawImage(this.terrainImg, 0, 0, s, s);
    } else {
      ctx.fillStyle = '#2a5a18';
      ctx.fillRect(0,0,s,s);
    }

    // Scale factor
    const scaleX = s / map.width;
    const scaleY = s / map.height;

    // Road lines
    ctx.strokeStyle = 'rgba(160,130,80,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, s/2); ctx.lineTo(s, s/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s/2, 0); ctx.lineTo(s/2, s);
    ctx.stroke();

    // Monsters (red dots)
    monsters.forEach(m => {
      if(!m.alive) return;
      const mx = m.x * scaleX, my = m.y * scaleY;
      ctx.fillStyle = '#ff4040';
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI*2);
      ctx.fill();
    });

    // NPCs (yellow dots)
    npcs.forEach(n => {
      const nx = n.x * scaleX, ny = n.y * scaleY;
      ctx.fillStyle = '#ffdd44';
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI*2);
      ctx.fill();
    });

    // Player dot
    const px = player.x * scaleX, py = player.y * scaleY;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#40ff80';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI*2);
    ctx.stroke();

    // View indicator
    const vx = (state.camera.x) * scaleX;
    const vy = (state.camera.y) * scaleY;
    const vw = (window.innerWidth) * scaleX;
    const vh = (window.innerHeight) * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vx, vy, vw, vh);

    ctx.restore();

    // Overlay border decorations
    ctx.strokeStyle = 'rgba(200,160,40,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s/2, s/2, s/2-1, 0, Math.PI*2);
    ctx.stroke();
  }
};

// ============================================================
// INPUT HANDLER
// ============================================================

const InputHandler = {
  init(state) {
    window.addEventListener('keydown', e => {
      state.keys[e.key.toLowerCase()] = true;

      // Skill hotkeys
      const skillKeys = { 'q': 0, 'w': 1, 'e': 2, 'r': 3, 'f': 4, 'g': 5 };
      if(skillKeys[e.key.toLowerCase()] !== undefined) {
        UIManager.triggerSkill(state, skillKeys[e.key.toLowerCase()]);
      }

      // Prevent scrolling
      if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', e => {
      state.keys[e.key.toLowerCase()] = false;
    });

    // Touch joystick
    const joystickArea = document.getElementById('joystick-area');
    if(joystickArea) {
      joystickArea.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = joystickArea.getBoundingClientRect();
        state.touch.joystick.active = true;
        state.touch.joystick.startX = touch.clientX - rect.left;
        state.touch.joystick.startY = touch.clientY - rect.top;
        state.touch.joystick.dx = 0;
        state.touch.joystick.dy = 0;
      }, { passive: false });

      joystickArea.addEventListener('touchmove', e => {
        e.preventDefault();
        if(!state.touch.joystick.active) return;
        const touch = e.touches[0];
        const rect = joystickArea.getBoundingClientRect();
        const dx = (touch.clientX - rect.left) - state.touch.joystick.startX;
        const dy = (touch.clientY - rect.top) - state.touch.joystick.startY;
        const maxR = 40;
        const dist = Math.min(Math.hypot(dx, dy), maxR);
        const angle = Math.atan2(dy, dx);
        state.touch.joystick.dx = Math.cos(angle) * dist / maxR;
        state.touch.joystick.dy = Math.sin(angle) * dist / maxR;
        UIManager.updateJoystickVisual(state.touch.joystick.dx, state.touch.joystick.dy, maxR);
      }, { passive: false });

      const endJoystick = e => {
        e.preventDefault();
        state.touch.joystick.active = false;
        state.touch.joystick.dx = 0;
        state.touch.joystick.dy = 0;
        UIManager.resetJoystickVisual();
      };
      joystickArea.addEventListener('touchend', endJoystick, { passive: false });
      joystickArea.addEventListener('touchcancel', endJoystick, { passive: false });
    }
  }
};

// ============================================================
// PHYSICS / MOVEMENT
// ============================================================

const Physics = {
  update(state, dt) {
    const { player, keys, touch, map } = state;
    let dx = 0, dy = 0;

    if(keys['arrowleft'] || keys['a']) dx -= 1;
    if(keys['arrowright'] || keys['d']) dx += 1;
    if(keys['arrowup'] || keys['w']) dy -= 1;
    if(keys['arrowdown'] || keys['s']) dy += 1;

    if(touch.joystick.active) {
      dx = touch.joystick.dx;
      dy = touch.joystick.dy;
    }

    // Normalize diagonal
    if(dx !== 0 && dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len; dy /= len;
    }

    player.moving = (dx !== 0 || dy !== 0);
    player.vx = dx * player.speed;
    player.vy = dy * player.speed;

    if(player.moving) {
      player.x = Math.max(20, Math.min(map.width-20, player.x + player.vx));
      player.y = Math.max(20, Math.min(map.height-20, player.y + player.vy));

      // Direction
      if(Math.abs(dx) >= Math.abs(dy)) {
        player.dir = dx > 0 ? 'right' : 'left';
      } else {
        player.dir = dy > 0 ? 'down' : 'up';
      }
    }

    // Monster wandering
    state.monsters.forEach(m => {
      if(!m.alive) return;
      m.animTimer += dt;
      m.wanderTimer -= dt;
      if(m.wanderTimer <= 0) {
        const angle = Math.random()*Math.PI*2;
        const spd = 0.3+Math.random()*0.4;
        m.vx = Math.cos(angle)*spd;
        m.vy = Math.sin(angle)*spd;
        m.wanderTimer = 60+Math.random()*120;
      }
      m.x = Math.max(50, Math.min(map.width-50, m.x + m.vx));
      m.y = Math.max(50, Math.min(map.height-50, m.y + m.vy));
      if(m.animTimer > 0.15) { m.animFrame = (m.animFrame+1)%4; m.animTimer=0; }
      if(m.hitFlash > 0) m.hitFlash--;

      // Auto-attack if near player
      const dist = Math.hypot(state.player.x-m.x, state.player.y-m.y);
      if(dist < 150) {
        m.vx += (state.player.x - m.x) * 0.0005;
        m.vy += (state.player.y - m.y) * 0.0005;
      }
    });

    // Auto attack nearest monster
    state.autoAttackTimer--;
    if(state.autoAttackTimer <= 0) {
      state.autoAttackTimer = 90;
      this.autoAttack(state);
    }
  },

  autoAttack(state) {
    // Find nearest alive monster
    let nearest = null, nearDist = Infinity;
    state.monsters.forEach(m => {
      if(!m.alive) return;
      const d = Math.hypot(state.player.x-m.x, state.player.y-m.y);
      if(d < 120 && d < nearDist) { nearest = m; nearDist = d; }
    });
    if(!nearest) return;

    // Deal damage
    const baseDmg = 300 + Math.floor(Math.random()*400);
    const isCrit = Math.random() < 0.2;
    const dmg = isCrit ? Math.floor(baseDmg * 1.8) : baseDmg;
    nearest.hp -= dmg;
    nearest.hitFlash = 8;

    // Hit effect
    state.effects.push({ type:'hit_flash', x:nearest.x, y:nearest.y, r:20, life:0.3, maxLife:0.3 });

    // Floating text
    UIManager.addFloatingText(state, nearest.x-state.camera.x, nearest.y-state.camera.y, isCrit?`${dmg}!`:String(dmg), isCrit?'#ff8000':'#ff4040');

    if(nearest.hp <= 0) {
      nearest.alive = false;
      UIManager.addChatMessage(state, { type:'system', text:`【系統】擊敗了 ${nearest.name}，獲得 ${nearest.reward} 經驗值！` });
      state.player.exp = Math.min(100, state.player.exp + 2);
      state.player.gold += nearest.reward * 2;
      UIManager.updateHUD(state);

      // Respawn after delay
      setTimeout(() => {
        nearest.hp = nearest.maxHp;
        nearest.alive = true;
        const angle = Math.random()*Math.PI*2;
        nearest.x = state.player.x + Math.cos(angle)*(200+Math.random()*200);
        nearest.y = state.player.y + Math.sin(angle)*(200+Math.random()*200);
        nearest.x = Math.max(80, Math.min(state.map.width-80, nearest.x));
        nearest.y = Math.max(80, Math.min(state.map.height-80, nearest.y));
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
      if(i >= state.skills.length) return;
      const skill = state.skills[i];

      // Set icon using canvas-generated image
      const iconEl = el.querySelector('.skill-icon-display');
      if(iconEl && skill.icon) {
        const iconImg = document.createElement('img');
        iconImg.src = skill.icon;
        iconImg.style.cssText = 'width:28px;height:28px;image-rendering:pixelated;border-radius:50%;display:block;';
        iconImg.draggable = false;
        iconEl.innerHTML = '';
        iconEl.appendChild(iconImg);
      }

      el.addEventListener('click', () => this.triggerSkill(state, i));
      el.addEventListener('touchstart', e => { e.preventDefault(); this.triggerSkill(state, i); }, { passive: false });
    });

    // Also init main attack btn
    const mainAttack = document.getElementById('main-attack');
    if(mainAttack) {
      // Replace emoji icon with canvas sword
      const swordData = AssetGen.makeSkillIcon('sword', 40);
      const swordImg = document.createElement('img');
      swordImg.src = swordData;
      swordImg.style.cssText = 'width:34px;height:34px;image-rendering:pixelated;';
      const attackIcon = mainAttack.querySelector('.attack-icon');
      if(attackIcon) { attackIcon.innerHTML = ''; attackIcon.appendChild(swordImg); }
    }
  },

  triggerSkill(state, index) {
    const skill = state.skills[index];
    if(!skill || skill.cdLeft > 0) return;

    skill.cdLeft = skill.cd;

    const px = state.player.x, py = state.player.y;

    // Effect based on type
    switch(skill.type) {
      case 'fire':
        state.effects.push({ type:'fire_slash', x:px, y:py, r:60, angle:0, life:0.5, maxLife:0.5 });
        this.damageMonsters(state, px, py, 80, 1200, 1600);
        break;
      case 'ice':
        state.effects.push({ type:'ice_nova', x:px, y:py, r:80, life:0.6, maxLife:0.6 });
        this.damageMonsters(state, px, py, 100, 900, 1200);
        break;
      case 'lightning':
        state.effects.push({ type:'lightning_bolt', x:px, y:py, r:120, life:0.4, maxLife:0.4 });
        this.damageMonsters(state, px, py, 60, 1500, 2000);
        break;
      case 'qi':
        state.effects.push({ type:'qi_burst', x:px, y:py, r:100, life:0.6, maxLife:0.6 });
        this.damageMonsters(state, px, py, 120, 800, 1000);
        break;
      case 'wind':
        state.player.speed = 5;
        setTimeout(()=>{ state.player.speed = 2.5; }, 2000);
        this.addChatMessage(state, { type:'system', text:'【疾風步】速度大幅提升！' });
        break;
      case 'shield':
        state.effects.push({ type:'heal_burst', x:px, y:py, r:50, life:0.8, maxLife:0.8 });
        const healAmt = Math.floor(state.player.maxHp * 0.15);
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmt);
        this.addFloatingText(state, window.innerWidth/2, window.innerHeight/2, `+${healAmt}`, '#40ff80');
        this.updateHUD(state);
        break;
    }

    // Start cooldown UI
    const skillEl = document.querySelectorAll('.skill-btn')[index];
    if(skillEl) {
      skillEl.classList.add('on-cooldown', 'skill-active-flash');
      setTimeout(() => skillEl.classList.remove('skill-active-flash'), 200);
    }

    // MP cost
    state.player.mp = Math.max(0, state.player.mp - 100);
    this.updateHUD(state);
  },

  damageMonsters(state, x, y, radius, minDmg, maxDmg) {
    state.monsters.forEach(m => {
      if(!m.alive) return;
      const dist = Math.hypot(m.x-x, m.y-y);
      if(dist < radius) {
        const dmg = minDmg + Math.floor(Math.random()*(maxDmg-minDmg));
        const isCrit = Math.random() < 0.25;
        const finalDmg = isCrit ? Math.floor(dmg*2) : dmg;
        m.hp -= finalDmg;
        m.hitFlash = 12;
        this.addFloatingText(state, m.x-state.camera.x, m.y-state.camera.y, isCrit?`${finalDmg}!`:String(finalDmg), isCrit?'#ff8000':'#ffaa00');
        if(m.hp <= 0) {
          m.alive = false;
          state.player.exp = Math.min(100, state.player.exp + 3);
          state.player.gold += m.reward * 3;
          this.addChatMessage(state, { type:'system', text:`【技能斬殺】${m.name}，超殺！獲得${m.reward*3}金幣！` });
          this.updateHUD(state);
          setTimeout(() => {
            m.hp = m.maxHp; m.alive = true;
            m.x = x + (Math.random()-0.5)*400;
            m.y = y + (Math.random()-0.5)*400;
            m.x = Math.max(80,Math.min(state.map.width-80,m.x));
            m.y = Math.max(80,Math.min(state.map.height-80,m.y));
          }, 10000);
        }
      }
    });
  },

  updateJoystickVisual(dx, dy, maxR) {
    const thumb = document.getElementById('joystick-thumb');
    if(thumb) {
      thumb.style.transform = `translate(calc(-50% + ${dx*maxR}px), calc(-50% + ${dy*maxR}px))`;
    }
  },

  resetJoystickVisual() {
    const thumb = document.getElementById('joystick-thumb');
    if(thumb) thumb.style.transform = 'translate(-50%, -50%)';
  },

  updateHUD(state) {
    const { player } = state;

    // HP bar
    const hpPct = (player.hp/player.maxHp*100).toFixed(1);
    const hpBar = document.getElementById('hp-bar');
    if(hpBar) hpBar.style.width = hpPct + '%';
    const hpVal = document.getElementById('hp-value');
    if(hpVal) hpVal.textContent = `${player.hp.toLocaleString()}/${player.maxHp.toLocaleString()}`;

    // MP bar
    const mpPct = (player.mp/player.maxMp*100).toFixed(1);
    const mpBar = document.getElementById('mp-bar');
    if(mpBar) mpBar.style.width = mpPct + '%';
    const mpVal = document.getElementById('mp-value');
    if(mpVal) mpVal.textContent = `${player.mp.toLocaleString()}/${player.maxMp.toLocaleString()}`;

    // EXP bar
    const expBar = document.getElementById('exp-bar');
    if(expBar) expBar.style.width = player.exp + '%';

    // Gold display
    const goldEl = document.getElementById('gold-display');
    if(goldEl) goldEl.textContent = player.gold.toLocaleString();
  },

  updateSkillCooldowns(state, dt) {
    const skillEls = document.querySelectorAll('.skill-btn');
    state.skills.forEach((skill, i) => {
      if(skill.cdLeft > 0) {
        skill.cdLeft -= dt * 60 / 60;
        if(skill.cdLeft < 0) skill.cdLeft = 0;

        const el = skillEls[i];
        if(!el) return;

        if(skill.cdLeft <= 0) {
          el.classList.remove('on-cooldown');
          const overlay = el.querySelector('.skill-cooldown-overlay');
          if(overlay) overlay.style.setProperty('--cd-pct', '0%');
          const timer = el.querySelector('.skill-cooldown-timer');
          if(timer) timer.textContent = '';
        } else {
          const pct = (skill.cdLeft / skill.cd * 360);
          const overlay = el.querySelector('.skill-cooldown-overlay');
          if(overlay) overlay.style.setProperty('--cd-pct', pct + 'deg');
          const timer = el.querySelector('.skill-cooldown-timer');
          if(timer) timer.textContent = Math.ceil(skill.cdLeft);
        }
      }
    });

    // MP regen
    if(state.player.mp < state.player.maxMp) {
      state.player.mp = Math.min(state.player.maxMp, state.player.mp + 0.5);
    }
  },

  addChatMessage(state, msg) {
    state.chatMessages.push(msg);
    if(state.chatMessages.length > 50) state.chatMessages.shift();

    const chatEl = document.getElementById('chat-messages');
    if(!chatEl) return;

    const div = document.createElement('div');
    div.className = `chat-message ${msg.type}`;
    if(msg.sender) {
      div.innerHTML = `<span class="chat-sender">[${msg.sender}]</span> ${msg.text}`;
    } else {
      div.textContent = msg.text;
    }
    chatEl.appendChild(div);

    // Keep scroll at bottom
    chatEl.scrollTop = chatEl.scrollHeight;

    // Limit visible messages
    while(chatEl.children.length > 30) {
      chatEl.removeChild(chatEl.firstChild);
    }
  },

  addFloatingText(state, screenX, screenY, text, color) {
    const container = document.getElementById('ui-layer');
    if(!container) return;

    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.color = color || '#ff4040';
    el.style.left = (screenX + (Math.random()-0.5)*40) + 'px';
    el.style.top = (screenY - 20) + 'px';
    container.appendChild(el);

    setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 1500);
  },

  initBuffBar(state) {
    const buffBar = document.getElementById('buff-bar');
    if(!buffBar) return;
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
      if(state.buffs[i]) {
        state.buffs[i].timer = Math.max(0, state.buffs[i].timer - 1/60);
        el.textContent = Math.ceil(state.buffs[i].timer) + 's';
      }
    });
  },

  initPanels(state) {
    // Inventory button
    document.querySelector('.qb-bag')?.addEventListener('click', () => {
      const p = document.getElementById('inventory-panel');
      if(p) p.classList.toggle('visible');
    });

    // Quest button
    document.querySelector('.qb-quest')?.addEventListener('click', () => {
      const p = document.getElementById('quest-panel');
      if(p) p.classList.toggle('visible');
    });

    // Close buttons
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.game-panel')?.classList.remove('visible');
      });
    });

    // Main attack button
    const mainAttack = document.getElementById('main-attack');
    if(mainAttack) {
      mainAttack.addEventListener('click', () => {
        Physics.autoAttack(state);
      });
      mainAttack.addEventListener('touchstart', e => {
        e.preventDefault();
        Physics.autoAttack(state);
      }, { passive: false });
    }

    // Chat send
    const chatSend = document.querySelector('.chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    if(chatSend && chatInput) {
      chatSend.addEventListener('click', () => {
        if(chatInput.value.trim()) {
          this.addChatMessage(state, { type:'normal', sender:state.player.name, text:chatInput.value.trim() });
          chatInput.value = '';
        }
      });
      chatInput.addEventListener('keydown', e => {
        if(e.key === 'Enter') chatSend.click();
      });
    }
  },

  startAutoChatMessages(state) {
    let msgIndex = 0;
    setInterval(() => {
      const msg = state.autoMessages[msgIndex % state.autoMessages.length];
      this.addChatMessage(state, msg);
      msgIndex++;
    }, 4000 + Math.random()*3000);
  }
};

// ============================================================
// ASSET LOADER
// ============================================================

const AssetLoader = {
  async loadAll(state) {
    // Load tiles
    const tileTypes = ['grass1','grass2','grass3','dirt1','road','stone1','stone2','water'];
    await Promise.all(tileTypes.map(t => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.tiles[t] = img; resolve(); };
      img.onerror = resolve;
      img.src = AssetGen.makeTile(t);
    })));

    // Load decorations
    const decoTypes = ['tree1','tree2','rock','flower'];
    await Promise.all(decoTypes.map(t => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.sprites[t] = img; resolve(); };
      img.onerror = resolve;
      const src = t.startsWith('tree') ? AssetGen.makeTree(t==='tree1'?1:2)
                : t==='rock' ? AssetGen.makeRock()
                : AssetGen.makeFlower();
      img.src = src;
    })));

    // Load player sprites (4 dirs x 4 frames)
    const dirs = ['down','up','left','right'];
    const frames = [0,1,2,3];
    state.sprites.player = {};
    await Promise.all(dirs.map(dir => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { state.sprites.player[dir] = img; resolve(); };
      img.onerror = resolve;
      img.src = AssetGen.makeCharacterFrame(dir, 1, 'player');
    })));

    // Load NPC sprites
    for(const npcType of ['npc_merchant','npc_guard']) {
      state.sprites[npcType] = {};
      await Promise.all(dirs.map(dir => new Promise(resolve => {
        const img = new Image();
        img.onload = () => { state.sprites[npcType][dir] = img; resolve(); };
        img.onerror = resolve;
        img.src = AssetGen.makeCharacterFrame(dir, 0, npcType);
      })));
    }

    // Load skill icons
    const skillTypes = ['fire','ice','lightning','qi','wind','shield','heal','sword'];
    for(const st of skillTypes) {
      await new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = resolve;
        img.src = AssetGen.makeSkillIcon(st, 48);
      });
    }

    // Set skill icon data URLs
    state.skills.forEach((skill, i) => {
      skill.icon = AssetGen.makeSkillIcon(skill.type, 48);
    });

    // Avatar
    const avatarCanvas = document.getElementById('avatar-canvas');
    if(avatarCanvas) {
      const img = new Image();
      img.onload = () => {
        const ctx = avatarCanvas.getContext('2d');
        avatarCanvas.width = 60; avatarCanvas.height = 60;
        ctx.drawImage(img, 0, 0, 60, 60);
      };
      img.src = AssetGen.makeAvatar();
    }

    // Player animation frames
    state.playerFrames = {};
    for(const dir of dirs) {
      state.playerFrames[dir] = [];
      for(const frame of frames) {
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

    // Player animation
    state.player.animTimer += dt;
    if(state.player.moving) {
      if(state.player.animTimer > 0.12) {
        state.player.animFrame = (state.player.animFrame + 1) % 4;
        state.player.animTimer = 0;
        // Update sprite
        if(state.playerFrames) {
          const frames = state.playerFrames[state.player.dir];
          if(frames && frames[state.player.animFrame]) {
            state.sprites.player[state.player.dir] = frames[state.player.animFrame];
          }
        }
      }
    } else {
      state.player.animFrame = 0;
      state.player.animTimer = 0;
    }
  }
};

// ============================================================
// MAIN GAME LOOP
// ============================================================

function gameLoop(timestamp) {
  const state = GameState;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.05);
  state.lastTime = timestamp;

  Physics.update(state, dt);
  AnimSystem.update(state, dt);
  Renderer.render(state, dt);
  MinimapRenderer.render(state);
  UIManager.updateSkillCooldowns(state, dt);
  UIManager.updateBuffTimers(state);

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
    { pct: 10, text: '載入地圖數據...' },
    { pct: 25, text: '生成地形紋理...' },
    { pct: 40, text: '載入角色精靈...' },
    { pct: 55, text: '載入NPC模型...' },
    { pct: 70, text: '初始化技能系統...' },
    { pct: 82, text: '渲染UI界面...' },
    { pct: 92, text: '連接伺服器...' },
    { pct: 100, text: '準備完成！' },
  ];

  for(const step of steps) {
    if(progress) progress.style.width = step.pct + '%';
    if(status) status.textContent = step.text;
    await new Promise(r => setTimeout(r, 150 + Math.random()*200));
  }

  await new Promise(r => setTimeout(r, 400));
  if(screen) {
    screen.classList.add('fade-out');
    setTimeout(() => { screen.style.display = 'none'; }, 800);
  }
}

// ============================================================
// GAME INITIALIZATION
// ============================================================

async function initGame() {
  const state = GameState;

  // Show loading
  showLoadingScreen();

  // Initialize renderer
  Renderer.init('world-canvas');

  // Generate map
  MapGen.generate(state);

  // Load all assets
  await AssetLoader.loadAll(state);

  // Initialize minimap
  MinimapRenderer.init('minimap-canvas', state);

  // Initialize input
  InputHandler.init(state);

  // Initialize UI
  UIManager.initSkillButtons(state);
  UIManager.initBuffBar(state);
  UIManager.updateHUD(state);
  UIManager.initPanels(state);
  UIManager.startAutoChatMessages(state);

  // Load initial chat messages into DOM
  state.chatMessages.forEach(msg => UIManager.addChatMessage(state, msg));

  // Start game loop
  state.lastTime = performance.now();
  state.animationId = requestAnimationFrame(gameLoop);

  // World ticker
  const ticker = document.querySelector('.ticker-text');
  if(ticker) {
    const tickerMsgs = [
      '【世界】玩家 烈焰天尊 達到100級！', '  ',
      '【系統】翠玉仙境BOSS將在30分鐘後重生！', '  ',
      '【市場】靈獸蛋×5超低價出售！', '  ',
      '【活動】本週末雙倍掉落！別忘記上線！', '  ',
    ];
    ticker.textContent = tickerMsgs.join('   ◆   ');
  }
}

// ============================================================
// EXTRA VISUAL POLISH - Ambient particle system
// ============================================================

const AmbientSystem = {
  particles: [],
  maxParticles: 30,

  spawn(state) {
    if(this.particles.length >= this.maxParticles) return;
    const cam = state.camera;
    const W = window.innerWidth, H = window.innerHeight;
    const types = ['leaf','firefly','dust'];
    const t = types[Math.floor(Math.random()*types.length)];
    this.particles.push({
      x: cam.x + Math.random()*W,
      y: cam.y + Math.random()*H,
      vx: (Math.random()-0.5)*0.4,
      vy: -0.2 - Math.random()*0.3,
      life: 1, maxLife: 3+Math.random()*4,
      size: 2+Math.random()*3,
      type: t,
      color: t==='leaf' ? `hsl(${100+Math.random()*60},70%,40%)` :
             t==='firefly' ? `hsl(${50+Math.random()*40},100%,70%)` :
             `rgba(200,180,140,0.5)`,
      angle: Math.random()*Math.PI*2,
      spin: (Math.random()-0.5)*0.1,
    });
  },

  update(state) {
    if(Math.random() < 0.15) this.spawn(state);
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1/180;
      p.angle += p.spin;
      if(p.type==='leaf') { p.vx += Math.sin(p.angle*2)*0.02; }
      if(p.type==='firefly') { p.vy += Math.sin(p.angle)*0.05; p.vx += Math.cos(p.angle)*0.05; }
      return p.life > 0;
    });
  },

  render(ctx, state) {
    const cam = state.camera;
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life * 0.7;
      ctx.translate(p.x - cam.x, p.y - cam.y);
      ctx.rotate(p.angle);

      if(p.type === 'firefly') {
        const g = ctx.createRadialGradient(0,0,0,0,0,p.size*2);
        g.addColorStop(0, p.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0,0,p.size*2,0,Math.PI*2);
        ctx.fill();
      } else if(p.type === 'leaf') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0,0,p.size,p.size*0.5,0,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0,0,p.size*0.5,0,Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    });
  }
};

// Patch renderer to include ambient particles
const _origRender = Renderer.render.bind(Renderer);
Renderer.render = function(state, dt) {
  _origRender(state, dt);
  const ctx = this.ctx;
  ctx.save();
  AmbientSystem.update(state);
  AmbientSystem.render(ctx, state);
  ctx.restore();
};

// ============================================================
// LEVEL UP SYSTEM
// ============================================================

function checkLevelUp(state) {
  if(state.player.exp >= 100) {
    state.player.exp = 0;
    state.player.level++;
    state.player.maxHp += 200;
    state.player.hp = state.player.maxHp;
    state.player.maxMp += 100;
    state.player.mp = state.player.maxMp;
    state.player.atk += 150;
    state.player.def += 50;

    // Show level up notification
    const notifArea = document.getElementById('notification-area');
    if(notifArea) {
      const div = document.createElement('div');
      div.className = 'system-notification';
      div.innerHTML = `✨ 升級！等級 ${state.player.level} ✨`;
      notifArea.appendChild(div);
      setTimeout(() => { if(div.parentNode) div.parentNode.removeChild(div); }, 3000);
    }

    UIManager.addChatMessage(state, { type:'system', text:`【恭喜】你已升至 ${state.player.level} 級！氣血、靈力全滿！` });
    UIManager.updateHUD(state);

    const badge = document.getElementById('level-badge');
    if(badge) badge.textContent = state.player.level;
  }
}

// Patch Physics.autoAttack to check level up
const _origAutoAttack = Physics.autoAttack.bind(Physics);
Physics.autoAttack = function(state) {
  _origAutoAttack(state);
  checkLevelUp(state);
};

// Patch UIManager.damageMonsters to check level up
const _origDmgMonsters = UIManager.damageMonsters.bind(UIManager);
UIManager.damageMonsters = function(state, x, y, radius, minDmg, maxDmg) {
  _origDmgMonsters(state, x, y, radius, minDmg, maxDmg);
  checkLevelUp(state);
};

// ============================================================
// KEYBOARD MOVEMENT CONTROLS DISPLAY
// ============================================================

function addKeyControls() {
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: fixed; bottom: 8px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.6); border: 1px solid rgba(200,160,40,0.3);
    border-radius: 4px; padding: 3px 10px;
    font-size: 9px; color: rgba(200,180,120,0.7);
    font-family: 'Noto Serif SC', serif;
    pointer-events: none; z-index: 100;
    white-space: nowrap;
  `;
  hint.textContent = 'WASD/方向鍵移動 · Q,W,E,R,F,G 技能 · 點擊攻擊按鈕攻擊';
  document.getElementById('ui-layer')?.appendChild(hint);

  // Auto-hide after 5s
  setTimeout(() => {
    hint.style.transition = 'opacity 1s ease';
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 1000);
  }, 6000);
}

// Start when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initGame().then(() => {
    addKeyControls();
  });
});
