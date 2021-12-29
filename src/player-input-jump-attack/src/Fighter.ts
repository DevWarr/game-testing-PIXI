import {
    Graphics as PIXIGraphics,
    GraphicsData,
    Rectangle as PIXIRectangle,
} from "pixi.js";
import { Application } from "./Application";
import { PlayerAttackCompleteState, PlayerSelectActionState } from "./GameStates";
import { PlayerAttackingState } from "./GameStates/PlayerAttackingState";

const FIGHTER_CONFIGURATION = {
    fighterWidth: 75,
    fighterHeight: 75,
    distanceColliderDistanceFromFighterBody: 150
};

interface IVelocity2D {
    x: number,
    y: number,
}

export enum AttackStates {
    NOT_ATTACKING,
    MOVING_TO_ATTACK,
    JUMPING,
    DOUBLE_JUMP,
    RETURN_TO_INITIAL
}

/**
 * A Fighter, controlled by either a player of a computer.
 */
export class Fighter {
    public application: Application
    private ground: PIXIGraphics;
    public fighter: PIXIGraphics;
    private velocity: IVelocity2D = { x: 0, y: 0 };
    private fighterBody: GraphicsData;
    private distanceCollider: GraphicsData;
    private _topCollider: GraphicsData;
    get topCollider(): GraphicsData {
        return this._topCollider
    }

    private initialXPosition: number
    private _attackState: AttackStates = AttackStates.NOT_ATTACKING
    get attackState(): AttackStates {
        return this._attackState
    }
    private fighterToAttack: Fighter | null

    constructor(application: Application, ground: PIXIGraphics) {
        this.application = application
        this.ground = ground;
        this.fighter = this.buildFighter();

        // NOTE: Very untrustworthy value assignment.
        // If this.buildFighter changes, these values may cause errors
        this.distanceCollider = this.fighter.geometry.graphicsData[0]
        this.fighterBody      = this.fighter.geometry.graphicsData[1]
        this._topCollider      = this.fighter.geometry.graphicsData[2]
    }

    /**
     * Updates the position of the fighter based on given X and Y values.
     */
    setFighterPosition = (x: number, y: number) => {
        this.fighter.x = x;
        this.fighter.y = y;
        this.initialXPosition = this.fighter.x
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
    private buildFighter = (): PIXIGraphics => {
        
        return new PIXIGraphics()
            .beginFill(0xFF0000, 0)
            .drawRect(
                /*
                    This is the distance collider, so it's drawn first.
                    It starts at (0,0) and has a height/width of:
                    150 + (fighter height/width) + 150
                */
                0,
                0,
                (
                    FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody +
                    FIGHTER_CONFIGURATION.fighterWidth +
                    FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody
                ),
                (
                    FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody +
                    FIGHTER_CONFIGURATION.fighterHeight +
                    FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody
                ),
            )
            .beginFill(0xCCCC00)
            .drawRect(
                /*
                    This is the fighter 'square' itself.
                    It's X and Y init values are offset to account for the distance collider.
                */
                FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody,
                FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody,
                FIGHTER_CONFIGURATION.fighterWidth,
                FIGHTER_CONFIGURATION.fighterHeight
            )
            .beginFill(0x0000FF, 0)
            .drawRect(
                /*
                    This is the top collider, with some funkier numbers.
                    Essentially, the collider is protruding above the top of the fighterBody itself,
                    with some extra space to detect a collision before the square itself is touched.
                */
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
        this.moveWithGravity(msDelta);
        // move along the X
        this.fighter.x += this.velocity.x

        if (this._attackState === AttackStates.MOVING_TO_ATTACK) {
            if (this.isWithinDistanceOf(this.fighterToAttack)) {
                this._attackState = AttackStates.JUMPING
                this.velocity.y = -10
            }     
        }

        if (this._attackState === AttackStates.JUMPING) {
            if (this.isCollidingWith(this.fighterToAttack)) {
                this.fighter.x = this.fighterToAttack.fighter.x
                this.application.transitionState(new PlayerAttackCompleteState(this.application, false))
                this._attackState = AttackStates.RETURN_TO_INITIAL
                this.velocity.y = -5
                if (this.fighter.x > this.initialXPosition) {
                    this.velocity.x = -5
                } else {
                    this.velocity.x = 5
                }
            }
        }

        if (this._attackState === AttackStates.DOUBLE_JUMP) {
            if (this.isCollidingWith(this.fighterToAttack)) {
                this.fighter.x = this.fighterToAttack.fighter.x
                this._attackState = AttackStates.RETURN_TO_INITIAL
                this.velocity.y = -5
                if (this.fighter.x > this.initialXPosition) {
                    this.velocity.x = -5
                } else {
                    this.velocity.x = 5
                }
            }
        }

        if (this._attackState === AttackStates.RETURN_TO_INITIAL) {
            if (this.velocity.x > 0) {
                if (this.fighter.x >= this.initialXPosition) {
                    this.velocity.x = 0
                    this.fighter.x = this.initialXPosition
                    this._attackState = AttackStates.NOT_ATTACKING
                    this.fighterToAttack = null
                    this.application.transitionState(new PlayerSelectActionState(this.application))
                }
            } else {
                if (this.fighter.x <= this.initialXPosition) {
                    this.velocity.x = 0
                    this.fighter.x = this.initialXPosition
                    this._attackState = AttackStates.NOT_ATTACKING
                    this.fighterToAttack = null
                    this.application.transitionState(new PlayerSelectActionState(this.application))
                }
            }
        }
    };

    /**
     * Moves the cube with relation to gravity.
     * 
     * Should only be called from within the update method.
     */
    private moveWithGravity = (msDelta: number) => {
        if (
            this.isCollidingWithGround() && 
            !([AttackStates.JUMPING, AttackStates.DOUBLE_JUMP].includes(this._attackState))
        ) {
            this.velocity.y = 0;
            this.fighter.y = (
                this.ground.y -
                FIGHTER_CONFIGURATION.fighterHeight -
                FIGHTER_CONFIGURATION.distanceColliderDistanceFromFighterBody
            )
        } else {
            this.velocity.y += 9.8 * (msDelta / 500);
            this.fighter.y += this.velocity.y;
        }
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

    attack = (fighterToAttack: Fighter) => {
        this.fighterToAttack = fighterToAttack
        this._attackState = AttackStates.MOVING_TO_ATTACK
        
        // advance toward the enemy, whether it be to the left or right
        // This velocity should only be set once, or else the fighter will get faster!
        if (this.fighter.x < this.fighterToAttack.fighter.x) {
            this.velocity.x = 5
        } else this.velocity.x = -5
    }

    inputJump = () => {
        if (
            !(this.application.state instanceof PlayerAttackingState) ||
            this.attackState !== AttackStates.JUMPING
        ) return

        if (this.isCollidingWithTopColliderOf(this.fighterToAttack)) {
            this.velocity.x = 0
            this.fighter.x = this.fighterToAttack.fighter.x
            this.velocity.y = -10
            this._attackState = AttackStates.DOUBLE_JUMP
            this.application.transitionState(new PlayerAttackCompleteState(this.application, true))
        } else {
            this.application.transitionState(new PlayerAttackCompleteState(this.application, false))
        }
    }

    isWithinDistanceOf = (fighterToAttack: Fighter): boolean => {
        if (this.velocity.x > 0) {
            return (
                // Right-most point of this fighterBody is farther right than
                // the left distance Collider of the other fighter
                this.getFighterBodyX() + (this.fighterBody.shape as PIXIRectangle).width
                > fighterToAttack.fighter.x
            )
        } else {
            // OR, left-most point of this fighterBody is farther left than
            // the right distance Collider of the other fighter
            return (
                this.getFighterBodyX() < (fighterToAttack.fighter.x + fighterToAttack.fighter.width)
            )
        }
    }

    isCollidingWithTopColliderOf = (fighterToAttack: Fighter): boolean => {
        
        const isWithinYBounds = ( 
            // Checking the Y bounds
            (this.getFighterBodyY() + (this.fighterBody.shape as PIXIRectangle).height)
            > fighterToAttack.fighter.y + (fighterToAttack.topCollider.shape as PIXIRectangle).y
        );

        const isWithinXBounds = this.velocity.x > 0 ?
            (
                // box entered from the left
                this.getFighterBodyX() + (this.fighterBody.shape as PIXIRectangle).width
                > fighterToAttack.fighter.x + (fighterToAttack.topCollider.shape as PIXIRectangle).x
            ) : ( // OR box entered from the right
                this.getFighterBodyX()
                < fighterToAttack.fighter.x + (fighterToAttack.topCollider.shape as PIXIRectangle).x + (fighterToAttack.topCollider.shape as PIXIRectangle).width
            );

        return (isWithinYBounds && isWithinXBounds)
    }

    isCollidingWith = (fighterToAttack: Fighter): boolean => {
        const isWithinYBounds = ( 
            // Checking the Y bounds
            (this.getFighterBodyY() + (this.fighterBody.shape as PIXIRectangle).height)
            > fighterToAttack.getFighterBodyY()
        );

        const isWithinXBounds = this.velocity.x > 0 ?
            (
                // box entered from the left
                this.getFighterBodyX() + (this.fighterBody.shape as PIXIRectangle).width
                > fighterToAttack.getFighterBodyX()
            ) : ( // OR box entered from the right
                this.getFighterBodyX()
                < fighterToAttack.getFighterBodyX() + (fighterToAttack.fighterBody.shape as PIXIRectangle).width
            );

        return (isWithinYBounds && isWithinXBounds)
    }
}