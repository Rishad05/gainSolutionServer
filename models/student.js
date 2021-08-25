const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    addingSubject:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ]
});
module.exports = mongoose.model('Student', studentSchema);