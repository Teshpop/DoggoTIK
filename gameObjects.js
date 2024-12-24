/**
 * Key
 */
class Key extends EngineObject {
  constructor(pos, player, idObject, tileid) {
    super(pos, vec2(1), tile(tileid, 32, 0));

    this.player = player;
    this.mass = 0;
    this.gravityScale = 0;
    this.setCollision(false, false);

    this.time = new Timer();
    this.time.set(0);
    this.getKey = false;
    this.id = idObject;
    this.sound = new SoundWave("./Audio/test_Sound.wav");
    this.sound.setVolume(1);
  }

  update() {
    if (!this.player) {
      console.log("No hay nada");
    }
    // Animacion simple
    this.pos.y += Math.sin(this.time.get() * 5) * 0.02;

    // verificar distancia
    const d = this.pos.distanceSquared(this.player.pos);
    if (d < 0.5) {
      this.getKey = true;
      this.sound.play(null, 1, 1, 1, false);
      this.callParticle();
      this.destroy();
    }
  }

  callParticle() {
    new ParticleEmitter(
      this.pos, // Posición del emisor
      0, // Ángulo de emisión
      0.3, // Tamaño del área de emisión (ajustado para un área más pequeña)
      0.3, // Tiempo de vida del emisor (emisión indefinida)
      100, // Número de partículas por segundo
      Math.PI, // Ángulo de emisión de partículas
      0, // Sin textura de partículas (sin imagen)
      randColor(), // Color random
      randColor(), // Color random
      randColor(), // Color random
      randColor(), // Color random
      0.2, // Tiempo de vida de las partículas
      0.1, // Tamaño inicial de las partículas
      0.3, // Tamaño final de las partículas
      0.2, // Velocidad de las partículas
      0.5, // Sin velocidad angular
      0.9, // Amortiguamiento de la velocidad
      1, // Sin amortiguamiento de la velocidad angular
      0.05, // Sin gravedad
      Math.PI * 2, // Ángulo de emisión de partículas
      0.1, // Tasa de desvanecimiento
      0.5, // Baja aleatoriedad para una apariencia uniforme
      true, // No colisión con tiles
      false, // No usar mezcla aditiva
      false, // Sin colores aleatorios lineales
      0, // Orden de renderizado
      false // Espacio local
    ).elasticity = 1;
  }
}
/**
 * /////////////////////////////////////////////
 */

/**
 * Door
 */
class Door extends EngineObject {
  constructor(pos, key, idObject) {
    super(pos, vec2(1), tile(3, 32, 0));

    this.setCollision();
    this.mass = 0;
    this.gravityScale = 0;
    this.key = key;
    this.id = idObject;
  }

  update() {
    super.update();
    if (this.key.getKey && this.key.id === this.id) {
      this.destroy();
    }
  }
}
/**
 * //////////////////////////////////////////////
 */

/**
 * Trench
 */
class Trench extends EngineObject {
  constructor(pos) {
    super(pos, vec2(1));
  }
}
/**
 * //////////////////////////////
 */

/**
 * Save Points
 */
class CheckPoint extends EngineObject {
  constructor(pos, player) {
    super(pos, vec2(1));

    this.setCollision(false, false);
    this.player = player;
    this.pos = pos;
    this.getFlag = false;
  }

  render() {
    super.render();

    if (!this.getFlag) {
      this.tileInfo = tile(1, 32, 6).frame(Math.floor(time * 12) % 6);
    } else {
      this.tileInfo = tile(0, 32, 6);
    }
  }

  update() {
    super.update();

    const d = this.pos.distanceSquared(this.player.pos);
    if (d < 0.5) {
      this.getFlag = true;
    }

    if (this.getFlag) {
      if (this.player.pos.y <= -3 || this.player.healt <= 0) {
        this.player.pos.x = this.pos.x;
        this.player.pos.y = this.pos.y + 0.5;
        this.player.lifes--;
      }
    } else {
      if (this.player.pos.y <= -3) {
        this.player.pos = vec2(1.5, 4);
        this.player.lifes--;
      }
    }
  }
}

/**
 * Dog
 */
class Dog extends EngineObject {
  constructor(pos, player) {
    super(pos, vec2(0.6));

    this.setCollision(false, false);

    this.saveDog = false;
    this.player = player;
  }

  render() {
    super.render();

    this.tileInfo = tile(0, 32, 2);
  }

  update() {
    super.update();
    if (this.saveDog) {
      buildLevel();
    }

    const d = this.pos.distanceSquared(this.player.pos);
    if (d < 0.5) {
      this.saveDog = true;
    }
  }
}
