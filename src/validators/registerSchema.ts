//front/src/validators/registerSchema.ts
import * as yup from 'yup';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  address: string;
  phone: string;
}

export const registerInitialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
  address: '',
  phone: '',
};

const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

export const registerValidationSchema = yup.object({
  name: yup.string().required('El nombre es requerido').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string()
    .required('La contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
  terms: yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
    .required('Debes aceptar los términos'),
  address: yup.string().required("La dirección es requerida."),
  phone: yup.string()
    .matches(phoneRegExp, "El número de teléfono no es valido Ej: +573112708453")
    .required("El número de teléfono es requerido"),
});