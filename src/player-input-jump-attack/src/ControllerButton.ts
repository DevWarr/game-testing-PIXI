
/**
 * A Single-Button Controller.
 * 
 * Determines whether the given button is pressed.
 */
export class ControllerButton {
    readonly key: string;
    private _isHeld: boolean = false;
    get isHeld(): boolean {
        return this._isHeld
    }
    private _isPressed: boolean = false;
    get isPressed(): boolean {
        return this._isPressed
    }
    
    constructor(key: string) {
        this.key = key
        this.initialize()
    }

    /**
     * Initializes the Controller with window event listeners
     */
    private initialize = () => {
        window.onkeydown = (event: KeyboardEvent) => {
            if (event.key === this.key && !this._isHeld) {
                console.log("pressed")
                this._isPressed = true;
                this._isHeld = true;
            }
        }
        window.onkeyup = (event: KeyboardEvent) => {
            if (event.key === this.key) {
                console.log("released")
                this._isPressed = false;
                this._isHeld = false;
            }
        }
        // When the window loses focus, we stop pressing the button.
        // Allows us to avoid pesky scenarios where the button glitches and stays held.
        window.onblur = () => {
            console.log("released")
            this._isPressed = false;
            this._isHeld = false;
        }
    }
    

    /**
     * Registers that the button is pressed and resets _isPressed to false.
     * 
     * Used for after the application has registered the button press.
     */
    registerButtonPress = () => {
        this._isPressed = false;
    }
}