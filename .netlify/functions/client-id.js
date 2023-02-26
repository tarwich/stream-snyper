// @ts-check
const https = require('https');

exports.handler = async function (event, context, callback) {
  // Query www.twitch.tv, parse the response, and return the client ID in the form of clientId="asdfkljaldskfjlaksdfj"
  https.get('https://www.twitch.tv', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const clientId = data.match(/clientId="([a-z0-9]+)"/)[1];

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ clientId }),
      });
    });
  });
};

// If run on the cli, run the function
if (require.main === module) {
  exports.handler({}, {}, console.log);
}
