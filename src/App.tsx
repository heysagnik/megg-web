import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import OutfitPage from './pages/OutfitPage';
import CategoryPage from './pages/CategoryPage';
import ProductsPage from './pages/ProductsPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="outfit/:outfitId" element={<OutfitPage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
