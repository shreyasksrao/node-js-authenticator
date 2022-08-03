const router = require('express').Router();
const axios = require('axios');
const nodemailer = require("nodemailer");

const GOOGLE_EMAIL_OAUTH_REDIRECT_URL = 'http://localhost:5001/email/getRefreshToken';


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

async function getAccessTokenFromRefreshToken(clientId, clientSecret, refreshToken) {
    const tokenUrl = 'https://accounts.google.com/o/oauth2/token';
    let requestBody = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };
    const res = await axios.post(tokenUrl, requestBody)
    if('access_token' in res.data)
        return res.data.access_token;
    else
        return -1;
}

router.get('/email/getEmailAuthURL', async (req, res) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: GOOGLE_EMAIL_OAUTH_REDIRECT_URL,
      client_id: GOOGLE_EMAIL_OAUTH_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://mail.google.com',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const searchParams = new URLSearchParams(options);
    return res.status(200).json({authURL: `${rootUrl}?${searchParams.toString()}`});
});

router.get(`/email/getRefreshToken`, async (req, res) => {
    const code = req.query.code;
    const { id_token, access_token, refresh_token, scope } = await getTokens(code, GOOGLE_EMAIL_OAUTH_CLIENT_ID, GOOGLE_EMAIL_OAUTH_CLIENT_SECRET, GOOGLE_EMAIL_OAUTH_REDIRECT_URL);

    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        { headers: { Authorization: `Bearer ${id_token}`} }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    const userEmail = googleUser.email;
    res.status(200).json({
        statusCode: 200,
        senderEmail: userEmail,
        refreshToken: refresh_token
    })
  });


//   {
//     accepted: [ 'shreyassuryanarayan@gmail.com' ],
//     rejected: [],
//     envelopeTime: 839,
//     messageTime: 1172,
//     messageSize: 349,
//     response: '250 2.0.0 OK  1659463663 a15-20020a170902710f00b0016d2540c098sm12034320pll.231 - gsmtp',
//     envelope: {
//       from: 'shreyassuryanarayan2000@gmail.com',
//       to: [ 'shreyassuryanarayan@gmail.com' ]
//     },
//     messageId: '<6fef4cf1-b177-7fae-380c-7a0963545e6e@gmail.com>'
//   }
router.get('/email/sendEmail', async (req, res) => {
    let access_token = await getAccessTokenFromRefreshToken(
                                GOOGLE_EMAIL_OAUTH_CLIENT_ID, 
                                GOOGLE_EMAIL_OAUTH_CLIENT_SECRET, 
                                GOOGLE_EMAIL_REFRESH_TOKEN
                            );
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: 'shreyassuryanarayan2000@gmail.com',
          access_token,
          clientId: GOOGLE_EMAIL_OAUTH_CLIENT_ID,
          clientSecret: GOOGLE_EMAIL_OAUTH_CLIENT_SECRET,
          refreshToken: GOOGLE_EMAIL_REFRESH_TOKEN,
          tls: {
            rejectUnauthorized: false
          }
        }
    });

    let _res = await transporter.sendMail({
        subject: "Test",
        text: "I am sending an email from nodemailer!",
        to: "shreyassuryanarayan@gmail.com",
        from: {
            name: 'F2K Tech Support',
            address: 'shreyassuryanarayan2000@gmail.com'
        }
    });
    console.log(_res);
    res.status(200).send(JSON.stringify(_res));
});

module.exports = router;
