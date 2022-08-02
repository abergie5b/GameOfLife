import { Patterns } from "./patterns.js";
import { Config } from "./config.js";

export class GameOfLife {
    #canvas;
    #grid;
    #stats;

    #fps;
    isPaused;
    #initialPattern;
    #generations;

    constructor(canvas, grid, stats) {
        this.#canvas = canvas;
        this.#grid = grid;
        this.#stats = stats;

        this.#fps = Config.GAME_FPS;
        this.isPaused = true;
        this.#initialPattern = Config.GAME_INITIAL_PATTERN;
        this.#generations = 0;
    }

    generations() { return this.#generations; }
    grid() { return this.#grid; }
    initialPattern(val) { this.#initialPattern = val; }
    fps(val) { this.#fps = val; }
    export() { this.#grid.export(); }

    init() {
        this.#canvas.clear();
        this.#canvas.setTranslate(
            -this.#grid.gridSizeX()*this.#grid.cellSize()*Config.GRID_NOSHOW_PERCENT,
            -this.#grid.gridSizeY()*this.#grid.cellSize()*Config.GRID_NOSHOW_PERCENT
        );
        this.#stats.reset();
        this.#generations = 0;

        this.#grid.init(
            this.#initialPattern
        );
        this.#updateNodes();
    }

    #updateNodes(timestamp) {
        let nodes = this.#grid.nodes();
        for (let y=0; y<nodes.length; y++) {
            for (let x=0; x<nodes[0].length; x++) {
                let node = nodes[y][x];
                node.update();
            }
        }
    }

    update(timestamp) {
        this.#grid.update(timestamp, this.#generations);
        this.#updateNodes(timestamp);
        this.#stats.update();
    }

    draw() {
        this.#canvas.clear();
        this.#canvas.applyTranslate();
        this.#canvas.scale();

        this.#grid.draw(
            this.#canvas.context(), 
            this.#generations
        );
        this.#canvas.restore();
    }

    step(self, timestamp) {
        this.#generations++;
        this.#stats.generations(this.#generations);

        self.update(timestamp);
        self.draw(
            self.#canvas.context()
        );
    }

    run() {
        let lastFrame = performance.now() / 1000;
        let loop = (timestamp) => {

            if (!this.isPaused) {
                let stepTime = timestamp - lastFrame;
                if (stepTime > 1 / this.#fps) {
                    this.step(this, timestamp);
                    lastFrame = timestamp;
                    this.#stats.stepTime(stepTime);
                }
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);
    }
}

