const http = require('http');
const https = require('https');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getRequest = (options, onResult) => {
    console.log('rest::getJSON');
    const port = options.port == 443 ? https : http;

    let output = '';

    const req = port.request(options, (res) => {
        console.log(`${options.host} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);

            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        // res.send('error: ' + err.message);
    });

    req.end();
};


/*
const options = {
  host: 'somesite.com',
  port: 443,
  path: '/some/path',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

rest.getRequest(options, (statusCode, result) => {
  // I could work with the resulting HTML/JSON here. I could also just return it
  console.log(`onResult: (${statusCode})\n\n${JSON.stringify(result)}`);

  res.statusCode = statusCode;

  res.send(result);
});
 */
