/*jshint esversion: 8 */

function addEndpointNameToRequest(_endpointName) {
    return (req, res, next) => {
        req.endpointName = _endpointName;
        next();
    };
}

module.exports = addEndpointNameToRequest;