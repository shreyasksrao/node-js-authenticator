const express = require('express');
const Redis = require('ioredis');

const redis = new Redis({
  host: '192.168.1.200',
  port: 6379,
  password: "FG0RVs9xv025s7bR/zGmifF9zaByxA2eNN0qUmasW1kuLk14/GEYxml5NrLsMacL+mNPBlUCQzcgSgs",
});

const getKeyName = (...args) => `emailer:${args.join(':')}`;

const app = express();
app.use(express.json());

const emailStreamKey = getKeyName('emailStream');
const maxStreamLength = 100;

app.post('/api/gmail/email',
  async (req, res) => {
    const emailOptions = req.body;
    const pipeline = redis.pipeline();
    pipeline.xadd(
        emailStreamKey, 'MAXLEN', '~', maxStreamLength, '*', ...Object.entries(emailOptions).flat(),
      (err, result) => {
        if (err) {
          console.error('Error adding Email to stream:');
          console.error(err);
        } else {
          console.log(`Received checkin, added to stream as ${result}`);
        }
      },
    );
    pipeline.exec();
    return res.status(202).end();
  },
);

const port = 5005;
app.listen(port, () => {
  console.log(`Email receiver listening on port ${port}.`);
});