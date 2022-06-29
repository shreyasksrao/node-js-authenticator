const getAuthHeader = () => {
    let loginState = isLoggedIn();
    if(loginState){
        let accessToken = getAccessTokenInLocalStorage();
        return {'x-auth-token': accessToken};
    }
    else
        return -1;
};

const isLoggedIn = () => {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken === "null")
        return false;
    return true;
};

const clearAccessTokenInLocalStorage = () => {
    localStorage.setItem('accessToken', "null");
};

const getAccessTokenInLocalStorage = () => {
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));
    return accessToken;
};

const setAccessTokenInLocalStorage = (accessToken) => {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
};

module.exports = {
    getAuthHeader,
    isLoggedIn,
    getAccessTokenInLocalStorage,
    setAccessTokenInLocalStorage,
    clearAccessTokenInLocalStorage
}