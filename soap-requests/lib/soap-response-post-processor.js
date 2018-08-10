const { parseString } = require('xml2js');

module.exports.Operations = {
    REMOVE_NAMESPACES_FROM_JSON: 'removeNamespaceDeclarationsFromJson',
    EXTRACT_BODY: 'extractBodyFromJson'
};

class SoapResponsePostProcessor {

    async process (responseXml, operations) {
        operations = operations || [];
        let result = await this.convertXmlToJson(responseXml);
        operations.forEach(operation => {
            result = this[operation](result);
        });
        return result;
    }

    convertXmlToJson (xml) {
        return new Promise((resolve, reject) => {
            parseString(xml, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    removeNamespaceDeclarationsFromJson (json) {
        let copy = {};
        this._copyObjectExcludingNamespaceDeclarations(json, copy);
        return copy;
    }

    extractBodyFromJson (json) {
        let envelopeIndex = Object.keys(json).findIndex(key => key.endsWith('Envelope'));
        let envelope = json[Object.keys(json)[envelopeIndex]];
        let bodyIndex = Object.keys(envelope).findIndex(key => key.endsWith('Body'));
        return envelope[Object.keys(envelope)[bodyIndex]];
    }

    _copyObjectExcludingNamespaceDeclarations (source, target) {
        Object.keys(source).forEach(key =>  {
            if (key !== '$' && typeof source[key] !== 'function') {
                if (typeof source[key] !== 'object' ) {
                    target[key] = source[key];
                } else {
                    if (source[key] instanceof Array) {
                        target[key] = [];
                        for (let i = 0; i < source[key].length; i++) {
                            target[key][i] = {};
                            this._copyObjectExcludingNamespaceDeclarations(source[key][i], target[key][i]);
                        }
                    } else {
                        target[key] = {};
                        this._copyObjectExcludingNamespaceDeclarations(source[key], target[key]);
                    }

                }
            }
        });
    };
}

module.exports.soapResponsePostProcessor = new SoapResponsePostProcessor();