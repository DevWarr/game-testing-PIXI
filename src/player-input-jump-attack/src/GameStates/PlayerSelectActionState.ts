import { Graphics as PIXIGraphics } from "pixi.js"
import { Application } from "../Application"
import { AbstractStateClass } from "./AbstractStateClass"
import { PlayerSelectEnemyState } from "./PlayerSelectEnemyState"

export class PlayerSelectActionState extends AbstractStateClass {
    private attackLabel: PIXIGraphics
    
    enterState = () => {
        this.attackLabel = new PIXIGraphics()
            .beginFill(0xCCCC00)
            .drawCircle(0, 0, 75/2)

        this.attackLabel.x = (
            this.application.player.fighter.x + (this.application.player.fighter.width / 2)
        )
        this.attackLabel.y = this.application.player.fighter.y - this.attackLabel.height
    
        this.application.app.stage.addChild(this.attackLabel)
    }

    exitState = () => {
        this.application.controllerButton.registerButtonPress()
        this.application.app.stage.removeChild(this.attackLabel)
        this.attackLabel.destroy()
    }

    registerButtonPress = () => {
        this.application.controllerButton.registerButtonPress()
        this.application.transitionState(new PlayerSelectEnemyState(this.application))
    }
}