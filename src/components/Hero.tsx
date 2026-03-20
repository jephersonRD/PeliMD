import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/api';

interface HeroProps {
  movies: Movie[];
  loading?: boolean;
}

const Hero = ({ movies, loading = false }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotar películas cada 6 segundos
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length, currentIndex]);

  const goToNext = () => {
    if (isTransitioning || movies.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning || movies.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading || movies.length === 0) {
    return (
      <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] bg-dark-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16">
          <div className="container mx-auto">
            <div className="h-10 w-64 bg-dark-700 rounded mb-4" />
            <div className="h-4 w-96 bg-dark-700 rounded mb-2" />
            <div className="h-4 w-80 bg-dark-700 rounded mb-6" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-dark-700 rounded-lg" />
              <div className="h-12 w-32 bg-dark-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = getImageUrl(currentMovie.backdrop_path, 'original');
  const releaseYear = currentMovie.release_date
    ? new Date(currentMovie.release_date).getFullYear()
    : 'N/A';
  const rating = currentMovie.vote_average.toFixed(1);

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <img
          src={backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=PeliMD';
          }}
        />
      </div>

      {/* Overlays de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-dark-950/30" />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-2xl">
            {/* Badge de película destacada */}
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/50 rounded-full px-4 py-1 mb-4">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-primary-400 text-sm font-medium">Destacada</span>
            </div>

            {/* Título */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {currentMovie.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 font-semibold">{rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
              <span className="px-3 py-1 bg-dark-800/80 rounded text-sm text-gray-300">
                HD
              </span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded text-sm">
                Subtitulada
              </span>
            </div>

            {/* Descripción */}
            <p
              className={`text-gray-300 text-sm sm:text-base lg:text-lg mb-8 line-clamp-3 transition-all duration-500 delay-100 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {currentMovie.overview || 'Sin descripción disponible para esta película.'}
            </p>

            {/* Botones de acción */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-500 delay-200 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <Link
                to={`/movie/${currentMovie.id}`}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
              >
                <Play className="w-5 h-5 fill-white" />
                Ver Ahora
              </Link>
              <Link
                to={`/movie/${currentMovie.id}`}
                className="inline-flex items-center gap-2 bg-dark-800/80 hover:bg-dark-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Info className="w-5 h-5" />
                Más Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary-500'
                : 'w-4 bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Botones de navegación laterales */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-dark-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-primary-500"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-dark-900/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-primary-500"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Hero;
