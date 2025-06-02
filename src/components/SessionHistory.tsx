
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, BookOpen, User, Edit3 } from 'lucide-react';

interface SessionHistoryProps {
  sessions: any[];
  onEditSession?: (session: any) => void;
}

const SessionHistory = ({ sessions, onEditSession }: SessionHistoryProps) => {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Sessions Recorded Yet</h3>
          <p className="text-gray-500">Start by creating your first session report!</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalAttendance = (session: any) => {
    const boys = parseInt(session.boysAttendance) || 0;
    const girls = parseInt(session.girlsAttendance) || 0;
    return boys + girls;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Session History</h2>
        <Badge variant="outline" className="text-sm">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {formatDate(session.date)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Grade {session.grade}</Badge>
                  {onEditSession && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditSession(session)}
                      className="flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Session Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {session.time}
                    {session.duration && ` (${session.duration}m)`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {getTotalAttendance(session)} students
                  </span>
                </div>
                
                {session.boysAttendance && (
                  <div className="text-sm text-gray-600">
                    Boys: {session.boysAttendance}
                  </div>
                )}
                
                {session.girlsAttendance && (
                  <div className="text-sm text-gray-600">
                    Girls: {session.girlsAttendance}
                  </div>
                )}
              </div>

              {/* Topics Taught */}
              {session.topicsTaught && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    Topics Covered
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {session.topicsTaught}
                  </p>
                </div>
              )}

              {/* Teacher */}
              {session.teacherAttended && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Teacher: {session.teacherAttended}</span>
                </div>
              )}

              {/* Summary */}
              {session.summary && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Session Summary</div>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    {session.summary}
                  </p>
                </div>
              )}

              {/* Media Files */}
              {session.mediaFiles && session.mediaFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Attached Media</div>
                  <div className="flex flex-wrap gap-2">
                    {session.mediaFiles.map((file: File, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                Recorded by {session.trainer} • {new Date(session.createdAt).toLocaleString()}
                {session.editHistory && session.editHistory.length > 0 && (
                  <span className="ml-2 text-orange-600">
                    • Edited {session.editHistory.length} time{session.editHistory.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;
