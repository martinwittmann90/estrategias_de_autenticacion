import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        max: 100,
    },
/*     isAdmin: {
        type: Boolean,
        required: true,
    }, */
    role: { type: String, 
        required: true, 
        default: "user", 
        enum: ["user", "admin"] 
    },
}, { versionKey: false });

const UserModel = model('users', userSchema);
export default UserModel;