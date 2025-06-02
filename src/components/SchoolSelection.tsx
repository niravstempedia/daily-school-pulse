
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, LogOut } from 'lucide-react';

interface SchoolSelectionProps {
  trainerName: string;
  onSchoolSelect: (school: any) => void;
  onLogout: () => void;
}

const schools = [
  {
    id: 1,
    name: "Sunrise Primary School",
    location: "Downtown District",
    totalStudents: 450,
    grades: "1-5"
  },
  {
    id: 2,
    name: "Valley High School",
    location: "West Valley",
    totalStudents: 850,
    grades: "9-12"
  },
  {
    id: 3,
    name: "Greenwood Elementary",
    location: "North Side",
    totalStudents: 320,
    grades: "K-6"
  },
  {
    id: 4,
    name: "Central Middle School",
    location: "City Center",
    totalStudents: 600,
    grades: "6-8"
  }
];

const SchoolSelection = ({ trainerName, onSchoolSelect, onLogout }: SchoolSelectionProps) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {trainerName}</h1>
            <p className="text-gray-600 mt-2">Select a school to begin your session tracking</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schools.map((school) => (
            <Card 
              key={school.id} 
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-l-blue-500"
              onClick={() => onSchoolSelect(school)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold">{school.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {school.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {school.totalStudents} students
                </div>
                <div className="text-sm text-gray-600">
                  Grades: {school.grades}
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Select School
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolSelection;
