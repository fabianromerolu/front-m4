//src/interfaces/Product.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    stock: number;
    categoryId: number;
    image: string;
    price: number;
}

interface ICategory {
    name: string;
    number: number;
}

export const categoriesName: ICategory[] = [
    { number:1, name: 'Smartphones' },
    { number:2, name: 'Laptops' },
    { number:3, name: 'Tablets' },
    { number:4, name: 'Headphones' },
    { number:5, name: 'Cameras' },
    { number:6, name: 'Printers' },
    { number:7, name: 'Monitors' },
    { number:8, name: 'Storage' },
    { number:9, name: 'Accessories' }
];

// --- Mapeo O(1) de id -> nombre
export const categoriesMap = categoriesName.reduce<Record<number, string>>(
  (acc, c) => {
    acc[c.number] = c.name;
    return acc;
  },
  {}
);
// --- Helper seguro: devuelve el nombre o "Sin categoría"
export function getCategoryName(id: number | null | undefined): string {
  if (typeof id !== "number") return "Sin categoría";
  return categoriesMap[id] ?? "Sin categoría";
}
