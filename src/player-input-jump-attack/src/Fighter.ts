import {
    Graphics as PIXIGraphics,
    GraphicsData,
    Rectangle as PIXIRectangle,
} from "pixi.js";

const FIGHTER_CONFIGURATION = {
    fighterWidth: 75,
    fighterHeight: 75
};

interface IVelocity2D {
    x: number,
    y: number,
}

/**
 * A Fighter, controlled by either a player of a computer.
 */
export class Fighter {
    private ground: PIXIGraphics;
    private isColliding: boolean = false;
    public fighter: PIXIGraphics;
    private fighterBody: GraphicsData;
    private velocity: IVelocity2D = { x: 0, y: 0 };

    constructor(ground: PIXIGraphics) {
        this.ground = ground;
        this.fighter = this.buildFighter();
        this.fighterBody = this.fighter.geometry.graphicsData.find(
            graphicsObject => graphicsObject.fillStyle.alpha === 1
        );
        // Update position of fighter
        this.fighter.x = 200;
        this.fighter.y = -200;
    }

    /**
     * gets the X position of the top-left corner of the fighterBody.
     */
    getFighterBodyX = (): number => this.fighter.x + (this.fighterBody.shape as PIXIRectangle).x;

    /**
     * gets the Y position of the top-left corner of the fighterBody.
     */
    getFighterBodyY = (): number => this.fighter.y + (this.fighterBody.shape as PIXIRectangle).y;

    /**
     * Creates a fighter with collision boxes.
     */
    buildFighter = (): PIXIGraphics => {
        
        return new PIXIGraphics()
            .beginFill(0xCCCC00)
            .drawRect(
                150,
                150,
                FIGHTER_CONFIGURATION.fighterWidth,
                FIGHTER_CONFIGURATION.fighterHeight
            )
            .beginFill(0xFF0000, 0.3)
            .drawRect(
                0,
                0,
                375, // 150px on each side of the main square
                375
            )
            .beginFill(0x0000FF, 0.3)
            .drawRect(
                130,
                120,
                FIGHTER_CONFIGURATION.fighterWidth + 40,
                40
            );
    };

    /**
     * Main Update Loop.
     */
    update = (frameDelta: number, msDelta: number) => {
        if (this.isCollidingWithGround()) {
            this.isColliding = true;
        } else this.isColliding = false;

        this.moveWithGravity(msDelta);
    };

    /**
     * Moves the cube with relation to gravity.
     * 
     * Should only be called from within the update method.
     */
    private moveWithGravity = (msDelta: number) => {
        if (this.isColliding) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += 9.8 * (msDelta / 500);
        }
        this.fighter.y += this.velocity.y;
    };

    /**
     * Checks if the fighter is colliding with the ground.
     * 
     * Utilty method to stop the fighter from falling through the ground.
     */
    isCollidingWithGround = (): boolean => {
        const bottomOfFighterBody = this.getFighterBodyY() + (this.fighterBody.shape as PIXIRectangle).height;
        const topOfGround = this.ground.y;

        // Y values start at 0 at the top, and increase as you go down
        // Ergo, a higher Y value means the body is below the ground
        return bottomOfFighterBody >= topOfGround;
    };
}