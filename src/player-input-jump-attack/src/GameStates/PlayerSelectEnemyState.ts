import {
    Graphics as PIXIGraphics,
    Point as PIXIPoint
} from "pixi.js"
import { AbstractStateClass } from "./AbstractStateClass";
import { PlayerAttackingState } from "./PlayerAttackingState";

export class PlayerSelectEnemyState extends AbstractStateClass {
    private enemySelectArrow: PIXIGraphics
    private isMovingDown: boolean = true
    private distanceMovedDown: number = 0

    enterState = (): void => {
        this.enemySelectArrow = new PIXIGraphics()
            .beginFill(0x7788FF)
            .lineStyle(4, 0xFFFFFF)
            .drawPolygon([
                new PIXIPoint(0, 0),
                new PIXIPoint(30, 20),
                new PIXIPoint(60, 0),
                new PIXIPoint(30, 60),
                new PIXIPoint(0, 0),
            ])
            .endFill()
        this.enemySelectArrow.x = (
            this.application.enemy.fighter.x
            + (this.application.enemy.fighter.width / 2)
            - (this.enemySelectArrow.width / 2)
        )
        this.enemySelectArrow.y = this.application.enemy.fighter.y - 20
        this.application.app.stage.addChild(this.enemySelectArrow)
    }

    exitState = (): void => {
        this.application.controllerButton.registerButtonPress()
        this.application.app.stage.removeChild(this.enemySelectArrow)
        this.enemySelectArrow.destroy()
    }

    registerButtonPress = (): void => {
        this.application.controllerButton.registerButtonPress()
        this.application.transitionState(new PlayerAttackingState(this.application))
    }

    update = (frameDelta: number, msDelta: number) => {
        const maxDistanceMovedDown = 30
        const movementDownPerUpdate = 1.5
        const movementUpPerUpdate = 1

        if (this.isMovingDown) {
            if (this.distanceMovedDown >= maxDistanceMovedDown) {
                this.isMovingDown = false
            } else {
                this.enemySelectArrow.y += movementDownPerUpdate
                this.distanceMovedDown += movementDownPerUpdate
            }
        } else {
            if (this.distanceMovedDown <= 0) {
                this.isMovingDown = true
            } else {
                this.enemySelectArrow.y -= movementUpPerUpdate
                this.distanceMovedDown -= movementUpPerUpdate
            }
        }
    }
    
}