const soapRequest = require('./lib/soap-request');
const RequestGenerator = require('./lib/request-generator');
const { Operations, soapResponsePostProcessor } = require('./lib/soap-response-post-processor');

module.exports.Operations = Operations;

module.exports.RequestGenerator = RequestGenerator;

module.exports.sendRequest = async function sendRequest (options) {
    let requestGenerator = options.requestGenerator;
    if (!requestGenerator) {
        requestGenerator = new RequestGenerator();
        await requestGenerator.setTemplatesFromFiles(options.headerFilePath, options.payloadFilePath);
    }
    const message = requestGenerator.generateMessage(options.headerParameters, options.payloadParameters);
    const { response } = await soapRequest.sendSoapRequest(options.url, message.headers, message.payload);
    const { payload, statusCode } = response;

    let processedPayload;
    if (options.operations) {
        processedPayload = await soapResponsePostProcessor.process(payload, options.operations);
    }
    return {
        payload: payload,
        processedPayload: processedPayload,
        statusCode: statusCode,
        headers: response.headers,
        requestGenerator: requestGenerator
    };
};