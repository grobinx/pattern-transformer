import { simpleMarkdown } from './src/rules/simpleMarkdown';
import { ibanTransform, phoneNumberTransform, simpleTransformFunction } from './src/rules/textTransforms';
import { transform } from './src/transform';

const input = "## Opis: **Nr telefonu: +48999999999** +48999999999\nDane: **jakaś pogrubiona treść** *GB29NWBK60161331926819* PL12345678901234567890123456";

const result = transform(
    input, simpleMarkdown(phoneNumberTransform, ibanTransform),
    simpleTransformFunction
);
console.debug(result);
