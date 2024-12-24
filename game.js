/**
 * ///////////////////////////
 */

setTilesPixelated(true);
setShowSplashScreen(false);
setShowWatermark(false);

// Active controls in phone
setTouchGamepadEnable(true);

function gameInit() {
  buildLevel();
  initUISystem();
  createUI();
  setMenuVisible(false);
  // setupPostProcess();
}

function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render

  const menuVisible = getMenuVisible();
  setPaused(menuVisible);

  if (keyWasPressed("KeyP") || gamepadWasPressed(9)) {
    setMenuVisible(!menuVisible);
  }
}

function gameRender() {
  /**
   * Pause Menu
   */
  if (!getMenuVisible()) {
    drawTile(
      vec2(770, 30),
      vec2(50),
      !isUsingGamepad ? tile(118, 16, 4) : tile(248, 16, 5),
      WHITE,
      0,
      false,
      rgb(0, 0, 0, 0),
      true,
      true
    );
  } else {
    drawTile(
      vec2(770, 30),
      vec2(50),
      !isUsingGamepad ? tile(608, 16, 4) : tile(250, 16, 5),
      WHITE,
      0,
      false,
      rgb(0, 0, 0, 0),
      true,
      true
    );
  }

  /**
   * Tutorial
   */

  /** Movement anim */
  drawTile(
    vec2(2.6, 4.8),
    vec2(0.5),
    tile(288, 32, 2).frame(Math.floor(time * 7) % 3)
  );

  /** Jump anim*/
  drawTile(
    vec2(6, 5.7),
    vec2(0.5),
    tile(224, 32, 2).frame(Math.floor(time * 7) % 5)
  );

  /** Attack anim */
  drawTile(
    vec2(17.5, 10),
    vec2(0.5),
    tile(96, 32, 2).frame(Math.floor(time * 10) % 11)
  );

  if (!isUsingGamepad) {
    /** Movement */
    //WASD
    drawTile(vec2(1.5, 4.2), vec2(0.5), tile(144, 16, 4));
    drawTile(vec2(2.1, 4.2), vec2(0.5), tile(146, 16, 4));
    //Arrows
    drawTile(vec2(3, 4.2), vec2(0.5), tile(229, 16, 4));
    drawTile(vec2(3.6, 4.2), vec2(0.5), tile(231, 16, 4));

    /** Jump */
    drawTile(vec2(5.5, 5), vec2(0.5), tile(1297, 16, 4));
    drawTile(vec2(6.3, 5), vec2(0.5), tile(110, 16, 4));

    /** Attack */
    drawTile(vec2(17, 9.3), vec2(0.5), tile(185, 16, 4));
    drawTile(vec2(17.7, 9.3), vec2(0.5), tile(179, 16, 4));
  }
  if (isUsingGamepad) {
    /** Movement */
    drawTile(vec2(2.6, 4), vec2(0.7), tile(935, 16, 5));

    /** Jump */
    drawTile(
      vec2(6, 5),
      vec2(0.7),
      tile(108, 16, 5).frame(Math.floor((time * 7) % 4))
    );

    /** Attack */
    drawTile(
      vec2(17.5, 9.1),
      vec2(0.7),
      tile(73, 16, 5).frame(Math.floor(time * 10) % 4)
    );
  }
  /**
   * //////////////////////////
   */

  /**
   * Final
   */
  if (arrEnemies.length <= 0) {
    setPaused(true);
    drawTextScreen(
      "YOU WIN\nYOU ELIMINATED YOUR ENEMIES!\nYOU AVENGE YOUR FRIENDS...",
      vec2(400, 300),
      40
    );
    drawRect(vec2(0), vec2(1000), rgb(0, 0, 0, 0.8));
  }
}

function gameRenderPost() {
  /**
   * Text random
   */
  // Kill them
  drawText(
    "K",
    vec2(Math.sin(time * 100) * 0.05 + 12, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "I",
    vec2(Math.sin(time * 100) * 0.05 + 12.7, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "L",
    vec2(Math.sin(time * 100) * 0.05 + 13.4, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "L",
    vec2(Math.sin(time * 100) * 0.05 + 14.1, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "T",
    vec2(Math.sin(time * 100) * 0.05 + 15.1, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "H",
    vec2(Math.sin(time * 100) * 0.05 + 15.9, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "E",
    vec2(Math.sin(time * 100) * 0.05 + 16.8, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "M",
    vec2(Math.sin(time * 100) * 0.05 + 17.7, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
  drawText(
    "!",
    vec2(Math.sin(time * 100) * 0.05 + 18.5, Math.cos(time * 100) * 0.05 + 5),
    1,
    rgb(0.6, 0, 0, 0.7),
    0.2,
    rgb(0.2, 0, 0, 1)
  );
}

function setupPostProcess() {
  const chromaticAberrationShader = `
  // Chromatic Aberration Effect

  // Function to sample the texture with a slight offset
  vec4 getAberratedColor(vec2 p)
  {
      const float chromaticAmount = 0.003; // Intensity of chromatic aberration
      
      // Sample the texture at slightly shifted coordinates for each color channel
      vec4 aberratedColor;
      aberratedColor.r = texture(iChannel0, p + vec2(chromaticAmount, 0.0)).r;  // Red channel shifted right
      aberratedColor.g = texture(iChannel0, p).g;  // Green channel stays the same
      aberratedColor.b = texture(iChannel0, p - vec2(chromaticAmount, 0.0)).b;  // Blue channel shifted left
      aberratedColor.a = texture(iChannel0, p).a;  // Alpha channel stays the same

      return aberratedColor;
  }

  void mainImage(out vec4 c, vec2 p)
  {
      // Normalize pixel coordinates
      p /= iResolution.xy;

      // Get the color with chromatic aberration applied
      c = getAberratedColor(p);

      // Optionally apply a subtle vignette to focus the center
      const float vignette = 2.0;
      const float vignettePow = 6.0;
      float dx = 2.0 * p.x - 1.0, dy = 2.0 * p.y - 1.0;
      c *= 1.0 - pow((dx * dx + dy * dy) / vignette, vignettePow);
  }`;

  const includeOverlay = true;
  initPostProcess(chromaticAberrationShader, includeOverlay);
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "RobotDoors.png",
  "MapTiles.png",
  "Perrito_tittle_shell.png",
  "Robot_Tiles.png",
  "gdb-keyboard-2.png",
  "gdb-xbox-2.png",
  "Sprite-test.png",
]);
