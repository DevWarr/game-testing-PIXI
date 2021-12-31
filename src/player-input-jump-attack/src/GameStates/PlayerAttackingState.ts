import { ButtonTypes } from "../Controller";
import { AttackStates } from "../Fighter";
import { AbstractStateClass } from "./AbstractStateClass";

export class PlayerAttackingState extends AbstractStateClass {
    
    enterState = (): void => {
        this.application.player.startAttack(this.application.enemy)
        this.application.controller.updateButtonFunctions(ButtonTypes.ACTION_BUTTON, this.application.player.inputJump, null)
    }

    exitState = (): void => {}

}