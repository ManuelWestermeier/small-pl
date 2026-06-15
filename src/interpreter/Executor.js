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

        switch (command) {
            case "EXIT":
                return;

            case "POS":
                pc++;
                break;

            case "GOTO": {
                const target = runtime.labels.get(args[0]);

                if (target === undefined) {
                    throw new Error(`Unknown label: ${args[0]}`);
                }

                pc = target;
                break;
            }

            default: {
                const handler = commands[command];

                if (!handler) {
                    throw new Error(`Unknown command: ${command}`);
                }

                await handler(runtime, ...args);
                pc++;
                break;
            }
        }
    }
}