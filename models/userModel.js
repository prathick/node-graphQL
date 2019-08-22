const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userJson = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            refs: 'Events'
        }
    ]
}

const userSchema = new Schema(userJson)
module.exports = mongoose.model("User", userSchema)