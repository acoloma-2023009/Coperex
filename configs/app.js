//Configurar el servidor de express (HTTP)
'use strict'

// ECModules | ESModules
import express from 'express' 
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import authRoutes from '../src/auth/auth.routes.js'
import companyRoutes from '../src/company/company.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import { createDefaultAdmin } from '../configs/adminCreate.js'

const configs = (app)=>{
    app.use(express.json()) 
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/company', companyRoutes)
}

export const initServer = async()=>{
    const app = express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        await createDefaultAdmin()
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}