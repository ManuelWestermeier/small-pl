export function parseLine(line) {
    const trimmed = String(line ?? "").trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
        return null;
    }

    const tokens = trimmed.match(/"[^"]*"|\S+/g) ?? [];

    if (tokens.length === 0) {
        return null;
    }

    return {
        command: tokens[0].toUpperCase(),
        args: tokens.slice(1).map((token) =>
            token.startsWith('"') && token.endsWith('"')
                ? token.slice(1, -1)
                : token
        ),
    };
}