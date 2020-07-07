const Joi = require('joi');
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                  CREATE USER COLLECTION AND SET PROPERTIES                 */
/* -------------------------------------------------------------------------- */
//  TODO:
/*  - add more validation checks for each field type
    - add custom Mongo validation
    - also add specific validations checks
    - does join_date need
*/

const User = mongoose.model('User', new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30
    },
    last_name: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 30
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 40
    },
    join_date: {
        type: Date,
        default: Date.now
    }
}));

function validateUser(user) {
    const schema = {
        first_name: Joi.string().min(1).max(30).required(),
        last_name: Joi.string().min(1).max(30).required(),
        username: Joi.string().min(5).max(20).required(),
        password: Joi.string().min(7).max(30).required(),
        email: Joi.string().min(7).max(40).required(),
        join_date: Joi.date()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;