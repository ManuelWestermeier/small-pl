import { parseLine } from "./Parser.js";
import { commands } from "./Commands.js";

export async function execute(runtime) {
    let pc = 0;

    while (pc >= 0 && pc < runtime.lines.length) {
        const parsed = parseLine(runtime.lines[pc]);

        if (!parsed) {
            pc++;
            continue;
        }

        const { command, args } = parsed;

        if (command === "EXIT" || command === "HALT") {
            return;
        }

        if (command === "LABEL" || command === "POS") {
            pc++;
            continue;
        }

        const handler = commands[command];

        if (!handler) {
            throw new Error(`Unknown command: ${command}`);
        }

        const result = await handler(runtime, ...args);

        if (result && typeof result.goto === "string") {
            const target = runtime.labels.get(result.goto);

            if (target === undefined) {
                throw new Error(`Unknown label: ${result.goto}`);
            }

            pc = target;
            continue;
        }

        if (command === "GOTO") {
            const target = runtime.labels.get(args[0]);

            if (target === undefined) {
                throw new Error(`Unknown label: ${args[0]}`);
            }

            pc = target;
            continue;
        }

        pc++;
    }
}