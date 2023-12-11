import { Ship } from "./Ship";
import * as TWEEN from '@tweenjs/tween.js'
import { movements, port, queue } from "../index"
import { SPEED } from "../utils/constant";
import { Dock } from "./Dock";
import { Color } from "./Color";

class Movements {
  public ships: Ship[] = [];

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }

  removeShip(shipRemoved: Ship) {
    this.ships = this.ships.filter((ship) => ship !== shipRemoved);
  }

  checkForTooCloseToEntrance(x: number, y: number, isCollision: boolean, ship: Ship): void {
    if (isCollision) {
      this.pauseOtherShips();
    } else {
      this.resumeOtherShips();
    }
  }

  private pauseOtherShips(): void {
    for (const ship of this.ships) {
      if (!ship.checkCollision(port) &&
        ((ship.getGraphics().getBounds().bottom > 340 && ship.getGraphics().getBounds().bottom < 395) ||
          ship.getGraphics().getBounds().top > 395 && ship.getGraphics().getBounds().top < 430)) {
        ship.getAnimation().pause();
      }
    }
  }

  private resumeOtherShips(): void {
    for (const ship of this.ships) {
      ship.getAnimation().resume();

    }
  }


  moveToDock(dock: Dock, ship: Ship): void {
    const destination = dock.getPosition();

    ship.getAnimation()
      .onStart(() => {
        dock.dockShip(ship);
        dock.setBusy(true);

      })
      .onUpdate((cord: any) => {
        this.
          checkForTooCloseToEntrance(
            ship.getGraphics().position.x,
            ship.getGraphics().position.y,
            ship.checkCollision(port),
            ship
          )
      })
      .onComplete(() => {
        setTimeout(() => {
          dock.setIsDock()
          ship.setIsLoaded()
          ship.getShipType() === "green" && dock.undockShip()
          dock.setBusy(false);
          new Color().updateColor(dock)
          new Color().updateColor(ship)
          this.moveToSea(ship);
        }, 5000);
      })
      .to({ x: destination.x + 30, y: destination.y - 90 }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }


  moveToSea(ship: Ship): void {
    ship.setAnimation(new TWEEN.Tween(ship.getGraphics().position));
    ship.getAnimation()
      .onUpdate(() => {
        this.checkForTooCloseToEntrance(
          ship.getGraphics().position.x,
          ship.getGraphics().position.y,
          ship.checkCollision(port),
          ship
        );
      })
      .onComplete(() => {
        movements.removeShip(ship)
        ship.getGraphics().clear();

      })
      .to({ x: 300, y: -50 }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }


  moveToEnterence(xEnter: number, yEnter: number, dock: Dock | undefined, ship: Ship) {
    new TWEEN.Tween(ship.getGraphics().position)
      .onStart(() => {
        dock?.dockShip(ship)
        dock?.setBusy(true);
      })
      .to({ x: xEnter, y: yEnter }, SPEED)
      .onComplete(() => {
        if (ship.getShipType() === "green") {
          if (dock) {
            this.moveToDock(dock, ship)
          }
          else {
            queue.enqueueGreen(ship)
            queue.moveToGreenQueue(ship)
          }
        }
        else {
          if (dock) {
            this.moveToDock(dock, ship)
          }
          else {
            queue.enqueueRed(ship)
            queue.moveToRedQueue(ship)
          }
        }

      })
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();

  }
}

export { Movements };
