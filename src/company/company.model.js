import { Schema, model } from 'mongoose';

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            unique: true,
            trim: true,
            maxLength: [50, `Can't exceed 50 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxLength: [300, `Can't exceed 300 characters`]
        },
        impactLevel: {
            type: String,
            required: [true, 'Impact level is required'],
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        yearsOfExperience: {
            type: Number,
            required: [true, 'Years of experience are required'],
            min: [0, 'Years of experience cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Technology', 'Food & Beverage', 'Fashion', 'Automotive', 'Health & Wellness'],
            trim: true
        },
        contactEmail: {
            type: String,
            required: [true, 'Contact email is required'],
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            maxLength: [13, `Can't exceed 13 digits`],
            minLength: [8, 'Phone must have at least 8 digits'],
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        website: {
            type: String,
            trim: true,
            match: [/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(:\d+)?(\/.*)?$/, 'Invalid website URL']
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

export default model('Company', companySchema)
