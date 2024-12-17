import {
    EngineObject,
    Timer,
    vec2,
    tile,
    setCameraPos,
    keyIsDown,
} from "littlejsengine";

export class Player extends EngineObject {
    constructor(pos, {
        speed = 10, 
        jumpForce = 0.5, 
        maxJumps = 1, 
        wallJumpEnabled = true,
        dashDistance = 10,
        dashCooldown = 0.2
    } = {}) {
        super(pos, vec2(0.9), tile(2, 32, 0));

        this.setCollision();
        
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
                        this.velocity.x = this.isFacingRight ? -this.jumpForce : this.jumpForce;
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
        if (keyIsDown("ShiftLeft") && this.canDash) {
            this.isDashing = true;
            this.canDash = false;
            this.dashTimer.set(this.dashCooldown);
            
            // Dash in facing direction
            const dashMultiplier = this.isFacingRight ? 1 : -1;
            this.velocity.x = this.dashDistance * dashMultiplier;
            this.velocity.y = 0; // Optional: can modify to add vertical dash component
        }

        // Dash cooldown
        if (!this.canDash) {
            if (this.dashTimer.get() >= this.dashCooldown) {
                this.canDash = true;
                this.isDashing = false;
            }
        }
    }

    checkWallContact() {
        // Implement wall contact detection based on your tile collision system
        // This is a placeholder and should be adapted to your specific game's collision logic
        return false;
    }

    kill() {
        if (this.life <= 0 || this.pos.y < -2) {
            this.destroy();
            // Implement level reload or game over logic
        }
    }

    getDamage(damage) {
        this.life -= damage;
    }
}