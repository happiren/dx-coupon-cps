import crypto from '@/common/CryptoJS.js';

var key = crypto.CryptoJS.enc.Utf8.parse("8888888888888888");
//十六位十六进制数作为秘钥偏移量
var iv  = crypto.CryptoJS.enc.Utf8.parse('6666666666666666');

function encrypt(word) {
    var srcs = crypto.CryptoJS.enc.Utf8.parse(word);
    var encrypted = crypto.CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: crypto.CryptoJS.mode.CBC, padding: crypto.CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

function decrypt(word) {
    var encryptedHexStr = crypto.CryptoJS.enc.Hex.parse(word);
    var srcs = crypto.CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = crypto.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: crypto.CryptoJS.mode.CBC, padding: crypto.CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(crypto.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
}
