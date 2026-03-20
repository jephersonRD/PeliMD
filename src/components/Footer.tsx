import { Film, Heart, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Peli<span className="text-primary-500">MD</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Tu plataforma favorita para descubrir películas. Explora las mejores películas, 
              descubre tendencias y encuentra tu próxima película favorita.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/?section=trending" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Tendencias
                </Link>
              </li>
              <li>
                <Link to="/?section=top-rated" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Mejor Valoradas
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Buscar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?genre=28" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Acción
                </Link>
              </li>
              <li>
                <Link to="/?genre=35" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Comedia
                </Link>
              </li>
              <li>
                <Link to="/?genre=18" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/?genre=878" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
                  Ciencia Ficción
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} PeliMD. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-primary-500 fill-primary-500" /> usando TMDb API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
