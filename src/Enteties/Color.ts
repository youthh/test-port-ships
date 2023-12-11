import { TypeOfShip } from "../utils/types"
import { Dock } from "./Dock";
import { Ship } from "./Ship";


export class Color  {

    getRandomColor(): TypeOfShip {
        const colors: TypeOfShip[] = ["red", "green"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }


    updateColor(obj: Ship | Dock): void {
        const { x, y } = {x: obj.getGraphics().position.x, y: obj.getGraphics().position.y}
        obj.getGraphics().clear()
        obj.create(x, y)
    }
}