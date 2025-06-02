
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, BookOpen } from 'lucide-react';

interface SessionAnalyticsProps {
  sessions: any[];
  school: any;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const SessionAnalytics = ({ sessions, school }: SessionAnalyticsProps) => {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Available</h3>
          <p className="text-gray-500">Create some session reports to see analytics!</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const attendanceByDate = sessions.map(session => ({
    date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    boys: parseInt(session.boysAttendance) || 0,
    girls: parseInt(session.girlsAttendance) || 0,
    total: (parseInt(session.boysAttendance) || 0) + (parseInt(session.girlsAttendance) || 0)
  })).reverse();

  const gradeDistribution = sessions.reduce((acc, session) => {
    const grade = session.grade;
    const attendance = (parseInt(session.boysAttendance) || 0) + (parseInt(session.girlsAttendance) || 0);
    acc[grade] = (acc[grade] || 0) + attendance;
    return acc;
  }, {});

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade: `Grade ${grade}`,
    count
  }));

  const genderDistribution = sessions.reduce((acc, session) => {
    acc.boys += parseInt(session.boysAttendance) || 0;
    acc.girls += parseInt(session.girlsAttendance) || 0;
    return acc;
  }, { boys: 0, girls: 0 });

  const genderData = [
    { name: 'Boys', value: genderDistribution.boys },
    { name: 'Girls', value: genderDistribution.girls }
  ];

  const totalAttendance = genderDistribution.boys + genderDistribution.girls;
  const averageSessionAttendance = Math.round(totalAttendance / sessions.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="text-sm text-gray-600">
          Based on {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Students Reached</p>
                <p className="text-2xl font-bold text-gray-800">{totalAttendance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Avg. per Session</p>
                <p className="text-2xl font-bold text-gray-800">{averageSessionAttendance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Sessions Conducted</p>
                <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Grades Covered</p>
                <p className="text-2xl font-bold text-gray-800">{Object.keys(gradeDistribution).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="boys" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="girls" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade-wise Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Grade-wise Total Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Session Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Grade {session.grade} - {new Date(session.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">
                    {((parseInt(session.boysAttendance) || 0) + (parseInt(session.girlsAttendance) || 0))} students attended
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{session.time}</p>
                  <p className="text-sm text-gray-500">{session.duration ? `${session.duration}m` : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionAnalytics;
