import { Dock } from "./Dock";
import {app} from "../index"
import * as PIXI from "pixi.js";

class Port {
  private docks: Dock[] = [];
  private portBorders: PIXI.Graphics;
  private lineEnter: PIXI.Graphics;
  private entreace: PIXI.Graphics;

  constructor(numDocks: number, dockWidth: number, dockHeight: number, spaceBetween: number) {
    
    // Create port borders
    this.portBorders = new PIXI.Graphics();
    this.portBorders.lineStyle(2, "yellow"); 
    this.portBorders.drawRect(0, 0, 800, 300);

        // Create entrance
     this.entreace = new PIXI.Graphics();
 
     this.entreace.moveTo(300, 0);
     this.entreace.lineTo(400, 300);
     this.entreace.lineTo(500, 0);
 
     // Position the entrance
     this.entreace.position.set(0, 0);

     // Create entrance
     this.lineEnter = new PIXI.Graphics();
     this.lineEnter.lineStyle(10, "0x87CEEB"); // Ширина границі входу 5, чорний колір
    //0x87CEEB
     // Draw two separate lines to create an entrance
     this.lineEnter.moveTo(150,400);
     this.lineEnter.lineTo(580, 400);
    
      console.log(this.lineEnter);
      
     // Position the entrance
     this.lineEnter.position.set(0, 0);

    // Position the port borders
    this.portBorders.position.set(0, 400);
    app.stage.addChild(this.portBorders, this.lineEnter, this.entreace);



    for (let i = 0; i < numDocks; i++) {
      const xPosition = 100 + i * (dockWidth + spaceBetween);
      const dock = new Dock(xPosition, 600, dockWidth, dockHeight);
      this.docks.push(dock);
      
      app.stage.addChild(dock.getGraphics());
    }
  }

  getAvailableDock(): Dock | undefined {
    return this.docks.find((dock) => {
      return  !dock.isOccupied()
    });
  }

  getEntreace(): PIXI.Graphics {
    return this.lineEnter
  }

  getFulledDock(): Dock | undefined {
    
    return this.docks.find((dock) => {      
      return dock.isFree() 
    });
  }


  // Other methods and logic for the port
}

export { Port };