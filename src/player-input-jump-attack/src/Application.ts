import {
    Application as PIXIApplication,
    Graphics as PIXIGraphics,
} from "pixi.js";
import { GameTimer } from "./GameTimer";
import { Fighter } from "./Fighter";
import { ControllerButton } from "./ControllerButton";
import { AbstractStateClass, GameStartingState, PlayerSelectActionState } from "./GameStates";

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
    public controllerButton: ControllerButton = new ControllerButton("x");
    
    public timer: GameTimer = new GameTimer();

    public ground: PIXIGraphics;
    public player: Fighter;
    public enemy: Fighter;

    public state: AbstractStateClass = new GameStartingState(this);
    
    constructor() {
        this.app.stage.addChild(this.timer.view);
        
        this.ground = this.buildGround();
        this.ground.y = Math.round(APP_CONFIGURATION.height * 0.7);
        this.app.stage.addChild(this.ground);

        this.controllerButton.textDisplay.x = 4
        this.controllerButton.textDisplay.y = APP_CONFIGURATION.height - 50
        this.app.stage.addChild(this.controllerButton.textDisplay)
        
        this.player = new Fighter(this, this.ground);
        this.player.setFighterPosition(100, -200)
        this.app.stage.addChild(this.player.fighter);

        this.enemy = new Fighter(this, this.ground)
        this.enemy.setFighterPosition(APP_CONFIGURATION.width-100-(150+75+150), -200)
        this.app.stage.addChild(this.enemy.fighter);

        this.app.ticker.add(this.update);
    }

    /**
     * Main Update Loop of the PIXI Application.
     * 
     * This method is used to call all other update methods in the application.
     */
    update = (frameDelta: number) => {
        if (
            this.state instanceof GameStartingState &&
            this.player.isCollidingWithGround() &&
            this.enemy.isCollidingWithGround()
        ) {
            this.transitionState(new PlayerSelectActionState(this))
        }
        if (this.controllerButton.isPressed) {
            this.state.registerButtonPress()
        }

        this.controllerButton.update(this.app.ticker.deltaMS)
        this.timer.update(frameDelta, this.app.ticker.deltaMS);
        this.state.update(frameDelta, this.app.ticker.deltaMS)
        this.player.update(frameDelta, this.app.ticker.deltaMS);
        this.enemy.update(frameDelta, this.app.ticker.deltaMS);
    };

    /**
     * Transitions out from the current state and into the given state.
     */
    transitionState = (newState: AbstractStateClass) => {
        if (this.state.constructor === newState.constructor) return

        this.state.exitState()
        this.state = newState
        this.state.enterState()
    }

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

