import { ControllerButton } from "./ControllerButton";

export enum ButtonTypes {
    ACTION_BUTTON
}

interface IButtons {
    [keyboardKey: string]: ControllerButton
}

type maybeFunction = Function | null | undefined

/**
 * Controller for detecting inputs.
 * 
 * Can hold several buttons, update what each button does, and update the key that will activate each button
 */
export class Controller {
    private buttons: IButtons = {
        "x": new ControllerButton(ButtonTypes.ACTION_BUTTON)
    }

    constructor() {
        this.initialize()
    }

    /**
     * Initializes event listeners to press and unpress buttons.
     */
    private initialize = () => {
        window.onkeydown = ({key}: KeyboardEvent) => {
            if (key in this.buttons) {
                this.buttons[key].onButtonDown()
            }
        }
        window.onkeyup = ({key}: KeyboardEvent) => {
            if (key in this.buttons) {
                this.buttons[key].onButtonUp()
            }
        }
        window.blur = () => {
            // Unpress all buttons if the window loses focus
            for (let key in this.buttons) {
                this.buttons[key].onButtonUp()
            }
        }
    }

    /**
     * Updates a given button's actions it performs when pressed or held.
     * 
     * @param buttonType The type of the button to update
     * @param isPressedFunc The new isPressedFunc. Set as `undefined` to keep the current function, and set to `null` to have no action.
     * @param isHeldFunc The new isHeldFunc. Set as `undefined` to keep the current function, and set to `null` to have no action.
     * @returns 
     */
    updateButtonFunctions = (buttonType: ButtonTypes, isPressedFunc: maybeFunction, isHeldFunc: maybeFunction) => {
        const buttonToUpdate = Object.values(this.buttons).find((button: ControllerButton) => button.buttonType === buttonType)
        if (!buttonToUpdate) return

        if (isPressedFunc !== undefined) buttonToUpdate.isPressedFunc = isPressedFunc
        if (isHeldFunc !== undefined) buttonToUpdate.isHeldFunc = isHeldFunc
    }

    /**
     * Main update loop for the controller.
     * 
     * Loops through and `.update()`s each button within `this.buttons`
     */
    update = (msDelta: number) => {
        Object.values(this.buttons)
            .forEach((button: ControllerButton) => button.update(msDelta))
    }
}
