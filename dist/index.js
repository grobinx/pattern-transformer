"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
/**
 * Transforms a string based on a map of regular expressions and their replacements.
 * Matches are sorted by nesting (inner matches first) before applying transformations.
 * @param input - The input string to transform.
 * @param rules - An array of transformation rules.
 * @returns An array of transformed results of type T or strings.
 */
function transform(input, rules) {
    const matches = [];
    // Collect all matches from all rules
    for (const [pattern, replacement] of rules) {
        let match;
        const regex = new RegExp(pattern, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'); // Ensure global flag
        while ((match = regex.exec(input)) !== null) {
            const innerMatches = matches.filter((m) => m.start >= match.index && m.end <= match.index + match[0].length);
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                value: replacement(match[0], innerMatches.map((m) => m.value)),
                inner: innerMatches.map((m) => m.value),
            });
        }
    }
    // Sort matches by nesting: inner matches (smaller ranges) come first
    matches.sort((a, b) => {
        if (a.start === b.start) {
            return b.end - a.end; // Longer matches come later if they start at the same position
        }
        return a.start - b.start; // Sort by start position
    });
    // Build the result array by processing the input string and matches
    const result = [];
    let lastIndex = 0;
    for (const match of matches) {
        // Add the text before the match
        if (lastIndex < match.start) {
            result.push(input.slice(lastIndex, match.start));
        }
        // Add the transformed match
        result.push(match.value);
        // Update the last processed index
        lastIndex = match.end;
    }
    // Add any remaining text after the last match
    if (lastIndex < input.length) {
        result.push(input.slice(lastIndex));
    }
    return result;
}
exports.transform = transform;
