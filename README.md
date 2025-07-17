# Pattern Transformer

Pattern Transformer is a Node.js tool built with TypeScript that allows you to transform strings based on a predefined set of regular expression rules. It is designed to simplify and automate string transformations by applying custom patterns and rules.

## Project Structure

```
pattern-transformer
├── src
│   ├── index.ts          # Entry point of the application
│   └── utils
│       └── helper.ts     # Utility functions
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

### Example

Here’s an example of how the transformation function works:

```typescript
import { transform } from './src/index';

const input = "## Description: **Phone number: +48999999999** +48999999999\nData: **some bold text**";
const rules = [
  { pattern: /^## (.*)$/m, group: 1 },
  { pattern: /\*\*(.*?)\*\*/, group: 1 },
  { pattern: /\+48\d{9}\b/ }
];

const result = transform(input, rules);
console.log(JSON.stringify(result, null, 2));
```

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, feel free to submit an issue or a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.