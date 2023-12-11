// Ship.ts
import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js'
import { Dock } from "./Dock";
import { app, movements, port, queue } from "../index";
import { SPEED } from "../utils/constant"
import { TypeOfShip } from "../utils/types"
// enteties
import { Color } from "../Enteties"


class Ship {
  private graphics: PIXI.Graphics;
  private color: Color = new Color();
  private ShipType: TypeOfShip = this.color.getRandomColor()
  private isLoaded: boolean = this.ShipType === "red";
  private shipAnimation: any


  constructor() {
    this.create(350, 10)
    this.shipAnimation = new TWEEN.Tween(this.graphics.position)
  }

  getGraphics(): PIXI.Graphics {
    return this.graphics;
  }

  getAnimation(): any {
    return this.shipAnimation
  }

  setAnimation(animation: any) {
    this.shipAnimation = animation
  }

  getIsLoaded(): boolean {
    return this.isLoaded
  }

  setIsLoaded() {
    this.isLoaded = !this.isLoaded
  }

  create(x: number, y: number) {
    this.graphics = new PIXI.Graphics();
    this.isLoaded && this.ShipType === "red"
      ? this.graphics.beginFill(this.ShipType)
      : this.isLoaded ? this.graphics.beginFill(this.ShipType) : this.graphics.lineStyle(4, this.ShipType);
    this.graphics.drawRect(0, 0, 30, 70);
    this.graphics.position.set(x, y);
    app.stage.addChild(this.graphics)
  }

  checkCollision(port: any): boolean {

    const boundsA = this.graphics.getBounds();
    const boundsB = port.getEntreace().getBounds();
    return boundsA.x < boundsB.x + boundsB.width &&
      boundsA.x + boundsA.width > boundsB.x &&
      boundsA.y < boundsB.y + boundsB.height &&
      boundsA.y + boundsA.height > boundsB.y;
  }

  getShipType(): string {
    return this.ShipType
  }
}

export { Ship };
