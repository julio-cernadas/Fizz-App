import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import config from "./../../../config/config";
import log from "./../../../utils/webpack-logger";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Name is required",
    },
    email: {
        type: String,
        trim: true,
        unique: "Email already exists",
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
        required: "Email is required",
    },
    hashed_password: {
        type: String,
        required: "Password is required",
    },
    salt: String,
    about: {
        type: String,
        trim: true,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
});

UserSchema.methods = {
    // Salts are used to safeguard passwords in storage, they are random values
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    },
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt) // Uses salt generated in virtual prop
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
    // Used in 'auth.controller.js' to authenticate the password for signin!
    isAuthenticated: function (plainTextPassword) {
        return this.encryptPassword(plainTextPassword) === this.hashed_password;
    },

    getSignedToken: function () {
        // To see the token conversion go to -> https://www.jsonwebtoken.io/
        const payload = { _id: this._id };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
        log.info("Successfully generated signed web token!");
        return token;
    },
};

// Virtual means that the property wont be persisted to the db, instead you'll
// store another value and have a get, for when accessing, and set, for when creating.
// NOTE: we never actually set 'salt' or 'hashed_password' ourselves, instead when we
// provide the User object a 'password' in the json object, it automatically run this
// process to setup the other 2 static model properties.
UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// Same as adding validation to the User schema defintion above...
UserSchema.path("hashed_password").validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate("password", "Password must be at least 6 characters.");
    }
    if (this.isNew && !this._password) {
        this.invalidate("password", "Password is required");
    }
}, null);

export default mongoose.model("User", UserSchema);
