const fs = require('fs');
const redis = require('./utils/redisclient');
const redisClient = redis.getClient();
const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

const CONSUMER_GROUP_NAME = 'emailSender';
const EMAIL_STREAM_NAME = 'emailer:emailStream';

const emailSender = async (consumerName) => {
  console.log(`${consumerName}: Starting up.`);

  const emailStreamKey = redis.getKeyName('emailStream');
  const res = await redisClient.call('XINFO', 'STREAM', EMAIL_STREAM_NAME);
  let streamInfo = {};
  if(res){
    for (let n = 0; n < res.length; n += 2) {
      const k = res[n];
      const v = res[n + 1];
      streamInfo[k] = v;
    }
    if(streamInfo.groups === 0){

        const res = await redisClient.call('XGROUP', 'CREATE', emailStreamKey, CONSUMER_GROUP_NAME, '$');
        console.log(res);
    }
  }
  
  while (true) {
    const response = await redisClient.xreadgroup('GROUP', CONSUMER_GROUP_NAME, consumerName, 'COUNT', '1', 'BLOCK', '5000', 'STREAMS', emailStreamKey, '>');

    if (response) {      
      const streamEntry = response[0][1][0];
      const fieldNamesAndValues = streamEntry[1];

      const emailOptions = {
        id: streamEntry[0],
        timestamp: streamEntry[0].split('-')[0],
      };

      console.log(`${consumerName}: Processing Email ${emailOptions.id}.`);

      for (let n = 0; n < fieldNamesAndValues.length; n += 2) {
        const k = fieldNamesAndValues[n];
        const v = fieldNamesAndValues[n + 1];
        emailOptions[k] = v;
      }

      const emailProcessId = emailOptions.id;

      console.log(`${consumerName}: Processing ${emailProcessId}.`);
      console.log(emailOptions);

      const ack = await redisClient.xack(emailStreamKey, CONSUMER_GROUP_NAME, emailProcessId);

      console.log(`${consumerName}: ${ack === 1 ? 'Acknowledged' : 'Error acknowledging'} processing of email ${emailProcessId}.`);

      console.log(`${consumerName}: Pausing to simulate work.`);
      await sleep(10);
    } else {
      console.log(`${consumerName}: waiting for more emails...`);
    }
  }
};

if (process.argv.length !== 3) {
  console.error('Usage: npm run sendEmailWorker <consumerName>');
  process.exit(1);
}

emailSender(process.argv[2]);