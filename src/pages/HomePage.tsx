import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieSection from '../components/MovieSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { Movie } from '../types/movie';
import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
} from '../services/api';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  // Cargar todas las películas
  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const [popular, trending, topRated, nowPlaying] = await Promise.all([
          getPopularMovies(),
          getTrendingMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
        ]);

        setPopularMovies(popular.results);
        setTrendingMovies(trending.results);
        setTopRatedMovies(topRated.results);
        setNowPlayingMovies(nowPlaying.results);

        // Usar películas populares para el hero
        setHeroMovies(popular.results.slice(0, 5));
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Error al cargar las películas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  // Manejar scroll a secciones
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Banner */}
      <Hero movies={heroMovies} loading={loading} />

      {/* Secciones de películas */}
      <div className="relative z-10 -mt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tendencias de la semana */}
          <section id="trending" className="scroll-mt-20">
            <MovieSection
              title="🔥 Tendencias de la Semana"
              movies={trendingMovies}
              loading={loading}
              size="large"
            />
          </section>

          {/* Películas populares */}
          <section id="popular" className="scroll-mt-20">
            <MovieSection
              title="⭐ Películas Populares"
              movies={popularMovies}
              loading={loading}
              size="medium"
            />
          </section>

          {/* Mejor valoradas */}
          <section id="top-rated" className="scroll-mt-20">
            <MovieSection
              title="🏆 Mejor Valoradas"
              movies={topRatedMovies}
              loading={loading}
              size="medium"
            />
          </section>

          {/* En cines */}
          <section id="now-playing" className="scroll-mt-20">
            <MovieSection
              title="🎬 En Cines"
              movies={nowPlayingMovies}
              loading={loading}
              size="medium"
            />
          </section>

          {/* Sección de categorías */}
          {!loading && (
            <section className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 relative">
                Explorar por Género
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-primary rounded-full"></span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Acción', color: 'from-red-600 to-red-900', emoji: '💥' },
                  { name: 'Comedia', color: 'from-yellow-600 to-yellow-900', emoji: '😂' },
                  { name: 'Drama', color: 'from-purple-600 to-purple-900', emoji: '🎭' },
                  { name: 'Terror', color: 'from-gray-700 to-gray-900', emoji: '👻' },
                  { name: 'Ciencia Ficción', color: 'from-blue-600 to-blue-900', emoji: '🚀' },
                  { name: 'Romance', color: 'from-pink-600 to-pink-900', emoji: '❤️' },
                ].map((genre) => (
                  <button
                    key={genre.name}
                    className={`bg-gradient-to-br ${genre.color} p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-black/30`}
                  >
                    <span className="text-3xl block mb-2">{genre.emoji}</span>
                    <span className="text-white font-medium text-sm">{genre.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && <LoadingSpinner fullScreen />}
    </div>
  );
};

export default HomePage;
