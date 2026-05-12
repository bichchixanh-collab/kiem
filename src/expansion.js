'use strict';
// ============================================================
// 仙劍天下 - EXPANSION ENGINE
// Integrates new content into existing game systems
// Reuses: Renderer, Physics, UIManager, MinimapRenderer, etc.
// ============================================================

// ============================================================
// REGION MANAGER - Tracks current region, triggers transitions
// ============================================================
const RegionManager = {
  currentRegion: null,
  lastRegionId: null,

  init(state) {
    state.currentRegion = WorldData.regions[0];
    state.activeQuests = [];
    state.completedQuests = [];
    state.npcDialog = null;
    state.activeBoss = null;
    state.eliteMonsters = [];
    state.loreStones = [];
    state.regionNPCs = [];
    state.questProgress = {};
    state.playerTitles = [];

    // Seed initial region content
    this.enterRegion(state, 'starting_village');
  },

  enterRegion(state, regionId) {
    const region = WorldData.regions.find(r => r.id === regionId);
    if (!region) return;
    const prevRegion = state.currentRegion;
    state.currentRegion = region;

    // Show region banner
    if (prevRegion && prevRegion.id !== regionId) {
      this.showRegionBanner(region);
      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'system',
        text: `【進入區域】${region.name} · ${region.nameEn} · 等級範圍 Lv.${region.levelRange[0]}~${region.levelRange[1]}`
      });
    }

    // Update map title
    const mapNameEl = document.querySelector('.map-name');
    const mapSubEl = document.querySelector('.map-subtitle');
    if (mapNameEl) mapNameEl.textContent = region.name;
    if (mapSubEl) mapSubEl.textContent = `${region.nameEn} · 修煉區 Lv.${region.levelRange[0]}~${region.levelRange[1]}`;

    // Update ambient atmosphere
    const atmo = document.getElementById('atmosphere-overlay');
    if (atmo && region.ambientColor) {
      atmo.style.background = `radial-gradient(ellipse at center, ${region.ambientColor}, transparent 70%)`;
    }

    // Add weather fog
    const fog = document.getElementById('fog-overlay');
    if (fog) fog.style.display = region.fog ? 'block' : 'none';

    // Spawn region NPCs
    this.spawnRegionNPCs(state, region);

    // Spawn region lore stones
    this.spawnLoreStones(state, region);

    // Update region side panel
    this.updateRegionPanel(state, region);
  },

  showRegionBanner(region) {
    const banner = document.getElementById('region-banner');
    if (!banner) return;
    const nameEl = banner.querySelector('.region-banner-name');
    const subEl = banner.querySelector('.region-banner-sub');
    if (nameEl) nameEl.textContent = region.name;
    if (subEl) subEl.textContent = `${region.nameEn}  ·  Lv.${region.levelRange[0]}~${region.levelRange[1]}  ·  ${region.type.toUpperCase()}`;
    banner.classList.remove('visible');
    void banner.offsetWidth;
    banner.classList.add('visible');
    setTimeout(() => banner.classList.remove('visible'), 4100);
  },

  spawnRegionNPCs(state, region) {
    // Remove old region NPCs (keep base npcs)
    state.npcs = state.npcs.filter(n => !n.fromExpansion);
    const regionNPCDefs = WorldData.npcs.filter(n => n.regionId === region.id);
    regionNPCDefs.forEach(def => {
      state.npcs.push({
        id: def.id,
        name: def.name,
        role: def.role,
        emoji: def.emoji,
        type: def.type || 'npc_merchant',
        x: def.x || 500,
        y: def.y || 500,
        dir: 'down',
        quests: def.quests || [],
        dialog: def.dialog || {},
        merchandise: def.merchandise || [],
        fromExpansion: true,
        animFrame: 0,
        animTimer: 0,
      });
    });
  },

  spawnLoreStones(state, region) {
    state.loreStones = WorldData.loreStones.filter(ls => ls.regionId === region.id);
  },

  updateRegionPanel(state, region) {
    const panel = document.getElementById('region-panel');
    if (!panel) return;
    const title = panel.querySelector('.region-panel-title');
    const rows = panel.querySelectorAll('.region-stat-row');

    if (title) title.textContent = `📍 ${region.name}`;
    if (rows[0]) {
      rows[0].querySelector('.region-stat-value').textContent = `Lv.${region.levelRange[0]}~${region.levelRange[1]}`;
    }
    if (rows[1]) {
      rows[1].querySelector('.region-stat-value').textContent = region.type;
    }
    if (rows[2]) {
      rows[2].querySelector('.region-stat-value').textContent =
        region.monsters.length + region.eliteMonsters.length;
    }

    const loreEl = panel.querySelector('.region-lore-text');
    if (loreEl) loreEl.textContent = `"${region.lore.substring(0, 60)}..."`;
  },

  checkRegionTransition(state) {
    // Simple proximity-based region detection
    const px = state.player.x, py = state.player.y;
    const region = WorldData.regions.find(r => {
      const dx = Math.abs(px - r.spawnX), dy = Math.abs(py - r.spawnY);
      return dx < 600 && dy < 600;
    });
    if (region && region.id !== state.currentRegion?.id) {
      this.enterRegion(state, region.id);
    }
  }
};

// ============================================================
// BOSS MANAGER - Spawns, manages, and renders bosses
// ============================================================
const BossManager = {
  activeBosses: [],

  init(state) {
    state.bosses = [];
  },

  spawnBoss(state, bossId, x, y) {
    const def = WorldData.bosses.find(b => b.id === bossId);
    if (!def) return null;
    const boss = {
      ...def,
      hp: def.maxHp,
      x: x || def.position.x,
      y: y || def.position.y,
      alive: true,
      phase: 1,
      animFrame: 0,
      animTimer: 0,
      hitFlash: 0,
      skillCooldowns: {},
      aggro: false,
      aggroRange: 300,
      attackRange: 120,
      attackCooldown: 0,
      lastSkillTime: 0,
      floatOffset: 0,
      phaseTriggered: false,
      fromExpansion: true,
    };
    def.skills.forEach(s => { boss.skillCooldowns[s.name] = 0; });
    state.bosses = state.bosses || [];
    state.bosses.push(boss);
    this.activeBosses.push(boss);

    // Show boss warning
    this.showBossWarning(def.name);
    this.showBossHP(boss);

    if (typeof UIManager !== 'undefined' && UIManager.addChatMessage) {
      UIManager.addChatMessage(state, {
        type: 'system',
        text: `【BOSS警告】${def.name}「${def.title}」降臨！`
      });
    }
    return boss;
  },

  showBossWarning(name) {
    const warn = document.getElementById('boss-warning');
    if (!warn) return;
    const textEl = warn.querySelector('.boss-warning-text');
    if (textEl) textEl.textContent = `⚠ BOSS降臨 · ${name} ⚠`;
    warn.classList.add('visible');
    setTimeout(() => warn.classList.remove('visible'), 6000);
  },

  showBossHP(boss) {
    const bar = document.getElementById('boss-hp-bar');
    if (!bar) return;
    bar.classList.add('visible');
    const nameEl = bar.querySelector('.boss-hp-name');
    if (nameEl) nameEl.textContent = `${boss.name} · ${boss.title}`;
    this.updateBossHP(boss);
  },

  hideBossHP() {
    const bar = document.getElementById('boss-hp-bar');
    if (bar) bar.classList.remove('visible');
  },

  updateBossHP(boss) {
    const fill = document.getElementById('boss-hp-fill');
    const text = document.getElementById('boss-hp-text');
    if (fill) fill.style.width = (boss.hp / boss.maxHp * 100) + '%';
    if (text) text.textContent = `${boss.hp.toLocaleString()} / ${boss.maxHp.toLocaleString()}`;
  },

  update(state, dt) {
    if (!state.bosses) return;
    state.bosses.forEach(boss => {
      if (!boss.alive) return;

      boss.animTimer += dt;
      if (boss.animTimer > 0.15) { boss.animFrame = (boss.animFrame + 1) % 4; boss.animTimer = 0; }
      boss.floatOffset = Math.sin(Date.now() * 0.002) * 3;
      if (boss.hitFlash > 0) boss.hitFlash--;
      if (boss.attackCooldown > 0) boss.attackCooldown -= dt;

      const dist = Math.hypot(state.player.x - boss.x, state.player.y - boss.y);

      // Aggro check
      if (dist < boss.aggroRange) boss.aggro = true;
      if (boss.aggro && boss.alive) {
        // Move toward player
        if (dist > boss.attackRange) {
          const angle = Math.atan2(state.player.y - boss.y, state.player.x - boss.x);
          boss.x += Math.cos(angle) * boss.spd * 40 * dt;
          boss.y += Math.sin(angle) * boss.spd * 40 * dt;
        }

        // Basic attack
        if (dist < boss.attackRange && boss.attackCooldown <= 0) {
          this.bossAttack(state, boss);
          boss.attackCooldown = 1.5;
        }

        // Phase transition
        if (!boss.phaseTriggered && boss.hp <= boss.maxHp * boss.phaseThreshold) {
          boss.phaseTriggered = true;
          boss.phase = 2;
          boss.atk = Math.floor(boss.atk * 1.4);
          boss.spd = boss.spd * 1.3;
          this.showBossWarning(`${boss.phase2Name}！`);
          if (typeof UIManager !== 'undefined' && UIManager.addChatMessage) {
            UIManager.addChatMessage(state, {
              type: 'system',
              text: `【BOSS狂化】${boss.name} 進入狂化狀態！攻擊力大幅提升！`
            });
          }
        }

        // Skill usage
        this.tryUseSkill(state, boss, dt);

        // Update HP bar
        this.updateBossHP(boss);
      }
    });
  },

  bossAttack(state, boss) {
    const dmg = boss.atk + Math.floor(Math.random() * boss.atk * 0.3);
    state.player.hp = Math.max(0, state.player.hp - Math.max(0, dmg - (state.player.def || 0)));
    if (typeof UIManager !== 'undefined') {
      UIManager.addFloatingText(state,
        window.innerWidth / 2 + (Math.random() - 0.5) * 60,
        window.innerHeight / 2,
        `-${dmg.toLocaleString()}`,
        '#ff4040'
      );
      UIManager.updateHUD(state);
    }
  },

  tryUseSkill(state, boss, dt) {
    const now = Date.now() / 1000;
    if (now - boss.lastSkillTime < 5) return;
    const availableSkills = boss.skills.filter(s => {
      const lastUsed = boss.skillCooldowns[s.name] || 0;
      return now - lastUsed >= s.cd;
    });
    if (availableSkills.length === 0) return;
    const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    boss.skillCooldowns[skill.name] = now;
    boss.lastSkillTime = now;

    const dist = Math.hypot(state.player.x - boss.x, state.player.y - boss.y);

    switch (skill.type) {
      case 'aoe_bleed':
      case 'quake':
      case 'shockwave':
      case 'ice_nova':
      case 'wing_sweep':
      case 'poison_breath': {
        if (dist <= (skill.range || 200)) {
          const dmg = skill.damage + Math.floor(Math.random() * skill.damage * 0.2);
          state.player.hp = Math.max(0, state.player.hp - dmg);
          state.effects && state.effects.push({
            type: 'fire_slash', x: state.player.x, y: state.player.y,
            r: 80, angle: 0, life: 0.4, maxLife: 0.4
          });
          UIManager.addFloatingText && UIManager.addFloatingText(state,
            window.innerWidth / 2, window.innerHeight / 2 - 30,
            `【${skill.name}】-${dmg.toLocaleString()}`, '#ff8080'
          );
          UIManager.addChatMessage && UIManager.addChatMessage(state, {
            type: 'system',
            text: `${boss.name} 使用了【${skill.name}】！`
          });
          UIManager.updateHUD && UIManager.updateHUD(state);
        }
        break;
      }
      case 'summon': {
        UIManager.addChatMessage && UIManager.addChatMessage(state, {
          type: 'system',
          text: `${boss.name} 召喚了援軍！`
        });
        for (let i = 0; i < (skill.count || 3); i++) {
          const angle = (Math.PI * 2 * i) / skill.count;
          const sx = boss.x + Math.cos(angle) * 100;
          const sy = boss.y + Math.sin(angle) * 100;
          const summonTypes = ['妖狐', '幽靈武士', '石魔', '火精靈'];
          const summonType = summonTypes[Math.floor(Math.random() * summonTypes.length)];
          state.monsters && state.monsters.push({
            name: summonType,
            level: boss.level - 5,
            hp: 3000, maxHp: 3000,
            atk: boss.atk * 0.3,
            def: 100,
            x: sx, y: sy,
            alive: true,
            aggro: true,
            aggroRange: 400,
            attackRange: 50,
            attackCooldown: 0,
            animFrame: 0,
            animTimer: 0,
            hitFlash: 0,
            wanderTimer: 0,
            wanderDir: { x: 0, y: 0 },
            isSummon: true,
          });
        }
        break;
      }
      case 'life_drain': {
        if (dist <= (skill.range || 100)) {
          const drain = Math.floor(skill.damage * 0.5);
          state.player.hp = Math.max(0, state.player.hp - skill.damage);
          boss.hp = Math.min(boss.maxHp, boss.hp + drain);
          UIManager.addFloatingText && UIManager.addFloatingText(state,
            window.innerWidth / 2, window.innerHeight / 2,
            `【${skill.name}】-${skill.damage.toLocaleString()}`, '#cc00ff'
          );
          UIManager.updateHUD && UIManager.updateHUD(state);
        }
        break;
      }
      case 'curse':
      case 'mind_break': {
        UIManager.addChatMessage && UIManager.addChatMessage(state, {
          type: 'system',
          text: `${boss.name} 對你施放了【${skill.name}】！移速降低！`
        });
        const origSpeed = state.player.speed;
        state.player.speed = origSpeed * 0.5;
        setTimeout(() => { state.player.speed = origSpeed; }, (skill.duration || 8) * 1000);
        break;
      }
    }
  },

  takeDamage(state, boss, damage) {
    if (!boss.alive) return;
    boss.hp -= damage;
    boss.hitFlash = 8;
    this.updateBossHP(boss);

    if (boss.hp <= 0) {
      boss.alive = false;
      boss.hp = 0;
      this.onBossDeath(state, boss);
    }
  },

  onBossDeath(state, boss) {
    this.hideBossHP();
    UIManager.addChatMessage && UIManager.addChatMessage(state, {
      type: 'system',
      text: `【擊殺】${boss.name}「${boss.title}」已倒下！恭喜英雄！`
    });

    // Drop loot
    boss.dropTable.forEach(drop => {
      if (Math.random() < drop.chance) {
        const amt = drop.amount
          ? Math.floor(drop.amount[0] + Math.random() * (drop.amount[1] - drop.amount[0]))
          : 1;
        UIManager.addChatMessage && UIManager.addChatMessage(state, {
          type: 'world',
          text: `💎 掉落：${drop.item}${amt > 1 ? ` ×${amt}` : ''} [${drop.rarity || 'common'}]`
        });
        if (drop.item === '金幣') {
          state.player.gold = (state.player.gold || 0) + amt;
          UIManager.updateHUD && UIManager.updateHUD(state);
        }
      }
    });

    // EXP reward
    const expGain = boss.level * 500;
    state.player.exp = (state.player.exp || 0) + Math.min(99, expGain / 100);
    UIManager.updateHUD && UIManager.updateHUD(state);

    // Respawn timer
    if (boss.respawnTimer) {
      const self = this;
      setTimeout(() => {
        boss.hp = boss.maxHp;
        boss.alive = true;
        boss.phase = 1;
        boss.phaseTriggered = false;
        boss.aggro = false;
        boss.x = boss.position ? boss.position.x : boss.x;
        boss.y = boss.position ? boss.position.y : boss.y;
        UIManager.addChatMessage && UIManager.addChatMessage(state, {
          type: 'system',
          text: `【重生】${boss.name} 再次降臨！`
        });
      }, boss.respawnTimer * 1000);
    }

    // Update active quests
    QuestManager.onBossKill(state, boss.id);
  },

  render(state, ctx) {
    if (!state.bosses) return;
    state.bosses.forEach(boss => {
      if (!boss.alive) return;
      const x = Math.floor(boss.x), y = Math.floor(boss.y);
      const size = boss.size || 2;

      ctx.save();

      // Boss shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(x, y + 20 * size, 20 * size, 8 * size, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hit flash
      if (boss.hitFlash > 0) {
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(boss.hitFlash * 0.5);
      }

      // Boss body (scaled)
      ctx.save();
      ctx.translate(x, y + boss.floatOffset);
      ctx.scale(size * 0.7, size * 0.7);
      this.drawBossBody(ctx, boss, 0, 0);
      ctx.restore();

      ctx.globalAlpha = 1;

      // Boss name plate
      const nameW = (boss.name.length + boss.title.length + 5) * 7 + 20;
      ctx.fillStyle = 'rgba(100,0,0,0.8)';
      ctx.fillRect(x - nameW / 2, y - 55 * size, nameW, 18);
      ctx.strokeStyle = 'rgba(200,0,0,0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - nameW / 2, y - 55 * size, nameW, 18);

      ctx.font = 'bold 11px "Noto Serif SC"';
      ctx.fillStyle = '#ff8080';
      ctx.textAlign = 'center';
      ctx.fillText(`⚔ ${boss.name} · ${boss.title}`, x, y - 41 * size);

      // Elite / phase indicator
      if (boss.phase === 2) {
        ctx.fillStyle = '#ff4040';
        ctx.font = 'bold 9px "Noto Serif SC"';
        ctx.fillText('【狂化】', x, y - 55 * size - 5);
      }

      ctx.textAlign = 'left';
      ctx.restore();
    });
  },

  drawBossBody(ctx, boss, x, y) {
    const col = boss.color || { body: '#808080', accent: '#a0a0a0', eyes: '#ffffff' };
    const anim = Math.sin(boss.animFrame * 0.8) * 2;

    // Aura glow
    ctx.fillStyle = `${col.body}44`;
    ctx.beginPath();
    ctx.ellipse(x, y + 15, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const radGrad = ctx.createRadialGradient(x - 3, y - 8, 2, x, y, 14);
    radGrad.addColorStop(0, col.accent);
    radGrad.addColorStop(1, col.body);
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 8, 6, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = col.body;
    ctx.beginPath();
    ctx.ellipse(x, y - 20 + anim, 12, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = col.eyes;
    ctx.beginPath();
    ctx.arc(x - 4, y - 21 + anim, 3, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 21 + anim, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(x - 3, y - 22 + anim, 1, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 22 + anim, 1, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.arc(x - 4, y - 21 + anim, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 21 + anim, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Crown / boss indicator
    ctx.fillStyle = '#ffd700';
    const points = [[x - 8, y - 32 + anim], [x - 4, y - 28 + anim], [x, y - 33 + anim], [x + 4, y - 28 + anim], [x + 8, y - 32 + anim], [x + 8, y - 26 + anim], [x - 8, y - 26 + anim]];
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.forEach(p => ctx.lineTo(...p));
    ctx.closePath();
    ctx.fill();

    // Phase 2 rage aura
    if (boss.phase === 2) {
      ctx.strokeStyle = 'rgba(255,80,0,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 22 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
};

// ============================================================
// ELITE MONSTER MANAGER
// ============================================================
const EliteManager = {
  spawnElite(state, eliteId, x, y) {
    const def = WorldData.elites.find(e => e.id === eliteId);
    if (!def) return null;
    const elite = {
      name: def.name,
      baseType: def.baseType,
      level: def.level,
      hp: 3000 * def.hpMultiplier,
      maxHp: 3000 * def.hpMultiplier,
      atk: 200 * def.atkMultiplier,
      def: 80,
      x: x || 500, y: y || 500,
      alive: true,
      isElite: true,
      eliteId: def.id,
      eliteDef: def,
      aggro: false,
      aggroRange: 220,
      attackRange: 60,
      attackCooldown: 0,
      animFrame: 0,
      animTimer: 0,
      hitFlash: 0,
      wanderTimer: 0,
      wanderDir: { x: 0, y: 0 },
    };
    state.monsters.push(elite);
    return elite;
  },

  trySpawnElites(state) {
    if (!state.currentRegion) return;
    const region = state.currentRegion;
    const currentEliteCount = state.monsters.filter(m => m.isElite && m.alive).length;
    if (currentEliteCount >= 3) return;

    region.eliteMonsters.forEach(eliteName => {
      const def = WorldData.elites.find(e => e.name === eliteName);
      if (!def || Math.random() > def.spawnWeight) return;
      const px = state.player.x, py = state.player.y;
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 300;
      const sx = Math.max(80, Math.min(state.map.width - 80, px + Math.cos(angle) * dist));
      const sy = Math.max(80, Math.min(state.map.height - 80, py + Math.sin(angle) * dist));
      this.spawnElite(state, def.id, sx, sy);
      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'system',
        text: `【精英】${def.name} 出現了！`
      });
    });
  },

  onEliteKill(state, elite) {
    // Drop elite loot
    const def = elite.eliteDef;
    if (!def) return;
    def.dropBonus.forEach(item => {
      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'world',
        text: `💎 精英掉落：${item}`
      });
    });
    state.player.exp = Math.min(100, (state.player.exp || 0) + 15);
    UIManager.updateHUD && UIManager.updateHUD(state);
    QuestManager.onEliteKill(state, elite.name);
  }
};

// ============================================================
// QUEST MANAGER
// ============================================================
const QuestManager = {
  init(state) {
    state.activeQuests = [];
    state.completedQuests = [];
    state.questProgress = {};
  },

  acceptQuest(state, questId) {
    if (state.activeQuests.find(q => q.id === questId)) return;
    if (state.completedQuests.includes(questId)) return;
    const def = WorldData.quests.find(q => q.id === questId);
    if (!def) return;
    if (state.player.level < def.levelReq) {
      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'system',
        text: `【任務】等級不足！需要 Lv.${def.levelReq} 才能接受「${def.name}」。`
      });
      return;
    }
    const quest = {
      ...def,
      objectives: def.objectives.map(o => ({ ...o, current: 0 })),
      status: 'active',
    };
    state.activeQuests.push(quest);
    state.questProgress[questId] = {};
    UIManager.addChatMessage && UIManager.addChatMessage(state, {
      type: 'npc',
      text: `【接受任務】${def.name} · ${def.description}`
    });
    this.refreshQuestPanel(state);
  },

  onMonsterKill(state, monsterName, isElite) {
    state.activeQuests.forEach(quest => {
      quest.objectives.forEach(obj => {
        if (obj.current >= obj.count) return;
        if (obj.type === 'kill' && obj.target === monsterName) {
          obj.current = Math.min(obj.count, obj.current + 1);
          obj.desc = obj.desc.replace(/\d+\/\d+/, `${obj.current}/${obj.count}`);
        }
      });
      this.checkQuestCompletion(state, quest);
    });
  },

  onEliteKill(state, eliteName) {
    state.activeQuests.forEach(quest => {
      quest.objectives.forEach(obj => {
        if (obj.current >= obj.count) return;
        if (obj.type === 'kill_elite' && obj.target === eliteName) {
          obj.current = Math.min(obj.count, obj.current + 1);
          obj.desc = obj.desc.replace(/\d+\/\d+/, `${obj.current}/${obj.count}`);
        }
      });
      this.checkQuestCompletion(state, quest);
    });
  },

  onBossKill(state, bossId) {
    state.activeQuests.forEach(quest => {
      quest.objectives.forEach(obj => {
        if (obj.current >= obj.count) return;
        if (obj.type === 'kill_boss' && obj.target === bossId) {
          obj.current = Math.min(obj.count, obj.current + 1);
          obj.desc = obj.desc.replace(/\d+\/\d+/, `${obj.current}/${obj.count}`);
        }
      });
      this.checkQuestCompletion(state, quest);
    });
  },

  checkQuestCompletion(state, quest) {
    const done = quest.objectives.every(o => o.current >= o.count);
    if (done && quest.status === 'active') {
      quest.status = 'completed';
      state.completedQuests.push(quest.id);
      state.activeQuests = state.activeQuests.filter(q => q.id !== quest.id);

      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'system',
        text: `【任務完成】${quest.name}！`
      });

      // Grant rewards
      if (quest.rewards) {
        state.player.exp = Math.min(100, (state.player.exp || 0) + Math.min(50, quest.rewards.exp / 1000));
        state.player.gold = (state.player.gold || 0) + (quest.rewards.gold || 0);
        UIManager.updateHUD && UIManager.updateHUD(state);
        if (quest.rewards.items) {
          quest.rewards.items.forEach(item => {
            UIManager.addChatMessage && UIManager.addChatMessage(state, {
              type: 'world',
              text: `🎁 獲得：${item.name} [${item.rarity}]`
            });
          });
        }
      }

      // Show notification
      const notifArea = document.getElementById('notification-area');
      if (notifArea) {
        const div = document.createElement('div');
        div.className = 'system-notification';
        div.innerHTML = `✅ 任務完成：${quest.name}`;
        notifArea.appendChild(div);
        setTimeout(() => div.remove(), 3500);
      }

      this.refreshQuestPanel(state);
    }
  },

  refreshQuestPanel(state) {
    const list = document.getElementById('quest-list-container');
    if (!list) return;
    list.innerHTML = '';
    const allQuests = [
      ...state.activeQuests,
      ...state.completedQuests.map(id => ({
        ...WorldData.quests.find(q => q.id === id),
        status: 'completed',
        objectives: (WorldData.quests.find(q => q.id === id) || {}).objectives || []
      })).filter(q => q.id)
    ];
    allQuests.slice(0, 12).forEach(quest => {
      const el = document.createElement('div');
      el.className = `quest-entry ${quest.status === 'active' ? 'active' : 'completed'}`;
      const typeIcon = quest.type === 'boss' ? '⚔' : quest.type === 'main' ? '📖' : '📌';
      el.innerHTML = `
        <div class="quest-name">${typeIcon} ${quest.name}</div>
        <div class="quest-desc">${quest.description}</div>
        <div class="quest-objectives">
          ${(quest.objectives || []).map(o => `
            <div class="quest-obj-item ${o.current >= o.count ? 'done' : ''}">
              ${o.desc}
            </div>
          `).join('')}
        </div>
        ${quest.rewards ? `<div class="quest-reward">🏆 EXP: ${quest.rewards.exp?.toLocaleString()} · 金幣: ${quest.rewards.gold?.toLocaleString()}</div>` : ''}
      `;
      list.appendChild(el);
    });
    if (allQuests.length === 0) {
      list.innerHTML = '<div style="padding:12px;color:rgba(200,180,130,0.6);font-size:10px;text-align:center;">暫無任務，去找NPC接取任務吧！</div>';
    }
  }
};

// ============================================================
// NPC DIALOG MANAGER
// ============================================================
const NPCDialogManager = {
  currentNPC: null,

  openDialog(state, npc) {
    this.currentNPC = npc;
    const panel = document.getElementById('npc-dialog-panel');
    if (!panel) return;

    const portrait = panel.querySelector('.npc-dialog-portrait');
    const nameEl = panel.querySelector('.npc-dialog-name');
    const roleEl = panel.querySelector('.npc-dialog-role');
    const textEl = panel.querySelector('.npc-dialog-text');
    const optionsEl = panel.querySelector('.npc-dialog-options');

    if (portrait) portrait.textContent = npc.emoji || '👤';
    if (nameEl) nameEl.textContent = npc.name;
    if (roleEl) roleEl.textContent = npc.role;

    // Determine greeting
    const hasCompletedQuest = npc.quests && npc.quests.some(qId => state.completedQuests?.includes(qId));
    const text = hasCompletedQuest ? (npc.dialog?.after_quest || npc.dialog?.greeting) : (npc.dialog?.greeting || '（NPC沉默）');
    if (textEl) textEl.textContent = text;

    // Build options
    if (optionsEl) {
      optionsEl.innerHTML = '';
      // Quest options
      if (npc.quests && npc.quests.length > 0) {
        npc.quests.forEach(qId => {
          if (state.completedQuests?.includes(qId)) return;
          const questDef = WorldData.quests.find(q => q.id === qId);
          if (!questDef) return;
          const isActive = state.activeQuests?.find(q => q.id === qId);
          const btn = document.createElement('button');
          btn.className = 'npc-opt-btn';
          btn.textContent = isActive ? `📖 查看任務：${questDef.name}` : `📜 接受任務：${questDef.name}`;
          btn.addEventListener('click', () => {
            if (!isActive) QuestManager.acceptQuest(state, qId);
            if (textEl) textEl.textContent = npc.dialog?.quest_hint || questDef.story;
          });
          optionsEl.appendChild(btn);
        });
      }
      // Lore option
      if (npc.dialog?.lore) {
        const loreBtn = document.createElement('button');
        loreBtn.className = 'npc-opt-btn';
        loreBtn.textContent = '💬 詢問：這裡有什麼故事嗎？';
        loreBtn.addEventListener('click', () => {
          if (textEl) textEl.textContent = npc.dialog.lore;
          UIManager.addChatMessage && UIManager.addChatMessage(state, {
            type: 'lore', sender: npc.name, text: npc.dialog.lore.substring(0, 60) + '...'
          });
        });
        optionsEl.appendChild(loreBtn);
      }
      // Merchant option
      if (npc.merchandise && npc.merchandise.length > 0) {
        const shopBtn = document.createElement('button');
        shopBtn.className = 'npc-opt-btn';
        shopBtn.textContent = '🛍️ 查看販賣物品';
        shopBtn.addEventListener('click', () => {
          if (textEl) textEl.textContent = (npc.dialog?.shop_prompt || '請選擇您想要的物品：') +
            '\n' + npc.merchandise.map(m => `${m.icon} ${m.name} - ${m.price > 0 ? m.price + '金幣' : '免費'} [${m.rarity}]`).join('\n');
        });
        optionsEl.appendChild(shopBtn);
      }
      // Close
      const closeBtn = document.createElement('button');
      closeBtn.className = 'npc-opt-btn';
      closeBtn.textContent = '👋 告辭';
      closeBtn.addEventListener('click', () => this.closeDialog());
      optionsEl.appendChild(closeBtn);
    }

    panel.classList.add('visible');
  },

  closeDialog() {
    const panel = document.getElementById('npc-dialog-panel');
    if (panel) panel.classList.remove('visible');
    this.currentNPC = null;
  }
};

// ============================================================
// LORE STONE MANAGER
// ============================================================
const LoreStoneManager = {
  interactRadius: 60,

  checkInteraction(state) {
    if (!state.loreStones) return;
    const px = state.player.x, py = state.player.y;
    let found = null;
    state.loreStones.forEach(ls => {
      const dist = Math.hypot(px - ls.x, py - ls.y);
      if (dist < this.interactRadius) found = ls;
    });
    const tooltip = document.getElementById('lore-tooltip');
    if (!tooltip) return;
    if (found) {
      const title = tooltip.querySelector('.lore-tooltip-title');
      const text = tooltip.querySelector('.lore-tooltip-text');
      if (title) title.textContent = `${found.emoji} ${found.title}`;
      if (text) text.textContent = found.text;
      tooltip.classList.add('visible');
      tooltip.style.top = '40%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    } else {
      tooltip.classList.remove('visible');
    }
  },

  render(state, ctx) {
    if (!state.loreStones) return;
    state.loreStones.forEach(ls => {
      const x = ls.x, y = ls.y;
      // Stone base
      ctx.fillStyle = 'rgba(80,50,120,0.8)';
      ctx.beginPath();
      ctx.ellipse(x, y, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Rune glow
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
      ctx.fillStyle = `rgba(180,120,255,${0.4 + pulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y - 8, 5, 0, Math.PI * 2);
      ctx.fill();
      // Emoji
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(ls.emoji || '📜', x, y - 4);
      ctx.textAlign = 'left';
      // Interaction hint
      const dist = Math.hypot(state.player.x - x, state.player.y - y);
      if (dist < 100) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(x - 30, y - 22, 60, 12);
        ctx.fillStyle = '#ddaaff';
        ctx.font = '8px "Noto Serif SC"';
        ctx.textAlign = 'center';
        ctx.fillText('靠近查看典故', x, y - 13);
        ctx.textAlign = 'left';
      }
    });
  }
};

// ============================================================
// DUNGEON MANAGER - Handles dungeon entry/exit
// ============================================================
const DungeonManager = {
  currentDungeon: null,
  inDungeon: false,

  checkDungeonEntrance(state) {
    if (!state.currentRegion?.dungeonEntrance) return;
    const def = WorldData.dungeons.find(d => d.id === state.currentRegion.dungeonEntrance);
    if (!def) return;
    const dist = Math.hypot(state.player.x - def.entranceX, state.player.y - def.entranceY);
    if (dist < 50) {
      if (state.player.level < def.levelReq) {
        UIManager.addChatMessage && UIManager.addChatMessage(state, {
          type: 'system',
          text: `【副本】需要 Lv.${def.levelReq} 才能進入「${def.name}」！`
        });
        return;
      }
      this.enterDungeon(state, def);
    }
  },

  enterDungeon(state, def) {
    if (this.inDungeon) return;
    // Show transition overlay
    const overlay = document.getElementById('dungeon-overlay');
    if (overlay) {
      const textEl = overlay.querySelector('.dungeon-enter-text');
      const subEl = overlay.querySelector('.dungeon-enter-sub');
      if (textEl) textEl.textContent = `進入副本：${def.name}`;
      if (subEl) subEl.textContent = `${def.nameEn} · ${def.floors}層 · 需求等級 Lv.${def.levelReq}`;
      overlay.classList.add('visible');
      setTimeout(() => overlay.classList.remove('visible'), 2500);
    }
    UIManager.addChatMessage && UIManager.addChatMessage(state, {
      type: 'system',
      text: `【進入副本】${def.name} · ${def.nameEn} · ${def.floors}層`
    });
    UIManager.addChatMessage && UIManager.addChatMessage(state, {
      type: 'lore',
      text: `"${def.lore.substring(0, 80)}..."`
    });

    // Spawn boss if not already alive
    if (def.boss) {
      const bossAlive = state.bosses && state.bosses.find(b => b.id === def.boss && b.alive);
      if (!bossAlive) {
        setTimeout(() => {
          BossManager.spawnBoss(state, def.boss, state.player.x + 400, state.player.y);
        }, 3000);
      }
    }

    this.currentDungeon = def;
    this.inDungeon = true;
    setTimeout(() => { this.inDungeon = false; }, 30000);
  }
};

// ============================================================
// REGION MAP PANEL
// ============================================================
const RegionMapPanel = {
  init(state) {
    const panel = document.getElementById('region-map-panel');
    if (!panel) return;
    const grid = panel.querySelector('.region-map-grid');
    if (!grid) return;
    grid.innerHTML = '';

    WorldData.regions.forEach(region => {
      const card = document.createElement('div');
      const isCurrent = state.currentRegion?.id === region.id;
      card.className = `region-card ${isCurrent ? 'current' : ''} ${region.locked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="region-card-icon">${region.icon}</div>
        <div class="region-card-name">${region.name}</div>
        <div class="region-card-level">Lv.${region.levelRange[0]}~${region.levelRange[1]}</div>
        <div class="region-card-type">${region.type} ${region.locked ? '🔒' : ''}</div>
      `;
      if (!region.locked) {
        card.addEventListener('click', () => {
          // Teleport to region
          state.player.x = region.spawnX;
          state.player.y = region.spawnY;
          RegionManager.enterRegion(state, region.id);
          panel.classList.remove('visible');
          UIManager.addChatMessage && UIManager.addChatMessage(state, {
            type: 'system',
            text: `【傳送】已傳送至 ${region.name}！`
          });
        });
      }
      grid.appendChild(card);
    });
  },

  refresh(state) {
    const cards = document.querySelectorAll('.region-card');
    cards.forEach((card, i) => {
      const region = WorldData.regions[i];
      if (!region) return;
      card.classList.toggle('current', state.currentRegion?.id === region.id);
    });
  }
};

// ============================================================
// EXPANSION RENDERER - Patches into existing Renderer
// ============================================================
const ExpansionRenderer = {
  patchRenderer(state) {
    if (typeof Renderer === 'undefined') return;
    const origRenderNPCs = Renderer.renderNPCs.bind(Renderer);
    Renderer.renderNPCs = function(state, ctx) {
      origRenderNPCs(state, ctx);
      // Render lore stones
      LoreStoneManager.render(state, ctx);
    };

    const origRender = Renderer.render.bind(Renderer);
    Renderer.render = function(state, dt) {
      origRender(state, dt);
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.save();
      ctx.translate(-state.camera.x, -state.camera.y);
      // Render bosses
      BossManager.render(state, ctx);
      ctx.restore();
    };
  }
};

// ============================================================
// EXPANSION PHYSICS - Patches into existing Physics
// ============================================================
const ExpansionPhysics = {
  patchPhysics(state) {
    if (typeof Physics === 'undefined') return;

    const origAutoAttack = Physics.autoAttack.bind(Physics);
    Physics.autoAttack = function(state) {
      origAutoAttack(state);
      // Also check boss hits
      const px = state.player.x, py = state.player.y;
      const attackRange = 70;
      (state.bosses || []).forEach(boss => {
        if (!boss.alive) return;
        const dist = Math.hypot(px - boss.x, py - boss.y);
        if (dist < attackRange) {
          const dmg = (state.player.atk || 1000) + Math.floor(Math.random() * 200);
          BossManager.takeDamage(state, boss, dmg);
          UIManager.addFloatingText && UIManager.addFloatingText(state,
            window.innerWidth / 2 + (Math.random() - 0.5) * 80,
            window.innerHeight / 2 - 40,
            `-${dmg.toLocaleString()}`,
            '#ffcc00'
          );
        }
      });
      // Check elite hits
      state.monsters.forEach(m => {
        if (!m.alive || !m.isElite) return;
        const dist = Math.hypot(px - m.x, py - m.y);
        if (dist < attackRange) {
          // Elite takes extra damage notification
          if (m.hp <= 0) {
            m.alive = false;
            EliteManager.onEliteKill(state, m);
            QuestManager.onEliteKill && QuestManager.onEliteKill(state, m.name);
          }
        }
      });
    };

    // Patch UIManager.damageMonsters to check elite kills
    if (typeof UIManager !== 'undefined') {
      const origDmgMonsters = UIManager.damageMonsters.bind(UIManager);
      UIManager.damageMonsters = function(state, x, y, radius, minDmg, maxDmg) {
        origDmgMonsters(state, x, y, radius, minDmg, maxDmg);
        // Boss damage
        (state.bosses || []).forEach(boss => {
          if (!boss.alive) return;
          const dist = Math.hypot(boss.x - x, boss.y - y);
          if (dist < radius) {
            const dmg = Math.floor(minDmg + Math.random() * (maxDmg - minDmg));
            BossManager.takeDamage(state, boss, dmg);
          }
        });
        // Quest tracking for kills
        state.monsters.forEach(m => {
          if (m.alive === false) {
            QuestManager.onMonsterKill && QuestManager.onMonsterKill(state, m.name, m.isElite);
            if (m.isElite) {
              EliteManager.onEliteKill(state, m);
            }
          }
        });
      };
    }
  }
};

// ============================================================
// EXPANDED MINIMAP - Adds boss/region markers
// ============================================================
const ExpansionMinimap = {
  patchMinimap(state) {
    if (typeof MinimapRenderer === 'undefined') return;
    const origRender = MinimapRenderer.render.bind(MinimapRenderer);
    MinimapRenderer.render = function(state) {
      origRender(state);
      const ctx = this.ctx;
      const s = this.size;
      if (!ctx || !s) return;

      const scaleX = s / state.map.width;
      const scaleY = s / state.map.height;

      ctx.save();
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
      ctx.clip();

      // Bosses on minimap (red star)
      (state.bosses || []).forEach(boss => {
        if (!boss.alive) return;
        const bx = boss.x * scaleX, by = boss.y * scaleY;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Lore stones (purple dot)
      (state.loreStones || []).forEach(ls => {
        const lx = ls.x * scaleX, ly = ls.y * scaleY;
        ctx.fillStyle = '#cc80ff';
        ctx.beginPath();
        ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dungeon entrances (yellow D)
      if (state.currentRegion?.dungeonEntrance) {
        const def = WorldData.dungeons.find(d => d.id === state.currentRegion.dungeonEntrance);
        if (def) {
          const dx = def.entranceX * scaleX, dy = def.entranceY * scaleY;
          ctx.fillStyle = '#ffdd44';
          ctx.beginPath();
          ctx.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };
  }
};

// ============================================================
// WORLD TICKER EXPANSION
// ============================================================
const ExpansionTicker = {
  init(state) {
    const ticker = document.querySelector('.ticker-text');
    if (!ticker) return;
    const msgs = WorldData.worldChats
      .filter(m => m.type === 'world' || m.type === 'system')
      .map(m => `${m.sender ? `[${m.sender}] ` : ''}${m.text}`)
      .join('  ◆  ');
    ticker.textContent = msgs;
  }
};

// ============================================================
// AUTO BOSS SPAWN TIMER
// ============================================================
const BossSpawnTimer = {
  timers: {},

  init(state) {
    // Spawn a boss every 5 minutes near the player's region
    setInterval(() => {
      const region = state.currentRegion;
      if (!region || !region.boss) return;
      const bossAlive = (state.bosses || []).find(b => b.id === region.boss && b.alive);
      if (!bossAlive) {
        const angle = Math.random() * Math.PI * 2;
        const bx = state.player.x + Math.cos(angle) * 500;
        const by = state.player.y + Math.sin(angle) * 500;
        BossManager.spawnBoss(state, region.boss, bx, by);
      }
    }, 5 * 60 * 1000); // every 5 minutes

    // Spawn elites every 30 seconds
    setInterval(() => {
      EliteManager.trySpawnElites(state);
    }, 30000);

    // Trigger auto boss spawn after 3 minutes for first time
    setTimeout(() => {
      const region = state.currentRegion;
      if (!region) return;
      const bossId = region.boss;
      if (!bossId) return;
      const bossAlive = (state.bosses || []).find(b => b.id === bossId && b.alive);
      if (!bossAlive) {
        const px = state.player.x, py = state.player.y;
        BossManager.spawnBoss(state, bossId, px + 600, py + 200);
      }
    }, 3 * 60 * 1000);
  }
};

// ============================================================
// EXPANSION INIT - Called after game initializes
// ============================================================
const ExpansionInit = {
  async init(state) {
    // Wait for GameState to be ready
    let attempts = 0;
    while (attempts < 50 && (!state.player || !state.map)) {
      await new Promise(r => setTimeout(r, 200));
      attempts++;
    }
    if (!state.player) return;

    // Initialize all expansion systems
    RegionManager.init(state);
    QuestManager.init(state);
    BossManager.init(state);

    // Patch into existing systems
    ExpansionRenderer.patchRenderer(state);
    ExpansionPhysics.patchPhysics(state);
    ExpansionMinimap.patchMinimap(state);

    // Start world ticker
    ExpansionTicker.init(state);

    // Start boss spawner
    BossSpawnTimer.init(state);

    // Init region map panel
    RegionMapPanel.init(state);

    // Init NPC click handlers
    this.initNPCInteraction(state);

    // Add expansion world chat messages
    WorldData.worldChats.forEach((msg, i) => {
      setTimeout(() => {
        UIManager.addChatMessage && UIManager.addChatMessage(state, msg);
      }, (i + 3) * 5000);
    });

    // Patch into game loop
    this.patchGameLoop(state);

    console.log('[Expansion] 世界擴充內容已載入！');
    console.log(`[Expansion] 地區: ${WorldData.regions.length}, 副本: ${WorldData.dungeons.length}, BOSS: ${WorldData.bosses.length}, 精英: ${WorldData.elites.length}, NPC: ${WorldData.npcs.length}, 任務: ${WorldData.quests.length}`);

    // Show initial area message
    setTimeout(() => {
      UIManager.addChatMessage && UIManager.addChatMessage(state, {
        type: 'system',
        text: '【世界】仙劍天下擴充世界已載入！新增7大區域、5座副本、5位BOSS、多位NPC與任務！'
      });
    }, 3000);
  },

  initNPCInteraction(state) {
    if (typeof Renderer !== 'undefined') {
      const origRenderNPCs = Renderer.renderNPCs.bind(Renderer);
      Renderer.renderNPCs = function(state, ctx) {
        origRenderNPCs(state, ctx);
        // Check NPC proximity for interaction
        const px = state.player.x, py = state.player.y;
        state.npcs.forEach(npc => {
          if (!npc.fromExpansion) return;
          const dist = Math.hypot(px - npc.x, py - npc.y);
          if (dist < 70) {
            const sx = npc.x - state.camera.x;
            const sy = npc.y - state.camera.y - 60;
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(sx - 25, sy - 12, 50, 14);
            ctx.fillStyle = '#ffdd44';
            ctx.font = '9px "Noto Serif SC"';
            ctx.textAlign = 'center';
            ctx.fillText('[F] 對話', sx, sy);
            ctx.textAlign = 'left';
            ctx.restore();
          }
        });
      };
    }

    // F key for NPC interaction
    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() !== 'f') return;
      if (NPCDialogManager.currentNPC) {
        NPCDialogManager.closeDialog();
        return;
      }
      const px = state.player.x, py = state.player.y;
      let nearest = null, nearestDist = Infinity;
      state.npcs.forEach(npc => {
        const dist = Math.hypot(px - npc.x, py - npc.y);
        if (dist < 80 && dist < nearestDist) { nearestDist = dist; nearest = npc; }
      });
      if (nearest) NPCDialogManager.openDialog(state, nearest);

      // Check lore stones
      LoreStoneManager.checkInteraction(state);
    });
  },

  patchGameLoop(state) {
    // Store original gameLoop tick
    const origLoop = window.gameLoop;
    if (!origLoop) return;
    window.gameLoop = function(timestamp) {
      origLoop(timestamp);
      // Expansion updates (every frame)
      RegionManager.checkRegionTransition(state);
      LoreStoneManager.checkInteraction(state);
      DungeonManager.checkDungeonEntrance(state);
      BossManager.update(state, 0.016);
      RegionMapPanel.refresh(state);
    };
  }
};

// Auto-start when DOM + game are ready
document.addEventListener('DOMContentLoaded', () => {
  const waitForState = setInterval(() => {
    if (typeof GameState !== 'undefined') {
      clearInterval(waitForState);
      ExpansionInit.init(GameState);
    }
  }, 300);
});
