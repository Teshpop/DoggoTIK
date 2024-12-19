import {
  EngineObject,
  Timer,
  vec2,
  tile,
  setCameraPos,
  keyIsDown,
} from "littlejsengine";
import { buildLevel } from "./gameLevel";

export class Player extends EngineObject {
  constructor(
    pos,
    {
      speed = 5.1,
      jumpForce = 0.5,
      maxJumps = 1,
      wallJumpEnabled = true,
      dashDistance = 1,
      dashCooldown = 1,
      dashSpeed = 1,
    } = {}
  ) {
    super(pos, vec2(0.9));

    this.setCollision();

    this.idleanim = tile(0, 32, 2);
    this.runanim = tile(288, 32, 2);
    this.jumpanim = tile(224, 32, 2);
    this.dashanim = tile(160, 32, 2);
    this.deathanim = tile(192, 32, 2);
    this.getDamageanim = tile(128, 32, 2);
    this.attackanim = tile(96, 32, 2);

    // Movement parameters
    this.speed = speed;
    this.jumpForce = jumpForce;
    this.maxJumps = maxJumps;
    this.wallJumpEnabled = wallJumpEnabled;

    // State tracking
    this.life = 4;
    this.jumpsRemaining = maxJumps;
    this.isJumping = false;
    this.isTouchingWall = false;
    this.isFacingRight = true;

    // Dash mechanics
    this.dashDistance = dashDistance;
    this.dashCooldown = dashCooldown;
    this.dashSpeed = dashSpeed; // Asignar la nueva propiedad
    this.canDash = true;
    this.isDashing = false;
    this.dashTimer = new Timer();

    // Timers and movement
    this.time = new Timer();
    this.time.set(0);
    this.oldTime = 0;
    this.deltaTime = 0;
    this.jumpTimer = 0;
    this.maxJumpTimer = 0.1;

    // Melee attack
    this.isAttacking = false;

    // Damage
    this.damage = 1;
  }

  render() { 
    super.render();
    
    this.mirror = !this.isFacingRight;
    //solo si la velocidad es 0
    if(this.velocity.x == 0 && this.velocity.y == 0)
    {
      this.tileInfo = this.idleanim.frame(Math.floor(this.time.get()*5)%18);
    }
    if(this.velocity.x != 0)
    {
      this.tileInfo = this.runanim.frame(Math.floor(this.time.get()*5)%3);
    }
    if(this.velocity.y != 0)
    {
      this.tileInfo = this.jumpanim.frame(Math.floor(this.time.get()*5)%5);
    }
    if(this.isDashing)
    {
      this.tileInfo = this.dashanim.frame(Math.floor(this.time.get()*5)%17);
    }
    if(this.life <= 0)
    {
      this.tileInfo = this.deathanim.frame(Math.floor(this.time.get()*5)%2);
    }
    if(this.isAttacking)
    {
      this.tileInfo = this.attackanim.frame(Math.floor(this.time.get()*10)%11);
    }

    
  }

  update() {
    super.update();


    // Delta time calculation
    this.deltaTime = this.time.get() - this.oldTime;
    this.oldTime = this.time.get();

    // Horizontal movement
    const moveX = keyIsDown("KeyD") - keyIsDown("KeyA");
    this.velocity.x = moveX * this.speed * this.deltaTime;

    // Update facing direction
    if (moveX !== 0) {
      this.isFacingRight = moveX > 0;
    }

    // Wall jump and regular jump mechanics
    this.handleJumping();

    // Dash mechanics
    this.handleDash();

    // Camera tracking
    setCameraPos(this.pos);

    // Melee attack mechanics
    this.handleMeleeAttack();

    // Kill player
    this.kill();

    if (!this.isDashing) {
      const moveX = keyIsDown("KeyD") - keyIsDown("KeyA");
      this.velocity.x = moveX * this.speed * this.deltaTime;
    }
    
  }

  handleJumping() {
    // Wall jump
    this.isTouchingWall = this.checkWallContact();

    if (keyIsDown("Space")) {
      // Regular jump or wall jump
      if (this.jumpsRemaining > 0) {
        if (!this.isJumping) {
          this.isJumping = true;
          this.jumpTimer = 0;
          this.jumpsRemaining--;
        }

        if (this.jumpTimer < this.maxJumpTimer) {
          this.jumpTimer += this.deltaTime;

          // Wall jump logic
          if (this.wallJumpEnabled && this.isTouchingWall) {
            this.velocity.y = this.jumpForce;
            this.velocity.x = this.isFacingRight
              ? -this.jumpForce
              : this.jumpForce;
          } else {
            this.velocity.y = this.jumpForce;
          }
        }
      }
    } else {
      this.isJumping = false;
    }

    // Reset jumps when touching ground
    if (this.groundObject) {
      this.jumpsRemaining = this.maxJumps;
    }
  }

  handleDash() {
    if (keyIsDown("ShiftLeft") && this.canDash && !this.isDashing) {
      this.isDashing = true;
      this.canDash = false;
      this.dashTimer.set(this.dashDistance / this.dashSpeed);

      // Dash in facing direction
      const dashMultiplier = this.isFacingRight ? 1 : -1;
      this.velocity.x = this.dashSpeed * dashMultiplier;
      this.tileInfo = this.dashanim.frame(Math.floor(this.time.get() * 5) % 2);
    }

    // Apply dash velocity
    if (this.isDashing) {
      if (this.dashTimer.get() <= 0) {
        this.isDashing = false;
        this.velocity.x = 0;
        this.dashCooldownTimer = new Timer(this.dashCooldown);
      }
    }

    // Dash cooldown
    if (!this.canDash && this.dashCooldownTimer) {
      if (this.dashCooldownTimer.get() <= 0) {
        this.canDash = true;
      }
    }
  }

  handleMeleeAttack() {
    if (!this.meleeCooldownTimer) {
      this.meleeCooldownTimer = new Timer();
      this.meleeCooldown = 1; // Duración del enfriamiento
    }
  
    if (keyIsDown("KeyM") && this.meleeCooldownTimer.get() <= 0 && !this.isAttacking) {
      this.isAttacking = true;
      this.meleeCooldownTimer.set(this.meleeCooldown);
  
      // Lógica del ataque cuerpo a cuerpo
      forEachObject(this.pos, this.size, (o) => {
        if (o.isCharacter && o.team != this.team && !o.isDead()) {
          o.damage(this.damage, this);
        }
      });
  
    } else if (this.isAttacking && this.meleeCooldownTimer.get() > 0) {
      if (this.meleeCooldownTimer.get() <= 0) {
        this.isAttacking = false;
      }
    }
  }

  checkWallContact() {
    // Implement wall contact detection based on your tile collision system
    // This is a placeholder and should be adapted to your specific game's collision logic
    return false;
  }

  kill() {
    if (this.life <= 0 || this.pos.y < -4) {
      buildLevel();
      this.destroy();
      // Implement level reload or game over logic
    }
  }

  getDamage(damage) {
    this.life -= damage;
  }
}
