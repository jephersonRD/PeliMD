import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard = ({ movie, size = 'medium' }: MovieCardProps) => {
  const sizeClasses = {
    small: 'w-32 h-48 sm:w-40 sm:h-60',
    medium: 'w-40 h-60 sm:w-48 sm:h-72',
    large: 'w-48 h-72 sm:w-56 sm:h-80',
  };

  const imageSrc = getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average.toFixed(1);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`group relative ${sizeClasses[size]} flex-shrink-0 rounded-xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}
    >
      {/* Imagen del póster */}
      <img
        src={imageSrc}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=Sin+Imagen';
        }}
      />

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Contenido del overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-yellow-500 font-semibold text-sm">{rating}</span>
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-2">
          {movie.title}
        </h3>

        {/* Año de estreno */}
        <p className="text-gray-400 text-xs">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Sin fecha'}
        </p>

        {/* Botón play */}
        <div className="mt-3 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Badge de rating */}
      <div className="absolute top-2 right-2 bg-dark-950/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="text-yellow-500 font-semibold text-xs">{rating}</span>
      </div>

      {/* Efecto de brillo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </Link>
  );
};

export default MovieCard;
