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
    let accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');
    let current = new Date();
    let currentEpoch = Math.floor(current.getTime()/ 1000)
    if (accessToken === null)
        return false;
    if (accessTokenExpiresAt < currentEpoch)
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

const setAccessTokenExpiryInLocalStorage = (expiresAt) => {
    localStorage.setItem('accessTokenExpiresAt', expiresAt);
};

const setRefreshTokenInLocalStorage = (refreshToken) => {
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
};

const setRefreshTokenExpiryInLocalStorage = (expiresAt) => {
    localStorage.setItem('refreshTokenExpiresAt', expiresAt);
};

module.exports = {
    getAuthHeader,
    isLoggedIn,
    getAccessTokenInLocalStorage,
    setAccessTokenInLocalStorage,
    setAccessTokenExpiryInLocalStorage,
    setRefreshTokenInLocalStorage,
    setRefreshTokenExpiryInLocalStorage,
    clearAccessTokenInLocalStorage
}