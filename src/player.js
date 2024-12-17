'use strict';

class Player extends GameObject {
    constructor(pos) {
        super(pos, vec2(0.8, 0.9), 32); // Posición, tamaño, y valor de colisión básico

        // Configuraciones generales
        this.speed = 0.1;              // Velocidad de movimiento
        this.jumpStrength = 0.2;       // Fuerza de salto
        this.extraJumps = 1;           // Saltos adicionales
        this.remainingJumps = this.extraJumps;
        this.gravityScale = 1;         // Gravedad estándar
        this.dashSpeed = 0.5;          // Velocidad del dash
        this.dashDuration = 0.2;       // Duración del dash
        this.isDashing = false;        // Estado de dash

        // Timers
        this.dashTimer = new Timer();
        this.attackCooldown = new Timer();
        this.attackCooldownTime = 0.3;

        // Estados de ataques
        this.attackDirection = vec2(1, 0); // Dirección de ataque
        this.isAttacking = false;

        // Variables de control de entrada
        this.keyInputs = {};
        this.mirror = false; // Dirección de la mirada (false = derecha)
    }

    updateInput() {
        // Captura de entradas de teclado
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
        this.moveInput = vec2(0, 0);
        if (!this.isDashing) {
            this.moveInput.x = this.keyInputs.left ? -1 : this.keyInputs.right ? 1 : 0;
            this.velocity.x = this.moveInput.x * this.speed;

            // Actualiza la dirección en la que mira el personaje
            if (this.moveInput.x) this.mirror = this.moveInput.x < 0;
        }

        // Lógica de salto
        if (this.keyInputs.jump) {
            if (this.isOnGround()) {
                this.velocity.y = this.jumpStrength;
                this.remainingJumps = this.extraJumps; // Restablece saltos adicionales
            } else if (this.remainingJumps > 0) {
                this.velocity.y = this.jumpStrength; // Salto adicional
                this.remainingJumps--;
            }
        }

        // Aplica gravedad
        this.velocity.y -= gravity * this.gravityScale;
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

        let attackType = null;

        if (this.keyInputs.attackLight) {
            attackType = 'light';
        } else if (this.keyInputs.attackHeavy) {
            attackType = 'heavy';
        }

        if (attackType) {
            // Determina la dirección del ataque
            if (this.keyInputs.up) this.attackDirection = vec2(0, -1); // Arriba
            else if (this.keyInputs.down) this.attackDirection = vec2(0, 1); // Abajo
            else this.attackDirection = vec2(this.mirror ? -1 : 1, 0); // Frente

            console.log(`Ataque ${attackType} en dirección (${this.attackDirection.x}, ${this.attackDirection.y})`);
            this.attackCooldown.set(attackType === 'light' ? 0.3 : 0.7);
        }
    }

    handleInteraction() {
        if (this.keyInputs.interact) {
            console.log("Interacción realizada");
        }
    }

    isOnGround() {
        // Ejemplo básico para detectar suelo (ajustar con colisiones reales)
        return this.pos.y <= 0;
    }

    update() {
        this.updateInput();
        this.handleMovement();
        this.handleDash();
        this.handleAttacks();
        this.handleInteraction();

        // Actualiza la posición con la velocidad actual
        this.pos = this.pos.add(this.velocity);

        // Limita la posición al suelo (simulación de colisión básica)
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.velocity.y = 0;
        }

        super.update();
    }

    render() {
        // Render del sprite del jugador
        drawTile(this.pos, vec2(1), 5, vec2(8), new Color(1, 1, 1), 0, this.mirror);
    }
}
