import { ButtonTypes } from "../Controller"
import { AbstractStateClass } from "./AbstractStateClass"

export class GameStartingState extends AbstractStateClass {

    enterState = (): void => {
        this.application.controller.updateButtonFunctions(ButtonTypes.ACTION_BUTTON, null, null)
    }

    exitState = (): void => {}

}