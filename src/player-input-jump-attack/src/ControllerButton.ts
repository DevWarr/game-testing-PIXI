import { Text as PIXIText } from "pixi.js"

/**
 * A Single-Button Controller.
 * 
 * Determines whether the given button is pressed.
 */
export class ControllerButton {
    public textDisplay: PIXIText
    private elapsedTime: number

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
        this.textDisplay = new PIXIText("", {
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0x9988FF,
            align: "left"
        })
        this.initialize()
    }

    /**
     * Initializes the Controller with window event listeners
     */
    private initialize = () => {
        window.onkeydown = (event: KeyboardEvent) => {
            if (event.key === this.key && !this._isHeld) {
                this.textDisplay.text = "Button pressed!"
                this._isPressed = true;
                this._isHeld = true;
            }
        }
        window.onkeyup = (event: KeyboardEvent) => {
            if (event.key === this.key) {
                this._isPressed = false;
                this._isHeld = false;
            }
        }
        // When the window loses focus, we stop pressing the button.
        // Allows us to avoid pesky scenarios where the button glitches and stays held.
        window.onblur = () => {
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

    update = (msDelta: number) => {
        if (this.textDisplay.text.length === 0) {
            this.elapsedTime = 0
            return
        }
        this.elapsedTime += msDelta
        if (this.elapsedTime > 2000) {
            this.textDisplay.text = ""
        }
    }
}