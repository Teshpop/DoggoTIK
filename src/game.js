import { engineInit, EngineObject, keyIsDown, vec2 } from "littlejsengine";
import { Key, Door, Enemy } from "./gameObjects";

/**
 * Player Test
 */
class Player extends EngineObject {
  constructor(pos, speed) {
    super(pos, vec2(1));

    this.setCollision();
    this.speed = speed;
    this.life = 4;
  }

  update() {
    super.update();
    const moveX = keyIsDown("KeyD") - keyIsDown("KeyA");
    this.velocity.x = moveX * this.speed;

    this.kill();
  }

  kill() {
    if (this.life <= 0) {
      this.destroy();
    }
  }

  getDamage(damage) {
    this.life -= damage;
    console.log(this.life);
  }
}

function gameInit() {
  const player = new Player(vec2(-4, 0), 0.1);
  const key1 = new Key(vec2(1, 0), player);
  new Door(vec2(2, 0), key1);
  new Enemy(vec2(4, 0), player);
}

function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
