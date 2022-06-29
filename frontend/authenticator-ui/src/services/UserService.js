import axios from 'axios';
import { getAuthHeader, isLoggedIn, getAccessTokenInLocalStorage, setAccessTokenInLocalStorage, clearAccessTokenInLocalStorage } from './AuthService';

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
            clearAccessTokenInLocalStorage();
            setAccessTokenInLocalStorage(accessToken);
            return {success: true,...responseData}
        }
        else
            return {success: false,...responseData}
    }
};

export const getAllUsers = async () => {
    let getUsersUrl = `${API_BASE_URL}`;
};