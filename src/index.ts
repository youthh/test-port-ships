import * as PIXI from "pixi.js";
// enteties
import { Movements, Port, Ship, ShipQueue } from "./Enteties";
import * as TWEEN from "@tweenjs/tween.js";

export const app = new PIXI.Application<HTMLCanvasElement>({
  width: 800,
  height: 700,
  backgroundColor: 0x87CEEB,
});
document.body.appendChild(app.view);

export const port = new Port(4, 100, 100, 50);

export const movements = new Movements();

export const queue = new ShipQueue();

function createShipAndMoveToPort() {
  const ship = new Ship();

  app.stage.addChild(ship.getGraphics());

  movements.addShip(ship);

  if (ship.getShipType() === "green") {
    const fulledDock = port.getFulledDock();

    if (fulledDock && !queue.getGreenShips().length) {
      movements.moveToEnterence(300, 270, fulledDock, ship)
    }
    else {
      queue.enqueueGreen(ship)
      queue.moveToGreenQueue(ship)
    }

  } else {
    const availableDock = port.getAvailableDock();

    if (queue.getRedShips().length || !availableDock) {
      queue.enqueueRed(ship)
      queue.moveToRedQueue(ship)
    }
    else {
      movements.moveToEnterence(370, 270, availableDock, ship)
    }
  }
}

// Create ships every 8 seconds
setInterval(() => {
  createShipAndMoveToPort();
}, 8000);

setInterval(() => {
  const fulledDock = port.getFulledDock();
  if (fulledDock && queue.getGreenShips().length) {
    const currentShip = queue.dequeueGreen();
    movements?.moveToEnterence(280, 300, fulledDock, currentShip)
    queue.getGreenShips().length && queue.moveQueue(queue.getGreenShips())
  }

  const availableDock = port.getAvailableDock();

  if (availableDock && queue.getRedShips().length) {
    const currentShip = queue.dequeueRed();
    movements?.moveToEnterence(370, 300, availableDock, currentShip)
    queue.getRedShips().length && queue.moveQueue(queue.getRedShips())
  }
}, 2000);


// Initial ship creation
createShipAndMoveToPort();


app.ticker.add(() => {
  TWEEN.update();
});

