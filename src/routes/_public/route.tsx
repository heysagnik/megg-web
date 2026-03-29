import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PublicLayout() {
  const navigation = useNavigation();
  const isLoading  = navigation.state === 'loading';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global route-transition progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: 'var(--color-black)', zIndex: 9999,
        transformOrigin: 'left',
        transform: isLoading ? 'scaleX(0.7)' : 'scaleX(0)',
        opacity: isLoading ? 1 : 0,
        transition: isLoading
          ? 'transform 3s cubic-bezier(0.1,0.05,0,1)'
          : 'opacity 250ms ease, transform 0s',
        pointerEvents: 'none',
      }} />

      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
