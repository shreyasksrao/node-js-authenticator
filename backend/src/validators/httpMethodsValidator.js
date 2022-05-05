/*jshint esversion: 8 */

const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

let httpMethodsValidator = (method) => {
    let capitalizedMethod = method.toUpperCase();
    const result = VALID_METHODS.includes(capitalizedMethod)?true:false;
    return result;
};

module.exports = {
    VALID_METHODS,
    httpMethodsValidator
};