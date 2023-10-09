import * as CryptoJS from 'crypto-js';
import { resolve } from 'path';

const iv = CryptoJS.enc.Base64.parse(''); //giving empty initialization vector
const SECRET_KEY_256 = CryptoJS.SHA256(
  '68e69a190a03ddb739c6356d5c9c10d16804adda',
);

export const encryptData = (data: any) => {
  const encryptedString = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY_256,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encryptedString.toString();
};


export const decryptData = (encrypted: any):Promise<any> => {
  return new Promise<any>((resolve)=>{
    var decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY_256, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    resolve(JSON.parse( decrypted.toString(CryptoJS.enc.Utf8)))
  })
 
};