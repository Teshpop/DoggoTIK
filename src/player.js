'use strict';

class Player extends Character {
    constructor(pos) {
        super(pos);

        // Configuraciones adicionales
        this.speed = 0.1;             // Velocidad de movimiento
        this.dashSpeed = 0.4;         // Velocidad del dash
        this.dashDuration = 0.2;      // Duración del dash
        this.isDashing = false;       // Estado del dash
        this.dashTimer = new Timer(); // Timer para el dash

        this.extraJumps = 1;          // Saltos adicionales
        this.remainingJumps = this.extraJumps;

        // Control de ataques
        this.attackCooldown = new Timer();
        this.attackCooldownTime = 0.3; // Cooldown para ataques
        this.attackDirection = vec2(1, 0); // Dirección predeterminada de ataque

        // Variables de interacción
        this.interactTimer = new Timer();

        // Estados
        this.isAttacking = false;
        this.isInteracting = false;

        // Entrada de usuario
        this.keyInputs = {};
    }

    updateInput() {
        // Captura de entradas
        this.keyInputs.left = keyIsDown(65);   // A
        this.keyInputs.right = keyIsDown(68);  // D
        this.keyInputs.up = keyIsDown(87);     // W
        this.keyInputs.down = keyIsDown(83);   // S
        this.keyInputs.jump = keyIsDown(32);   // SPACE
        this.keyInputs.attackLight = keyIsDown(75); // K
        this.keyInputs.attackHeavy = keyIsDown(76); // L
        this.keyInputs.dash = keyIsDown(16);   // SHIFT
        this.keyInputs.interact = keyIsDown(69);    // E
    }

    handleMovement() {
        // Movimiento horizontal
        this.moveInput.x = this.keyInputs.left ? -1 : this.keyInputs.right ? 1 : 0;

        if (!this.isDashing) {
            this.velocity.x = this.moveInput.x * this.speed;
        }

        // Salto y salto en pared (reutiliza Character)
        if (this.keyInputs.jump) {
            if (this.groundTimer.active()) {
                this.velocity.y = 0.15; // Salto desde el suelo
                this.remainingJumps = this.extraJumps;
            } else if (this.climbingWall) {
                this.velocity.y = 0.25; // Salto en pared
                this.velocity.x = -this.getMirrorSign() * this.speed;
                this.remainingJumps = this.extraJumps;
            } else if (this.remainingJumps > 0) {
                this.velocity.y = 0.15; // Saltos adicionales
                this.remainingJumps--;
            }
        }

        // Actualiza dirección de la mirada
        if (this.moveInput.x) this.mirror = this.moveInput.x < 0;
    }

    handleDash() {
        if (this.keyInputs.dash && !this.isDashing && !this.dashTimer.active()) {
            this.isDashing = true;
            this.dashTimer.set(this.dashDuration);
            this.velocity.x = this.mirror ? -this.dashSpeed : this.dashSpeed;
        }

        if (this.dashTimer.elapsed()) {
            this.isDashing = false;
        }
    }

    handleAttacks() {
        if (this.attackCooldown.active()) return;

        if (this.keyInputs.attackLight || this.keyInputs.attackHeavy) {
            // Determina dirección del ataque
            if (this.keyInputs.up) this.attackDirection = vec2(0, -1); // Arriba
            else if (this.keyInputs.down) this.attackDirection = vec2(0, 1); // Abajo
            else this.attackDirection = vec2(this.mirror ? -1 : 1, 0); // Frente

            const attackType = this.keyInputs.attackLight ? 'light' : 'heavy';
            this.performAttack(this.attackDirection, attackType);
        }
    }

    performAttack(direction, type) {
        // Reutiliza lógica de ataque existente (en Character)
        console.log(`Ataque ${type} en dirección (${direction.x}, ${direction.y})`);

        // Ajusta la dirección del arma (si es aplicable)
        this.weapon.localAngle = Math.atan2(direction.y, direction.x);

        // Temporizador para evitar ataques simultáneos
        this.attackCooldown.set(type === 'light' ? 0.3 : 0.7);
    }

    handleInteraction() {
        if (this.keyInputs.interact && !this.interactTimer.active()) {
            console.log("Interacción realizada");
            this.interactTimer.set(0.5); // Cooldown para la interacción
            this.isInteracting = true;
        }
    }

    update() {
        this.updateInput();
        this.handleMovement();
        this.handleDash();
        this.handleAttacks();
        this.handleInteraction();

        super.update(); // Actualiza físicas y colisiones
    }

    render() {
        // Renderización del personaje
        drawTile(this.pos, vec2(1), this.bodyTile, vec2(8), new Color(1, 1, 1), 0, this.mirror);
    }
}
