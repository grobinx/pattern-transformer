import { transform, TransformationRule } from './src/transform';

const input = "## Opis: **Nr telefonu: +48999999999** +48999999999\nDane: **jakiaś pogrubiona treść**";
const rules: TransformationRule[] = [
    {
        pattern: /^## (.*)$/m, // Dodano zakończenie wiersza
        group: 1,
        transform: (match) => `<h1>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</h1>`,
    },
    {
        pattern: /\*\*(.*?)\*\*/, // Dodano zakończenie ciągu znaków
        group: 1,
        transform: (match) => `<strong>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</strong>`,
    },
    {
        pattern: /\+48\d{9}\b/, // Dodano zakończenie ciągu znaków (word boundary)
        transform: (match) => (match[0] as string).replace(/(\+48)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4'),
    },
];

const result = transform(
    input, rules,
    (match) => match.map((item) => typeof item === 'string' ? item : item.transformed).join('')
);
console.debug(result);
