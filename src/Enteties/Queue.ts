// ShipQueue.ts
import { Ship } from "./Ship";
import { Dock } from "./Dock";
import { movements } from "../index";
import * as TWEEN from '@tweenjs/tween.js'
import { SPACE_BETWEEN_SHIPS_IN_QUEUE, SPEED} from "../utils/constant"

class ShipQueue {
  private greenQueue: Ship[] = [];
  private redQueue: Ship[] = [];
  private movements = movements;
  

  enqueueRed(ship: Ship): void {
    this.redQueue.push(ship);
  }
  
  enqueueGreen(ship: Ship): void {
    this.greenQueue.push(ship);
  }

  dequeueRed(): Ship | undefined {
    return this.redQueue.shift();
  }

  dequeueGreen(): Ship | undefined {    
    return this.greenQueue.shift();
  }

  moveQueue(ships: Ship[]) {
    const destX = ships[0].getShipType() === "green" ? 150 : 580;
    ships.forEach((currentShip, index) => {
      const destinationY = 390 - SPACE_BETWEEN_SHIPS_IN_QUEUE * (index + 1);
      const anim = new TWEEN.Tween(currentShip.getGraphics().position);
      anim
        .onUpdate((cords) => {
          currentShip.getGraphics().x = cords._x;
          currentShip.getGraphics().y = cords._y;
        })
        .to({ x: destX, y: destinationY }, SPEED)
        .easing(TWEEN.Easing.Quadratic.Out as any)
        .start();
    });

  }
  
  moveToRedQueue(ship: Ship): void {
    let shipY = 390 - SPACE_BETWEEN_SHIPS_IN_QUEUE * this.redQueue.length;
    const redShip = this.redQueue.at(-1);

    new TWEEN.Tween(redShip.getGraphics().position)
      .to({ x: 580, y: shipY }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }

  moveToGreenQueue(ship: Ship): void {
    let shipY = 390 - SPACE_BETWEEN_SHIPS_IN_QUEUE * this.greenQueue.length;
    const greenShip = this.greenQueue.at(-1);
   
    new TWEEN.Tween(greenShip.getGraphics().position)
      .to({ x: 150, y: shipY }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }

  getRedShips(): Ship[]  {
    return this.redQueue
  }

  getGreenShips(): Ship[]  {
    return this.greenQueue
  }
}

export { ShipQueue };
