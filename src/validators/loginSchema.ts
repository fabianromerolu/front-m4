import * as Yup from 'yup'


//definición de la interfaz
export interface LoginFormVlaues {
    email: string;
    password: string;
}

//valores inicales del formulario
export const loginInitialValues: LoginFormVlaues = {
    email: "",
    password: "",
}

//esquema de validaciones (aquí entra yup)
export const loginValidationSchema = Yup.object({
   email: Yup.string()
   .email('Correo electronico invalido')
   .required('el correo electronico es obligatorio'),
   password: Yup.string()
   .min(6, 'La contraseña debe tener al menos 6 caracteres')
   .required('La contraseña es requerida')
})