const fs = require('fs');
const { sendRequest, RequestGenerator, Operations } = require('./soap-requests/index');

let fileBytes = new Buffer(fs.readFileSync('./to-upload/abc.txt')).toString('base64');

sendRequest({
    url: 'http://localhost:8080/thusitha/onlineBanking',
    headerFilePath: './requests/upload-request-headers.hbs',
    payloadFilePath: './requests/upload-request.hbs',
    headerParameters: { userAgent: 'BlimpIt'},
    payloadParameters: { fileName: 'abc.txt', fileBytes: fileBytes },
    operations: [Operations.REMOVE_NAMESPACES_FROM_JSON, Operations.EXTRACT_BODY]
}).then((result) => {
    console.log('1. Request successful--------------------------------------------------------------------------------');
    console.log(result);
}).catch((error) => {
    console.log('1. Request failed------------------------------------------------------------------------------------');
    console.log(error);
});


const requestGenerator = new RequestGenerator();
requestGenerator
    .setTemplatesFromFiles('./requests/upload-request-headers.hbs', './requests/upload-request.hbs')
    .then(() => {
        sendRequest({
            url: 'http://localhost:8080/thusitha/onlineBanking',
            headerParameters: { userAgent: 'BlimpIt'},
            payloadParameters: { fileName: 'abc.txt', fileBytes: fileBytes },
            operations: [Operations.REMOVE_NAMESPACES_FROM_JSON, Operations.EXTRACT_BODY],
            requestGenerator: requestGenerator
    }).then((result) => {
        console.log('2. Request successful--------------------------------------------------------------------------------');
        console.log(result);
    }).catch((error) => {
        console.log('2. Request failed------------------------------------------------------------------------------------');
        console.log(error);
    });
});