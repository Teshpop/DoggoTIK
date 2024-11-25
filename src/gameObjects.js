// import { InteractableObjects } from "./InteractableObjects";
import { vec2, EngineObject, Timer } from "littlejsengine";

/**
 * Key
 */
export class Key extends EngineObject {
  constructor(pos, player) {
    super(pos, vec2(0.5));

    this.player = player;
    this.mass = 0;
    this.gravityScale = 0;

    this.time = new Timer();
    this.time.set(0);
    this.getKey = false;
  }

  update() {
    if (!this.player) {
      console.log("No hay nada");
    }
    // Animacion simple
    this.pos.y = Math.sin(this.time.get() * 3) / 4;

    // verificar distancia
    const d = this.pos.distanceSquared(this.player.pos);
    if (d < 0.35) {
      this.getKey = true;
      this.destroy();
    }
  }
}
/**
 * /////////////////////////////////////////////
 */

/**
 * Door
 */
export class Door extends EngineObject {
  constructor(pos, key) {
    super(pos, vec2(1));

    this.setCollision();
    this.mass = 0;
    this.gravityScale = 0;
    this.key = key;
  }

  update() {
    super.update();
    if (this.key.getKey) {
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
