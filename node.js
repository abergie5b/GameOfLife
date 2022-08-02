
export class Node {
    #width
    #height
    #x
    #y
    #cachedIsAlive
    #isAlive
    #alives
    #isTouched
    #lastGenerationTouched

    constructor(width, height, x, y, isAlive) {
        this.#width = width;
        this.#height = height;
        this.#x = x;
        this.#y = y;

        this.#cachedIsAlive = isAlive;
        this.#isAlive = false;

        this.#alives = 0;
        this.#isTouched = false;

        this.#lastGenerationTouched = 0;
    }

    x() { return this.#x; }
    y() { return this.#y; }
    kill() { this.#cachedIsAlive = false; }
    revive() { this.#cachedIsAlive = true; }
    isAlive() { return this.#isAlive; }
    alives(val) { this.#alives = val; }
    update() { this.#isAlive = this.#cachedIsAlive; }

    touch(generation) {
        this.#isTouched = true;
        this.#lastGenerationTouched = generation;
    }

    draw(ctx, generation)
    {
        if (this.#isAlive) {
            ctx.fillStyle = `rgba(0, 0, 255, 0.5)`;
            ctx.fillRect(
                this.#x,
                this.#y,
                this.#width,
                this.#height
            );
        }
        else if (this.#isTouched && !this.#isAlive) {
            let g = 255 + (this.#lastGenerationTouched - generation) * 2;
            ctx.fillStyle = `rgba(0, ${g}, 0, 0.25)`;
            ctx.fillRect(
                this.#x,
                this.#y,
                this.#width,
                this.#height
            );

        }
    }
}

