import CryptoJS from 'crypto-js';


const secretKey = "performanz";


export const hashPassword = (password) => {
    if (password) {
        return CryptoJS.HmacSHA256(password, secretKey).toString();
    };
    
    return "";
};


export const verifyPassword = (password, hashedPassword) => {
    const newHashedPassword = CryptoJS.HmacSHA256(password, secretKey).toString();
    return newHashedPassword === hashedPassword;
};