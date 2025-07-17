/**
 * Pattern Transformer Module
 * This module provides functionality to transform input strings based on defined transformation rules.
 * It supports complex transformations using regular expressions and custom transformation functions.
 * @module transform
 */

/**
 * TransformationRule interface
 * Represents a rule for transforming input strings.
 */
export type TransformationRule<T = string> = {
    /**
     * Regular expression pattern to match against the input string.
     */
    pattern: RegExp,
    /**
     * The group number to extract from the match result.
     * If not specified, defaults to 0 (the entire match).
     */
    group?: number,
    /**
     * Transformation function to apply to the matched string.
     * @param match Array of matched strings or TreeNode objects.
     * @returns Transformed value of type T.
     */
    transform: (match: (string | TreeNode<T> | T)[]) => T;
    /**
     * Stop transform level
     */
    stop?: boolean;
};

type TreeNode<T = string> = {
    type: string;
    oryginal?: string;
    values: (string | TreeNode<T>)[];
    rule?: TransformationRule<T>;
    transformed?: T;
};

/**
 * Function to transform an input string based on defined rules.
 * It builds a tree structure from the input string.
 * @param input The input string to be transformed.
 * @param rules Array of TransformationRule objects defining the transformation rules.
 * @returns TreeNode<T>
 * @throws Will throw an error if the input is not a string or if the rules are not valid.
 */
export const transformTree = <T = string>(
    input: string,
    rules: TransformationRule<T>[],
): TreeNode<T> => {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string.');
    }

    if (!Array.isArray(rules) || rules.some(rule => !(rule.pattern instanceof RegExp))) {
        throw new Error('Rules must be an array of valid TransformationRule objects.');
    }

    const findLargestPattern = (text: string, rules: TransformationRule<T>[]): { fullMatch: string, match: string, rule: TransformationRule<T> } | null => {
        let largestMatch: { fullMatch: string, match: string, rule: TransformationRule<T> } | null = null;

        for (const rule of rules) {
            const match = text.match(rule.pattern);
            if (match && match[rule.group || 0] && (!largestMatch || match[rule.group || 0].length > largestMatch.match.length)) {
                largestMatch = { fullMatch: match[0], match: match[rule.group || 0], rule };
            }
        }

        return largestMatch;
    };

    const processText = (text: string, parentNode: TreeNode<T>): TreeNode<T> => {
        // If the text is empty, return parentNode
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
            if (!largestPattern?.fullMatch || !largestPattern?.match) {
                throw new Error('Invalid pattern match returned.');
            }

            const matchIndex = text.indexOf(fullMatch);

            // Fragment before the found pattern
            if (matchIndex > 0) {
                parentNode.values.push(text.substring(0, matchIndex));
            }

            // Adding the found pattern
            const node: TreeNode<T> = {
                type: 'pattern',
                oryginal: fullMatch,
                values: [],
                rule: largestPattern.rule,
            };

            // Check if the pattern can be further divided
            if (match !== fullMatch && !largestPattern.rule.stop) {
                parentNode.values.push(processText(match, node));
            } else {
                node.values.push(match); // Add the pattern as a value if it cannot be further divided
                parentNode.values.push(node);
            }

            // Remove the fragment before and the pattern from the text
            text = text.substring(matchIndex + fullMatch.length);
        }

        return parentNode;
    };

    const rootNode: TreeNode<T> = { type: 'root', oryginal: input, values: [] };

    return processText(input, rootNode);
};

/**
 * Function to apply transformations to a tree structure.
 * It recursively processes each node and applies the transformation rules.
 * @param tree The root node of the tree structure.
 * @param transform The transformation function to apply to matched strings.
 * @returns Transformed object based on the tree structure and transformation rules.
 * @throws Will throw an error if no transformation function is defined for a rule.
 */
export const transformApply = <T = string>(
    tree: TreeNode<T>, 
    transform: (match: (string | TreeNode<T> | T)[]) => T
): T => {
    const transformNode = (node: TreeNode<T>): T => {
        if (node.values.length === 0) {
            return node.oryginal as unknown as T;
        }

        const transformedValues = node.values.map(value => {
            if (typeof value === 'string') {
                return value;
            } else {
                return transformNode(value as TreeNode<T>);
            }
        });

        if (node.rule && node.rule.transform) {
            node.transformed = node.rule.transform(transformedValues);
        } else if (node.type === 'root') {
            node.transformed = transform(transformedValues);
        } else {
            throw new Error(`No transform function defined for rule: ${JSON.stringify(node.rule)}`);
        }

        return node.transformed;
    };

    return transformNode(tree);
};

/**
 * Main transformation function.
 * It takes an input string, applies transformation rules, and returns the transformed object.
 * @param input The input string to be transformed.
 * @param rules Array of TransformationRule objects defining the transformation rules.
 * @param transform The transformation function to apply to matched strings. The function should take an array of matched strings or TreeNode objects and return a transformed value of type T.
 * @returns Transformed object based on the input and rules.
 * @throws Will throw an error if the input is not a string or if the rules are not valid.
 */
export const transform = <T = string>(
    input: string,
    rules: TransformationRule<T>[],
    transform: (match: (string | TreeNode<T> | T)[]) => T
): T => {
    const tree = transformTree<T>(input, rules);
    const result = transformApply<T>(tree, transform);
    //console.debug('pattern-transformer', 'transformTree', JSON.stringify(tree, null, 2));
    return result;
};
