const {Schema, model} = require('mongoose');

const ProjectSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'default.png'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('Project', ProjectSchema);