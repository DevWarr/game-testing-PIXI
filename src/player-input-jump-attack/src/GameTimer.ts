import { ITextStyle, Text as PIXIText } from "pixi.js";

const TEXT_STYLING: Partial<ITextStyle> = {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xff1010,
    align: "left"
};

/**
 * A Timer that displays some generic time info.
 */
export class GameTimer {
    private elapsedFrames: number = 0;
    private elapsedTime: number = 0;
    public view: PIXIText;

    /**
     * Create a new GameTimer.
     */
    constructor() {
        this.view = new PIXIText(this.buildTimerText(), TEXT_STYLING);
    }

    /**
     * Builds the text for the {@link GameTimer} to display 
     */
    buildTimerText = (): string => {
        const elapsedFrames = Math.round(this.elapsedFrames);
        const elapsedTime = Math.round(this.elapsedTime / 100) / 10;

        return `Elapsed Frames: ${elapsedFrames}\nElapsed Seconds: ${elapsedTime}`;
    };

    /**
     * Main Update Loop.
     */
    update = (frameDelta: number, msDelta: number) => {
        this.elapsedFrames += frameDelta;
        this.elapsedTime += msDelta;
        this.view.text = this.buildTimerText();
    };
}