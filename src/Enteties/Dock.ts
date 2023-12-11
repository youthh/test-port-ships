// Dock.ts
import * as PIXI from "pixi.js";
import { Ship } from "./Ship";
import { app } from "..";
class Dock {
  private occupied: boolean = false;
  private ship: Ship | null = null;
  private graphics: PIXI.Graphics;
  private isBusy: boolean = false

  constructor(x: number, y: number, width: number, height: number) {
    this.create(x, y)
  }

  isOccupied(): boolean {
    return Boolean(this.ship) || this.occupied;
  }

  dockShip(ship: Ship): void {
    this.ship = ship
    this.occupied = true;
  }

  setIsDock() {
    this.ship = null;
  }

  isFree(): boolean {
    return this.occupied && !this.isBusy;
  }

  setBusy(value: boolean) {
    this.isBusy = value
  }

  create(x: number, y: number) {
    this.graphics = new PIXI.Graphics();
    this.occupied ? this.graphics.beginFill(0xFFFF00)
      : this.graphics.lineStyle(5, 0xFFFF00);
    this.graphics.drawRect(0, 0, 100, 95);
    this.graphics.position.set(x, y);
    app.stage.addChild(this.graphics)
  }

  undockShip(): void {
    this.ship = null;
    this.occupied = false;
  }

  getGraphics(): PIXI.Graphics {
    return this.graphics;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.graphics.x, y: this.graphics.y };
  }
}

export { Dock };
