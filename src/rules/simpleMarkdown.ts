import { TransformationRule, TransformFunction } from '../transform';
import { simpleTransformFunction } from './textTransforms';

export const simpleMarkdown = (...additionalRules: TransformationRule[]): TransformationRule[] => {
    const baseRules: TransformationRule[] = [
        {
            pattern: /^# (.*)$/m, // Matches lines starting with "# " (Markdown header level 1)
            group: 1,
            transform: (match) => `<h1>${simpleTransformFunction(match)}</h1>`,
        },
        {
            pattern: /^## (.*)$/m, // Matches lines starting with "## " (Markdown header level 2)
            group: 1,
            transform: (match) => `<h2>${simpleTransformFunction(match)}</h2>`,
        },
        {
            pattern: /^### (.*)$/m, // Matches lines starting with "### " (Markdown header level 3)
            group: 1,
            transform: (match) => `<h3>${simpleTransformFunction(match)}</h3>`,
        },
        {
            pattern: /^#### (.*)$/m, // Matches lines starting with "#### " (Markdown header level 4)
            group: 1,
            transform: (match) => `<h4>${simpleTransformFunction(match)}</h4>`,
        },
        {
            pattern: /\*\*(.*?)\*\*/, // Matches bold text enclosed in "**"
            group: 1,
            transform: (match) => `<strong>${simpleTransformFunction(match)}</strong>`,
        },
        {
            pattern: /\*(.*?)\*/, // Matches italic text enclosed in "*"
            group: 1,
            transform: (match) => `<em>${simpleTransformFunction(match)}</em>`,
        },
        {
            pattern: /\[(.*?)\]\((.*?)\)/, // Matches Markdown links [text](url)
            transform: (match) => (match[0] as string).replace(/(\[(.*?)\]\((.*?)\))/, '<a href="$2">$1</a>'),
        },
        {
            pattern: /!\[(.*?)\]\((.*?)\)/, // Matches Markdown images ![alt](url)
            transform: (match) => (match[0] as string).replace(/(\[(.*?)\]\((.*?)\))/, '<img src="$2" alt="$1">'),
        },
        {
            pattern: /`([^`]+)`/, // Matches inline code `code`
            transform: (match) => `<code>${match[0] as string}</code>`,
            stop: true,
        },
        {
            pattern: /```([\s\S]*?)```/, // Matches code blocks ```code```
            transform: (match) => `<pre><code>${match[0] as string}</code></pre>`,
            stop: true,
        },
    ];

    return [...baseRules, ...additionalRules];
};
