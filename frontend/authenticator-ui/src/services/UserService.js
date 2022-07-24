import axios from 'axios';
import { getAccessTokenInLocalStorage, setAccessTokenInLocalStorage, clearAccessTokenInLocalStorage, 
         clearAccessTokenExpiryInLocalStorage, setAccessTokenExpiryInLocalStorage, setRefreshTokenInLocalStorage, 
         setRefreshTokenExpiryInLocalStorage } from './AuthService';

const API_BASE_URL = "http://127.0.0.1:5001/api/v1";

export const loginHandler = async (email, password, setCookie=false) => {
    let loginUrl = `${API_BASE_URL}/loginUser`;
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    let postData = {
        'email': email,
        'password': password
    };

    let response = await axios.post(loginUrl, postData, headers);
    if(! setCookie){
        let responseData = response.data;
        if (responseData.statusCode === 200){
            let accessToken = responseData.accessToken;
            let accessTokenExpiresAt = responseData.accessTokenExpiresAt;
            let refreshToken = responseData.refreshToken;
            let refreshTokenExpiresAt = responseData.refreshTokenExpiresAt;
            clearAccessTokenInLocalStorage();
            setAccessTokenInLocalStorage(accessToken);
            setAccessTokenExpiryInLocalStorage(accessTokenExpiresAt);
            setRefreshTokenInLocalStorage(refreshToken);
            setRefreshTokenExpiryInLocalStorage(refreshTokenExpiresAt);
            return {success: true,...responseData}
        }
        else
            return {success: false,...responseData}
    }
};

export const logoutUser = async () => {
    let logoutUrl = `${API_BASE_URL}/logoutUser`;
    let accessToken = getAccessTokenInLocalStorage();
    let headers = {
        'x-auth-token': accessToken,
        'Accept': 'application/json'
    };

    let response = await axios.post(logoutUrl, '', {headers: headers});
    console.log(response);
    if (response.data.statusCode === 201){
        clearAccessTokenInLocalStorage();
        clearAccessTokenExpiryInLocalStorage();
        return {success: true, ...response.data};
    }
    return {success: false, ...response.data};
};

export const getAllUsers = async () => {
    let getUsersUrl = `${API_BASE_URL}`;
};