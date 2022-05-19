import axios from 'axios';

const API_BASE_URL = "https://192.168.1.200:5001/api/v1";

async function onLoginBtnClick(){
    let loginUrl = `${API_BASE_URL}/loginUser`;
    
}

module.exports = {
    onLoginBtnClick
}