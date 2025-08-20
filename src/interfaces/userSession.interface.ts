//src/interfaces/userSession.interface.ts
export interface UserSessionInterface {
    token: string;
    login?: boolean;
    user:{
        name: string;
        email: string;
        id: number;
        orders: [];
        role: string;
        phone: string;
        address: string;
    };
}