import {
  engineInit,
  EngineObject,
  keyIsDown,
  Timer,
  vec2,
  tile,
  setCameraPos,
} from "littlejsengine";

import { buildLevel } from "./gameLevel";

/**
 * Player Test
 */
export class Player extends EngineObject {
  constructor(pos, speed) {
    super(pos, vec2(1), tile(2, 32, 0));

    this.setCollision();
    this.speed = speed;
    this.life = 4;

    this.time = new Timer();
    this.time.set(0);
    this.oldTime = 0;
    this.deltaTime = 0;

    this.jumpTimer = 0;
    this.maxJumpTimer = 0.1;
    this.isJumping = false;
    this.jumpForce = 5;
  }

  update() {
    super.update();
    //Delta time
    this.deltaTime = this.time.get() - this.oldTime;
    this.oldTime = this.time.get();

    const moveX = keyIsDown("KeyD") - keyIsDown("KeyA");
    this.velocity.x = moveX * this.speed * this.deltaTime;

    // Salto
    if (keyIsDown("Space")) {
      if (!this.isJumping) {
        this.isJumping = true;
        this.jumpTimer = 0;
      }

      if (this.jumpTimer < this.maxJumpTimer) {
        this.jumpTimer += this.deltaTime;
        this.velocity.y = this.jumpForce;
      }
    } else {
      this.isJumping = false;
    }
    this.kill();

    /**
     * Camera Position
     */

    setCameraPos(this.pos);
  }

  kill() {
    if (this.life <= 0) {
      this.destroy();
    }
  }

  getDamage(damage) {
    this.life -= damage;
  }
}
/**
 * //////////////////////////////////////
 */

/**
 * Suelo Temporal
 */
class floor extends EngineObject {
  constructor(pos, size) {
    super(pos, size);

    this.setCollision();
    this.mass = 0;
    this.gravityScale = 0;
  }
}
/**
 * ///////////////////////////
 */

function gameInit() {
  buildLevel();
}

function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "RobotDoors.png",
  "RobotTiles1.png",
]);
