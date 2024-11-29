import { jwtDecode } from 'jwt-decode';


export const checkTokenExpiration = (token) => {

    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;

    const timeLeft = expirationTime - Date.now();

    if (timeLeft > 0) {
        return false;
    } else {
        return true;
    }
};