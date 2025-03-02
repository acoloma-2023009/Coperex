import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't exceed 25 characters`],
            trim: true
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't exceed 25 characters`],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            maxLength: [15, `Can't exceed 15 characters`],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            maxLength: [100, `Can't exceed 100 characters`],
            match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number']
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, `Can't exceed 13 digits`],
            minLength: [8, 'Phone must have at least 8 digits'],
            trim: true
        },
        role: {
            type: String,
            enum: ['ADMIN'], // Solo permite el rol ADMIN
            default: 'ADMIN',
            immutable: true // No se puede modificar
        },
        status: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


userSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
};

export default model('User', userSchema);
