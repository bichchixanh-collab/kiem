# MMORPG Browser Game Architecture

━━━━━━━━━━━━━━━━━━━━
PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━

Project Type:

* Browser MMORPG Prototype
* Offline-first ARPG
* Pixel Art
* Top-down Action RPG

Goal:
Create a commercial-quality indie MMORPG browser prototype using REAL PNG assets and a stable reusable engine architecture.

━━━━━━━━━━━━━━━━━━━━
CORE ENGINE RULES
━━━━━━━━━━━━━━━━━━━━

The project MUST use:

* HTML
* CSS
* Vanilla JavaScript

The project MUST NOT use:

* React
* Vue
* Angular
* TypeScript
* TSX
* JSX
* NextJS
* Vite
* Webpack
* Tailwind

━━━━━━━━━━━━━━━━━━━━
RENDERING RULES
━━━━━━━━━━━━━━━━━━━━

Rendering:

* HTML5 Canvas
* drawImage() rendering only

Canvas is ONLY allowed for:

* rendering sprites
* rendering tilemaps
* rendering particles from PNG textures
* camera rendering
* spritesheet animation

Canvas MUST NEVER:

* generate artwork
* generate terrain
* generate UI graphics
* generate procedural sprites
* generate placeholder visuals

FORBIDDEN:

* fillRect() as final graphics
* arc() as final graphics
* procedural rendering
* runtime-generated textures
* canvas-to-dataURL asset generation

━━━━━━━━━━━━━━━━━━━━
ASSET PIPELINE
━━━━━━━━━━━━━━━━━━━━

ALL artwork MUST exist as REAL STATIC PNG FILES before runtime.

Assets:

* PNG spritesheets
* PNG tilesets
* PNG UI textures
* PNG effects
* PNG inventory icons
* PNG monster sprites
* PNG environment props

Runtime-generated textures are NOT allowed.

All visuals must originate from:

* physical PNG files
* asset folders
* texture atlases

━━━━━━━━━━━━━━━━━━━━
FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━

/assets/
/characters/
/monsters/
/tilesets/
/maps/
/effects/
/items/
/ui/
/audio/

/src/
game.js
renderer.js
entities.js
combat.js
inventory.js
world.js

/index.html
/style.css

━━━━━━━━━━━━━━━━━━━━
WORLD DESIGN RULES
━━━━━━━━━━━━━━━━━━━━

World Style:

* Chinese fantasy MMORPG
* old-school Korean MMO atmosphere
* immersive pixel world

World System:

* chunk streaming
* open-world illusion
* reusable map chunks

Required Regions:

* forests
* villages
* caves
* temples
* mountains
* ruins
* sect headquarters

━━━━━━━━━━━━━━━━━━━━
GAMEPLAY RULES
━━━━━━━━━━━━━━━━━━━━

Required Systems:

* WASD movement
* mouse targeting
* ARPG combat
* enemy AI
* aggro system
* inventory
* equipment
* quests
* minimap
* loot drops
* HP/MP system
* skills
* cooldowns
* floating damage numbers

━━━━━━━━━━━━━━━━━━━━
UI RULES
━━━━━━━━━━━━━━━━━━━━

UI Style:

* classic Korean MMORPG
* fantasy pixel UI
* ornate fantasy frames

UI MUST use PNG textures only.

No CSS-generated fake MMORPG UI.

━━━━━━━━━━━━━━━━━━━━
EXPANSION RULES
━━━━━━━━━━━━━━━━━━━━

Future chats/extensions MUST:

* reuse existing architecture
* reuse renderer
* reuse asset pipeline
* reuse gameplay systems

Future expansions MUST NOT:

* rewrite engine
* replace renderer
* migrate framework
* regenerate assets
* change architecture

All future work must integrate into the EXISTING codebase.
