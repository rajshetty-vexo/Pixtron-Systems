import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { ArrowRight,ArrowLeft } from 'lucide-react';
import type { ProductDetail } from '../data/productsData';

interface ProductHubProps {
  product: ProductDetail;
  subProducts: ProductDetail[];
}

export const ProductHub: React.FC<ProductHubProps> = ({ product, subProducts }) => {
  return (
    <main className="pt-28 sm:pt-36 pb-24 bg-white min-h-screen">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to={`/products?suite=${product.suite}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
      <section className="max-w-4xl mx-auto px-4 text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PixtronArrows size={14} />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {product.category}
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4">
          {product.name}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {product.description}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {subProducts.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/products/${sub.id}`}
                className="group flex flex-col h-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-primary/30 transition-all"
              >
                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
                  {sub.subtitle}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mb-3">{sub.name}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{sub.description}</p>
                <span className="inline-flex items-center gap-2 text-primary font-bold text-sm">
                  Explore {sub.name}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProductHub;