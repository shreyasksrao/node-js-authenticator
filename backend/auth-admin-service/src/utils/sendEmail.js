const axios = require('axios');

function getTokens( code, clientId, clientSecret, redirectUri ) {
  /*
  Returns:
  Promise<{
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }>
  */
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

function getGoogleAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: `http://localhost:5001/auth/google`,
    client_id: "905149359245-f1cnl1l62sla1nrkscpvhpssgi8s0mb4.apps.googleusercontent.com",
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
    ].join(' '),
  };
  const searchParams = new URLSearchParams(options);
  return `${rootUrl}?${searchParams.toString()}`;
}

console.log(getGoogleAuthURL())
// (async () => {
//     const { id_token, access_token } = await getTokens( 
//   code, 
//   '293672208183-7j15sdhcgmkajo8smc45qlktcf3i2d2e.apps.googleusercontent.com', 
//   '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', 
//   'http://localhost:5001/auth/google'
// )
// })();
