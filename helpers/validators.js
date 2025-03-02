import { body } from "express-validator"
import { validateError } from "./validate.error.js"
import { existUsername, existEmail } from "./db.validators.js"

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty().trim(),
    body('surname', 'Surname cannot be empty').notEmpty().trim(),
    body('email', 'Email cannot be empty or is not valid')
        .notEmpty()
        .isEmail()
        .custom(existEmail)
        .normalizeEmail(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .isLength({ max: 15 })
        .custom(existUsername)
        .trim()
        .toLowerCase(),
    body('password', 'Password must be at least 8 characters and strong')
        .notEmpty()
        .isLength({ min: 8 })
        .isStrongPassword()
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol'),
    body('phone', 'Phone cannot be empty or is not valid')
        .notEmpty()
        .isLength({ min: 8, max: 13 }),
    validateError
];

export const loginValidator = [
    body('userLoggin', 'Username or email cannot be empty')
        .notEmpty()
        .trim(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isLength({ min: 8 }),
    validateError
];

export const companyValidator = [
    body('name', 'Company name cannot be empty').notEmpty().trim(),
    body('description', 'Description cannot be empty').notEmpty().trim().isLength({ max: 300 }),
    body('impactLevel', 'Invalid impact level').isIn(['Low', 'Medium', 'High']).optional(),
    body('yearsOfExperience', 'Years of experience must be a positive number')
        .isInt({ min: 0 })
        .withMessage('Years of experience cannot be negative'),
    body('category', 'Invalid category')
        .isIn(['Technology', 'Food & Beverage', 'Fashion', 'Automotive', 'Health & Wellness'])
        .withMessage('Category must be one of: Technology, Food & Beverage, Fashion, Automotive, Health & Wellness'),
    body('contactEmail', 'Invalid email format')
        .notEmpty()
        .isEmail()
        .normalizeEmail(),
    body('phone', 'Phone must be between 8 and 13 digits')
        .notEmpty()
        .isLength({ min: 8, max: 13 }),
    body('address', 'Address cannot be empty').notEmpty().trim(),
    body('website', 'Invalid website URL')
        .optional()
        .matches(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(:\d+)?(\/.*)?$/),
    validateError
];