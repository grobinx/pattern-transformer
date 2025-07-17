import { TransformationRule } from '../transform';

/**
 * Rule for transforming phone numbers
 * 
 * @example
 * input: "Contact: +1 (123) 456-7890 or +48 999999999 or +48 999-999-999"
 * output: "Contact: +1 123 456 7890 or +48 999 999 999 or +48 999 999 999"
 */
export const phoneNumberTransform: TransformationRule = {
    pattern: /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, // Matches international phone numbers
    transform: (match) => {
        const rawNumber = match[0] as string;

        // Remove special characters and spaces
        const cleanedNumber = rawNumber.replace(/[-.\s]/g, ' ').replace(/\((.*?)\)/g, '$1');

        // Add spaces between groups of digits if no separators exist
        return cleanedNumber.replace(/(\+?\d{1,3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    },
    stop: true, 
};

/**
 * Rule for transforming IBAN numbers
 * 
 * @example
 * input: "GB29NWBK60161331926819"
 * output: "GB29 NWBK 6016 1331 9268 19"
 */
export const ibanTransform: TransformationRule = {
    pattern: /[A-Z]{2}\d{2}[A-Z0-9]{1,30}/, // Matches IBAN format
    transform: (match) => {
        const rawIBAN = match[0] as string;
        return rawIBAN.replace(/(.{4})/g, '$1 ').trim(); // Adds spaces every 4 characters
    },
    stop: true, 
};

/**
 * Rule for transforming credit card numbers
 * 
 * @example
 * input: "1234567812345678"
 * output: "1234 5678 1234 5678"
 */
export const creditCardTransform: TransformationRule = {
    pattern: /\d{16}/, // Matches 16-digit credit card numbers
    transform: (match) => {
        const rawCard = match[0] as string;
        return rawCard.replace(/(.{4})/g, '$1 ').trim(); // Adds spaces every 4 digits
    },
    stop: true, 
};

/**
 * Rule for transforming IP addresses
 * 
 * @example
 * input: "192168001001"
 * output: "192.168.0.1"
 */
export const ipAddressTransform: TransformationRule = {
    pattern: /\d{12}/, // Matches 12-digit IP addresses
    transform: (match) => {
        const rawIP = match[0] as string;
        return rawIP.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4'); // Adds dots between groups of digits
    },
    stop: true, 
};

/**
 * Rule for transforming PESEL numbers (Poland)
 * 
 * @example
 * input: "12345678901"
 * output: "123-456-789-01"
 */
export const peselTransform: TransformationRule = {
    pattern: /\d{11}/, // Matches PESEL format
    transform: (match) => {
        const rawPESEL = match[0] as string;
        return rawPESEL.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1-$2-$3-$4'); // Adds separators
    },
    stop: true, 
};

/**
 * Rule for transforming NIP numbers (Poland)
 * 
 * @example
 * input: "1234567890"
 * output: "123-456-78-90"
 */
export const nipTransform: TransformationRule = {
    pattern: /\d{10}/, // Matches NIP format
    transform: (match) => {
        const rawNIP = match[0] as string;
        return rawNIP.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4'); // Adds separators
    },
    stop: true, 
};

/**
 * Rule for transforming postal codes (Poland)
 * 
 * @example
 * input: "12345"
 * output: "12-345"
 */
export const postalCodeTransform: TransformationRule = {
    pattern: /\d{5}/, // Matches postal code format
    transform: (match) => {
        const rawCode = match[0] as string;
        return rawCode.replace(/(\d{2})(\d{3})/, '$1-$2'); // Adds a dash between groups of digits
    },
    stop: true, 
};

/**
 * Rule for transforming GPS coordinates
 * 
 * @example
 * input: "52.2296756,21.0122287"
 * output: "52.2296756° N, 21.0122287° E"
 */
export const gpsTransform: TransformationRule = {
    pattern: /\b-?\d+\.\d+,-?\d+\.\d+\b/, // Matches GPS coordinates
    transform: (match) => {
        const [lat, lon] = (match[0] as string).split(',');
        return `${lat}° N, ${lon}° E`; // Adds directional indicators
    },
    stop: true,
};

/**
 * Rule for transforming email addresses
 * 
 * @example
 * input: "Example@Domain.com"
 * output: "example@domain.com"
 */
export const emailTransformToLower: TransformationRule = {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Matches email addresses
    transform: (match) => (match[0] as string).toLowerCase().trim(), // Converts to lowercase and removes spaces
    stop: true,
};

/**
 * Rule for transforming URLs into clickable links
 * 
 * @example
 * input: "Visit https://www.example.com for more information."
 * output: "Visit <a href='https://www.example.com'>https://www.example.com</a> for more information."
 */
export const urlTransformToLink: TransformationRule = {
    pattern: /\b(?:https?:\/\/)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(\/[^\s]*)?\b/, // Matches URLs
    transform: (match) => {
        const rawUrl = match[0] as string;
        const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`; // Ensure URL starts with "http"
        return `<a href="${url}">${url}</a>`; // Wrap URL in an anchor tag
    },
    stop: true,
};

/**
 * Rule for transforming email addresses into clickable links
 * 
 * @example
 * input: "Contact me at Example@Domain.com"
 * output: "Contact me at <a href='mailto:example@domain.com'>example@domain.com</a>"
 */
export const emailTransformToLink: TransformationRule = {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Matches email addresses
    transform: (match) => {
        const email = (match[0] as string).toLowerCase().trim(); // Converts to lowercase and removes spaces
        return `<a href="mailto:${email}">${email}</a>`; // Wraps email in a mailto link
    },
    stop: true,
};
