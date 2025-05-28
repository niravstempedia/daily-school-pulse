
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, LogOut, ArrowLeft, BarChart3, TrendingUp, Calendar, Users, Edit3, FileSpreadsheet } from 'lucide-react';
import SessionForm from './SessionForm';
import SessionHistory from './SessionHistory';
import SessionAnalytics from './SessionAnalytics';
import GoogleSheetsExport from './GoogleSheetsExport';

interface DashboardProps {
  trainer: string;
  trainerEmail: string;
  school: any;
  onLogout: () => void;
  onBackToSchools: () => void;
}

const Dashboard = ({ trainer, trainerEmail, school, onLogout, onBackToSchools }: DashboardProps) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [editingSession, setEditingSession] = useState<any>(null);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const storageKey = `sessions_${trainerEmail}_${school.id}`;
    const savedSessions = localStorage.getItem(storageKey);
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, [trainerEmail, school.id]);

  useEffect(() => {
    const storageKey = `sessions_${trainerEmail}_${school.id}`;
    localStorage.setItem(storageKey, JSON.stringify(sessions));
  }, [sessions, trainerEmail, school.id]);

  const addSession = (sessionData: any) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      trainer,
      trainerEmail,
      school: school.name,
      schoolId: school.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
  };

  const updateSession = (sessionData: any) => {
    const updatedSession = {
      ...editingSession,
      ...sessionData,
      updatedAt: new Date().toISOString(),
      editHistory: [
        ...(editingSession.editHistory || []),
        {
          editedAt: new Date().toISOString(),
          editedBy: trainer,
          previousData: { ...editingSession }
        }
      ]
    };
    
    setSessions(sessions.map(session => 
      session.id === editingSession.id ? updatedSession : session
    ));
    
    setEditingSession(null);
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session);
  };

  const cancelEdit = () => {
    setEditingSession(null);
  };

  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo && sessionDate <= today;
  });

  const totalAttendance = sessions.reduce((sum, session) => {
    const boys = parseInt(session.boysAttendance) || 0;
    const girls = parseInt(session.girlsAttendance) || 0;
    return sum + boys + girls;
  }, 0);

  const averageAttendance = sessions.length > 0 ? Math.round(totalAttendance / sessions.length) : 0;

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBackToSchools}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Schools
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="text-4xl">{school.logo}</div>
                  {school.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Trainer: {trainer} | {school.location} | {school.totalStudents.toLocaleString()} students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src="https://thestempedia.com/wp-content/uploads/2023/06/STEMpedia-Main-Logo.png" 
                alt="STEMpedia Logo" 
                className="h-12 object-contain"
              />
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
                    <p className="text-3xl font-bold">{sessions.length}</p>
                    <p className="text-blue-100 text-xs mt-1">All time</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">This Week</p>
                    <p className="text-3xl font-bold">{thisWeekSessions.length}</p>
                    <p className="text-green-100 text-xs mt-1">Sessions conducted</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Attendance</p>
                    <p className="text-3xl font-bold">{totalAttendance.toLocaleString()}</p>
                    <p className="text-purple-100 text-xs mt-1">Students reached</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg. Attendance</p>
                    <p className="text-3xl font-bold">{averageAttendance}</p>
                    <p className="text-orange-100 text-xs mt-1">Per session</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue={editingSession ? "edit-session" : "new-session"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="new-session" disabled={!!editingSession}>New Session</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="google-export">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Google Export
              </TabsTrigger>
              {editingSession && (
                <TabsTrigger value="edit-session" className="bg-orange-100 text-orange-700">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Session
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="new-session">
              <SessionForm onSubmit={addSession} school={school} />
            </TabsContent>
            
            <TabsContent value="history">
              <SessionHistory 
                sessions={sessions} 
                onEditSession={handleEditSession}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <SessionAnalytics sessions={sessions} school={school} />
            </TabsContent>

            <TabsContent value="google-export">
              <GoogleSheetsExport sessions={sessions} school={school} />
            </TabsContent>

            {editingSession && (
              <TabsContent value="edit-session">
                <SessionForm 
                  onSubmit={updateSession}
                  school={school}
                  editingSession={editingSession}
                  onCancel={cancelEdit}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      <footer className="text-center py-4">
        <p className="text-sm text-gray-600">
          © 2024 STEMpedia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
