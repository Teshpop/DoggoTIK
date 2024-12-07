import { Player } from "./game";
import { Key, Door } from "./gameObjects";
import {
  initTileCollision,
  vec2,
  tile,
  engineObjectsDestroy,
  TileLayer,
  TileLayerData,
  setTileCollisionData,
  setGravity,
} from "littlejsengine";

let levelSize, player, key;

export function buildLevel() {
  setGravity(-0.3);
  loadLevel();
}

const loadLevel = () => {
  const tileMapData = TileMaps.gameLeveData;
  levelSize = vec2(tileMapData.width, tileMapData.height);
  initTileCollision(levelSize);
  engineObjectsDestroy();

  player = new Player(vec2(1, 4), 5);

  const objectsCount = tileMapData.layers[3].objects;

  objectsCount.map((objects) => {
    const { x, y, type, properties } = objects;
    const id = properties[0].value;
    const tileId = properties[1].value;

    const position = vec2(x / levelSize.x + 2.5, levelSize.y - y / 32 + 0.5);

    if (type === "key") {
      key = new Key(position, player, id, tileId);
    }
    if (type === "door") {
      if (key) {
        new Door(position, key, id);
      }
    }
  });

  // Procesar capas del mapa (colisiones y tiles)
  const layerCounts = tileMapData.layers.length;
  for (let layer = layerCounts; layer--; ) {
    if (layer !== 3) {
      const layerData = tileMapData.layers[layer].data;
      const tileLayer = new TileLayer(vec2(), levelSize, tile(0, 32, 1));
      tileLayer.renderOrder = -1e3 + layer;

      for (let x = levelSize.x; x--; ) {
        for (let y = levelSize.y; y--; ) {
          const pos = vec2(x, levelSize.y - 1 - y);
          const currentTile = layerData[y * levelSize.x + x];
          const tileData = new TileLayerData(currentTile - 1);

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
