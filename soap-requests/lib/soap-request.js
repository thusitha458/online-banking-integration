const request = require('request');

const DEFAULT_TIMEOUT = 30 * 1000;

class SoapRequest {
    constructor () {
        this.timeout = DEFAULT_TIMEOUT;
    }

    setTimeout (timeout)  {
        this.timeout = timeout;
    }

    sendSoapRequest (url, headers, xml) {
        return new Promise((resolve, reject) => {
            request.post({
                url: url,
                headers: headers,
                body: xml,
                timeout: this.timeout
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode > 299 || response.statusCode < 200) {
                    reject(new Error(`Request is failed with error code \
                                \"${response.statusCode}\" and message \"${response.statusMessage}\"`));
                } else {
                    resolve({
                        response: {
                            payload: response.body,
                            headers: response.headers,
                            statusCode: response.statusCode
                        }
                    });
                }
            });
        });
    }
}

module.exports = new SoapRequest();

