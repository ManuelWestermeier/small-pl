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

    async DELAY(runtime, ms) {
        await new Promise(resolve => {
            setTimeout(resolve, Number(ms));
        });
    }
};