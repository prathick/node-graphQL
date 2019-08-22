const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventJson = {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, refs: 'User' }
}

const eventSchema = new Schema(eventJson)
module.exports = mongoose.model('Events', eventSchema)

