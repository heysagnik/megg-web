import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

/* ── Layout ── */
import PublicLayout from './routes/_public/route';

/* ── Route modules ── */
import { default as Home,         loader as homeLoader }     from './routes/_public/_index/route';
import { default as ProductsPage, loader as productsLoader } from './routes/_public/products/route';
import { default as ProductPage,  loader as productLoader }  from './routes/_public/product/[productId]/route';
import { default as SearchPage }                             from './routes/_public/search/route';
import { default as OutfitPage,   loader as outfitLoader }  from './routes/_public/outfit/[outfitId]/route';
import { default as CategoryPage, loader as categoryLoader } from './routes/_public/category/[category]/route';
import { default as About }                                  from './routes/_public/about/route';
import { default as Privacy }                                from './routes/_public/privacy/route';
import { default as Terms }                                  from './routes/_public/terms/route';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true,                   element: <Home />,         loader: homeLoader     },
      { path: 'about',                 element: <About />                                },
      { path: 'products',              element: <ProductsPage />, loader: productsLoader },
      { path: 'search',                element: <SearchPage />                           },
      { path: 'product/:productId',    element: <ProductPage />,  loader: productLoader  },
      { path: 'outfit/:outfitId',      element: <OutfitPage />,   loader: outfitLoader   },
      { path: 'category/:category',    element: <CategoryPage />, loader: categoryLoader },
      { path: 'privacy',               element: <Privacy />                              },
      { path: 'terms',                 element: <Terms />                                },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
