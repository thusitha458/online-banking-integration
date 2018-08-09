const request = require('request');

module.exports = function soapRequest(url, headers, xml) {
    return new Promise((resolve, reject) => {
        request.post({
            url,
            headers,
            body: xml,
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else if (response.statusCode > 299 || response.statusCode < 200) {
                reject(new Error('Soap error'));
            } else {
                resolve({
                    response: {
                        body,
                        statusCode: response.statusCode,
                    },
                });
            }
        });
    });
};