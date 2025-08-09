//esta es la estructura en la que mi back me responde al momento de loguearme
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