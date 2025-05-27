
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, LogOut, ArrowLeft, Plus, BarChart3 } from 'lucide-react';
import SessionForm from './SessionForm';
import SessionHistory from './SessionHistory';

interface DashboardProps {
  trainer: string;
  school: any;
  onLogout: () => void;
  onBackToSchools: () => void;
}

const Dashboard = ({ trainer, school, onLogout, onBackToSchools }: DashboardProps) => {
  const [sessions, setSessions] = useState<any[]>([]);

  const addSession = (sessionData: any) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      trainer,
      school: school.name,
      createdAt: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={onBackToSchools}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Schools
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                {school.name}
              </h1>
              <p className="text-gray-600 mt-1">Trainer: {trainer} | {school.location}</p>
            </div>
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-600">{sessions.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-3xl font-bold text-green-600">
                    {sessions.filter(s => {
                      const sessionDate = new Date(s.date);
                      const today = new Date();
                      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return sessionDate >= weekAgo && sessionDate <= today;
                    }).length}
                  </p>
                </div>
                <Plus className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">School Info</p>
                  <p className="text-sm text-gray-800">{school.totalStudents} students</p>
                  <p className="text-sm text-gray-600">Grades {school.grades}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="new-session" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-session">New Session Report</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-session">
            <SessionForm onSubmit={addSession} />
          </TabsContent>
          
          <TabsContent value="history">
            <SessionHistory sessions={sessions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
