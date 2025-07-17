# Pattern Transformer

Pattern Transformer is a Node.js tool built with TypeScript that allows you to transform strings based on a predefined set of regular expression rules. It is designed to simplify and automate string transformations by applying custom patterns and rules.

## Project Structure

```
pattern-transformer
├── src
│   ├── rules                       # Contains transformation rules
|   |   ├── simpleMarkdown.ts       # Simple Markdown transformation
│   |   └── textTransformations.ts  # Single text transformation rules
│   └── transform.ts                # Core transformation logic
│── index.ts                        # Entry point of the application
├── package.json                    # npm configuration file
├── tsconfig.json                   # TypeScript configuration file
└── README.md                       # Project documentation
```

## Installation

To get started with this project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd pattern-transformer
npm install
```

## Usage

To run the application, use the following command:

```bash
npm start
```

The main functionality of the tool is provided by a transformation function that takes a string and applies a series of transformations based on a set of regular expression rules. You can customize the transformation rules by modifying the rules in the source code.

## Example

### Rules

The transformation rules are defined as follows:

```typescript
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
        ...
        {
            pattern: /`([^`]+)`/, // Matches inline code `code`
            transform: (match) => `<code>${match[0] as string}</code>`,
            stop: true,
        },
        ...
    ]
    ...
}
```

### Execute

Here’s an example of how the transformation function works:

```typescript
import { simpleMarkdown } from './src/rules/simpleMarkdown';
import { ibanTransform, phoneNumberTransform, simpleTransformFunction } from './src/rules/textTransforms';
import { transform } from './src/transform';

const input = "## Opis: **Nr telefonu: +48999999999** +48999999999\nDane: **jakaś pogrubiona treść** *GB29NWBK60161331926819* PL12345678901234567890123456";

const result = transform(
    input, 
    simpleMarkdown(phoneNumberTransform, ibanTransform),
    simpleTransformFunction
);

console.log(result);
```

### Output

Given the input above, the `transform` function will produce the following output:

```html
<h2>Opis: <strong>Nr telefonu: +48 999 999 999</strong> +48 999 999 999</h2>
Dane: <strong>jakaś pogrubiona treść</strong> <em>GB29 NWBK 6016 1331 9268 19</em> PL12 3456 7890 1234 5678 9012 3456
```

This example demonstrates how the `transform` function processes the input string and applies the defined rules to extract and transform the relevant parts.

## Additional Rules

The project includes additional rules for transforming various types of data:

- **Phone Numbers**: Formats international phone numbers into a readable format.
- **IBAN Numbers**: Adds spaces every 4 characters for better readability.
- **Email Addresses**: Converts emails to lowercase or clickable links.
- **URLs**: Converts URLs into clickable links.
- **GPS Coordinates**: Formats latitude and longitude with directional indicators.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, feel free to submit an issue or a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.