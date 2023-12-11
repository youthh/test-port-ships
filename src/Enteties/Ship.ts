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
  private movements = movements;
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


  create(x: number, y: number) {    
    this.graphics = new PIXI.Graphics();
    this.isLoaded && this.ShipType === "red"
      ? this.graphics.beginFill(this.ShipType) 
      : this.isLoaded ? this.graphics.beginFill(this.ShipType)  : this.graphics.lineStyle(4, this.ShipType); 
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


  moveToEnterence(xEnter: number, yEnter: number, dock: Dock | undefined) {
    new TWEEN.Tween(this.graphics.position)
    .onStart(() => {
        dock?.dockShip(this)
        dock?.setBusy(true);
    })
    .to({ x: xEnter, y: yEnter}, SPEED)
    .onComplete(() => {
      if(this.ShipType === "green") {
        const fulledDock = port.getFulledDock();
        if(dock) {
          this.moveToDock(dock)
        }
        else {
          queue.enqueueGreen(this)
          queue.moveToGreenQueue(this)
        }
      }
      else{
        const availableDock = port.getAvailableDock();
        if(dock) {
          this.moveToDock(dock)
        }
        else{
          queue.enqueueRed(this)
          queue.moveToRedQueue(this)
        }
      }
    
    })
    .easing(TWEEN.Easing.Quadratic.InOut as any)
    .start();

  }

  moveToDock(dock: Dock): void {
    const destination = dock.getPosition();
    
    this.shipAnimation
      .onStart(() => {
        dock.dockShip(this);
        dock.setBusy(true);
        
      })
      .onUpdate((cord: any) => {
        this.movements.
        checkForTooCloseToEntrance(
          this.graphics.position.x, 
          this.graphics.position.y, 
          this.checkCollision(port),
            this
          )
     

      })
      .onComplete(() => {     
        setTimeout(() => {          
          dock.setIsDock()
          this.isLoaded = !this.isLoaded;
          this.ShipType === "green" && dock.undockShip()
          dock.setBusy(false);
          this.color.updateColor(dock)
          this.color.updateColor(this)
          this.moveToSea();
        }, 5000);
      })
      .to({ x: destination.x + 30, y: destination.y - 90 }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }

  moveToSea(): void {
    this.shipAnimation =  new TWEEN.Tween(this.graphics.position);
    this.shipAnimation
      .onStart(() => {})
      .onUpdate(() => {

        this.movements.checkForTooCloseToEntrance(
          this.graphics.position.x, 
          this.graphics.position.y, 
          this.checkCollision(port),
          this
        );
       
      })
      .onComplete(() => {
        movements.removeShip(this)
        this.graphics.clear();
        
      }) 
      .to({ x: 300, y: -50 }, SPEED)
      .easing(TWEEN.Easing.Quadratic.InOut as any)
      .start();
  }

  isCloseToEntrance(): boolean {
    return   this.graphics.y  < 280 || this.graphics.y > 400;
  }


  getShipType(): string {
    return this.ShipType
  }
}

export { Ship };
