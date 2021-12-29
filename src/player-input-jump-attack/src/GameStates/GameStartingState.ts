import { AbstractStateClass } from "./AbstractStateClass"

export class GameStartingState extends AbstractStateClass {

    enterState = (): void => {
        return
    }

    exitState = (): void => {
        this.application.controllerButton.registerButtonPress()
    }

    registerButtonPress = (): void  => {
        this.application.controllerButton.registerButtonPress()
    }

}