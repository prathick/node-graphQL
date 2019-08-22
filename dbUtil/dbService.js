const Model = require('../models')

module.exports = class dbService {

    constructor(name) {
        if (!this.isValidModelName(name)) throw "Invalid model name '" + name + "'. Terminating app..."

        this.name = name

    }

    isValidModelName(name) {
        return !(!name || name.length === 0 || !Model.hasOwnProperty(name))
    }

    createRecord(objToSave, callback) {
        new Model[this.name](objToSave).save(callback);
    }

    getRecord(criteria, projection, options, callback) {
        options.lean = true;
        Model[this.name].find(criteria, projection, options, callback);
      }
}