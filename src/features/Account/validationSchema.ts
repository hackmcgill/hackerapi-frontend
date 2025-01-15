import { array, object, string, number } from 'yup';

const getValidationSchema = (isCreate: boolean) => {
  const password = isCreate
    ? string().min(6, 'Must be at least 6 characters').required('Required')
    : string().when('newPassword', {
        is: (pass: string) => pass,
        then: (schema) => schema.required('Required to change password'),
        otherwise: (schema) => schema,
      });

  return object().shape({
    firstName: string().required('Required'),
    lastName: string().required('Required'),
    email: string().required('Required').email('Must be a valid email'),
    password,
    newPassword: string().min(6, 'Must be at least 6 characters'),
    pronoun: string(),
    gender: string(),
    dietaryRestrictions: array().of(string()),
    phoneNumber: string().test(
      'validPhone',
      'Must be a valid phone number',
      (value) => {
        const parsedValue = value?.replace(/\D/g, '');
        return !parsedValue || (parsedValue.length > 10 && parsedValue.length < 14);
      }
    ),
    age: number()
      .required('Required')
      .min(0, 'Age must be a positive number') // Minimum age
      .max(100, 'Age must be less than or equal to 100'), // Maximum age
  });
};

export default getValidationSchema;
