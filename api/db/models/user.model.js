const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const jwtSecret = "3d5sa4d8sd65d3s2sd89s7d9sad45s6123h4gf6h7g9c8b5n132h";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    sessions: [{
        token:  {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

// Instance methods

// Override the toJSON method, because we don't want to send password and sessions
UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    // return the document expect password and sessions ( restricted )
    // for that we gonna use lodash
    return _.omit(userObject, [ 'password', 'sessions' ])
}

// Access Token generation
UserSchema.method.generateAccessToken = function(){
    const user = this;
    return new Promise((promise, reject) => {
        // Create JSON Web Token and return it
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m"} , (err, token) => {
            if(!err){
                resolve(token);
            }else{
                reject();
            }
        });
    })
}

// Method to generate 64kb string
UserSchema.method.generateRefreshAuthToken = function(){
    const user = this;
    return new Promise((promise, reject) =>{
        crypto.randomBytes(64, (err, buf) => {
            if(!err){
                let token = buf.toString('hex');
                
                resolve(token);
            }
        })
    })
}

// INSTANCE METHODS

// Create Session method
// Inside this method we are calling the methods
// 1- "Generate Refresh AuthToken", then with its outcome, we call "Save Session" to Database inside of it.
// 
UserSchema.methods.createSession = function() {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // If it has been saved to db properly, we return the token
        return refreshToken
    }).catch((e) => {
        return Promise.reject('Failed to  save session to database.\n' + e );
    })
}

// MODEL METHODS (static methods)

UserSchema.statics.findByIdAndToken = function (_id, token ) {
    // Finds user by id and token
    // used in auth middleware (verifySession)

    const User = this;

    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if(!user) return Promise.reject();
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) resolve(user);
                else{
                    reject();
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondsSinceEpoch){
        // Hasn`t expired
        return false;
    }else{
        // Did expire
        return true;
    }
}

// MIDDLEWARE
// Before saving a document, we will run this code
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if(user.isModified('password')) {
        // if the password field has been changed, run this code

        //Generate salt and hash password
        bcrypt.genSalt( costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }

})

// HELPER METHODS

// Save Session to database
// Session = Refresh Token + Expiry Time
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {

        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({"token": refreshToken, expiresAt});

        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        })
    })
}

// Will generate a Unix timestamp for 10 days from now.
let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };