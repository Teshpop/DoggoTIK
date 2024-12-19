import { Player } from "./character";
import { Key, Door, Enemy } from "./gameObjects";
import {
  initTileCollision,
  vec2,
  tile,
  engineObjectsDestroy,
  TileLayer,
  TileLayerData,
  setTileCollisionData,
  setGravity,
  SoundWave,
  setCanvasFixedSize,
  setCameraScale,
} from "littlejsengine";

let levelSize, player;
const keyMaps = new Map();
const backgorundMusic = new SoundWave("/Audio/test1_littlejam.mp3");

export function buildLevel() {
  setGravity(-0.05);
  backgorundMusic.stop();
  backgorundMusic.play(null, 0.8, 1, 1, true);
  setCanvasFixedSize(vec2(800, 600));
  setCameraScale(60);
  loadLevel();
}

const loadLevel = () => {
  const tileMapData = TileMaps.gameLeveData;
  levelSize = vec2(tileMapData.width, tileMapData.height);
  initTileCollision(levelSize);
  engineObjectsDestroy();

  /**
   * Init Player
   */
  player = new Player(vec2(1, 4), 5);

  /**
   * Add Objects
   */
  // Keys
  const keysCount = tileMapData.layers[3].objects;
  CreateObjects(keysCount, "key");

  // Doors
  const doorsCount = tileMapData.layers[4].objects;
  CreateObjects(doorsCount, "door");

  /**
   * Add Map
   */
  const layerCounts = tileMapData.layers.length;
  for (let layer = layerCounts; layer--; ) {
    if (layer < 3) {
      const layerData = tileMapData.layers[layer].data;
      const tileLayer = new TileLayer(vec2(), levelSize, tile(0, 32, 1));
      tileLayer.renderOrder = -1e3 + layer;

      for (let x = levelSize.x; x--; ) {
        for (let y = levelSize.y; y--; ) {
          const pos = vec2(x, levelSize.y - 1 - y);
          const currentTile = layerData[y * levelSize.x + x];
          const tileData = new TileLayerData(currentTile - 1);

          if (layer === 2) {
            const objectPos = pos.add(vec2(0.5));
            if (currentTile == 482) {
              new Enemy(objectPos, player);
            }
          }

          tileLayer.setData(pos, tileData);
          if (currentTile > 0 && layer === 1) {
            setTileCollisionData(pos, 1);
          }
        }
      }
      tileLayer.redraw();
    }
  }
};

const CreateObjects = (ArrObjects, type) => {
  ArrObjects.forEach((objects) => {
    const { x, y, properties } = objects;
    const id = properties[0].value;
    const tileId = properties[1].value;

    const position = vec2(x / 32 + 0.5, levelSize.y - y / 32 + 0.5);

    /**
     * Key
     */
    if (type === "key") {
      const key = new Key(position, player, id, tileId);
      keyMaps.set(id, key);
    }

    /**
     * Door
     */
    if (type === "door") {
      const key = keyMaps.get(id);
      if (key) {
        new Door(position, key, id);
      }
    }
  });
};
