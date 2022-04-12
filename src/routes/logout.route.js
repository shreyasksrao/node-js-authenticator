/*jshint esversion: 8 */
/* eslint-disable no-console */

const router = require("express").Router();
const { blacklistToken } = require('../middlewares/blacklistToken');

router.delete('/logout', blacklistToken, async (req, res) => {
  return res.json({message:"Token blacklisted. User logged out."});
});
 
module.exports = router;