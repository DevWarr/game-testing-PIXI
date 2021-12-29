import { AttackStates } from "../Fighter";
import { AbstractStateClass } from "./AbstractStateClass";

export class PlayerAttackingState extends AbstractStateClass {
    
    enterState = (): void => {
        this.application.player.attack(this.application.enemy)
    }

    exitState = (): void => {
        this.application.controllerButton.registerButtonPress()
    }

    registerButtonPress = (): void => {
        this.application.controllerButton.registerButtonPress()
        if (this.application.player.attackState !== AttackStates.JUMPING) return
        this.application.player.inputJump()
    }

}