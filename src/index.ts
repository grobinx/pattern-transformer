export type TransformationRule = {
    pattern: RegExp,
    group?: number,
    //transform: (match: (string | TreeNode)[]) => string;
};

type TreeNode = {
    type: string;
    oryginal?: string;
    values: (string | TreeNode)[];
    //transformed?: string;
    //transform?: (match: (string | TreeNode)[]) => string;
};

export const transformTree = (
    input: string,
    rules: TransformationRule[],
): TreeNode => {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string.');
    }

    if (!Array.isArray(rules) || rules.some(rule => !(rule.pattern instanceof RegExp))) {
        throw new Error('Rules must be an array of valid TransformationRule objects.');
    }

    const findLargestPattern = (text: string, rules: TransformationRule[]): { fullMatch: string, match: string, rule: TransformationRule } | null => {
        let largestMatch: { fullMatch: string, match: string, rule: TransformationRule } | null = null;

        for (const rule of rules) {
            const match = text.match(rule.pattern);
            if (match && match[rule.group || 0] && (!largestMatch || match[rule.group || 0].length > largestMatch.match.length)) {
                largestMatch = { fullMatch: match[0], match: match[rule.group || 0], rule };
            }
        }

        return largestMatch;
    };

    const processText = (text: string, parentNode: TreeNode): TreeNode => {
        // Jeśli tekst jest pusty, zwróć parentNode
        if (text.length === 0) {
            return parentNode;
        }

        while (text.length > 0) {
            const largestPattern = findLargestPattern(text, rules);

            if (!largestPattern) {
                parentNode.values.push(text);
                break;
            }

            const { fullMatch, match, rule } = largestPattern;
            if (!largestPattern.fullMatch || !largestPattern.match) {
                throw new Error('Invalid pattern match returned.');
            }

            const matchIndex = text.indexOf(fullMatch);

            // Fragment przed znalezionym wzorcem
            if (matchIndex > 0) {
                parentNode.values.push(text.substring(0, matchIndex));
            }

            // Dodanie znalezionego wzorca
            const node: TreeNode = {
                type: 'pattern',
                oryginal: match,
                values: [],
            };

            // Sprawdzenie, czy wzorzec może być dalej dzielony
            if (match !== fullMatch) {
                parentNode.values.push(processText(match, node));
            } else {
                node.values.push(match); // Dodanie wzorca jako wartości, jeśli nie można go dalej dzielić
                parentNode.values.push(node);
            }

            // Usunięcie fragmentu przed i wzorca z tekstu
            text = text.substring(matchIndex + fullMatch.length);
        }

        return parentNode;
    };

    const rootNode: TreeNode = { type: 'root', oryginal: input, values: [] };

    return processText(input, rootNode);
};

export const transform = (
    input: string,
    rules: TransformationRule[],
): TreeNode => {
    return transformTree(input, rules);
}