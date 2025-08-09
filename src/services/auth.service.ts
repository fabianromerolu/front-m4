//front/src/utils/auth.util.ts
import { LoginFormVlaues } from "@/validators/loginSchema";
import { RegisterFormValues } from "@/validators/registerSchema";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const RegisterUser = async (userData: RegisterFormValues) => {
    try {
        const res = await fetch(`${apiUrl}/users/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        });
        if(res.ok){
            return res.json()
        }else{
            alert("Ups!, esto no funciona")
            throw new Error('Registro fallido')
        }
    } catch (error: any) {
        throw new Error(error);
    }
}

export const LoginUser = async (userData: LoginFormVlaues) => {
    try {
        const res = await fetch(`${apiUrl}/users/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        })
                if(res.ok){
            return res.json()
        }else{
            alert("Ups!, esto no funciona")
            throw new Error('Login fallido')
        }
    } catch (error: any) {
        throw new Error(error);
    }
}