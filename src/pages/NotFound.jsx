import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <i className="ri-compass-discover-line text-amber-500 text-4xl"></i>
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          404
        </h1>
        <p className="text-lg text-gray-600 mb-2">Page non trouvée</p>
        <p className="text-sm text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default NotFound;