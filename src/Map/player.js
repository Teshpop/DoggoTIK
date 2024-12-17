'use strict';

class Player extends Character {
    constructor(pos) {
        super(pos);

        // Configuraciones del jugador
        this.speed = 0.1;             // Velocidad de movimiento
        this.dashSpeed = 0.4;         // Velocidad del dash
        this.dashDuration = 0.2;      // Duración del dash
        this.isDashing = false;       // Estado de dash
        this.dashTimer = new Timer(); // Timer para el dash

        this.extraJumps = 1;          // Saltos adicionales
        this.remainingJumps = this.extraJumps;

        // Configuración de ataques
        this.attackCooldown = new Timer();
        this.attackCooldownTime = 0.3;
        this.attackDirection = vec2(1, 0);

        // Entrada de usuario
        this.keyInputs = {};
    }

    updateInput() {
        // Manejo de teclas
        this.keyInputs.left = keyIsDown(65);  // A
        this.keyInputs.right = keyIsDown(68); // D
        this.keyInputs.up = keyIsDown(87);    // W
        this.keyInputs.down = keyIsDown(83);  // S
        this.keyInputs.jump = keyIsDown(32);  // SPACE
        this.keyInputs.attackLight = keyIsDown(75); // K
        this.keyInputs.attackHeavy = keyIsDown(76); // L
        this.keyInputs.dash = keyIsDown(16);  // SHIFT
    }

    handleMovement() {
        // Movimiento horizontal
        this.moveInput.x = this.keyInputs.left ? -1 : this.keyInputs.right ? 1 : 0;
        if (!this.isDashing) this.velocity.x = this.moveInput.x * this.speed;

        // Lógica de salto y salto en pared (ya manejada en Character)
        if (this.keyInputs.jump) {
            if (this.groundTimer.active()) {
                this.velocity.y = 0.15; // Salto desde el suelo
                this.remainingJumps = this.extraJumps; // Reset de saltos
            } else if (this.climbingWall) {
                this.velocity.y = 0.25; // Salto en pared
                this.velocity.x = -this.getMirrorSign() * this.speed;
                this.remainingJumps = this.extraJumps;
            } else if (this.remainingJumps > 0) {
                this.velocity.y = 0.15; // Saltos adicionales
                this.remainingJumps--;
            }
        }

        // Actualiza dirección de mirada
        if (this.moveInput.x) this.mirror = this.moveInput.x < 0;
    }

    handleDash() {
        if (this.keyInputs.dash && !this.isDashing && !this.dashTimer.active()) {
            this.isDashing = true;
            this.dashTimer.set(this.dashDuration);
            this.velocity.x = this.mirror ? -this.dashSpeed : this.dashSpeed;
        }

        if (this.dashTimer.elapsed()) this.isDashing = false;
    }

    handleAttacks() {
        if (this.attackCooldown.active()) return;

        if (this.keyInputs.attackLight) {
            this.performAttack('light');
        } else if (this.keyInputs.attackHeavy) {
            this.performAttack('heavy');
        }
    }

    performAttack(type) {
        // Dirección de ataque
        if (this.keyInputs.up) this.attackDirection = vec2(0, -1); // Arriba
        else if (this.keyInputs.down) this.attackDirection = vec2(0, 1); // Abajo
        else this.attackDirection = vec2(this.mirror ? -1 : 1, 0); // Frente

        // Imprime ataque (añadir colisiones y lógica de daño)
        console.log(`Ataque ${type} en dirección (${this.attackDirection.x}, ${this.attackDirection.y})`);

        this.attackCooldown.set(type === 'light' ? 0.3 : 0.7); // Cooldown según tipo
    }

    update() {
        this.updateInput();
        this.handleMovement();
        this.handleDash();
        this.handleAttacks();

        super.update(); // Lógica de físicas y colisiones
    }

    render() {
        // Render del personaje (usa el tile 5 y 8 como referencia)
        drawTile(this.pos, vec2(1), 5, vec2(8), new Color(1, 1, 1), 0, this.mirror);
    }
}
