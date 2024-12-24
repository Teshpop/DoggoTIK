class Enemy extends Character {
  constructor(pos, player) {
    super(pos, vec2(0.8));

    this.tag = "Enemy";
    this.player = player;

    this.setCollision(true, true);
    this.mass = 1;

    /**
     * Animations
     */
    this.animations = {
      idle: tile(0, 32, 3),
      walk: tile(64, 32, 3),
      detected: tile(128, 32, 3),
      death: tile(192, 32, 3),
      damage: tile(128, 32, 3),
      attack: tile(32, 32, 3),
    };

    // Base
    this.healt = 3;
    this.speed = 2.5;
    this.isAttack = false;
    this.isHit = false;
    this.isDying = false; // Cambio de nombre a isDying para mayor claridad
    this.dyingTimer = 0; // Temporizador para la animación de muerte

    this.soundAttack = new SoundWave("./Audio/bonk.wav");
    // this.soundHit = new SoundWave("./Audio/hitRobot.wav");
    this.stepSound = new SoundWave("./Audio/StepRobot.wav");
    this.soundRobot = new SoundWave("./Audio/SoundRobot.wav");

    this.timerSounds = new Timer();
    this.timerSounds.set(0);
  }

  render() {
    super.render();

    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.tileInfo = this.animations.idle.frame(
        Math.floor(this.timer.get() * 15) % 20
      );
    }
    if (this.velocity.x != 0 && !this.detectedPlayer) {
      this.tileInfo = this.animations.walk.frame(
        Math.floor(this.timer.get() * 20) % 12
      );
    }
    if (this.isHit) {
      this.tileInfo = this.animations.detected.frame(
        Math.floor(this.timer.get() * 8) % 2
      );
    }
    if (this.isAttack && this.velocity.x === 0 && !this.isHit) {
      this.tileInfo = this.animations.attack.frame(
        Math.floor(this.timer.get() * 6) % 4
      );
    }
  }

  update() {
    super.update();

    this.movement();

    // Get Damage reaction
    if (this.isHit) {
      if (this.timer.get() > 0.3) {
        this.isHit = false;
      }
    }

    if (this.kill()) {
      arrEnemies.pop();
      this.destroy();
    }

    if (this.timerSounds.get() > Math.random() + 3) {
      this.timerSounds.set(0);
      this.soundRobot.play(this.pos, 0.5, 1, 1, false);
    }
  }

  movement() {
    //Detection player
    const d = this.pos.distanceSquared(this.player.pos);
    // Verificar si el jugador está dentro del rango de detección
    if (d < 10) {
      // Calcular la diferencia en las posiciones
      const dx = this.player.pos.x - this.pos.x;

      // Normalizar el vector de dirección
      const length = Math.sqrt(dx * dx);
      const dirX = dx / length;

      // Ajustar la velocidad del enemigo
      this.velocity.x = dirX * this.speed * this.deltaTime;
      if (d < 1) {
        this.velocity.x = 0;
        this.handleAttack();
        // this.playerAttack();
      }
    } else {
      // Si el jugador está fuera de rango, detener al enemigo
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.isAttack = false;
    }

    if (this.velocity.x != 0) {
      this.mirror = this.velocity.x > 0 ? 1 : 0;
    }

    if (this.velocity.x != 0 && this.velocity.y === 0) {
      if (this.timerSounds.get() > 0.3) {
        this.timerSounds.set(0);
        this.stepSound.play(this.pos, 1, 1, 1, false);
      }
    }
  }

  handleAttack() {
    if (this.timer.get() > 1) {
      this.soundAttack.play(this.pos, 1, 1, 1, false);
      this.isAttack = true;
      this.timer.set(0);
      this.player.getDamage(1);
    }
  }

  getDamage(d) {
    new ParticleEmitter(
      this.pos, // Posición del emisor
      0, // Ángulo de emisión centrado
      0.1, // Área de emisión pequeña para un efecto localizado
      0.3, // Tiempo de vida del emisor más largo para simular la caída
      50, // Menor cantidad de partículas por segundo para un efecto más disperso
      Math.PI, // Ángulo amplio para dispersar las gotas hacia abajo
      0, // Sin textura de partículas
      rgb(0.9, 0.9, 0.9), // Blanco suave como color principal
      rgb(0.8, 0.8, 0.8), // Gris muy claro para variación
      rgb(0.7, 0.7, 0.7), // Gris claro para las partículas más tenues
      rgb(0.5, 0.5, 0.5), // Gris medio para simular polvo o fragmentos más oscuros
      0.6, // Tiempo de vida de las partículas más largo para simular la caída lenta
      0.15, // Tamaño inicial pequeño, como gotas de sangre
      0.05, // Tamaño final más pequeño para simular desvanecimiento
      0.3, // Velocidad baja para simular la gravedad en las gotas
      0.05, // Velocidad angular mínima para un efecto natural
      0.9, // Amortiguación de velocidad para que las gotas se ralenticen al caer
      0.8, // Sin rotación notoria para un movimiento más realista
      2, // Gravedad alta para simular caída de sangre
      Math.PI, // Ángulo amplio para dispersión natural hacia abajo
      0.4, // Tasa de desvanecimiento más baja para mayor duración visual
      0.5, // Mayor aleatoriedad para un efecto menos uniforme
      true, // Sin colisión con tiles para un movimiento fluido
      false, // Mezcla opaca para evitar brillo
      false, // Sin colores aleatorios lineales
      1, // Orden de renderizado
      false // Espacio global para caída realista
    ).elasticity = 0; // Sin rebote, las gotas no deben rebotar
    this.timer.set(0);
    this.isHit = true;
    this.healt -= d;
  }
}
