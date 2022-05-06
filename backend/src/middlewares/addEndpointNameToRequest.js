/*jshint esversion: 8 */

async function addEndpointNameToRequest(endpointName) {
    return (req, res, next) => {
        req.endpointName = endpointName;
        next();
    };
}

module.exports = addEndpointNameToRequest;