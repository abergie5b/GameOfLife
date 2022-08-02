import { Node } from "./node.js";
import { Patterns } from "./patterns.js";
import { Config } from "./config.js";

export class Grid {
    #width;
    #height;
    #stats
    #grid;
    #size;
    #drawCellsIsEnabled

    #gridSizeX;
    #gridSizeY;
    #MAX_STROKE_EMPTYCELLX;
    #MAX_STROKE_EMPTYCELLY;

    constructor(width, height, stats) {
        this.#width = width;
        this.#height = height;
        this.#stats = stats;
        this.#grid = [];
        this.#size = Config.GRID_CELL_SIZE;
        this.#drawCellsIsEnabled = Config.GRID_RENDER_BY_DEFAULT;

        this.#initSizes();
    }

    drawCells(val) { this.#drawCellsIsEnabled = val; }
    nodes() { return this.#grid; }
    cellSize() { return this.#size; }
    gridSizeX() { return this.#gridSizeX; }
    gridSizeY() { return this.#gridSizeY; }

    init(initialPattern) {
        let initialPatternStartCoords = [
            Math.floor(this.#gridSizeX*Config.GRID_INITIAL_PATTERN_STARTCOORDS_PERCENT),
            Math.floor(this.#gridSizeY*Config.GRID_INITIAL_PATTERN_STARTCOORDS_PERCENT)
        ];
        let initialPatternEndCoords = [
            Math.floor(initialPatternStartCoords[0] + initialPattern[0].length),
            Math.floor(initialPatternStartCoords[1] + initialPattern.length)
        ];

        this.#grid = [];
        for (let y=0; y<this.#gridSizeY; y++)
        {
            this.#grid.push([]);
            for (let x=0; x<this.#gridSizeX; x++)
            {
                var isAlive = false;
                if (x > initialPatternStartCoords[0] && x <= initialPatternEndCoords[0]
                 && y > initialPatternStartCoords[1] && y <= initialPatternEndCoords[1]) {
                    isAlive = initialPattern
                        [y-initialPatternStartCoords[1] - 1]
                        [x-initialPatternStartCoords[0] - 1] === 1
                        ? true
                        : false;
                        
                }
                let node = new Node(
                    this.#size,
                    this.#size,
                    x*this.#size,
                    y*this.#size,
                    isAlive
                )
                this.#grid[y].push(node);
            }
        }
    }

    export() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += '[';
        for (let arr of this.#grid){
            csvContent += `[${arr.map(
                node => node.isAlive() ? 1 : 0
            ).join(',') }],\n`
        }
        csvContent += ']';
        window.open(
            encodeURI(csvContent)
        );
    }

    #initSizes() {
        this.#gridSizeX = this.#width / this.#size;
        this.#gridSizeY = this.#height / this.#size;
        this.#MAX_STROKE_EMPTYCELLX =  this.#gridSizeX * Config.GRID_NOSHOW_PERCENT;
        this.#MAX_STROKE_EMPTYCELLY =  this.#gridSizeY * Config.GRID_NOSHOW_PERCENT;
    }

    size(val) {
        this.#size = val;
        this.#initSizes();
    }

    toggleNodeAt(x, y, generation) {
        let node = this.getNodeAt(x, y);
        if (node.isAlive()) {
            node.kill();
        }
        else {
            node.touch(generation);
            node.revive();
        }
        node.update();
    }

    #getAdjacentNodes(x, y) {
        let rowAbove = this.#grid[y-1];
        if (rowAbove != null) {
            var tLeft = rowAbove[x-1];
            var top = rowAbove[x];
            var tRight = rowAbove[x+1];
        }

        let rowBelow = this.#grid[y+1];
        if (rowBelow != null) {
            var bLeft = this.#grid[y+1][x-1];
            var bottom = this.#grid[y+1][x];
            var bRight = this.#grid[y+1][x+1]
        }

        let left = this.#grid[y][x-1];
        let right = this.#grid[y][x+1];

        return [
            tLeft,
            top,
            tRight,
            left,
            right,
            bLeft,
            bottom,
            bRight
        ];
    }

    update(timestamp, generation) {
        let totalAlives = 0;
        for (let y=0; y<this.#gridSizeY; y++) {
            for (let x=0; x<this.#gridSizeX; x++) {

                let adjacents = this.#getAdjacentNodes(x, y);

                let alives = 0;
                for (let adjacent of adjacents) {
                    if (adjacent != null)
                        alives += adjacent.isAlive();
                }

                let node = this.#grid[y][x];
                node.alives(alives);
                if (alives < 2) {
                    node.kill();
                }
                else if (alives == 3) {
                    node.touch(generation);
                    node.revive();
                }
                else if (alives > 3) {
                    node.kill();
                }
                totalAlives += node.isAlive();
            }
        }
        this.#stats.liveCells(totalAlives);
    }

    getNodeAt(x, y) {
        let yNodeCoord = Math.floor(y / this.#size);
        let xNodeCoord = Math.floor(x / this.#size);
        return this.#grid[yNodeCoord][xNodeCoord]
    }

    draw(ctx, generation) {
        for (let y=0; y<this.#gridSizeY; y++) {
            for (let x=0; x<this.#gridSizeX; x++) {
                if (this.#drawCellsIsEnabled) {
                    if ((y < this.#gridSizeY - this.#MAX_STROKE_EMPTYCELLY && y > this.#MAX_STROKE_EMPTYCELLY)
                     && (x < this.#gridSizeX - this.#MAX_STROKE_EMPTYCELLX && x > this.#MAX_STROKE_EMPTYCELLX)) {
                        ctx.strokeStyle = `rgba(0, 0, 0, 0.25)`;
                        ctx.strokeRect(
                            x*this.#size,
                            y*this.#size,
                            this.#size,
                            this.#size
                        );
                    }
                }
                let node = this.#grid[y][x];
                node.draw(ctx, generation);
            }
        }
    }
    
}

