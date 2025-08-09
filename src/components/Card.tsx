import { Product } from "@/interfaces/Product";
import PATHROUTES from "@/utils/pathRoutes";
import Image from "next/image";
import Link from "next/link";

function Card({ product }: { product: Product }) {
  return (
    <div className="border-2 border-[var(--color-crema)] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white hover:bg-[var(--color-crema)]/10 group">
      <Link href={PATHROUTES.PRODUCTID(product.id)}>
      
      {/* Imagen con efecto hover */}
      <div className="relative overflow-hidden rounded-t-xl h-60 w-full">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge de stock */}
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-[var(--color-rosa)] text-white text-xs px-2 py-1 rounded-full">
            ¡Últimas {product.stock} unidades!
          </span>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-[var(--color-morado)] group-hover:text-[var(--color-rosa)] transition-colors duration-300">
          {product.name}
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>

        <div className="mt-4 mb-2 flex items-center justify-between">
          <span className="text-2xl font-bold text-[var(--color-morado)]">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.stock > 5 
              ? 'bg-green-100 text-green-800' 
              : 'bg-[var(--color-rosa)]/20 text-rosa'
          }`}>
            {product.stock > 5 ? 'Disponible' : 'Pocas unidades'}
          </span>
        </div>
      </div>
      </Link>
    </div>
  );
}

export default Card;