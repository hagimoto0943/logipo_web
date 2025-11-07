import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from '@components/app/Sidebar';
import { MobileHeader } from '@components/app/MobileHeader';
import { useState, useEffect } from 'react';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    if (location.pathname.startsWith('/app/dashboard')) {
      setCurrentView('dashboard');
    } else if (location.pathname.startsWith('/app/reviews/new')) {
      setCurrentView('editor');
    } else if (location.pathname.startsWith('/app/reviews')) {
      setCurrentView('history');
    } else if (location.pathname.startsWith('/app/account')) {
      setCurrentView('account');
    } else {
      setCurrentView('dashboard');
    }
  }, [location.pathname]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    switch (view) {
      case 'dashboard':
        navigate('/app/dashboard');
        break;
      case 'editor':
        navigate('/app/reviews/new');
        break;
      case 'history':
        navigate('/app/reviews');
        break;
      case 'account':
        navigate('/app/account');
        break;
      default:
        navigate('/app/dashboard');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader currentView={currentView} onViewChange={handleViewChange} />
      
      {/* Desktop Sidebar */}
      <AppSidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        // AppSidebar also has isCollapsed and onToggleCollapse props,
        // but they are not directly managed by MobileHeader in the Figma design.
        // For now, we'll omit them or assume AppSidebar manages its own collapse state.
      />
      
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



