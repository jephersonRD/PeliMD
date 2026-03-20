import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieSection = ({ title, movies, loading = false, size = 'medium' }: MovieSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative py-6">
      {/* Título de la sección */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white relative">
          {title}
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-primary rounded-full"></span>
        </h2>
      </div>

      {/* Contenedor del carrusel */}
      <div className="relative group">
        {/* Botón izquierdo */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
            canScrollLeft
              ? 'opacity-0 group-hover:opacity-100 hover:bg-primary-500 hover:scale-110'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carrusel de películas */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? // Skeleton loading
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 ${size === 'small' ? 'w-32 h-48 sm:w-40 sm:h-60' : size === 'large' ? 'w-48 h-72 sm:w-56 sm:h-80' : 'w-40 h-60 sm:w-48 sm:h-72'} bg-dark-800 rounded-xl animate-pulse`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl" />
                </div>
              ))
            : movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size={size} />
              ))}
        </div>

        {/* Botón derecho */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
            canScrollRight
              ? 'opacity-0 group-hover:opacity-100 hover:bg-primary-500 hover:scale-110'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Gradientes laterales */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark-950 to-transparent pointer-events-none z-[5]" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark-950 to-transparent pointer-events-none z-[5]" />
      </div>
    </section>
  );
};

export default MovieSection;
