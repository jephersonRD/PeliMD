import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, Play, ArrowLeft, Share2, Heart, Bookmark, X } from 'lucide-react';
import { MovieDetails, Cast, Video } from '../types/movie';
import { getImageUrl, getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies } from '../services/api';
import MovieSection from '../components/MovieSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../types/movie';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const movieId = parseInt(id, 10);
        const [details, credits, videosData, similar] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getSimilarMovies(movieId),
        ]);

        setMovie(details);
        setCast(credits.cast.slice(0, 10));
        setVideos(videosData.results.filter((v) => v.site === 'YouTube').slice(0, 3));
        setSimilarMovies(similar.results);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Error al cargar los detalles de la película.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    // Scroll al inicio al cargar
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Película no encontrada'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);
  const trailer = videos.find((v) => v.type === 'Trailer') || videos[0];

  // Formatear runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero con backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=PeliMD';
            }}
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/50 to-transparent" />

        {/* Botón volver */}
        <Link
          to="/"
          className="absolute top-24 left-4 sm:left-8 z-20 inline-flex items-center gap-2 bg-dark-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-8 lg:px-16 pb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Póster */}
              <div className="hidden lg:block flex-shrink-0">
                <div className="w-64 xl:w-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=Sin+Imagen';
                    }}
                  />
                </div>
              </div>

              {/* Información */}
              <div className="flex-1">
                {/* Título */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                {/* Título original si es diferente */}
                {movie.original_title !== movie.title && (
                  <p className="text-gray-400 text-sm mb-4">
                    Título original: {movie.original_title}
                  </p>
                )}

                {/* Tagline */}
                {movie.tagline && (
                  <p className="text-gray-300 text-lg italic mb-4">"{movie.tagline}"</p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-dark-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-yellow-500 font-semibold">{rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{releaseYear}</span>
                  </div>
                  {movie.runtime > 0 && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                    HD
                  </span>
                </div>

                {/* Géneros */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-dark-800/80 backdrop-blur-sm text-gray-300 rounded-full text-sm hover:bg-primary-500/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Descripción */}
                <p className="text-gray-300 text-base lg:text-lg mb-8 max-w-3xl line-clamp-4 lg:line-clamp-none">
                  {movie.overview || 'Sin descripción disponible.'}
                </p>

                {/* Botones de acción */}
                <div className="flex flex-wrap gap-4">
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Ver Trailer
                    </button>
                  )}
                  <button className="inline-flex items-center gap-2 bg-dark-800/80 hover:bg-dark-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                    <Heart className="w-5 h-5" />
                    Favorito
                  </button>
                  <button className="inline-flex items-center gap-2 bg-dark-800/80 hover:bg-dark-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                    <Bookmark className="w-5 h-5" />
                    Guardar
                  </button>
                  <button className="inline-flex items-center gap-2 bg-dark-800/80 hover:bg-dark-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido inferior */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 py-12">
        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 relative">
              Reparto Principal
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-primary rounded-full"></span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex-shrink-0 w-28 sm:w-32 text-center"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden mb-2 ring-2 ring-dark-700 hover:ring-primary-500 transition-all duration-300">
                    <img
                      src={getImageUrl(actor.profile_path, 'w500')}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/200x200/1a1a2e/ffffff?text=👤';
                      }}
                    />
                  </div>
                  <p className="text-white text-sm font-medium truncate">{actor.name}</p>
                  <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Información adicional */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 relative">
            Información
            <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-primary rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Estado</h3>
              <p className="text-white font-medium">{movie.status || 'N/A'}</p>
            </div>
            <div className="bg-dark-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Idioma Original</h3>
              <p className="text-white font-medium uppercase">{movie.original_language || 'N/A'}</p>
            </div>
            <div className="bg-dark-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Votos</h3>
              <p className="text-white font-medium">{movie.vote_count.toLocaleString()}</p>
            </div>
            {movie.budget > 0 && (
              <div className="bg-dark-900 rounded-xl p-6">
                <h3 className="text-gray-400 text-sm mb-2">Presupuesto</h3>
                <p className="text-white font-medium">${movie.budget.toLocaleString()}</p>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="bg-dark-900 rounded-xl p-6">
                <h3 className="text-gray-400 text-sm mb-2">Recaudación</h3>
                <p className="text-white font-medium">${movie.revenue.toLocaleString()}</p>
              </div>
            )}
          </div>
        </section>

        {/* Películas similares */}
        {similarMovies.length > 0 && (
          <section>
            <MovieSection
              title="Películas Similares"
              movies={similarMovies}
              size="medium"
            />
          </section>
        )}
      </div>

      {/* Modal del trailer */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-dark-950/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-primary-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative pt-[56.25%] bg-dark-900 rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
