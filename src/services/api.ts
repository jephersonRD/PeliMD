// Servicio API para TMDb
// Documentación: https://developers.themoviedb.org/3

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjM2NWNhYzZiZGZkNjFkYmNmNTY1YTU2ZDQ5MTBkMyIsIm5iZiI6MTc3Mzk2ODMxOC45MzkwMDAxLCJzdWIiOiI2OWJjOWJiZWI0NzY4ZDZkMTBlYTM2OGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.5_E2v3hQxs1wrFsOft1ejTtTYOV_3qFfMv0iWWZlCY0';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// URLs de imágenes
export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Headers para autenticación (método Bearer Token)
const getHeaders = () => ({
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
});

// Función genérica para hacer peticiones
const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    language: 'es-ES',
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams}`;

  console.log('Fetching from TMDb:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDb API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url
      });
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
};

// Obtener películas populares
export const getPopularMovies = async (page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/movie/popular', { page: String(page) });
};

// Obtener películas en tendencia (semanal)
export const getTrendingMovies = async (page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/trending/movie/week', { page: String(page) });
};

// Obtener películas mejor valoradas
export const getTopRatedMovies = async (page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/movie/top_rated', { page: String(page) });
};

// Obtener películas que se están proyectando
export const getNowPlayingMovies = async (page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/movie/now_playing', { page: String(page) });
};

// Obtener próximos estrenos
export const getUpcomingMovies = async (page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/movie/upcoming', { page: String(page) });
};

// Buscar películas
export const searchMovies = async (query: string, page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/search/movie', { 
    query,
    page: String(page),
    include_adult: 'false'
  });
};

// Obtener detalles de una película
export const getMovieDetails = async (movieId: number) => {
  return fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
};

// Obtener créditos de una película
export const getMovieCredits = async (movieId: number) => {
  return fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
};

// Obtener videos de una película (trailers)
export const getMovieVideos = async (movieId: number) => {
  return fetchFromTMDB<VideoResponse>(`/movie/${movieId}/videos`);
};

// Obtener películas similares
export const getSimilarMovies = async (movieId: number, page: number = 1) => {
  return fetchFromTMDB<MovieResponse>(`/movie/${movieId}/similar`, { page: String(page) });
};

// Obtener películas por género
export const getMoviesByGenre = async (genreId: number, page: number = 1) => {
  return fetchFromTMDB<MovieResponse>('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc'
  });
};

// Géneros de películas
export const getGenres = async () => {
  return fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
};

// Importar el tipo Genre
import { Genre, MovieResponse, MovieDetails, Credits, VideoResponse } from '../types/movie';
