
import { Grid } from "./grid.js";
import { Canvas } from "./canvas.js";
import { GameOfLife } from "./game.js";
import { Patterns } from "./patterns.js";
import { Statistics } from "./statistics.js";
import { Soup } from "./soup.js";
import { Config } from "./config.js";

let stats = new Statistics();

let grid = new Grid(
    Config.CANVAS_WIDTH*Config.GRID_WIDTH_MULTIPLIER,
    Config.CANVAS_HEIGHT*Config.GRID_HEIGHT_MULTIPLIER,
    stats
);

let canvas = new Canvas(
    document.getElementById('gol'),
    Config.CANVAS_WIDTH,
    Config.CANVAS_HEIGHT
);

let gol = new GameOfLife(
    canvas,
    grid,
    stats
);


function start() {
    let fps = document.getElementById('fps');
    gol.fps(parseFloat(fps.value) / 1000);
    if (gol.isPaused) {
        gol.isPaused = false;
        gol.run();
    }
}

function initTotalDrag() {
    return { 
        x: -grid.gridSizeX()*grid.cellSize()*Config.GRID_NOSHOW_PERCENT,
        y: -grid.gridSizeY()*grid.cellSize()*Config.GRID_NOSHOW_PERCENT
    };
}

function reset() {
    document.getElementById('scale').innerHTML =
        'scale:(1.00,1.00)';

    let size = document.getElementById('size');
    let fps = document.getElementById('fps');
    grid.size(parseInt(size.value));
    gol.fps(parseFloat(fps.value) / 1000);
    totalDrag = initTotalDrag();

    canvas.setScale(1, 1);
    gol.isPaused = true;
    gol.init();
    gol.draw();
}


document.getElementById('reset')
    .addEventListener('click', () => {
        reset();
});

document.getElementById('fps')
    .addEventListener('change', () => {
        let fps = document.getElementById('fps');
        let val = parseFloat(fps.value) / 1000;
        if (val != null) {
            gol.fps(val);
        }

});

document.getElementById('start')
    .addEventListener('click', () => {
        start();
});

document.getElementById('step')
    .addEventListener('click', () => {
        gol.isPaused = true;
        requestAnimationFrame((ts) => { gol.step(gol, ts); });
});

document.getElementById('stop')
    .addEventListener('click', () => {
        gol.isPaused = true;
});

document.getElementById('clear')
    .addEventListener('click', () => {
        gol.isPaused = true;
        gol.initialPattern([[]]);
        gol.init();
        gol.draw();
});

document.getElementById('drawCellsEnabled')
    .addEventListener('click', (e) => {
        grid.drawCells(e.srcElement.checked);
        gol.draw();
});

document.getElementById('export')
    .addEventListener('click', () => {
        gol.export();
});

var pan = Config.CANVAS_PAN_MODE_DEFAULT;
document.getElementById('pan')
    .addEventListener('click', (e) => {
        pan = e.srcElement.checked;
});

document.getElementById('createSoup')
    .addEventListener('click', () => {
        let size = document.getElementById('size');
        grid.size(parseInt(size.value));

        let width = document.getElementById('soupWidth').value;
        let height = document.getElementById('soupHeight').value;
        let density = document.getElementById('soupDensity').value;
        let soup = new Soup(
            width,
            height,
            density,
            grid.cellSize()
        );
        gol.initialPattern(soup.create());
        reset();
});

document.getElementById('gol')
    .addEventListener('wheel', (e) => {
        e.preventDefault();
        canvas.setScaleDelta(e.deltaY * -0.0001);
        if (gol.isPaused) {
            gol.draw();
        }
        document.getElementById('scale').innerHTML = 
            `scale:(${canvas.scaleX().toFixed(2)},${canvas.scaleY().toFixed(2)})`;
});

var drag = false;
var startDrag = { x: 0, y: 0 };
var endDrag = { x: 0, y: 0 };
var totalDrag = initTotalDrag();
document.getElementById('gol')
    .addEventListener('mousedown', (e) => {
        drag = true;
        if (!pan) {
            let x = (e.offsetX 
                + Math.abs(totalDrag.x) 
                + endDrag.x 
                - startDrag.x) / canvas.scaleX();
            let y = (e.offsetY 
                + Math.abs(totalDrag.y) 
                + endDrag.y 
                - startDrag.y) / canvas.scaleY();

            grid.toggleNodeAt(
                x,
                y,
                0
            );
            let node = grid.getNodeAt(
                x,
                y
            );
            if (gol.isPaused) {
                gol.draw();
            }
        }
        else {
            startDrag.x = e.pageX;
            startDrag.y = e.pageY;
        }
});

document.getElementById('gol')
    .addEventListener('mouseup', (e) => {
        drag = false;
        totalDrag.x += endDrag.x - startDrag.x;
        totalDrag.y += endDrag.y - startDrag.y;
        startDrag.x = endDrag.x;
        startDrag.y = endDrag.y;
        if (gol.isPaused) {
            gol.draw();
        }
});

document.getElementById('gol')
    .addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (drag) {
            if (!pan) {
                let x = (e.offsetX 
                    + Math.abs(totalDrag.x) 
                    + endDrag.x 
                    - startDrag.x) / canvas.scaleX();
                let y = (e.offsetY 
                    + Math.abs(totalDrag.y) 
                    + endDrag.y 
                    - startDrag.y) / canvas.scaleY();
                let node = grid.getNodeAt(x, y);
                if (!node.isAlive()) {
                    let node = grid.getNodeAt(x, y);
                    node.touch(gol.generations());
                    node.revive();
                    node.update();
                    if (gol.isPaused) {
                        gol.draw();
                    }
                }
            }
            else {
                endDrag.x = e.pageX;
                endDrag.y = e.pageY;
                canvas.setTranslate(
                    totalDrag.x + endDrag.x - startDrag.x,
                    totalDrag.y + endDrag.y - startDrag.y
                );
                if (gol.isPaused) {
                    gol.draw();
                }

            }

        }
});

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        if (gol.isPaused) {
            start();
        }
        else {
            gol.isPaused = true;
        }
    }
});


window.onload = () => {
    document.getElementById('size').value = Config.GRID_CELL_SIZE;
    document.getElementById('fps').value = Config.GAME_FPS;
    document.getElementById('drawCellsEnabled').checked = Config.GRID_RENDER_BY_DEFAULT;
    document.getElementById('pan').checked = Config.CANVAS_PAN_MODE_DEFAULT;
    document.getElementById('soupWidth').value = Config.SOUP_WIDTH;
    document.getElementById('soupHeight').value = Config.SOUP_HEIGHT;
    document.getElementById('soupDensity').value = Config.SOUP_DENSITY;

    let select = document.getElementById('patterns');
    for (let pattern of Object.keys(Patterns.All)) {
        let button = document.createElement('button');
        button.type = 'button';
        button.id = pattern;
        button.innerHTML = pattern;
        select.appendChild(button);

        document.getElementById(pattern)
            .addEventListener('click', (e) => {
                gol.initialPattern(Patterns.All[pattern]);
                reset();
        });

    }

    gol.init();
    gol.draw();
}

