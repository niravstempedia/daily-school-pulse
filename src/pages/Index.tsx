
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SchoolSelection from '../components/SchoolSelection';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'schools' | 'dashboard'>('login');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleLogin = (trainerName: string) => {
    setSelectedTrainer(trainerName);
    setCurrentView('schools');
  };

  const handleSchoolSelect = (school: any) => {
    setSelectedSchool(school);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setSelectedTrainer('');
    setSelectedSchool(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentView === 'login' && (
        <LoginForm onLogin={handleLogin} />
      )}
      
      {currentView === 'schools' && (
        <SchoolSelection 
          trainerName={selectedTrainer} 
          onSchoolSelect={handleSchoolSelect}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'dashboard' && selectedSchool && (
        <Dashboard 
          trainer={selectedTrainer}
          school={selectedSchool}
          onLogout={handleLogout}
          onBackToSchools={() => setCurrentView('schools')}
        />
      )}
    </div>
  );
};

export default Index;
