
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Upload, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionFormProps {
  onSubmit: (data: any) => void;
  school?: any;
  editingSession?: any;
  onCancel?: () => void;
}

const SessionForm = ({ onSubmit, school, editingSession, onCancel }: SessionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: editingSession?.date || '',
    time: editingSession?.time || '',
    duration: editingSession?.duration || '',
    grade: editingSession?.grade || '',
    boysAttendance: editingSession?.boysAttendance || '',
    girlsAttendance: editingSession?.girlsAttendance || '',
    topicsTaught: editingSession?.topicsTaught || '',
    teacherAttended: editingSession?.teacherAttended || '',
    summary: editingSession?.summary || '',
    mediaFiles: editingSession?.mediaFiles || []
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.date || !formData.time || !formData.grade) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in date, time, and grade before submitting.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    
    // Reset form only if not editing
    if (!editingSession) {
      setFormData({
        date: '',
        time: '',
        duration: '',
        grade: '',
        boysAttendance: '',
        girlsAttendance: '',
        topicsTaught: '',
        teacherAttended: '',
        summary: '',
        mediaFiles: []
      });
    }

    toast({
      title: editingSession ? "Session Updated Successfully" : "Session Recorded Successfully",
      description: editingSession ? "Your session report has been updated." : "Your daily session report has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {editingSession ? 'Edit Session Report' : 'Daily Session Report'}
          </CardTitle>
          {editingSession && onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 60"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              />
            </div>
          </div>

          {/* Grade and Attendance Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K">Kindergarten</SelectItem>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="boysAttendance">Boys Attendance</Label>
              <Input
                id="boysAttendance"
                type="number"
                placeholder="Number of boys present"
                value={formData.boysAttendance}
                onChange={(e) => handleInputChange('boysAttendance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girlsAttendance">Girls Attendance</Label>
              <Input
                id="girlsAttendance"
                type="number"
                placeholder="Number of girls present"
                value={formData.girlsAttendance}
                onChange={(e) => handleInputChange('girlsAttendance', e.target.value)}
              />
            </div>
          </div>

          {/* Topics and Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topicsTaught">Topics Taught</Label>
              <Textarea
                id="topicsTaught"
                placeholder="Describe the topics covered in this session..."
                value={formData.topicsTaught}
                onChange={(e) => handleInputChange('topicsTaught', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacherAttended">Teacher Who Attended</Label>
              <Input
                id="teacherAttended"
                placeholder="Name of the teacher present"
                value={formData.teacherAttended}
                onChange={(e) => handleInputChange('teacherAttended', e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Session Summary</Label>
            <Textarea
              id="summary"
              placeholder="Overall summary of the session, student engagement, challenges, achievements..."
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <Label>Upload Photos/Videos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
              />
            </div>
            
            {/* Display uploaded files */}
            {formData.mediaFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {formData.mediaFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {editingSession ? 'Update Session Report' : 'Save Session Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionForm;
