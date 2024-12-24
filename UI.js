let uiRoot, uiMenu;

const setMenuVisible = (visible) => (uiMenu.visible = visible);
const getMenuVisible = () => uiMenu.visible;

function createUI() {
  /**
   * UI ROOT & UI MENU
   */
  uiRoot = new UIObject();
  uiMenu = new UIObject(vec2(canvasFixedSize.x / 2, canvasFixedSize.y / 2));
  uiRoot.addChild(uiMenu);

  /**
   * Background Menu
   */
  const uiBackground = new UIObject(vec2(0, 0), vec2(400, 550));
  uiBackground.color = rgb(0, 0, 0, 0.8);
  uiBackground.lineWidth = 0;
  uiMenu.addChild(uiBackground);

  const textTitle = new UIText(
    vec2(0, -230),
    vec2(600, 60),
    "DOGGO TIK \nPAUSE"
  );
  textTitle.textColor = WHITE;
  textTitle.lineWidth = 5;
  textTitle.lineColor = rgb(0.5, 0.3, 0, 1);
  uiMenu.addChild(textTitle);

  const btnResetGame = new UIButton(vec2(0, 140), vec2(350, 50), "RESET GAME");
  btnResetGame.textColor = WHITE;
  btnResetGame.color = rgb(1.0, 0.549, 0.0, 0.3);
  btnResetGame.onPress = () => {
    buildLevel();
    setMenuVisible(false);
  };
  uiMenu.addChild(btnResetGame);

  const btnExitPause = new UIButton(vec2(0, 200), vec2(350, 50), "RESUME");
  btnExitPause.textColor = WHITE;
  btnExitPause.color = rgb(0.0, 0.0, 0.545, 0.3);
  btnExitPause.onPress = () => {
    setMenuVisible(false);
  };
  uiMenu.addChild(btnExitPause);
}
