'use client';

import { useState } from 'react';
import { ContentProvider } from '../../context/ContentContext';
import { Navigation } from './Navigation';
import { Home } from './Home';
import { About } from './About';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Contact } from './Contact';

export function Website() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'services': return <Services />;
      case 'gallery': return <Gallery />;
      case 'contact': return <Contact />;
      default: return <Home />;
    }
  };

  return (
    <ContentProvider>
      <div className="min-h-screen bg-white">
        <Navigation activePage={activePage} setActivePage={setActivePage} />
        <main>{renderPage()}</main>
      </div>
    </ContentProvider>
  );
}