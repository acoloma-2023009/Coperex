import User from '../src/user/user.model.js'
import { encrypt } from '../utils/encrypt.js'

// Datos del administrador por defecto
const defaultAdmin = {
    name: 'Admin',
    surname: 'System',
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    password: 'Admin1234',
    phone: '12345678'
}

// Función para crear el admin si no existe
export const createDefaultAdmin = async () => {
    try {
        let adminExists = await User.findOne({ username: 'admin' })
        if (!adminExists) {
            defaultAdmin.password = await encrypt(defaultAdmin.password)
            let admin = new User(defaultAdmin);
            await admin.save();
            console.log('Default admin created successfully')
        } else {
            console.log('Default admin already exists')
        }
    } catch (err) {
        console.error('Error creating default admin:', err.message)
    }
}
