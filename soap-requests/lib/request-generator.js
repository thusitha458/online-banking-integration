const fs = require('fs');

const templateEngine = require('./handlebars-engine');

class RequestGenerator {
    constructor () {
        this._templateEngine = templateEngine;
    }

    generateMessage (headerParameters, payloadParameters) {
        if (!this._headersTemplate || !this._payloadTemplate) {
            throw new Error('Templates are not set');
        }
        headerParameters = headerParameters || {};
        payloadParameters = payloadParameters || {};

        return {
            headers: JSON.parse(this._headersTemplate(headerParameters)),
            payload: this._payloadTemplate(payloadParameters)
        };
    }

    async setTemplatesFromFiles (headersFilePath, payloadFilePath) {
        this._headersTemplate = await this._getTemplateFromFile(headersFilePath);
        this._payloadTemplate = await this._getTemplateFromFile(payloadFilePath);
    }

    setHeadersTemplate (headersTemplate) {
        this._headersTemplate = headersTemplate;
    }

    getHeadersTemplate () {
        return this._headersTemplate;
    }

    setPayloadTemplate (payloadTemplate) {
        this._payloadTemplate = payloadTemplate;
    }

    getPayloadTemplate () {
        return this._payloadTemplate;
    }

    _getTemplateFromFile (filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf8' }, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this._templateEngine.compile(data));
                }
            });
        });

    }
}

module.exports = RequestGenerator;