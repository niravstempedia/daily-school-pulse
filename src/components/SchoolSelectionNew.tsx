
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, LogOut, GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchools } from '@/hooks/useSchools';

interface School {
  id: string;
  name: string;
  location: string;
  total_students: number;
  grades: string;
  logo: string;
  color: string;
  description: string;
}

interface SchoolSelectionNewProps {
  onSchoolSelect: (school: School) => void;
}

const SchoolSelectionNew = ({ onSchoolSelect }: SchoolSelectionNewProps) => {
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { schools, loading: schoolsLoading } = useSchools();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (profileLoading || schoolsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading your schools...
        </div>
      </div>
    );
  }

  if (!schools || schools.length === 0) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-between items-center mb-8">
            <img 
              src="https://thestempedia.com/wp-content/uploads/2023/06/STEMpedia-Main-Logo.png" 
              alt="STEMpedia Logo" 
              className="h-36 object-contain"
            />
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
          <Card className="shadow-xl">
            <CardContent className="p-12">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
              <p className="text-gray-600 mb-6">
                Sorry {profile?.full_name || 'User'}, your account doesn't have access to any schools in our system.
              </p>
              <p className="text-sm text-gray-500">
                Please contact your administrator for access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-6">
            <img 
              src="https://thestempedia.com/wp-content/uploads/2023/06/STEMpedia-Main-Logo.png" 
              alt="STEMpedia Logo" 
              className="h-36 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome, {profile?.full_name || 'User'}
              </h1>
              <p className="text-gray-600 mt-1">Select a school to begin tracking sessions</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schools.map((school) => (
            <Card 
              key={school.id} 
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden"
              onClick={() => onSchoolSelect(school)}
            >
              <div className={`h-2 bg-gradient-to-r ${school.color}`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{school.logo}</div>
                  <GraduationCap className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {school.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{school.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  {school.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  {school.total_students.toLocaleString()} students
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Grades:</span> {school.grades}
                </div>
                <Button className={`w-full mt-4 bg-gradient-to-r ${school.color} hover:shadow-lg transition-all duration-200 text-white border-0`}>
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            You have access to {schools.length} school{schools.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSelectionNew;
