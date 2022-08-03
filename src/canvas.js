import { Config } from "./config.js";

export class Canvas {
    #element;
    #ctx;
    #scaleX;
    #scaleY;
    #translateX;
    #translateY;

    constructor(element) {
        this.#element = element;
        this.#element.width = innerWidth;
        this.#element.height = innerHeight;

        this.#ctx = element.getContext('2d');
        this.#scaleX = Config.CANVAS_SCALEX;
        this.#scaleY = Config.CANVAS_SCALEY;

        this.#translateX = Config.CANVAS_TRANSLATEX;
        this.#translateY = Config.CANVAS_TRANSLATEY;
    }

    element() { return this.#element; }
    context() { return this.#ctx; }
    scaleX() { return this.#scaleX; }
    scaleY() { return this.#scaleY; }

    applyScale() { 
        this.#ctx.scale(
            this.#scaleX, 
            this.#scaleY
        ); 
    }

    applyTranslate() {
        this.#ctx.translate(
            this.#translateX, 
            this.#translateY
        );
    }

    setTranslate(x, y) {
        this.#translateX = x;
        this.#translateY = y;
    }

    restore() {
        this.#ctx.resetTransform();
    }

    setScale(x, y) {
        this.#scaleX = x;
        this.#scaleY = y;
    }

    setScaleDelta(delta) {
        this.#scaleX += delta;
        this.#scaleY += delta;
    }

    clear() {
        this.#ctx.clearRect(
            0, 
            0, 
            innerWidth,
            innerHeight
        );
    }
}

