
export class Statistics {
    #generations
    #stepTime
    #liveCells

    #generationsEle
    #stepTimeEle
    #liveCellsEle

    constructor() {
        this.#generations = 0;
        this.#stepTime = 0;
        this.#liveCells = 0;

        this.#generationsEle = document.getElementById('generations');
        this.#stepTimeEle = document.getElementById('stepTime');
        this.#liveCellsEle = document.getElementById('liveCells');
    }
    liveCells(val) { this.#liveCells = val; }
    stepTime(val) { this.#stepTime = val; }
    generations(val) { this.#generations = val; }

    update() {
        this.#generationsEle.innerHTML = this.#generations;
        this.#stepTimeEle.innerHTML = `${parseInt(this.#stepTime)}ms`;
        this.#liveCellsEle.innerHTML = this.#liveCells;
    }

    reset() {
        this.#stepTime = 0;
        this.#liveCells = 0;
        this.#generations = 0;
        this.update();
    }
}

