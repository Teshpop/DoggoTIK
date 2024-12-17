import {
    EngineObject,
    Timer,
    vec2,
    tile,
    setCameraPos,
    keyIsDown,
  } from "littlejsengine";
  
  import { buildLevel } from "./gameLevel";
  
  /**
   * Player Test
   */
  export class Player extends EngineObject {
    constructor(pos, speed) {
      super(pos, vec2(0.9), tile(2, 32, 0));
  
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
      if (this.life <= 0 || this.pos.y < -2) {
        this.destroy();
        // ReloadLevel
        buildLevel();
      }
    }
  
    getDamage(damage) {
      this.life -= damage;
    }
  }