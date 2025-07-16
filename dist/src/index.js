"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const transform = (input, rules) => {
    const findLargestPattern = (text, rules) => {
        let largestMatch = null;
        for (const rule of rules) {
            const match = text.match(rule.pattern);
            if (match && match[rule.matchGroup || 0] && (!largestMatch || match[rule.matchGroup || 0].length > largestMatch.match.length)) {
                largestMatch = { fullMatch: match[0], match: match[rule.matchGroup || 0], rule };
            }
        }
        return largestMatch;
    };
    const processText = (text) => {
        const rootNode = { type: 'root', values: [] };
        while (text.length > 0) {
            const largestPattern = findLargestPattern(text, rules);
            if (!largestPattern) {
                rootNode.values.push(text);
                break;
            }
            const { fullMatch, match, rule } = largestPattern;
            const matchIndex = text.indexOf(fullMatch);
            // Fragment przed znalezionym wzorcem
            if (matchIndex > 0) {
                rootNode.values.push(text.substring(0, matchIndex));
            }
            // Dodanie znalezionego wzorca
            const node = {
                type: 'pattern',
                oryginal: match,
                values: [],
            };
            rootNode.values.push(node);
            // Usunięcie fragmentu przed i wzorca z tekstu
            text = text.substring(matchIndex + fullMatch.length);
        }
        return rootNode;
    };
    return processText(input);
};
exports.transform = transform;
//# sourceMappingURL=index.js.map