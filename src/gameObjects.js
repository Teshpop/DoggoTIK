// import { InteractableObjects } from "./InteractableObjects";
import {
  vec2,
  EngineObject,
  Timer,
  tile,
  SoundWave,
  ParticleEmitter,
  rgb,
  randColor,
} from "littlejsengine";

/**
 * Key
 */
export class Key extends EngineObject {
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
    this.sound = new SoundWave("/Audio/test_Sound.wav");
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
    if (d < 0.3) {
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
export class Door extends EngineObject {
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
      console.log("Se elimino la puerta");
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
export class Trench extends EngineObject {
  constructor(pos) {
    super(pos, vec2(1));
  }
}
/**
 * //////////////////////////////
 */

/**
 * Enemy
 */
export class Enemy extends EngineObject {
  constructor(pos, player) {
    super(pos, vec2(1));

    this.setCollision(true, true);
    this.damage = 2;
    this.life = 4;
    this.player = player;

    this.speed = 0.08;
    this.time = new Timer(0);
  }

  update() {
    super.update();
    //Detection player
    const d = this.pos.distanceSquared(this.player.pos);
    // Verificar si el jugador está dentro del rango de detección
    if (d < 30) {
      // Calcular la diferencia en las posiciones
      const dx = this.player.pos.x - this.pos.x;

      // Normalizar el vector de dirección
      const length = Math.sqrt(dx * dx);
      const dirX = dx / length;

      // Ajustar la velocidad del enemigo
      this.velocity.x = dirX * this.speed;
      if (d < 1.5) {
        this.velocity.x = 0;
        this.attack();
      }
    } else {
      // Si el jugador está fuera de rango, detener al enemigo
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
  }

  attack() {
    if (this.time.get() > 1.5) {
      this.time.set(0);
      this.player.getDamage(this.damage);
    }
  }
}
/**
 * /////////////////////////////////////////////////
 */
