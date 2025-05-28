
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SchoolSelection from '../components/SchoolSelection';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'schools' | 'dashboard'>('login');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleLogin = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setCurrentView('schools');
  };

  const handleSchoolSelect = (school: any) => {
    setSelectedSchool(school);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserEmail('');
    setUserName('');
    setSelectedSchool(null);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'login' && (
        <LoginForm onLogin={handleLogin} />
      )}
      
      {currentView === 'schools' && (
        <SchoolSelection 
          userEmail={userEmail}
          userName={userName}
          onSchoolSelect={handleSchoolSelect}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'dashboard' && selectedSchool && (
        <Dashboard 
          trainer={userName}
          trainerEmail={userEmail}
          school={selectedSchool}
          onLogout={handleLogout}
          onBackToSchools={() => setCurrentView('schools')}
        />
      )}
    </div>
  );
};

export default Index;
