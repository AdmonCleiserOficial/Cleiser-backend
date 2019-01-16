const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate');

const TextSchema = new Schema({
    message: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    actualText: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

TextSchema.methods.new = async function(message) {
    let text = this;
    text.message = message;
    
    return text.save()
        .then(t => {
            return {
                text: t
            }
        });
};

TextSchema.plugin(paginate);

module.exports = mongoose.model('Text', TextSchema);