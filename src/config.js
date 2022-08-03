import { Patterns } from "./patterns.js";

export class Config {
    static GAME_FPS = 60;
    static GAME_INITIAL_PATTERN = Patterns.StairstepNonomino;

    static CANVAS_WIDTH = 1350;
    static CANVAS_HEIGHT = 650;
    static CANVAS_SCALEX = 1;
    static CANVAS_SCALEY = 1;
    static CANVAS_TRANSLATEX = 1;
    static CANVAS_TRANSLATEY = 1;
    static CANVAS_PAN_MODE_DEFAULT = true;

    static GRID_WIDTH_MULTIPLIER = 5;
    static GRID_HEIGHT_MULTIPLIER = 5;
    static GRID_CELL_SIZE = 10;
    static GRID_NOSHOW_PERCENT = 0.4;
    static GRID_RENDER_BY_DEFAULT = false;
    static GRID_INITIAL_PATTERN_STARTCOORDS_PERCENT = 0.5;

    static SOUP_WIDTH = 100;
    static SOUP_HEIGHT = 100;
    static SOUP_DENSITY = 0.3;

}
