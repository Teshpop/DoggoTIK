import { engineInit } from "littlejsengine";

import { buildLevel } from "./gameLevel";

/**
 * ///////////////////////////
 */

function gameInit() {
  buildLevel();
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
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "RobotDoors.png",
  "MapTiles.png",
  "Perrito_tittle_shell.png",
  "Robot_Tiles.png",
]);
