const { parseString } = require('xml2js');
const Handlebars = require('handlebars');
const fs = require('fs');

const soapRequest = require('./soap-request');

const url = 'http://localhost:8080/thusitha/onlineBanking';

const uploadRequestHeadersPreprocessed = fs.readFileSync('./requests/upload-request-headers.hbs', 'utf8');
let uploadRequestHeadersTemplate = Handlebars.compile(uploadRequestHeadersPreprocessed);
let headersJson = JSON.parse(uploadRequestHeadersTemplate({userAgent: 'BlimpIt'}));

const uploadRequestXmlPreprocessed = fs.readFileSync('./requests/upload-request.hbs', 'utf8');
let uploadRequestTemplate = Handlebars.compile(uploadRequestXmlPreprocessed);

let fileBytes = new Buffer(fs.readFileSync('./to-upload/abc.txt')).toString('base64');

let uploadRequestXml = uploadRequestTemplate({
    fileName: 'abc.txt',
    fileBytes: fileBytes
});

const sendRequest = async () => {
    const { response } = await soapRequest(url, headersJson, uploadRequestXml);
    const { body, statusCode } = response;
    parseString(body, function (err, result) {
        constructOutput(result);
    });
    console.log(body);
    console.log(statusCode);
};

sendRequest()
    .then(() => console.log('Request successful'))
    .catch(() => console.log('Request failed', ));

const constructOutput = (result) => {
    let newResult = {};
    extractValuesFromJson(result, newResult);
    console.log(JSON.stringify(newResult, undefined, 2));
};

const extractValuesFromJson = (sourceJson, targetJson) => {
    Object.keys(sourceJson).forEach(key =>  {
        if (key !== '$' && typeof sourceJson[key] !== 'function') {
            if (typeof sourceJson[key] !== 'object' ) {
                targetJson[key] = sourceJson[key];
            } else {
                if (sourceJson[key] instanceof Array) {
                    targetJson[key] = [];
                    for (let i = 0; i < sourceJson[key].length; i++) {
                        targetJson[key][i] = {};
                        extractValuesFromJson(sourceJson[key][i], targetJson[key][i]);
                    }
                } else {
                    targetJson[key] = {};
                    extractValuesFromJson(sourceJson[key], targetJson[key]);
                }

            }
        }
    });
};