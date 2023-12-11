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
  movements.addShip(ship)


  if (ship.getShipType() === "green") {
    const fulledDock = port.getFulledDock();

    if (fulledDock && !queue.getGreenShips().length) {
      ship.moveToEnterence(300, 270, fulledDock)
    } 
    else {
      queue.enqueueGreen(ship)
      queue.moveToGreenQueue(ship)
    }
   
  } else {
    const availableDock = port.getAvailableDock();


    if(queue.getRedShips().length || !availableDock) {
      queue.enqueueRed(ship)
      queue.moveToRedQueue(ship)
    } 
    else {
      ship.moveToEnterence(370, 270, availableDock)
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
    currentShip?.moveToEnterence(280, 300, fulledDock)
    queue.getGreenShips().length && queue.moveQueue(queue.getGreenShips())
  }   

  const availableDock = port.getAvailableDock();

  if (availableDock && queue.getRedShips().length) {
    
    const currentShip = queue.dequeueRed();
    currentShip?.moveToEnterence(370, 300, availableDock)
    queue.getRedShips().length && queue.moveQueue(queue.getRedShips())
  }
}, 2000);


// Initial ship creation
createShipAndMoveToPort();


app.ticker.add(() => {
  TWEEN.update();
});