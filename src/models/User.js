const mongoose = require('mongoose');

const{ Schema } = mongoose;
const bcrypt = require('bcryptjs');
const UserSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true},
    adress: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

//crypt user password
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

//decrypt user password when logging the user
////standard function to be able to acced the userschema
UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password); //user password vs schema password
};

module.exports = mongoose.model('User', UserSchema)