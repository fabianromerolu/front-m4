// front/src/utils/productsFetcher.utils.ts

import { Product } from "@/interfaces/Product";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
/**
 * fetchProducts
 * -------------
 * Realiza una petición GET al endpoint /products para obtener
 * el listado completo de productos.
 *
 * @returns Promise<Product[]> arreglo de productos
 * @throws Error si la petición falla o devuelve un status != 2xx
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      method: "GET",
    });

    // 1. Verificar que la respuesta sea exitosa (status 200–299)
    if (!res.ok) {
      // Lanza un error con el código de estado
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 2. Parsear JSON en el tipo Product[]
    const products: Product[] = await res.json();
    return products;
  } catch (error: unknown) {
    // 3. Manejo genérico de errores de red o parsing
    //    error puede ser Error u otro tipo, por eso lo convertimos a string
    const message =
      error instanceof Error
        ? error.message
        : String(error);
    throw new Error(`fetchProducts falló: ${message}`);
  }
};

/**
 * fetchProductById
 * ----------------
 * Obtiene un único producto a partir de su ID.
 * Actualmente reutiliza fetchProducts para no duplicar lógicas,
 * pero idealmente podrías exponer un endpoint /products/:id.
 *
 * @param id ID del producto como string
 * @returns Promise<Product> objeto Product
 * @throws Error si no encuentra el producto o falla la petición
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    // 1. Traer todo el catálogo
    const products = await fetchProducts();

    // 2. Buscar el producto cuyo id coincida (convertimos ambos a string)
    const product = products.find((p) => p.id.toString() === id);

    // 3. Si no lo encuentra, lanzamos error específico
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    return product;
  } catch (error: unknown) {
    // 4. Si falló fetchProducts o la búsqueda, pasamos mensaje claro
    const message =
      error instanceof Error
        ? error.message
        : String(error);
    throw new Error(`fetchProductById falló: ${message}`);
  }
};
