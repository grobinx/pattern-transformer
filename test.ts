import { simpleMarkdown } from './src/rules/simpleMarkdown';
import { ibanTransform, phoneNumberTransform } from './src/rules/textTransforms';
import { transform, TransformationRule } from './src/transform';

const input = "## Opis: **Nr telefonu: +48999999999** +48999999999\nDane: **jakaś pogrubiona treść** *GB29NWBK60161331926819* PL12345678901234567890123456";

const result = transform(
    input, simpleMarkdown(phoneNumberTransform, ibanTransform),
    (match) => match.map((item) => typeof item === 'string' ? item : item.transformed).join('')
);
console.debug(result);
