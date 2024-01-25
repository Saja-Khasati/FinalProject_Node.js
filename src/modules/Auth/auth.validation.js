import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';


export const signupSchema = {
    body: joi.object({
        
    name:joi.string().alphanum().required(),
    email:generalFields.email,
    gender:joi.string().valid('Male','Female'),
    phoneNumber:joi.string().required(),
    age:joi.number().integer().min(20).max(80).required(),
    password:generalFields.password,
    address: joi.string(), 
    role:joi.string().valid('Doctor', 'Patient'),
    }),
    
}
export const signinSchema = joi.object({
    email:generalFields.email,
    password:generalFields.password,
   
});