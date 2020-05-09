import jssha3 from 'js-sha3';

export function byte2hexStr(byte) {
    if (typeof byte !== 'number')
        throw new Error('Input must be a number');

    if (byte < 0 || byte > 255)
        throw new Error('Input must be a byte');

    const hexByteMap = '0123456789ABCDEF';

    let str = '';
    str += hexByteMap.charAt(byte >> 4);
    str += hexByteMap.charAt(byte & 0x0f);

    return str;
}

export function isHexChar(c) {
    if ((c >= 'A' && c <= 'F') ||
        (c >= 'a' && c <= 'f') ||
        (c >= '0' && c <= '9')) {
        return 1;
    }

    return 0;
}

export function hexChar2byte(c) {
    let d;

    if (c >= 'A' && c <= 'F')
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    else if (c >= 'a' && c <= 'f')
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    else if (c >= '0' && c <= '9')
        d = c.charCodeAt(0) - '0'.charCodeAt(0);

    if (typeof d === 'number')
        return d;
    else
        throw new Error('The passed hex char is not a valid hex char');
}

export function hexStr2byteArray(str) {
    if (typeof str !== 'string')
        throw new Error('The passed string is not a string')

    const byteArray = Array();
    let d = 0;
    let j = 0;
    let k = 0;

    for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i);

        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;

            if (0 === (j % 2)) {
                byteArray[k++] = d;
                d = 0;
            }
        } else
            throw new Error('The passed hex char is not a valid hex string')
    }

    return byteArray;
}

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP = {};

for (let i = 0; i < ALPHABET.length; i++)
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;

const BASE = 58;

export function encode58(buffer) {
    if (buffer.length === 0)
        return '';

    let i;
    let j;

    const digits = [0];

    for (i = 0; i < buffer.length; i++) {
        for (j = 0; j < digits.length; j++)
            digits[j] <<= 8;

        digits[0] += buffer[i];
        let carry = 0;

        for (j = 0; j < digits.length; ++j) {
            digits[j] += carry;
            carry = (digits[j] / BASE) | 0;
            digits[j] %= BASE
        }

        while (carry) {
            digits.push(carry % BASE);
            carry = (carry / BASE) | 0
        }
    }

    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++)
        digits.push(0);

    return digits.reverse().map(digit => ALPHABET[digit]).join('');
}

export function decode58(string) {
    if (string.length === 0)
        return [];

    let i;
    let j;

    const bytes = [0];

    for (i = 0; i < string.length; i++) {
        const c = string[i];

        if (!(c in ALPHABET_MAP))
            throw new Error('Non-base58 character');

        for (j = 0; j < bytes.length; j++)
            bytes[j] *= BASE;

        bytes[0] += ALPHABET_MAP[c];
        let carry = 0;

        for (j = 0; j < bytes.length; ++j) {
            bytes[j] += carry;
            carry = bytes[j] >> 8;
            bytes[j] &= 0xff;
        }

        while (carry) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }

    for (i = 0; string[i] === '1' && i < string.length - 1; i++)
        bytes.push(0);

    return bytes.reverse();
}

export function byteArray2hexStr(byteArray) {
    let str = '';

    for (let i = 0; i < (byteArray.length); i++)
        str += byte2hexStr(byteArray[i]);

    return str;
}

export function SHA256(msgBytes) {
    const msgHex = byteArray2hexStr(msgBytes);
    const hashHex = jssha3.sha3_256('0x' + msgHex).replace(/^0x/, '')
    return hexStr2byteArray(hashHex);
}

export function getBase58CheckAddress(addressBytes) {
    const hash0 = SHA256(addressBytes);
    const hash1 = SHA256(hash0);

    let checkSum = hash1.slice(0, 4);
    checkSum = addressBytes.concat(checkSum);

    return encode58(checkSum);
}

export function hexAddress2tronAddress(hexAddress) {
    return getBase58CheckAddress(hexStr2byteArray(hexAddress))
}
