import {roles} from '../../middleware/Auth.js'


export const endPoint = {
    get: [roles.Doctor,roles.Patient],
    create: [roles.Patient],
    remove: [roles.Patient,roles.Doctor],
}