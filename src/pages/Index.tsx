
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GoogleAuth from '@/components/GoogleAuth';
import SchoolSelectionNew from '@/components/SchoolSelectionNew';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'schools' | 'dashboard'>('schools');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleSchoolSelect = (school: any) => {
    setSelectedSchool(school);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setSelectedSchool(null);
    setCurrentView('schools');
  };

  const handleBackToSchools = () => {
    setSelectedSchool(null);
    setCurrentView('schools');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <GoogleAuth />;
  }

  return (
    <div className="min-h-screen">
      {currentView === 'schools' && (
        <SchoolSelectionNew onSchoolSelect={handleSchoolSelect} />
      )}
      
      {currentView === 'dashboard' && selectedSchool && (
        <Dashboard 
          trainer={user.user_metadata?.full_name || user.email || 'User'}
          trainerEmail={user.email || ''}
          school={selectedSchool}
          onLogout={handleLogout}
          onBackToSchools={handleBackToSchools}
        />
      )}
    </div>
  );
};

export default Index;
