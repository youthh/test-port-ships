import { Ship } from "./Ship";
import * as TWEEN from '@tweenjs/tween.js'
import { movements, port } from "../index"

class Movements {
  public ships: Ship[] = [];
  private isAllowMovement: boolean = true;

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }

  removeShip(shipRemoved: Ship) {
    this.ships = this.ships.filter((ship) => ship !== shipRemoved);
  }

  checkForTooCloseToEntrance(x: number, y: number, isCollision: boolean, ship: Ship): void {
    const entranceY = 395;
    const collisionThreshold = 10;

    if (isCollision) {
      this.pauseOtherShips();
    } else {
      this.resumeOtherShips();
    }
  }

  setIsAllowMovement(value: boolean): void {
    this.isAllowMovement = value;
    if (value) {
      this.resumeOtherShips();
    }
  }

  checkCollision(port: any, ship: Ship): boolean {
    const boundsA = ship.getGraphics().getBounds();
        
    const boundsB = port.getEntreace().getBounds();
    return boundsA.x < boundsB.x + boundsB.width &&
      boundsA.x + boundsA.width > boundsB.x &&
      boundsA.y < boundsB.y + boundsB.height &&
      boundsA.y + boundsA.height > boundsB.y;
  }

  getIsAllowMovement(): boolean {
    return this.isAllowMovement;
  }

  private pauseOtherShips(): void {
    for (const ship of this.ships) {                
      if (!this.checkCollision(port, ship) && 
        ((ship.getGraphics().getBounds().bottom > 340 && ship.getGraphics().getBounds().bottom < 395 ) ||
         ship.getGraphics().getBounds().top > 395 && ship.getGraphics().getBounds().top < 430 ) )  {
        ship.getAnimation().pause();
      }
    }
  }

  private resumeOtherShips(): void {
    for (const ship of this.ships) {
      ship.getAnimation().resume();

    }
  }
}

export { Movements };
