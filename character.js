class Character extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.8));

    this.timer = new Timer();
    this.timer.set(0);
    this.deltaTime = 0;
    this.oldTime = 0;

    /** @property {Number} - Velocidad del personaje */
    this.speed;
    /** @property {Number} - Vida del personaje */
    this.healt = 0;
    /** @property {Number} - Dano del personaje */
    this.damage;
    /** @property {String} - Tipo de personaje */
    this.tag;
  }

  update() {
    super.update();
    // Delta time
    this.deltaTime = this.timer.get() - this.oldTime;
    this.oldTime = this.timer.get();
  }

  kill() {
    if (this.healt <= 0) {
      return true;
    }
  }
}

class BoxAttack extends EngineObject {
  constructor(character) {
    super();
    this.mass = 0;
    this.setCollision(true, false);
    this.size = vec2(0.5);
    this.character = character;
    this.tileInfo = tile(10000);

    this.object;
  }

  update() {
    super.update();
    this.pos.y = this.character.pos.y;
    this.pos.x = this.character.mirror
      ? this.character.pos.x - 0.8
      : this.character.pos.x + 0.8;
  }

  collideWithObject(o) {
    super.collideWithObject();
    this.object = o;
  }
}
