const Handlebars = require('handlebars');

class HandlebarsEngine {
    constructor () {
        this._engine = Handlebars;
    }

    compile (source) {
        return this._engine.compile(source);
    }
}

module.exports = new HandlebarsEngine();