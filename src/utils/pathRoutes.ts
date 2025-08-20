//src/utils/pathRoutes.ts
const PATHROUTES = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    CART: "/cart",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTID: (id: number | string) => `/product/${id}`,
}


export default PATHROUTES