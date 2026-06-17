import { Runtime } from "./interpreter/Runtime.js";
import { execute } from "./interpreter/Executor.js";

fetch("/script.mws").then(res => res.text()).then(script => {
    const runtime = new Runtime(
        script
            .split("\n")
            .map(line => line.trim())
    );

    execute(runtime).catch(error => {
        console.error(error);
        alert(error.message);
    });
})

