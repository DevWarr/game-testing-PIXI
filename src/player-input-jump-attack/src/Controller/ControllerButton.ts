import { ButtonTypes } from "./Controller";

/**
 * A Single ControllerButton.
 * 
 * On update, checks if the button is pressed or held, and calls any corresponding functions.
 */
export class ControllerButton {
    public buttonType: ButtonTypes;
    private isHeld: boolean = false;
    private isPressed: boolean = false;

    public isHeldFunc: Function;
    public isPressedFunc: Function;
    
    constructor(buttonType: ButtonTypes) {
        this.buttonType = buttonType
    }

    /**
     * Records that the button is pressed down.
     * 
     * NOTE: If the button `isHeld` already when this method is called, `isPressed` will NOT be set to true.
     * This is to avoid `isPressedFunc()` from being called when the button hasn't been freshly pressed down.
     */
    onButtonDown = () => {
        // If this method is called and the button has already been held down, 
        // We don't want to record it as a press - only a hold
        if (!this.isHeld) {
            this.isPressed = true
        }
        this.isHeld = true
    }

    /** Records that the button is not pressed. */
    onButtonUp = () => {
        this.isHeld = false
        this.isPressed = false
    }

    /**
     * Main update loop.
     * 
     * If the button `isPressed`, we call `isPressedFunc()` and set `isPressed` to false (to only record one press)
     * 
     * If the button `isHeld`, we call `isHeldFunc()` (we don't set this to false: if the button is still held we keep calling this function)
     */
    update = (msDelta: number) => {
        if (this.isPressed && this.isPressedFunc) {
            this.isPressedFunc()
            this.isPressed = false
        }
        if (this.isHeld && this.isHeldFunc) {
            this.isHeldFunc()
        }
    }
}
