import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { TranslationProvider } from "./hooks/useTranslation.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import useSmoothScrollAnchor from "./hooks/useSmoothScrollAnchor.jsx";

function ScrollHandler() {
  useSmoothScrollAnchor();
  return null;
}

function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <ScrollHandler />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TranslationProvider>
  );
}

export default App;