import { Runtime } from "./interpreter/Runtime.js";
import { execute } from "./interpreter/Executor.js";

const script = `
SET X NUM 2

POS LOOP

ALERT X
DELAY 1000

MATH X X * X

LOG X

GOTO LOOP
`;

const runtime = new Runtime(
    script
        .split("\n")
        .map(line => line.trim())
);

execute(runtime).catch(error => {
    console.error(error);
    alert(error.message);
});