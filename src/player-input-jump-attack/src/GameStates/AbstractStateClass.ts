import { Application } from "../Application"

export abstract class AbstractStateClass {
    application: Application
    
    constructor(application: Application) {
        this.application = application
    }

    abstract enterState(): void

    abstract exitState(): void

    update = (frameDelta: number, msDelta: number) => {}
}