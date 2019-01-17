const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate');

const MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recepient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    texts: {
       type: [Schema.Types.ObjectId],
       ref: 'Text'
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

MessageSchema.methods.new = async function(text) {
    let message = this;
    message.texts.push(text);
    message.isRead = false;

    return message.save()
        .then(m => {
            return {
                message: m
            }
        });
};

MessageSchema.plugin(paginate);

module.exports = mongoose.model('Message', MessageSchema);