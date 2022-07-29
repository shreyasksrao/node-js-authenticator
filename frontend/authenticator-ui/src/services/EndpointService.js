import axios from 'axios';
import { isLoggedIn, getAccessTokenInLocalStorage } from './AuthService';

const API_BASE_URL = "http://127.0.0.1:5001/api/v1";

export const getAllEndpoints = async () => {
    let loginState = isLoggedIn();
    if(loginState){
        try {
            let accessToken = getAccessTokenInLocalStorage();
            let getAllEndpointsUrl = `${API_BASE_URL}/getAllEndpoints`;
            let headers = {
                'Accept': 'application/json',
                'x-auth-token': accessToken
            };
            const res = await axios.get(getAllEndpointsUrl, { 'headers': headers });
            return {data: res.data, returnCode: 0};
        } catch (error) {
            return {data: 'Error', error: JSON.stringify(error), returnCode: -1};
        }
    }
    else
        return {data: 'Error', error: 'Not Logged In', returnCode: -2};
};

export const getEndpoint = async (id) => {
    let loginState = isLoggedIn();
    if(loginState){
        try {
            let accessToken = getAccessTokenInLocalStorage();
            let getEndpointUrl = `${API_BASE_URL}/getEndpoint/${id}`;
            let headers = {
                'Accept': 'application/json',
                'x-auth-token': accessToken
            };
            const res = await axios.get(getEndpointUrl, { 'headers': headers });
            return {data: res.data, returnCode: 0};
        } catch (error) {
            return {data: 'Error', error: JSON.stringify(error), returnCode: -1};
        }
    }
    else
        return {data: 'Error', error: 'Not Logged In', returnCode: -2};
}

export const createEndpoint = async (data) => {
    let loginState = isLoggedIn();
    if(loginState){
        try {
            let accessToken = getAccessTokenInLocalStorage();
            let createEndpointUrl = `${API_BASE_URL}/createEndpoint`;
            let headers = {
                'Accept': 'application/json',
                'x-auth-token': accessToken,
                'Content-Type': 'application/json'
            };
            const res = await axios.post(createEndpointUrl, data, { 'headers': headers });
            return {data: res.data, returnCode: 0};
        } catch (error) {
            return {data: 'Error', error: error.response.data.message, returnCode: -1};
        }
    }
    else
        return {data: 'Error', error: 'Not Logged In', returnCode: -2};
};