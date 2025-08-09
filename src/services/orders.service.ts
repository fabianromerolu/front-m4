const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const createOrder = async (products: number[], token: string ) => {
    //mi endponit solo espera un arreglo de IDs de productos
    try {
        const res = await fetch(`${apiUrl}/orders`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({products}), 
        });
        const orders = await res.json();
        return orders;
    } catch (error) {
        throw new Error(error as string);
    }
};

export const getAllOrders = async (token: string) => {
        try {
        const res = await fetch(`${apiUrl}/users/orders`,{
            method: 'GET',
            cache: 'no-cache',
            headers:{
                Authorization: token,
            }
        });
        const orders = await res.json();
        return orders;
    } catch (error) {
        throw new Error(error as string);
    }
}