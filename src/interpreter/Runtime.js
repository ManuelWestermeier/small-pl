export class Runtime {
    constructor(lines) {
        this.lines = lines;
        this.vars = Object.create(null);
        this.labels = new Map();
        this.gameObjects = Object.create(null);

        this.canvas = document.querySelector("canvas") ?? document.createElement("canvas");
        if (!this.canvas.isConnected) document.body.appendChild(this.canvas);

        this.canvas.tabIndex = 0;
        this.canvas.style.position = "fixed";
        this.canvas.style.left = "0";
        this.canvas.style.top = "0";
        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.display = "block";
        this.canvas.style.outline = "none";
        this.canvas.style.touchAction = "none";

        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) throw new Error("2D context unavailable");

        this.camera = { x: 0, y: 0 };
        this.world = { width: 0, height: 0 };

        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();

        this.mouseDown = false;
        this.mousePressed = false;
        this.mouseReleased = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButton = 0;

        this.halted = false;
        this._dpr = 1;

        this._buildLabelMap();
        this._installInput();
        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas(), { passive: true });
        window.visualViewport?.addEventListener("resize", () => this.resizeCanvas(), { passive: true });
    }

    _buildLabelMap() {
        for (let i = 0; i < this.lines.length; i++) {
            const line = String(this.lines[i] ?? "").trim();
            if (!line) continue;

            const tokens = line.match(/"[^"]*"|\S+/g) ?? [];
            const cmd = tokens[0]?.toUpperCase();
            const label = tokens[1];

            if ((cmd === "LABEL" || cmd === "POS") && label) {
                this.labels.set(label, i);
            }
        }
    }

    _normalizeKey(key) {
        if (key === " ") return "Space";
        return key;
    }

    _eventToCanvasPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    _installInput() {
        window.addEventListener("keydown", (e) => {
            const key = this._normalizeKey(e.code || e.key);
            if (!this.keysDown.has(key)) this.keysPressed.add(key);
            this.keysDown.add(key);

            if (key === "Space" || key.startsWith("Arrow")) {
                e.preventDefault();
            }
        }, { passive: false });

        window.addEventListener("keyup", (e) => {
            const key = this._normalizeKey(e.code || e.key);
            this.keysDown.delete(key);
            this.keysReleased.add(key);

            if (key === "Space" || key.startsWith("Arrow")) {
                e.preventDefault();
            }
        }, { passive: false });

        const updateMouse = (e) => {
            const p = this._eventToCanvasPos(e);
            this.mouseX = p.x;
            this.mouseY = p.y;
        };

        this.canvas.addEventListener("pointermove", (e) => {
            updateMouse(e);
        }, { passive: true });

        this.canvas.addEventListener("pointerdown", (e) => {
            this.canvas.focus({ preventScroll: true });
            updateMouse(e);

            this.mouseDown = true;
            this.mousePressed = true;
            this.mouseButton = e.button;

            if (this.canvas.setPointerCapture) {
                try {
                    this.canvas.setPointerCapture(e.pointerId);
                } catch {
                    // ignore
                }
            }

            e.preventDefault();
        }, { passive: false });

        window.addEventListener("pointerup", (e) => {
            updateMouse(e);

            this.mouseDown = false;
            this.mouseReleased = true;
            this.mouseButton = e.button;

            e.preventDefault();
        }, { passive: false });

        window.addEventListener("pointercancel", () => {
            this.mouseDown = false;
            this.mouseReleased = true;
        }, { passive: true });

        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    resizeCanvas() {
        const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        const cssWidth = Math.max(1, window.innerWidth || 800);
        const cssHeight = Math.max(1, window.innerHeight || 600);

        this._dpr = dpr;
        this.canvas.width = Math.floor(cssWidth * dpr);
        this.canvas.height = Math.floor(cssHeight * dpr);

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.world.width = cssWidth;
        this.world.height = cssHeight;
    }

    getVar(name) {
        return this.vars[name];
    }

    setVar(name, value) {
        this.vars[name] = value;
    }

    deleteVar(name) {
        delete this.vars[name];
    }

    hasVar(name) {
        return Object.prototype.hasOwnProperty.call(this.vars, name);
    }

    isDown(key) {
        return this.keysDown.has(this._normalizeKey(key));
    }

    wasPressed(key) {
        return this.keysPressed.has(this._normalizeKey(key));
    }

    wasReleased(key) {
        return this.keysReleased.has(this._normalizeKey(key));
    }

    clearFrameInput() {
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mousePressed = false;
        this.mouseReleased = false;
    }
}