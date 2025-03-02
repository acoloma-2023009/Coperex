import Company from '../company/company.model.js'
import ExcelJS from 'exceljs'
import express from 'express'
const { Response } = express
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export const registerCompany = async (req, res) => {
    try {
        let data = req.body
        if (!Company.schema.path('category').enumValues.includes(data.category)) {
            return res.status(400).send({ message: 'Invalid category. Allowed categories: ' + Company.schema.path('category').enumValues.join(', ') })
        }
        let existingCompany = await Company.findOne({ name: data.name })
        if (existingCompany) return res.status(400).send({ message: 'Company name already exists' })
        let company = new Company(data);
        await company.save();
        return res.status(201).send({ message: 'Company registered successfully', company })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error during company registration', error: err.message })
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body
        if (data.category && !Company.schema.path('category').enumValues.includes(data.category)) {
            return res.status(400).send({ message: 'Invalid category. Allowed categories: ' + Company.schema.path('category').enumValues.join(', ') });
        }
        let updatedCompany = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!updatedCompany) return res.status(404).send({ message: 'Company not found' })
        return res.status(200).send({ message: 'Company updated successfully', updatedCompany })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error during company update', error: err.message })
    }
}

export const getCompanies = async (req, res) => {
    try {
        let { category, years, sort, impact } = req.query;
        let filter = {};
        
        if (category) {
            if (!Company.schema.path('category').enumValues.includes(category)) {
                return res.status(400).send({ message: 'Invalid category filter. Allowed categories: ' + Company.schema.path('category').enumValues.join(', ') });
            }
            filter.category = category;
        }
        if (years) {
            const yearsParsed = parseInt(years);
            if (!isNaN(yearsParsed)) {
                filter.yearsOfExperience = { $gte: yearsParsed };
            }
        }
        if (impact) {
            if (!['Low', 'Medium', 'High'].includes(impact)) {
                return res.status(400).send({ message: 'Invalid impact level. Allowed values: Low, Medium, High' });
            }
            filter.impactLevel = impact;
        }
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'A-Z':
                    sortOption.name = 1;
                    break;
                case 'Z-A':
                    sortOption.name = -1;
                    break;
                case 'years':
                    sortOption.yearsOfExperience = 1;
                    break;
                case '-years':
                    sortOption.yearsOfExperience = -1;
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid sort option. Allowed values: A-Z, Z-A, years, -years' });
            }
        }
        let companies = await Company.find(filter).sort(sortOption);
        return res.status(200).send({ message: 'Companies retrieved successfully', companies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error while retrieving companies', error: err.message });
    }
}

export const generateExcelReport = async (req, res = Response) => {
    try {
        const companies = await Company.find();
        if (companies.length === 0) {
            return res.status(404).send({ message: 'No companies found to generate a report' });
        }
        const sanitize = (value) => {
            return typeof value === 'string' ? value.replace(/[<>"'/]/g, '') : value;
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Companies');
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Impact Level', key: 'impactLevel', width: 15 },
            { header: 'Years of Experience', key: 'yearsOfExperience', width: 20 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Contact Email', key: 'contactEmail', width: 25 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Address', key: 'address', width: 30 },
            { header: 'Website', key: 'website', width: 30 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ]
        companies.forEach(company => {
            worksheet.addRow({
                name: sanitize(company.name),
                description: sanitize(company.description),
                impactLevel: sanitize(company.impactLevel),
                yearsOfExperience: company.yearsOfExperience,
                category: sanitize(company.category),
                contactEmail: sanitize(company.contactEmail),
                phone: sanitize(company.phone),
                address: sanitize(company.address),
                website: sanitize(company.website),
                createdAt: company.createdAt.toISOString()
            })
        })
        // Ruta donde se guardará el archivo en /src/reports
        const reportsDir = path.join(__dirname, '../reports')
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        const filePath = path.join(reportsDir, 'companies_report.xlsx');
        await workbook.xlsx.writeFile(filePath);
        res.download(filePath, 'companies_report.xlsx');
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error generating the Excel report', error: err.message });
    }
}
