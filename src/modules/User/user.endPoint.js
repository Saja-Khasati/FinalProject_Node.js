import { roles } from '../../middleware/Auth.js';

export const endPoint = {
  get: [roles.Doctor,roles.Patient],
  getSpecific:[roles.Doctor,roles.Patient],
  getPatient:[roles.Doctor],
  delete:[roles.Doctor],
  update:[roles.Doctor,roles.Patient]
 
};
