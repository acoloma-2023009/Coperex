import { Router } from 'express'
import { 
    login,
    registerAdmin,
 } from './auth.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.error.js'

const api = Router()

//Rutas públicas

api.post(
    '/register', 
    [
        registerValidator,
        validateJwt,
        isAdmin,
        deleteFileOnError
    ], 
    registerAdmin
)
api.post(
    '/login', 
    [
        loginValidator
    ], 
    login
)

export default api