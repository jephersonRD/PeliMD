import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, ArrowLeft, SearchX } from 'lucide-react';
import { Movie } from '../types/movie';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Función de búsqueda
  const performSearch = useCallback(async (searchQuery: string, pageNum: number = 1, append: boolean = false) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchMovies(searchQuery, pageNum);
      
      if (append) {
        setMovies(prev => [...prev, ...response.results]);
      } else {
        setMovies(response.results);
      }
      
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Error al buscar películas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Búsqueda inicial si hay query en URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setPage(1);
      setSearchParams({ q: query.trim() });
      performSearch(query.trim(), 1, false);
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    setSearchParams({});
  };

  // Cargar más resultados
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(query, nextPage, true);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de búsqueda */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Buscar Películas
          </h1>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar películas por título..."
                className="w-full bg-dark-800 border-2 border-dark-700 focus:border-primary-500 rounded-xl py-4 pl-14 pr-14 text-lg text-white placeholder-gray-400 outline-none transition-all duration-300"
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div>
          {/* Info de resultados */}
          {hasSearched && !loading && (
            <div className="mb-6">
              <p className="text-gray-400">
                {totalResults > 0 ? (
                  <>
                    Se encontraron <span className="text-white font-semibold">{totalResults.toLocaleString()}</span> resultados para{' '}
                    <span className="text-primary-500 font-semibold">"{query}"</span>
                  </>
                ) : (
                  <>No se encontraron resultados para <span className="text-primary-500 font-semibold">"{query}"</span></>
                )}
              </p>
            </div>
          )}

          {/* Loading inicial */}
          {loading && movies.length === 0 && (
            <LoadingSpinner />
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={() => performSearch(query)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Sin resultados */}
          {hasSearched && !loading && movies.length === 0 && !error && (
            <div className="text-center py-16">
              <SearchX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No encontramos resultados
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Intenta con otros términos de búsqueda o verifica la ortografía.
              </p>
            </div>
          )}

          {/* Grid de películas */}
          {movies.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {movies.map((movie) => (
                  <div key={movie.id} className="flex justify-center">
                    <MovieCard movie={movie} size="medium" />
                  </div>
                ))}
              </div>

              {/* Botón cargar más */}
              {page < totalPages && (
                <div className="text-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-dark-800 hover:bg-dark-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Cargando...
                      </span>
                    ) : (
                      `Cargar más (${page} de ${totalPages})`
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Estado inicial - sin búsqueda */}
          {!hasSearched && !loading && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Busca tus películas favoritas
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Escribe el título de una película para comenzar la búsqueda.
              </p>

              {/* Sugerencias de búsqueda */}
              <div className="mt-8">
                <p className="text-gray-500 text-sm mb-4">Prueba buscando:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Avengers', 'Star Wars', 'Batman', 'Spider', 'Matrix'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setQuery(suggestion);
                        setSearchParams({ q: suggestion });
                        performSearch(suggestion);
                      }}
                      className="px-4 py-2 bg-dark-800 hover:bg-primary-500/30 text-gray-300 hover:text-white rounded-full text-sm transition-all duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
