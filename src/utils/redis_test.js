/*jshint esversion: 8 */
/* eslint-disable no-console */
const redis = require('redis');

(async () => {
  try {
    const client = redis.createClient({ 
      socket: { 
        port: 6379, 
        host: "192.168.1.6"
      },
      password: "FG0RVs9xv025s7bR/zGmifF9zaByxA2eNN0qUmasW1kuLk14/GEYxml5NrLsMacL+mNPBlUCQzcgSgs" 
    });
  
    await client.connect();

    console.log('connected');

    const response = await  client.get('hello');
    if(response){
        console.log(response);
    }
  } catch (err) {
    console.error(err);
  }
})();