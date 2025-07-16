"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./src/index");
const input = "## Opis: **Nr telefonu: +48999999999** +48999999999\nDane: **jakiaś pogrubiona treść**";
const rules = [
    {
        pattern: /^## (.*)$/m,
        matchGroup: 1,
        //transform: (match) => `<h1>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</h1>`,
    },
    {
        pattern: /\*\*(.*?)\*\*/,
        matchGroup: 1,
        //transform: (match) => `<strong>${match.map((item) => typeof item === 'string' ? item : item.transformed).join('')}</strong>`,
    },
    {
        pattern: /\+48\d{9}\b/, // Dodano zakończenie ciągu znaków (word boundary)
        //transform: (match) => (match[0] as string).replace(/(\+48)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4'),
    },
];
const result = (0, index_1.transform)(input, rules);
console.debug(JSON.stringify(result, null, 2));
// Output: 'Opis: <strong>+48 999 999 999</strong>'
//# sourceMappingURL=test.js.map