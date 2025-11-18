// my-portfolio/scripts/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const promptDiv = document.getElementById('prompt');

// --- CONFIGURATION ---
const GRAVITY = 0.8;
const FRICTION = 0.85; 
const MOVE_SPEED = 3.5; 
const JUMP_FORCE = 18; // High jump for floating platforms
const GROUND_Y = 110; 
const TILE_SIZE = 48; 
const WORLD_WIDTH = 2000; 

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- ASSET LOADING SYSTEM ---
const playerSprite = new Image(); playerSprite.src = 'Images/AnimationSheet_Character.png';
const imgTileset = new Image();   imgTileset.src = 'Images/oak_woods_tileset.png';
const imgPortal = new Image();    imgPortal.src = 'Images/PORTAL BLUE-Sheet.png';
const imgChests = new Image();    imgChests.src = 'Images/Chests.png'; 

// ASSETS FOR SECTIONS
const imgChest0 = new Image(); imgChest0.src = 'Images/chest_0.png';
const imgChest1 = new Image(); imgChest1.src = 'Images/chest_1.png';
const imgChest2 = new Image(); imgChest2.src = 'Images/chest_2.png';
const imgChest3 = new Image(); imgChest3.src = 'Images/chest_3.png';
const imgChest4 = new Image(); imgChest4.src = 'Images/chest_4.png';

const imgRetro0 = new Image(); imgRetro0.src = 'Images/retro_chest_0.png';
const imgRetro1 = new Image(); imgRetro1.src = 'Images/retro_chest_1.png';
const imgRetro2 = new Image(); imgRetro2.src = 'Images/retro_chest_2.png';
const imgRetro3 = new Image(); imgRetro3.src = 'Images/retro_chest_3.png';

const imgWooden0 = new Image(); imgWooden0.src = 'Images/wooden_chest_0.png';
const imgWooden1 = new Image(); imgWooden1.src = 'Images/wooden_chest_1.png';
const imgWooden2 = new Image(); imgWooden2.src = 'Images/wooden_chest_2.png';
const imgWooden3 = new Image(); imgWooden3.src = 'Images/wooden_chest_3.png';
const imgWooden4 = new Image(); imgWooden4.src = 'Images/wooden_chest_4.png';

// Backgrounds
const bgLayer1 = new Image(); bgLayer1.src = 'Images/background_layer_1.png';
const bgLayer2 = new Image(); bgLayer2.src = 'Images/background_layer_2.png';
const bgLayer3 = new Image(); bgLayer3.src = 'Images/background_layer_3.png';

// Decorations
const imgLamp = new Image();     imgLamp.src = 'Images/lamp.png';
const imgFence1 = new Image();   imgFence1.src = 'Images/fence_1.png'; 
const imgFence2 = new Image();   imgFence2.src = 'Images/fence_2.png'; 
const imgSign = new Image();     imgSign.src = 'Images/sign.png';
const imgRock1 = new Image();    imgRock1.src = 'Images/rock_1.png';
const imgRock2 = new Image();    imgRock2.src = 'Images/rock_2.png';
const imgRock3 = new Image();    imgRock3.src = 'Images/rock_3.png';
const imgGrass1 = new Image();   imgGrass1.src = 'Images/grass_1.png';
const imgGrass2 = new Image();   imgGrass2.src = 'Images/grass_2.png';
const imgGrass3 = new Image();   imgGrass3.src = 'Images/grass_3.png';

// SPECIFIC SIGNS
const imgSign1 = new Image(); imgSign1.src = 'Images/sign1.png'; 
const imgSign2 = new Image(); imgSign2.src = 'Images/sign2.png'; 
const imgSign3 = new Image(); imgSign3.src = 'Images/sign3.png'; 
const imgSign4 = new Image(); imgSign4.src = 'Images/sign4.png'; 

// --- PLATFORM DATA ---
const platforms = [
    { x: 0,    h: 320, width: 9 }, // Projects
    { x: 500,  h: 250, width: 2 }, // Step 1
    { x: 600,  h: 150, width: 2 }, // Step 2
    { x: 800,  h: 200, width: 5 }, // Skills
    { x: 1100, h: 300, width: 5.4  }, // About
];

// --- CLASSES ---

class Layer {
  constructor(image, speedModifier, yOffset = 0) {
    this.image = image;
    this.speedModifier = speedModifier;
    this.yOffset = yOffset;
    this.width = 928; 
    this.height = 793;
  }

  draw(ctx, cameraX) {
    const localX = -(cameraX * this.speedModifier) % this.width;
    const drawY = canvas.height - this.height + this.yOffset;
    
    if (this.image.complete && this.image.naturalWidth !== 0) {
      ctx.drawImage(this.image, localX, drawY, this.width, this.height);
      ctx.drawImage(this.image, localX + this.width, drawY, this.width, this.height);
      ctx.drawImage(this.image, localX + this.width * 2, drawY, this.width, this.height);
      if (localX > 0) {
          ctx.drawImage(this.image, localX - this.width, drawY, this.width, this.height);
      }
    }
  }
}

class Decoration {
  constructor(image, x, scale = 2.5, yOffset = 0, onPlatformHeight = 0) {
    this.image = image;
    this.x = x;
    this.scale = scale;
    this.yOffset = yOffset;
    this.onPlatformHeight = onPlatformHeight;
  }

  draw(ctx) {
    if (this.image.complete && this.image.naturalWidth !== 0) {
        const drawW = this.image.width * this.scale;
        const drawH = this.image.height * this.scale;
        let baseY = canvas.height - GROUND_Y;
        if (this.onPlatformHeight > 0) {
            baseY -= this.onPlatformHeight;
        }
        const drawY = baseY - drawH + this.yOffset;
        ctx.drawImage(this.image, this.x, drawY, drawW, drawH);
    }
  }
}

class Sign {
  constructor(image, x, text, heightOffset = 0, scale = 0.6) {
    this.image = image;
    this.x = x;
    this.text = text;
    this.scale = scale; // Individual scale
    this.heightOffset = heightOffset;
  }

  draw(ctx) {
    if (!this.image.complete || this.image.naturalWidth === 0) return;
    const drawW = this.image.width * this.scale;
    const drawH = this.image.height * this.scale;
    
    const baseY = canvas.height - GROUND_Y - this.heightOffset;
    const drawY = baseY - drawH + 10; 

    ctx.drawImage(this.image, this.x, drawY, drawW, drawH);
    
    if (this.text) {
        ctx.fillStyle = '#3e2723'; 
        ctx.font = '8px "Press Start 2P"'; 
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x + drawW / 2, drawY + drawH / 3 + 8);
    }
  }
}

class Portal {
  constructor(x, link, name = "EXIT") {
    this.image = imgPortal;
    this.x = x;
    this.link = link;
    this.name = name;
    this.scale = 3.5;
    this.totalFrames = 8; 
    this.frameX = 0;
    this.gameFrame = 0;
    this.staggerFrames = 6; 
    this.width = 0;
    this.height = 0;
    this.actionVerb = (name === "EXIT") ? "EXIT" : "OPEN";
  }

  draw(ctx) {
    if (!this.image.complete || this.image.naturalWidth === 0) return;
    const spriteW = this.image.width / this.totalFrames;
    const spriteH = this.image.height;
    this.width = spriteW * this.scale;
    this.height = spriteH * this.scale;
    
    const drawY = canvas.height - GROUND_Y - this.height + 15; 

    this.gameFrame++;
    if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX++;
        if (this.frameX >= this.totalFrames) this.frameX = 0;
    }

    ctx.drawImage(this.image, this.frameX * spriteW, 0, spriteW, spriteH, this.x, drawY, this.width, this.height);
  }

  checkCollision(player) {
    const centerX = this.x + this.width / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerBottom = player.y + player.height;
    const groundTop = canvas.height - GROUND_Y;
    
    return Math.abs(centerX - playerCenterX) < 40 && playerBottom > groundTop - 20; 
  }
}

class FrameChest {
  constructor(x, name, link, framesArray, heightOffset = 0) {
    this.x = x;
    this.name = name;
    this.link = link;
    this.scale = 2.0; 
    this.frames = framesArray;
    this.width = 48 * this.scale; 
    this.height = 32 * this.scale;
    this.currentFrameIndex = 0;
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.isOpen = false;
    this.actionVerb = "OPEN"; 
    this.heightOffset = heightOffset;
  }

  update(player) {
      const centerX = this.x + this.width / 2;
      const playerCenterX = player.x + player.width / 2;
      
      const playerBottom = player.y + player.height;
      const chestSurfaceY = canvas.height - GROUND_Y - this.heightOffset;
      
      const dist = Math.abs(centerX - playerCenterX);
      const vDist = Math.abs(playerBottom - chestSurfaceY);
      
      if (dist < 100 && vDist < 50) {
          this.gameFrame++;
          if (this.gameFrame % this.staggerFrames === 0) {
              if (this.currentFrameIndex < this.frames.length - 1) this.currentFrameIndex++;
          }
          this.isOpen = true; 
      } else {
          this.gameFrame++;
          if (this.gameFrame % this.staggerFrames === 0) {
              if (this.currentFrameIndex > 0) this.currentFrameIndex--;
          }
          if (this.currentFrameIndex === 0) this.isOpen = false;
      }
  }

  draw(ctx) {
    const currentImg = this.frames[this.currentFrameIndex];
    if (!currentImg || !currentImg.complete || currentImg.naturalWidth === 0) return;

    this.width = currentImg.width * this.scale;
    this.height = currentImg.height * this.scale;
    
    const baseY = canvas.height - GROUND_Y - this.heightOffset;
    const drawY = baseY - this.height + 5;

    ctx.drawImage(currentImg, this.x, drawY, this.width, this.height);
  }

  checkCollision(player) {
    const centerX = this.x + this.width / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerBottom = player.y + player.height;
    const chestSurfaceY = canvas.height - GROUND_Y - this.heightOffset;

    return Math.abs(centerX - playerCenterX) < 50 && Math.abs(playerBottom - chestSurfaceY) < 50; 
  }
}

class SheetChest {
  constructor(x, typeRow, name, link, heightOffset = 0) {
    this.x = x;
    this.typeRow = typeRow; 
    this.name = name;
    this.link = link;
    this.scale = 3.0; 
    this.sheetCols = 10; 
    this.sheetRows = 5; 
    this.width = 0; this.height = 0;
    this.frameX = 0; 
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.isOpen = false;
    this.actionVerb = "OPEN";
    this.heightOffset = heightOffset;
  }

  update(player) {
      const centerX = this.x + 48; 
      const playerCenterX = player.x + player.width / 2;
      const playerBottom = player.y + player.height;
      const chestSurfaceY = canvas.height - GROUND_Y - this.heightOffset;

      const dist = Math.abs(centerX - playerCenterX);
      const vDist = Math.abs(playerBottom - chestSurfaceY);

      if (dist < 100 && vDist < 50) {
          this.gameFrame++;
          if (this.gameFrame % this.staggerFrames === 0) {
              if (this.frameX < 4) this.frameX++;
          }
          this.isOpen = true;
      } else {
          this.gameFrame++;
          if (this.gameFrame % this.staggerFrames === 0) {
              if (this.frameX > 0) this.frameX--;
          }
          if (this.frameX === 0) this.isOpen = false;
      }
  }

  draw(ctx) {
    if (!imgChests.complete || imgChests.naturalWidth === 0) return;

    const spriteW = imgChests.width / this.sheetCols;
    const spriteH = imgChests.height / this.sheetRows;

    this.width = spriteW * this.scale;
    this.height = spriteH * this.scale;
    
    const baseY = canvas.height - GROUND_Y - this.heightOffset;
    const drawY = baseY - this.height + 5;

    ctx.drawImage(imgChests, this.frameX * spriteW, this.typeRow * spriteH, spriteW, spriteH, this.x, drawY, this.width, this.height);
  }

  checkCollision(player) {
    const centerX = this.x + this.width / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerBottom = player.y + player.height;
    const chestSurfaceY = canvas.height - GROUND_Y - this.heightOffset;

    return Math.abs(centerX - playerCenterX) < 50 && Math.abs(playerBottom - chestSurfaceY) < 50;
  }
}

// --- SCENE SETUP ---
const decorations = [
    // Platform 1 (Projects)
    new Decoration(imgLamp, 10, 2.5, 0, 320),
    new Decoration(imgFence1, 60, 2.5, 0, 320),
    new Decoration(imgGrass1, 250, 2.5, 10, 320),
    new Decoration(imgGrass2, 350, 2.5, 10, 320),
    
    // Platform 4 (Skills)
    new Decoration(imgGrass3, 820, 2.5, 10, 200),
    new Decoration(imgRock1, 950, 2.5, 5, 200),

    // Platform 5 (About)
    new Decoration(imgLamp, 1300, 2.5, 0, 300),
    new Decoration(imgGrass1, 1150, 2.5, 10, 300),

    // Ground
    new Decoration(imgRock2, 1500, 2.5, 5),   
    new Decoration(imgRock3, 1650, 2.5, 5),
    new Decoration(imgGrass2, 1650, 2.5, 10),
    new Decoration(imgGrass3, 1900, 2.5, 10),
];

// SIGNS FOR SECTIONS
const sectionSigns = [
  new Sign(imgSign1, 340, "PROJECTS", 320, 0.6),
  new Sign(imgSign3, 800, "SKILLS", 200, 0.6),
  new Sign(imgSign2, 1100, "ABOUT", 300, 0.6),
  new Sign(imgSign4, 1500, "CONTACT", 0, 1.0), // Moved to 1500, Scale 1.0
];

// --- INTERACTABLES ---
const interactables = [
  new Portal(50, 'index.html'), 
  
  // 1. PROJECTS
  new FrameChest(250, 'PROJECTS', 'projects_rpg.html', [imgRetro0, imgRetro1, imgRetro2, imgRetro3], 320), 
  
  // 2. SKILLS
  new FrameChest(920, 'SKILLS', 'skills_rpg.html', [imgWooden0, imgWooden1, imgWooden2, imgWooden3, imgWooden4], 200),    
  
  // 3. ABOUT
  new FrameChest(1220, 'ABOUT', 'about_rpg.html', [imgChest0, imgChest1, imgChest2, imgChest3, imgChest4], 300),      
  
  // 4. CONTACT
  new SheetChest(1650, 1, 'CONTACT', 'contact_rpg.html', 0)   
];

// --- PLAYER CLASS ---
class Player {
  constructor() {
    const params = new URLSearchParams(window.location.search);
    const spawn = params.get('spawn');

    this.x = 100; 
    this.y = canvas.height - GROUND_Y - 80; // Default to ground level
    
    // --- Spawn Logic Adjustment ---
    // Sets both X (location) and Y (height on platform) correctly
    if (spawn === 'projects') {
        this.x = 250; // At Projects Chest
        this.y = canvas.height - GROUND_Y - 320 - 80; // On Platform (Height 320)
    } 
    else if (spawn === 'skills') {
        this.x = 920; // At Skills Chest
        this.y = canvas.height - GROUND_Y - 200 - 80; // On Platform (Height 200)
    }
    else if (spawn === 'about') {
        this.x = 1220; // At About Chest
        this.y = canvas.height - GROUND_Y - 300 - 80; // On Platform (Height 300)
    }
    else if (spawn === 'contact') {
        this.x = 1650; // At Contact Chest
        this.y = canvas.height - GROUND_Y - 80; // On Ground
    }

    this.vx = 0;
    this.vy = 0;
    this.width = 80;  
    this.height = 80; 
    this.isGrounded = false;
    this.facingRight = true;

    this.spriteW = 32;
    this.spriteH = 32;
    this.frameX = 0;
    this.frameY = 0;
    this.gameFrame = 0;
    this.staggerFrames = 7; 
    this.states = { IDLE: 0, RUN: 2, ATTACK: 4, JUMP: 5, DEATH: 7 };
    this.maxFrames = { 0: 2, 2: 4, 4: 4, 5: 4, 7: 4 };
    this.currentState = this.states.IDLE;
    this.isInteracting = false;
  }

  update() {
    if (keys.right) { this.vx += 1; this.facingRight = true; if(!this.isInteracting && this.isGrounded) this.currentState = this.states.RUN; }
    else if (keys.left) { this.vx -= 1; this.facingRight = false; if(!this.isInteracting && this.isGrounded) this.currentState = this.states.RUN; }
    else { if(!this.isInteracting && this.isGrounded) this.currentState = this.states.IDLE; }

    this.vx *= FRICTION;
    if (Math.abs(this.vx) < 0.1) this.vx = 0;
    if (this.vx > MOVE_SPEED) this.vx = MOVE_SPEED;
    if (this.vx < -MOVE_SPEED) this.vx = -MOVE_SPEED;
    
    this.vy += GRAVITY;
    const oldY = this.y;
    
    this.x += this.vx;
    this.y += this.vy;

    // --- COLLISION LOGIC ---
    this.isGrounded = false;
    const groundTop = canvas.height - GROUND_Y;

    // 1. Ground Collision
    if (this.y + this.height >= groundTop) {
        this.y = groundTop - this.height;
        this.vy = 0;
        this.isGrounded = true;
    }

    // 2. Platform Collision
    if (this.vy >= 0) { 
        platforms.forEach(plat => {
            const platTop = groundTop - plat.h; 
            const platLeft = plat.x;
            const platRight = plat.x + (plat.width * TILE_SIZE);
            
            const playerRight = this.x + this.width - 25; 
            const playerLeft = this.x + 25; 
            
            if (playerRight > platLeft && playerLeft < platRight) {
                const playerFeet = this.y + this.height;
                const oldPlayerFeet = oldY + this.height;
                
                if (oldPlayerFeet <= platTop && playerFeet >= platTop) {
                    this.y = platTop - this.height;
                    this.vy = 0;
                    this.isGrounded = true;
                }
            }
        });
    }

    if (!this.isGrounded) {
      if (!this.isInteracting) this.currentState = this.states.JUMP;
    }

    if (keys.up && this.isGrounded) { 
        this.vy = -JUMP_FORCE; 
        this.isGrounded = false; 
        this.currentState = this.states.JUMP; 
    }
    
    if (this.x < 0) this.x = 0;
    if (this.x > WORLD_WIDTH - this.width) this.x = WORLD_WIDTH - this.width;

    this.gameFrame++;
    if (this.gameFrame % this.staggerFrames === 0) {
      if (this.frameX < this.maxFrames[this.currentState] - 1) this.frameX++;
      else this.frameX = 0; 
    }
    this.frameY = this.currentState;
  }

  draw(ctx) {
    ctx.save(); 
    if (!this.facingRight) {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      this.drawSprite(ctx, 0, 0); 
    } else {
      ctx.translate(this.x, this.y);
      this.drawSprite(ctx, 0, 0);
    }
    ctx.restore(); 
  }

  drawSprite(ctx, x, y) {
    if (playerSprite.complete && playerSprite.naturalWidth !== 0) {
        ctx.drawImage(playerSprite, this.frameX * this.spriteW, this.frameY * this.spriteH, this.spriteW, this.spriteH, x, y, this.width, this.height);
    }
  }
}

const player = new Player();
const keys = { right: false, left: false, up: false, interact: false };
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') keys.up = true;
  if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') { 
      keys.interact = true; 
      checkInteraction(); 
  }
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') keys.up = false;
  if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') keys.interact = false;
});

// --- MOBILE TOUCH CONTROLS ---
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnJump = document.getElementById('btn-jump');
const btnInteract = document.getElementById('btn-interact');

if (btnLeft && btnRight && btnJump && btnInteract) {
  const handleTouch = (key, state) => {
    if (key === 'left') keys.left = state;
    if (key === 'right') keys.right = state;
    if (key === 'up') keys.up = state;
    if (key === 'interact') {
        keys.interact = state;
        if(state) checkInteraction();
    }
  };

  const addTouch = (btn, key) => {
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch(key, true); }, {passive: false});
    btn.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch(key, false); }, {passive: false});
  };

  addTouch(btnLeft, 'left');
  addTouch(btnRight, 'right');
  addTouch(btnJump, 'up');
  addTouch(btnInteract, 'interact');
}

function checkInteraction() {
  interactables.forEach(obj => { 
      if (obj.checkCollision(player)) {
          window.location.href = obj.link;
      }
  });
}

// --- TILE DRAWING ---
function drawGround(cameraX) {
    if (!imgTileset.complete) return;
    
    const srcGrassX = 24; const srcGrassY = 0; const srcSize = 24;
    const srcDirtX = 24; const srcDirtY = 24;
    
    const startCol = Math.floor(cameraX / TILE_SIZE);
    const endCol = startCol + (canvas.width / TILE_SIZE) + 2;
    
    // 1. Draw Main Ground (Standard Grass Top)
    for (let col = startCol; col < endCol; col++) {
        let worldX = col * TILE_SIZE;
        if (worldX < -TILE_SIZE || worldX > WORLD_WIDTH + TILE_SIZE) continue;

        let x = worldX - cameraX; 
        ctx.drawImage(imgTileset, srcGrassX, srcGrassY, srcSize, srcSize, x, canvas.height - GROUND_Y, TILE_SIZE, TILE_SIZE);
        for (let y = canvas.height - GROUND_Y + TILE_SIZE; y < canvas.height; y += TILE_SIZE) {
             ctx.drawImage(imgTileset, srcDirtX, srcDirtY, srcSize, srcSize, x, y, TILE_SIZE, TILE_SIZE);
        }
    }

    // 2. Draw Floating Platforms (Only Top Grass Layer - No Dirt)
    platforms.forEach(plat => {
        const platTop = canvas.height - GROUND_Y - plat.h;
        
        if (plat.x + (plat.width * TILE_SIZE) < cameraX || plat.x > cameraX + canvas.width) return;

        for(let i = 0; i < plat.width; i++) {
            const worldX = plat.x + (i * TILE_SIZE);
            const x = worldX - cameraX;
            
            // Top Tile (Grass)
            ctx.drawImage(imgTileset, srcGrassX, srcGrassY, srcSize, srcSize, x, platTop, TILE_SIZE, TILE_SIZE);
            
            // Bottom dirt layer removed to make it thin and floating
        }
    });
}

// --- MAIN LOOP ---
let smoothedCameraX = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let targetCameraX = player.x - canvas.width / 2 + player.width/2;
  if (targetCameraX < 0) targetCameraX = 0; 
  if (targetCameraX > WORLD_WIDTH - canvas.width) targetCameraX = WORLD_WIDTH - canvas.width;
  
  smoothedCameraX += (targetCameraX - smoothedCameraX) * 0.1;

  const layers = [
    new Layer(bgLayer1, 0.2, -50), 
    new Layer(bgLayer2, 0.5, 0),   
    new Layer(bgLayer3, 0.8, 50)   
  ];

  ctx.fillStyle = '#2a0050'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  layers.forEach(layer => layer.draw(ctx, smoothedCameraX));
  drawGround(smoothedCameraX);

  ctx.save();
  ctx.translate(-smoothedCameraX, 0);
  
  decorations.forEach(d => d.draw(ctx));
  sectionSigns.forEach(s => s.draw(ctx));

  let activeTarget = null;
  interactables.forEach(obj => { 
      if (obj.update) obj.update(player); 
      obj.draw(ctx); 
      if (obj.checkCollision(player)) activeTarget = obj; 
  });

  player.update();
  player.draw(ctx);

  ctx.restore();

  if (activeTarget) {
    const action = activeTarget.actionVerb || "ENTER";
    promptDiv.style.display = 'block';
    promptDiv.innerHTML = `${action} <span style="color:#ffd400">${activeTarget.name}</span> <br><span style="font-size:10px">(PRESS E)</span>`;
    
    // Calculate position relative to the object
    // World X to Screen X
    const screenX = activeTarget.x - smoothedCameraX + (activeTarget.width / 2);
    
    // Calculate Object Top Y (based on drawing logic)
    // Default for chests/signs: Ground - Offset - Height
    let objectTop = canvas.height - GROUND_Y - (activeTarget.heightOffset || 0) - activeTarget.height;
    
    // Adjust for Portal (it has a slight offset in draw: +15)
    if (activeTarget instanceof Portal) {
       objectTop = canvas.height - GROUND_Y - activeTarget.height + 15;
    }

    // Apply styles
    promptDiv.style.left = `${screenX}px`;
    promptDiv.style.top = `${objectTop - 50}px`; // 50px above the object
    promptDiv.style.transform = 'translateX(-50%)'; // Center text
    promptDiv.style.bottom = 'auto'; // Override CSS default
  } else {
    promptDiv.style.display = 'none';
  }

  requestAnimationFrame(animate);
}

// --- ASSET PRELOADER ---
const allImages = [
  playerSprite, imgTileset, imgPortal, imgChests,
  imgChest0, imgChest1, imgChest2, imgChest3, imgChest4,
  imgRetro0, imgRetro1, imgRetro2, imgRetro3,
  imgWooden0, imgWooden1, imgWooden2, imgWooden3, imgWooden4,
  bgLayer1, bgLayer2, bgLayer3,
  imgLamp, imgFence1, imgFence2, imgSign,
  imgRock1, imgRock2, imgRock3,
  imgGrass1, imgGrass2, imgGrass3,
  imgSign1, imgSign2, imgSign3, imgSign4
];

let imagesLoaded = 0;
function checkImages() {
  imagesLoaded++;
  if (imagesLoaded >= allImages.length) {
    const uiStatus = document.querySelector('#ui-layer p:last-child');
    if (uiStatus) uiStatus.textContent = "System: Online";
    animate();
  }
}

allImages.forEach(img => {
  if (img.complete) {
    checkImages();
  } else {
    img.onload = checkImages;
    img.onerror = () => { 
        console.warn("Failed to load image:", img.src); 
        checkImages(); 
    };
  }
});

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });