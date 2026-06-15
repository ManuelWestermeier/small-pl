export function parseLine(line) {
    const trimmed = line.trim();

    if (!trimmed) {
        return null;
    }

    const tokens = trimmed.match(/"[^"]*"|\S+/g) ?? [];

    return {
        command: tokens[0].toUpperCase(),
        args: tokens.slice(1).map(token =>
            token.startsWith('"') && token.endsWith('"')
                ? token.slice(1, -1)
                : token
        )
    };
}