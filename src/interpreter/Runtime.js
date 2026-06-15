export class Runtime {
    constructor(lines) {
        this.lines = lines;
        this.vars = {};
        this.labels = new Map();

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line.startsWith("POS ")) {
                continue;
            }

            const [, label] = line.split(/\s+/);

            if (label) {
                this.labels.set(label, i);
            }
        }
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
}