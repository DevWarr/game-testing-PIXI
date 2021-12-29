import {
    Application as PIXIApplication,
    Graphics as PIXIGraphics,
} from "pixi.js";
import { GameTimer } from "./GameTimer";
import { Fighter } from "./Fighter";

const APP_CONFIGURATION = {
    width: 1280,
    height: 720
};

/**
 * Entry point for the PIXI Application.
 * 
 * This class stores global logic and properties for the game to function, 
 * as well as many containers and sprites used in the app itself.
 */
export class Application {
    public app: PIXIApplication = new PIXIApplication(APP_CONFIGURATION);
    public view: HTMLCanvasElement = this.app.view;
    
    public timer: GameTimer = new GameTimer();

    public ground: PIXIGraphics;
    public player: Fighter;
    
    constructor() {
        this.app.stage.addChild(this.timer.view);
        
        this.ground = this.buildGround();
        this.ground.y = Math.round(APP_CONFIGURATION.height * 0.7);
        this.app.stage.addChild(this.ground);
        
        this.player = new Fighter(this.ground);
        this.app.stage.addChild(this.player.fighter);

        this.app.ticker.add(this.update);
        console.log(this.app.stage.height, String(this.app.stage.width));
    }

    /**
     * Main Update Loop of the PIXI Application.
     * 
     * This method is used to call all other update methods in the application.
     */
    update = (frameDelta: number) => {
        this.timer.update(frameDelta, this.app.ticker.deltaMS);
        this.player.update(frameDelta, this.app.ticker.deltaMS);
    };

    /**
     * Builds a ground object for the fighters to stand on.
     * 
     */
    buildGround = (): PIXIGraphics => {
        const groundWidth = APP_CONFIGURATION.width;
        const groundHeight = Math.round(APP_CONFIGURATION.height * 0.3);

        return new PIXIGraphics()
            .beginFill(0x445500)
            .drawRect(
                0,
                0,
                groundWidth,
                groundHeight
            );
    };
}

