import { Runtime } from "./Runtime.js";

function toNumber(value) {
    const n = Number(value);
    if (Number.isNaN(n)) throw new Error(`Expected number, got: ${value}`);
    return n;
}

function hasVar(runtime, name) {
    return typeof runtime.hasVar === "function" ? runtime.hasVar(name) : true;
}

function resolve(runtime, token) {
    if (typeof token === "undefined") return undefined;
    if (token === null) return null;
    if (typeof token !== "string") return token;

    if (hasVar(runtime, token)) {
        try {
            return runtime.getVar(token);
        } catch {
            return token;
        }
    }

    return token;
}

function getGameObject(runtime, id) {
    const go = runtime.gameObjects?.[id];
    if (!go) throw new Error(`GameObject not found: ${id}`);
    return go;
}

function compare(left, operator, right) {
    switch (operator) {
        case "==": return left == right;
        case "===": return left === right;
        case "!=": return left != right;
        case "!==": return left !== right;
        case "<": return left < right;
        case "<=": return left <= right;
        case ">": return left > right;
        case ">=": return left >= right;
        default:
            throw new Error(`Unknown comparator: ${operator}`);
    }
}

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
                runtime.setVar(name, resolve(runtime, value[0]));
                break;

            case "BOOL": {
                const raw = value.join(" ").toLowerCase();
                runtime.setVar(name, raw === "true" || raw === "1" || raw === "yes");
                break;
            }

            case "JSON":
                runtime.setVar(name, JSON.parse(value.join(" ")));
                break;

            default:
                throw new Error(`Unknown SET type: ${type}`);
        }
    },

    async DEL(runtime, name) {
        runtime.deleteVar(name);
    },

    async COPY(runtime, outName, sourceName) {
        runtime.setVar(outName, resolve(runtime, sourceName));
    },

    async CREATE_GAMEOBJECT(runtime, id) {
        runtime.gameObjects[id] = {
            image: null,
            color: "",
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            r: 0,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            gravity: 0,
            speed: 0,
            jump: 0,
            solid: false,
            dynamic: false,
            onGround: false,
            visible: true,
            z: 0,
            _jumpLatched: false,
        };
    },

    async ACCES_GAMEOBJECT(runtime, id, key, value) {
        const go = getGameObject(runtime, id);
        go[key] = resolve(runtime, value);
    },

    async ACCESS_GAMEOBJECT(runtime, id, key, value) {
        return commands.ACCES_GAMEOBJECT(runtime, id, key, value);
    },

    async SET_GAMEOBJECT(runtime, id, key, type, ...value) {
        const go = getGameObject(runtime, id);

        switch (type) {
            case "NUM":
                go[key] = Number(value[0]);
                break;

            case "STR":
                go[key] = value.join(" ");
                break;

            case "VAR":
                go[key] = resolve(runtime, value[0]);
                break;

            case "BOOL": {
                const raw = value.join(" ").toLowerCase();
                go[key] = raw === "true" || raw === "1" || raw === "yes";
                break;
            }

            default:
                throw new Error(`Unknown SET_GAMEOBJECT type: ${type}`);
        }
    },

    async READ_GAMEOBJECT(runtime, name, id, key) {
        runtime.setVar(name, getGameObject(runtime, id)[key]);
    },

    async DEL_GAMEOBJECT(runtime, id) {
        delete runtime.gameObjects[id];
    },

    async MOVE_GAMEOBJECT(runtime, id, dx, dy) {
        const go = getGameObject(runtime, id);
        go.x += toNumber(resolve(runtime, dx));
        go.y += toNumber(resolve(runtime, dy));
    },

    async RESIZE_GAMEOBJECT(runtime, id, w, h) {
        const go = getGameObject(runtime, id);
        go.w = toNumber(resolve(runtime, w));
        go.h = toNumber(resolve(runtime, h));
    },

    async LOG(runtime, ...parts) {
        console.log(...parts.map((p) => resolve(runtime, p)));
    },

    async ALERT(runtime, ...parts) {
        if (typeof alert === "function") {
            alert(parts.map((p) => resolve(runtime, p)).join(" "));
        }
    },

    async MATH(runtime, outName, a, operator, b) {
        const left = resolve(runtime, a);
        const right = resolve(runtime, b);

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

            case "%":
                runtime.setVar(outName, left % right);
                break;

            case "**":
                runtime.setVar(outName, left ** right);
                break;

            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    },

    async ADD(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) + resolve(runtime, b));
    },

    async SUB(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) - resolve(runtime, b));
    },

    async MUL(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) * resolve(runtime, b));
    },

    async DIV(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) / resolve(runtime, b));
    },

    async MOD(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) % resolve(runtime, b));
    },

    async POW(runtime, outName, a, b) {
        runtime.setVar(outName, resolve(runtime, a) ** resolve(runtime, b));
    },

    async CMP(runtime, outName, a, operator, b) {
        runtime.setVar(outName, compare(resolve(runtime, a), operator, resolve(runtime, b)));
    },

    async IF(runtime, a, operator, b, label) {
        if (compare(resolve(runtime, a), operator, resolve(runtime, b))) {
            return { goto: label };
        }
    },

    async GOTO(runtime, label) {
        return { goto: label };
    },

    async LABEL() {
        return undefined;
    },

    async POS() {
        return undefined;
    },

    async INC(runtime, name, amount = "1") {
        runtime.setVar(name, toNumber(resolve(runtime, name)) + toNumber(resolve(runtime, amount)));
    },

    async DEC(runtime, name, amount = "1") {
        runtime.setVar(name, toNumber(resolve(runtime, name)) - toNumber(resolve(runtime, amount)));
    },

    async RAND(runtime, outName, min, max) {
        const a = toNumber(resolve(runtime, min));
        const b = toNumber(resolve(runtime, max));
        runtime.setVar(outName, Math.floor(Math.random() * (b - a + 1)) + a);
    },

    async CLAMP(runtime, outName, value, min, max) {
        const v = toNumber(resolve(runtime, value));
        const lo = toNumber(resolve(runtime, min));
        const hi = toNumber(resolve(runtime, max));
        runtime.setVar(outName, Math.min(hi, Math.max(lo, v)));
    },

    async CONCAT(runtime, outName, ...parts) {
        runtime.setVar(outName, parts.map((p) => String(resolve(runtime, p))).join(" "));
    },

    async KEY_DOWN(runtime, outName, key) {
        runtime.setVar(outName, runtime.isDown(key));
    },

    async KEY_PRESSED(runtime, outName, key) {
        runtime.setVar(outName, runtime.wasPressed(key));
    },

    async KEY_RELEASED(runtime, outName, key) {
        runtime.setVar(outName, runtime.wasReleased(key));
    },

    async MOUSE_DOWN(runtime, outName) {
        runtime.setVar(outName, runtime.mouseDown);
    },

    async MOUSE_PRESSED(runtime, outName) {
        runtime.setVar(outName, runtime.mousePressed);
    },

    async MOUSE_RELEASED(runtime, outName) {
        runtime.setVar(outName, runtime.mouseReleased);
    },

    async MOUSE_POS(runtime, xName, yName) {
        runtime.setVar(xName, runtime.mouseX);
        runtime.setVar(yName, runtime.mouseY);
    },

    async CONTROL_PLAYER(runtime, id, leftKey, rightKey, jumpKey) {
        const go = getGameObject(runtime, id);

        const left = runtime.isDown(leftKey);
        const right = runtime.isDown(rightKey);
        const jumpDown = runtime.isDown(jumpKey);

        const speed = Number(go.speed || 0);
        const jumpPower = Number(go.jump || 0);

        if (left && !right) {
            go.vx = -speed;
        } else if (right && !left) {
            go.vx = speed;
        } else {
            go.vx *= go.onGround ? 0.82 : 0.985;
            if (Math.abs(go.vx) < 0.01) go.vx = 0;
        }

        if (!jumpDown) {
            go._jumpLatched = false;
        }

        if (jumpDown && go.onGround && !go._jumpLatched) {
            go.vy = -jumpPower;
            go.onGround = false;
            go._jumpLatched = true;
        }
    },

    async PHYSICS_STEP(runtime) {
        const solids = Object.values(runtime.gameObjects).filter(
            (o) => o.visible !== false && o.solid
        );
        const dynamics = Object.values(runtime.gameObjects).filter(
            (o) => o.visible !== false && o.dynamic
        );

        for (const go of dynamics) {
            go.onGround = false;

            go.vx += Number(go.ax || 0);
            go.vy += Number(go.ay || 0) + Number(go.gravity || 0);

            let nextX = go.x + go.vx;
            let nextY = go.y + go.vy;

            const probeX = { ...go, x: nextX, y: go.y };
            for (const solid of solids) {
                if (solid === go) continue;
                if (
                    probeX.x < solid.x + solid.w &&
                    probeX.x + probeX.w > solid.x &&
                    probeX.y < solid.y + solid.h &&
                    probeX.y + probeX.h > solid.y
                ) {
                    if (go.vx > 0) nextX = solid.x - go.w;
                    else if (go.vx < 0) nextX = solid.x + solid.w;
                    go.vx = 0;
                    break;
                }
            }

            go.x = nextX;

            const probeY = { ...go, x: go.x, y: nextY };
            for (const solid of solids) {
                if (solid === go) continue;
                if (
                    probeY.x < solid.x + solid.w &&
                    probeY.x + probeY.w > solid.x &&
                    probeY.y < solid.y + solid.h &&
                    probeY.y + probeY.h > solid.y
                ) {
                    if (go.vy > 0) {
                        nextY = solid.y - go.h;
                        go.onGround = true;
                    } else if (go.vy < 0) {
                        nextY = solid.y + solid.h;
                    }
                    go.vy = 0;
                    break;
                }
            }

            go.y = nextY;
        }
    },

    async FOLLOW_CAMERA(runtime, id) {
        const go = getGameObject(runtime, id);
        runtime.camera.x = Math.max(0, go.x + go.w / 2 - runtime.canvas.clientWidth / 2);
        runtime.camera.y = 0;
    },

    async RANDOM_LEVEL(runtime, count = "18") {
        const n = Math.max(6, Number(resolve(runtime, count)) | 0);
        const groundY = runtime.canvas.clientHeight - 80;

        runtime.world.width = 2800 + n * 120;
        runtime.world.height = runtime.canvas.clientHeight;

        runtime.gameObjects.GROUND = {
            image: null,
            color: "#444",
            x: 0,
            y: groundY,
            w: runtime.world.width,
            h: 80,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            gravity: 0,
            speed: 0,
            jump: 0,
            solid: true,
            dynamic: false,
            onGround: false,
            visible: true,
            z: 0,
            _jumpLatched: false,
        };

        const start = {
            x: 40,
            y: groundY - 40,
            w: 220,
            h: 40,
        };

        runtime.gameObjects.START = {
            image: null,
            color: "#666",
            x: start.x,
            y: start.y,
            w: start.w,
            h: start.h,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            gravity: 0,
            speed: 0,
            jump: 0,
            solid: true,
            dynamic: false,
            onGround: false,
            visible: true,
            z: 0,
            _jumpLatched: false,
        };

        let x = start.x + start.w + 130;
        let lastY = groundY - 120;

        for (let i = 0; i < n; i++) {
            const w = 110 + ((Math.random() * 120) | 0);
            const gap = 90 + ((Math.random() * 90) | 0);
            const y = Math.max(180, Math.min(groundY - 60, lastY + (((Math.random() * 180) | 0) - 90)));

            runtime.gameObjects[`PLATFORM_${i}`] = {
                image: null,
                color: i % 5 === 0 ? "#7a7a7a" : "#888",
                x,
                y,
                w,
                h: 24,
                vx: 0,
                vy: 0,
                ax: 0,
                ay: 0,
                gravity: 0,
                speed: 0,
                jump: 0,
                solid: true,
                dynamic: false,
                onGround: false,
                visible: true,
                z: 0,
                _jumpLatched: false,
            };

            x += w + gap;
            lastY = y;
        }

        runtime.gameObjects.GOAL = {
            image: null,
            color: "#0f0",
            x: x + 120,
            y: groundY - 120,
            w: 26,
            h: 120,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            gravity: 0,
            speed: 0,
            jump: 0,
            solid: false,
            dynamic: false,
            onGround: false,
            visible: true,
            z: 1,
            _jumpLatched: false,
        };

        runtime.setVar("RESPAWN_X", start.x + 40);
        runtime.setVar("RESPAWN_Y", start.y - 28);
    },

    async CANVAS(runtime, bg = "#000") {
        runtime.resizeCanvas();

        if (bg) {
            runtime.ctx.fillStyle = bg;
            runtime.ctx.fillRect(0, 0, runtime.canvas.clientWidth, runtime.canvas.clientHeight);
        }
    },

    async CLEAR(runtime, bg = "#000") {
        runtime.ctx.setTransform(runtime._dpr, 0, 0, runtime._dpr, 0, 0);
        runtime.ctx.fillStyle = bg;
        runtime.ctx.fillRect(0, 0, runtime.canvas.clientWidth, runtime.canvas.clientHeight);
    },

    async DELAY(runtime, ms) {
        await new Promise((resolveFn) => {
            setTimeout(resolveFn, Number(resolve(runtime, ms)));
        });
        runtime.clearFrameInput();
    },

    async WAIT(runtime, ms) {
        return commands.DELAY(runtime, ms);
    },

    async DRAW(runtime, id) {
        const go = runtime.gameObjects[id];
        if (!go || go.visible === false) return;

        const x = Number(go.x) - runtime.camera.x;
        const y = Number(go.y) - runtime.camera.y;
        const w = Number(go.w) || 0;
        const h = Number(go.h) || 0;

        if (go.image) {
            const img = typeof go.image === "string" ? runtime.getVar(go.image) : go.image;
            if (img && img.width) {
                runtime.ctx.drawImage(img, x, y, w, h);
                return;
            }
        }

        if (go.color) {
            runtime.ctx.fillStyle = go.color;
            runtime.ctx.fillRect(x, y, w, h);
        }
    },

    async DRAW_ALL(runtime) {
        for (const gameObjectId in runtime.gameObjects) {
            await commands.DRAW(runtime, gameObjectId);
        }
    },
};