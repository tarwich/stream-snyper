// @ts-check
const https = require('https');

exports.handler = async function (event, context, callback) {
  // Query www.twitch.tv, parse the response, and return the client ID in the form of clientId="asdfkljaldskfjlaksdfj"
  const data = await new Promise((resolve, reject) => {
    https.get(
      'https://www.twitch.tv',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
          Origin: 'https://www.twitch.tv',
          // Referer: 'https://www.twitch.tv/',
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      },
    );
  });

  const clientId = data.match(/clientId="(.*?)"/)[1];

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ clientId }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

// If run on the cli, run the function
if (require.main === module) {
  exports.handler({}, {}, console.log);
}
