import { Node } from "./node.js";

export class Soup {
    #width
    #height
    #density
    #cellSize

    constructor(width, height, density, cellSize) {
        this.#width = width;
        this.#height = height;
        this.#density = density;
        this.#cellSize = cellSize;
    }

    create() {
        let soup = [ ];
        let soupWidth = this.#width / this.#cellSize;
        let soupHeight = this.#height / this.#cellSize;
        for (let y=0; y<soupHeight; y++) {
            soup.push([]);
            for (let x=0; x<soupWidth; x++) {
                let isAlive = this.#density > Math.random() 
                    ? 1
                    : 0;
                soup[y].push(isAlive);
            }
        }
        return soup;
    }

}

