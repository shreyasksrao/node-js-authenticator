/*jshint esversion: 8 */

async function addEndpointAlias(alias) {
    return (req, res, next) => {
        req.urlAlias = alias;
        next();
    };
}

module.exports = addEndpointAlias;