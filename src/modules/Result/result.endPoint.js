import { roles } from '../../middleware/Auth.js';

export const endPoint = {
  add: [roles.Doctor],
  get: [roles.Doctor],

};
