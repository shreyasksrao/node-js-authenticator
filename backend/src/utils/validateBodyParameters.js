/*jshint esversion: 8 */
/* eslint-disable indent */

function validateBodyParamsExistence(req, requiredParamsArray) {
    requiredParamsArray.forEach( (parameter) => {
        if (req.body[parameter] == undefined)
            return {status: false, message:`Request Body doesn't contain the property '${parameter}'`};
    });
    return {status: true};
}

module.exports = {
    validateBodyParamsExistence
};