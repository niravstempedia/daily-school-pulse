
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Code, FileSpreadsheet, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleSheetsService } from '../utils/googleSheetsIntegration';

interface GoogleSheetsExportProps {
  sessions: any[];
  school: any;
}

const GoogleSheetsExport = ({ sessions, school }: GoogleSheetsExportProps) => {
  const { toast } = useToast();
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const sheetsService = new GoogleSheetsService({ spreadsheetId, apiKey });

  const downloadCSV = () => {
    const csvContent = sheetsService.exportToCSV(sessions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sessions_${school.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Downloaded",
      description: "Session data has been exported to CSV format.",
    });
  };

  const copyAppsScriptCode = () => {
    const code = sheetsService.generateAppsScriptCode(sessions);
    navigator.clipboard.writeText(code);
    
    toast({
      title: "Code Copied",
      description: "Google Apps Script code has been copied to clipboard.",
    });
  };

  const copyHTMLCode = () => {
    const html = sheetsService.generateHTMLDashboard();
    navigator.clipboard.writeText(html);
    
    toast({
      title: "HTML Copied",
      description: "Dashboard HTML code has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Google Apps Script Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={downloadCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
            
            <Button onClick={copyAppsScriptCode} variant="outline" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Copy Apps Script Code
            </Button>
            
            <Button onClick={copyHTMLCode} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy HTML Dashboard
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Google Apps Script Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Download the CSV file using the button above</li>
              <li>Open <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Apps Script</a></li>
              <li>Create a new project</li>
              <li>Copy and paste the Apps Script code (use "Copy Apps Script Code" button)</li>
              <li>Create a new HTML file named "dashboard" and paste the HTML code</li>
              <li>Deploy as a web app to access your dashboard</li>
              <li>Import your CSV data using the generated functions</li>
            </ol>
          </div>

          {/* Google Sheets Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold">Google Sheets API Configuration (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
                <Input
                  id="spreadsheetId"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="Your Google Sheets API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>CSV Preview (First 5 rows)</Label>
            <Textarea
              value={sheetsService.exportToCSV(sessions.slice(0, 5))}
              readOnly
              rows={10}
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sessions.reduce((sum, s) => sum + (parseInt(s.boysAttendance) || 0) + (parseInt(s.girlsAttendance) || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(sessions.map(s => s.grade)).size}
              </div>
              <div className="text-sm text-gray-600">Grades Covered</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSheetsExport;
