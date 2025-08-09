export interface Product {
    id: number;   // Unique identifier for the product
    name: string; // Name of the product
    description: string; // Description of the product
    stock: number; // Number of items in stock
    categoryId: number; // Category of the product
    image: string; // URL of the product image
    price: number; // Price of the product
}