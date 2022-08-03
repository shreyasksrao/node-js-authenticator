const {User} = require('../../sequelize');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
const router = require('express').Router();
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');

const axios = require('axios');

const GOOGLE_OAUTH_REDIRECT_URL = 'http://localhost:5001/auth/google';
const GOOGLE_OAUTH_CLIENT_ID = "212198777237-15sg1j5mh5ktidngqjh2sjrusgd724rm.apps.googleusercontent.com";
const GOOGLE_OAUTH_CLIENT_SECRET = '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';

function getTokens( code, clientId, clientSecret, redirectUri ) {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  const searchParams = new URLSearchParams(values);
  console.log(searchParams.toString());
  return axios
    .post(url, searchParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
}

router.get('/auth/google/getGoogleAuthURL', async (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URL,
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const searchParams = new URLSearchParams(options);
  return res.status(200).json({authURL: `${rootUrl}?${searchParams.toString()}`});
});

router.get(`/auth/google`, async (req, res) => {
    const code = req.query.code;
  
    const { id_token, access_token, refresh_token, scope } = await getTokens(code, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URL);
    console.log(`ID Token - ${id_token}`);
    console.log(`Access Token - ${access_token}`);
    console.log(`Refresh Token - ${refresh_token}`);
    console.log(`Scope - ${scope}`);

    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    console.log(googleUser);
    res.redirect('http://localhost:3000/signin');
  });

module.exports = router;