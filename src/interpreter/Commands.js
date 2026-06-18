import { Runtime } from "./Runtime.js";

export const commands = {
    async SET(runtime, name, type, ...value) {
        switch (type) {
            case "NUM":
                runtime.setVar(name, Number(value[0]));
                break;

            case "STR":
                runtime.setVar(name, value.join(" "));
                break;

            case "VAR":
                runtime.setVar(name, runtime.getVar(value[0]));
                break;

            default:
                throw new Error(`Unknown SET type: ${type}`);
        }
    },

    async DEL(runtime, name) {
        runtime.deleteVar(name);
    },

    async CREATE_GAMEOBJECT(runtime, id) {
        runtime.gameObjects[id] = { image: "", color: "", x: 0, y: 0, w: 0, h: 0, r: 0 };
    },

    async ACCES_GAMEOBJECT(runtime, id, key, value) {
        runtime.gameObjects[id][key] = runtime.getVar(value);
    },

    async READ_GAMEOBJECT(runtime, name, id, key) {
        runtime.setVar(name, gameObjects[id][key]);
    },

    async DEL_GAMEOBJECT(runtime, id) {
        delete runtime.gameObjects[id];
    },

    async LOG(runtime, name) {
        console.log(runtime.getVar(name));
    },

    async ALERT(runtime, name) {
        alert(runtime.getVar(name));
    },

    async MATH(runtime, outName, a, operator, b) {
        const left = runtime.getVar(a);
        const right = runtime.getVar(b);

        switch (operator) {
            case "+":
                runtime.setVar(outName, left + right);
                break;

            case "-":
                runtime.setVar(outName, left - right);
                break;

            case "*":
                runtime.setVar(outName, left * right);
                break;

            case "/":
                runtime.setVar(outName, left / right);
                break;

            case "**":
                runtime.setVar(outName, left ** right);
                break;

            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    },

    async CANVAS(runtime = new Runtime(), bg) {
        runtime.canvas.width = innerWidth;
        runtime.canvas.height = innerHeight;
        if (!bg) return;
        runtime.ctx.fillStyle = bg;
        runtime.ctx.fillRect(0, 0, runtime.canvas.width, runtime.canvas.height);
    },

    async DELAY(runtime, ms) {
        await new Promise(resolve => {
            setTimeout(resolve, Number(ms));
        });
    },

    async DRAW(runtime = new Runtime(), id) {
        const go = runtime.gameObjects[id];
        if (!go) return;

        //  { image: "", color: "", x: 0, y: 0, w: 0, h: 0, r: 0 };

        console.log(go);
        
        if (go.image) {
            runtime.ctx.drawImage(go.image, go.x, go.y, go.w, go.h);
        }
        else if (go.color) {
            runtime.ctx.fillStyle = go.color;
            runtime.ctx.fillRect(go.x, go.y, go.w, go.h);
        }
    },

    async DRAW_ALL(runtime = new Runtime()) {
        for (const gameObjectId in runtime.gameObjects) {
            commands.DRAW(runtime, gameObjectId);
        }
    }
};