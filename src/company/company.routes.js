import { Router } from 'express';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';
import { getCompanies, registerCompany, updateCompany, generateExcelReport } from './company.controller.js';
import { companyValidator } from '../../helpers/validators.js';

const api = Router();

api.post('/',
    [
        validateJwt,
        isAdmin,
        companyValidator
    ], 
    registerCompany
);

api.put('/:id',
    [
        validateJwt,
        isAdmin,
        companyValidator
    ], 
    updateCompany
);

api.get('/',
    [
        validateJwt,
        isAdmin 
    ],
    getCompanies
);
api.get('/report',
    [
        validateJwt,
        isAdmin
    ],
    generateExcelReport
);

export default api;
