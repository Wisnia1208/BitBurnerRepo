/** @param {NS} ns */
export async function main(ns) {
  const input = ["FRAME MODEM DEBUG CLOUD CACHE", 6];
  const plaintext = input[0];
  const shift = input[1];

  function caesarLeft(text, shift) {
    const result = [];
    const normalizedShift = ((shift % 26) + 26) % 26;

    for (const ch of text) {
      if (ch >= "A" && ch <= "Z") {
        const code = ch.charCodeAt(0) - 65;
        const shifted = (code - normalizedShift + 26) % 26;
        result.push(String.fromCharCode(shifted + 65));
      } else if (ch >= "a" && ch <= "z") {
        const code = ch.charCodeAt(0) - 97;
        const shifted = (code - normalizedShift + 26) % 26;
        result.push(String.fromCharCode(shifted + 97));
      } else {
        result.push(ch);
      }
    }

    return result.join("");
  }

  const cipherText = caesarLeft(plaintext, shift);
  ns.tprint(`Plaintext: ${plaintext}`);
  ns.tprint(`Shift: ${shift} (left)`);
  ns.tprint(`Ciphertext: ${cipherText}`);

  return cipherText;
}
