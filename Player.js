class Player extends Character {
  constructor(
    pos,
    {
      healt = 10,
      lifes = 3,
      damage = 2,
      speed = 5,
      jumpForce = 0.23,
      maxJumps = 1,
    }
  ) {
    super(pos);

    this.setCollision();

    /**
     * Animaciones
     */
    this.speedAnim = 6;
    this.animations = {
      idle: tile(0, 32, 2),
      walk: tile(288, 32, 2),
      jump: tile(224, 32, 2),
      dash: tile(160, 32, 2),
      death: tile(192, 32, 2),
      damage: tile(128, 32, 2),
      attack: tile(96, 32, 2),
    };

    /**
     * Player
     */
    this.tag = "Player";
    this.checkPointpos;

    this.lifes = lifes;
    this.healt = healt;
    this.speed = speed;
    this.damage = damage;
    this.jumpForce = jumpForce;
    this.maxJumps = maxJumps;

    this.jumpsRemaining = maxJumps;
    this.isJumping = false;
    this.jumpTimer = 0;
    this.maxJumpTimer = 0.1;
    this.isAttack = false;
    this.isHit = false;
    this.renderOrder = 10;

    this.soundAttack = new SoundWave("./Audio/Slash.wav");
    this.soundHit = new SoundWave("./Audio/hitDoggo.wav");
    this.soundStep = new SoundWave("./Audio/StepDoggo.wav");

    this.timerSounds = new Timer();
    this.timerSounds.set(0);

    this.timerXD = new Timer();
    this.timerXD.set(0);

    /**
     * Collisions
     */
    this.box = new BoxAttack(this);
  }

  /** Animaciones */
  render() {
    super.render();

    drawTile(
      vec2(30),
      vec2(50),
      tile(0, 32, 2),
      rgb(1, 1, 1, 1),
      0,
      false,
      rgb(0, 0, 0, 0),
      true,
      true
    );

    drawTextScreen(`${this.lifes}`, vec2(70, 40), 50);

    if (this.timer.get() >= 6) {
    }
    drawText(
      "I NEED TO AVENGE MY FRIENDS...\nI'M GOING TO ELIMINATE EVERYONE!\ni mean woof...",
      vec2(
        Math.sin(time * 12) * 0.05 + this.pos.x,
        Math.cos(time * 4) * 0.05 + this.pos.y + 1
      ),
      0.2,
      this.timerXD.get(0) >= 10 ? rgb(1, 1, 1, 0) : rgb(1, 1, 1, 1)
    );

    const alpha = 1 - this.healt / 10;

    drawRect(this.pos, vec2(100), rgb(0.5, 0, 0, alpha));

    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.tileInfo = this.animations.idle.frame(
        Math.floor(this.timer * this.speedAnim) % 18
      );
    }
    if (this.velocity.x != 0) {
      this.tileInfo = this.animations.walk.frame(
        Math.floor(this.timer * 10) % 3
      );
    }
    if (this.velocity.y != 0) {
      this.tileInfo = this.animations.jump.frame(
        Math.floor(this.timer * this.speedAnim) % 5
      );
    }
    if (this.isAttack && !this.isHit) {
      this.tileInfo = this.animations.attack.frame(
        Math.floor(this.timer * 30) % 11
      );
    }
    if (this.isHit) {
      this.tileInfo = this.animations.damage.frame(
        Math.floor(this.timer * 15) % 6
      );
    }
  }

  update() {
    super.update();

    this.Controls();

    // Muerte
    if (this.kill()) {
      this.lifes--;
      this.healt = 10;
    }
    if (this.lifes <= 0) {
      buildLevel();
      this.destroy();
    }

    // Get Damage reaction
    if (this.isHit) {
      if (this.timer.get() > 0.3) {
        this.isHit = false;
      }
    }

    if (this.isAttack) {
      this.handleCameraShake(0.3, 0.08);
    }
  }

  Controls() {
    const moveX = isUsingGamepad
      ? gamepadStick(0).x
      : keyIsDown("ArrowRight") - keyIsDown("ArrowLeft");

    if (!this.isAttack && !this.isHit) {
      this.velocity.x = moveX * this.speed * this.deltaTime;
    }

    if (moveX !== 0) {
      this.mirror = moveX < 0;
    }

    if (this.velocity.x != 0 && this.velocity.y === 0) {
      if (this.timerSounds.get() > 0.3) {
        this.timerSounds.set(0);
        this.soundStep.play(this.pos, 1, 10, 1, false);
      }
    }

    this.handleJumping();
    this.handleAttacK();
    this.handleCameraLag();
  }

  getDamage(d) {
    this.soundHit.play(this.pos, 1, 1, 1, false);
    new ParticleEmitter(
      this.pos, // Posición del emisor
      0, // Ángulo de emisión centrado
      0.1, // Área de emisión pequeña para un efecto localizado
      0.3, // Tiempo de vida del emisor más largo para simular la caída
      50, // Menor cantidad de partículas por segundo para un efecto más disperso
      Math.PI, // Ángulo amplio para dispersar las gotas hacia abajo
      0, // Sin textura de partículas
      rgb(0.6, 0, 0), // Rojo oscuro como color principal
      rgb(0.8, 0.1, 0.1), // Rojo ligeramente más brillante para variación
      rgb(0.5, 0, 0), // Rojo más apagado para las partículas más tenues
      rgb(0.3, 0, 0), // Rojo oscuro casi negro para simular sangre seca
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
    this.handleCameraShake(0.3, 0.8);
    this.timer.set(0);
    this.isHit = true;
    this.healt -= d;
  }

  handleCameraLag() {
    // Controlamos el factor de lag (qué tan rápido sigue la cámara al jugador)
    const cameraLagFactor = 0.1;

    // Interpolamos la posición de la cámara hacia la posición del jugador
    const laggedCameraPosX =
      cameraPos.x + (this.pos.x - cameraPos.x) * cameraLagFactor;
    const laggedCameraPosY =
      cameraPos.y + (this.pos.y - cameraPos.y) * cameraLagFactor;

    // Establecemos la nueva posición de la cámara con el lag aplicado
    setCameraPos(vec2(laggedCameraPosX, laggedCameraPosY));
  }

  handleAttacK() {
    if (!this.isHit) {
      if (
        keyWasPressed("KeyM") ||
        keyWasPressed("KeyZ") ||
        gamepadWasPressed(2)
      ) {
        this.soundAttack.play(this.pos, 1, 1, 1, false);
        this.isAttack = true;
        this.timer.set(0);
        if (this.box.object) {
          this.box.object.getDamage(1);
        }
      }

      if (this.isAttack) {
        if (this.timer.get() > 0.3) {
          this.isAttack = false;
          console.log("ataque");
        }
      }
    }
  }

  handleJumping() {
    // Verifica si se está presionando la tecla de salto
    if (keyIsDown("Space") || keyIsDown("KeyW") || gamepadIsDown(0)) {
      // Realiza un salto si hay saltos restantes
      if (this.jumpsRemaining > 0) {
        if (!this.isJumping) {
          this.isJumping = true;
          this.jumpTimer = 0;
          this.jumpsRemaining--; // Consume un salto
          this.velocity.y =
            this.jumpsRemaining === 0
              ? this.jumpForce * 1.4 // Menor potencia en el segundo salto
              : this.jumpForce; // Potencia normal en el primer salto
        }

        // Maneja el temporizador de salto
        if (this.jumpTimer < this.maxJumpTimer) {
          this.jumpTimer += this.deltaTime;
        }
      }
    } else {
      this.isJumping = false; // Finaliza el estado de salto cuando se suelta la tecla
    }

    // Restablece los saltos al tocar el suelo
    if (this.groundObject) {
      this.jumpsRemaining = this.maxJumps;
    }
  }

  handleCameraShake(duration, intensity) {
    let shakeDuration = duration; // Cuánto durará el shake
    let shakeIntensity = intensity; // Qué tan fuerte será el shake

    if (shakeDuration > 0) {
      // Reduce el tiempo de shake
      shakeDuration -= this.deltaTime;

      // Aplicar movimiento aleatorio para el shake
      const shakeOffsetX = Math.random() * shakeIntensity - shakeIntensity / 2;
      const shakeOffsetY = Math.random() * shakeIntensity - shakeIntensity / 2;

      // Actualizamos la posición de la cámara con el efecto de shake
      const newCameraPos = vec2(
        cameraPos.x + shakeOffsetX,
        cameraPos.y + shakeOffsetY
      );

      // Establecemos la nueva posición de la cámara
      setCameraPos(newCameraPos);
    }
  }
}
