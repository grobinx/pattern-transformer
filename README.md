# Pattern Transformer

Pattern Transformer is a Node.js tool built with TypeScript that allows you to transform strings based on a predefined set of regular expression rules. It is designed to simplify and automate string transformations by applying custom patterns and rules.

## Project Structure

```
pattern-transformer
├── src
│   ├── index.ts          # Entry point of the application
├── package.json          # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
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

### Rules

The transformation rules are defined as follows:

```typescript
const rules: TransformationRule[] = [
    {
        pattern: /^## (.*)$/m, // Matches lines starting with "##"
        group: 1,
        transform: (match) => `<h1>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</h1>`,
    },
    {
        pattern: /\*\*(.*?)\*\*/, // Matches bold text enclosed in "**"
        group: 1,
        transform: (match) => `<strong>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</strong>`,
    },
    {
        pattern: /\+48\d{9}\b/, // Matches Polish phone numbers
        transform: (match) => (match[0] as string).replace(/(\+48)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4'),
    },
];
```

### Example

Here’s an example of how the transformation function works:

```typescript
import { transform } from './src/index';

const input = "## Description: **Phone number: +48999999999** +48999999999\nData: **some bold text**";
const result = transform(input, rules);
console.log(result);
```

### Output Example

Given the input above, the `transform` function will produce the following output:

```html
<h1>Description: <strong>Phone number: +48 999 999 999</strong> +48 999 999 999</h1>
<strong>some bold text</strong>
```

This example demonstrates how the `transform` function processes the input string and applies the defined rules to extract and transform the relevant parts.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, feel free to submit an issue or a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.