public class CaesarCipher {
    public static void main(String[] args) {
        String plaintext = "FRAME MODEM DEBUG CLOUD CACHE";
        int shift = 6;

        String cipherText = caesarLeft(plaintext, shift);
        System.out.println("Plaintext: " + plaintext);
        System.out.println("Shift: " + shift + " (left)");
        System.out.println("Ciphertext: " + cipherText);
    }

    private static String caesarLeft(String text, int shift) {
        shift = ((shift % 26) + 26) % 26;
        StringBuilder result = new StringBuilder();

        for (char ch : text.toCharArray()) {
            if (ch >= 'A' && ch <= 'Z') {
                int code = ch - 'A';
                int shifted = (code - shift + 26) % 26;
                result.append((char) (shifted + 'A'));
            } else if (ch >= 'a' && ch <= 'z') {
                int code = ch - 'a';
                int shifted = (code - shift + 26) % 26;
                result.append((char) (shifted + 'a'));
            } else {
                result.append(ch);
            }
        }

        return result.toString();
    }
}
