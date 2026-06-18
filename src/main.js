import { Runtime } from "./interpreter/Runtime.js";
import { execute } from "./interpreter/Executor.js";

async function loadScript() {
    try {
        const res = await fetch("/script.mws");
        if (res.ok) return await res.text();
    } catch {
        // fallback
    }
    return fallbackScript;
}

const canvas = document.querySelector("canvas") || document.createElement("canvas");
if (!canvas.isConnected) {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.appendChild(canvas);
}

loadScript()
    .then((script) => {
        const lines = script.split("\n").map((line) => line.trimEnd());
        const runtime = new Runtime(lines);
        return execute(runtime);
    })
    .catch((error) => {
        console.error(error);
        alert(error.message);
    });