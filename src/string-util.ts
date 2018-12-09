export namespace StringUtil {

    const HexPalette
        = "0123456789ABCDEF";

    const AlphaNumPalette
        = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    export function randomString(palette: string, length: number) {
        const chars = new Array(length);

        for (let i = 0; i < length; i++)
            chars[i] = palette.charAt(Math.floor(Math.random() * palette.length));

        return chars.join("");
    }

    export function randomHex(length: number) {
        return randomString(HexPalette, length);
    }

    export function randomAlphaNum(length: number) {
        return randomString(AlphaNumPalette, length);
    }
}
