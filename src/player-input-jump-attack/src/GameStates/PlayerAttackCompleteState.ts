import { ITextStyle, Text as PIXIText } from "pixi.js";
import { Application } from "../Application";
import { AbstractStateClass } from "./AbstractStateClass";

const TEXT_STYLING: Partial<ITextStyle> = {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xFFFFFF,
    align: "right"
};

export class PlayerAttackCompleteState extends AbstractStateClass {
    public textDisplay: PIXIText

    constructor(application: Application, jumpSucceeded: boolean) {
        super(application)
        this.textDisplay = new PIXIText(jumpSucceeded ? "Good!" : "Miss...", TEXT_STYLING)
    }
    
    enterState = (): void => {
        this.textDisplay.x = this.application.player.fighter.x
        this.textDisplay.y = this.application.player.fighter.y - this.textDisplay.height
        this.application.app.stage.addChild(this.textDisplay)
    }

    exitState = (): void => {
        this.application.app.stage.removeChild(this.textDisplay)
        this.textDisplay.destroy()
    }
}