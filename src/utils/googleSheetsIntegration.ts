
// Google Sheets Integration for Google Apps Script compatibility
export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
}

export interface SessionForExport {
  id: number;
  date: string;
  time: string;
  duration: string;
  grade: string;
  boysAttendance: string;
  girlsAttendance: string;
  topicsTaught: string;
  teacherAttended: string;
  summary: string;
  trainer: string;
  trainerEmail: string;
  school: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  // Convert sessions to CSV format for Google Sheets
  exportToCSV(sessions: any[]): string {
    const headers = [
      'ID', 'Date', 'Time', 'Duration', 'Grade', 'Boys Attendance', 
      'Girls Attendance', 'Topics Taught', 'Teacher Attended', 'Summary',
      'Trainer', 'Trainer Email', 'School', 'School ID', 'Created At', 'Updated At'
    ];

    const rows = sessions.map(session => [
      session.id,
      session.date,
      session.time,
      session.duration || '',
      session.grade,
      session.boysAttendance || '0',
      session.girlsAttendance || '0',
      session.topicsTaught || '',
      session.teacherAttended || '',
      session.summary || '',
      session.trainer,
      session.trainerEmail,
      session.school,
      session.schoolId,
      session.createdAt,
      session.updatedAt || session.createdAt
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Generate Google Apps Script code for data management
  generateAppsScriptCode(sessions: any[]): string {
    const csvData = this.exportToCSV(sessions);
    
    return `
// Google Apps Script code for managing session data
// Copy this code to Google Apps Script Editor

function createSessionsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Session Reports');
  
  // Add headers
  const headers = [
    'ID', 'Date', 'Time', 'Duration', 'Grade', 'Boys Attendance', 
    'Girls Attendance', 'Topics Taught', 'Teacher Attended', 'Summary',
    'Trainer', 'Trainer Email', 'School', 'School ID', 'Created At', 'Updated At'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  return sheet;
}

function importSessionData() {
  const csvData = \`${csvData}\`;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Session Reports') || createSessionsSheet();
  
  const rows = csvData.split('\\n').slice(1); // Skip header
  const data = rows.map(row => {
    const cols = row.match(/(".*?"|[^",]+)(?=\\s*,|\\s*$)/g) || [];
    return cols.map(col => col.replace(/^"|"$/g, '').replace(/""/g, '"'));
  });
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }
  
  return 'Data imported successfully';
}

function getSessionsBySchool(schoolName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Session Reports');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const schoolIndex = headers.indexOf('School');
  
  return data.slice(1).filter(row => row[schoolIndex] === schoolName);
}

function getAnalytics() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Session Reports');
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const sessions = data.slice(1);
  
  const totalSessions = sessions.length;
  const boysIndex = headers.indexOf('Boys Attendance');
  const girlsIndex = headers.indexOf('Girls Attendance');
  
  const totalAttendance = sessions.reduce((sum, row) => {
    return sum + (parseInt(row[boysIndex]) || 0) + (parseInt(row[girlsIndex]) || 0);
  }, 0);
  
  return {
    totalSessions,
    totalAttendance,
    averageAttendance: totalSessions > 0 ? Math.round(totalAttendance / totalSessions) : 0
  };
}

// Web app function to create HTML dashboard
function doGet() {
  return HtmlService.createHtmlOutputFromFile('dashboard')
    .setTitle('School Session Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
`;
  }

  // Generate simple HTML for Google Apps Script web app
  generateHTMLDashboard(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>School Session Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .stats { display: flex; gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #f5f5f5; padding: 20px; border-radius: 8px; flex: 1; }
    .stat-number { font-size: 2em; font-weight: bold; color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f8f9fa; font-weight: bold; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .btn { background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>School Session Dashboard</h1>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number" id="totalSessions">0</div>
        <div>Total Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="totalAttendance">0</div>
        <div>Total Attendance</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="averageAttendance">0</div>
        <div>Average per Session</div>
      </div>
    </div>
    
    <button class="btn" onclick="loadData()">Refresh Data</button>
    
    <table id="sessionsTable">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Grade</th>
          <th>Attendance</th>
          <th>Teacher</th>
          <th>Topics</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>

  <script>
    function loadData() {
      google.script.run
        .withSuccessHandler(updateDashboard)
        .withFailureHandler(handleError)
        .getAnalytics();
        
      google.script.run
        .withSuccessHandler(updateTable)
        .withFailureHandler(handleError)
        .getSessionsBySchool('All');
    }
    
    function updateDashboard(analytics) {
      document.getElementById('totalSessions').textContent = analytics.totalSessions;
      document.getElementById('totalAttendance').textContent = analytics.totalAttendance;
      document.getElementById('averageAttendance').textContent = analytics.averageAttendance;
    }
    
    function updateTable(sessions) {
      const tbody = document.querySelector('#sessionsTable tbody');
      tbody.innerHTML = '';
      
      sessions.forEach(session => {
        const row = tbody.insertRow();
        const attendance = (parseInt(session[5]) || 0) + (parseInt(session[6]) || 0);
        
        row.innerHTML = \`
          <td>\${session[1]}</td>
          <td>\${session[2]}</td>
          <td>\${session[4]}</td>
          <td>\${attendance}</td>
          <td>\${session[8]}</td>
          <td>\${session[7]}</td>
        \`;
      });
    }
    
    function handleError(error) {
      console.error('Error:', error);
      alert('Error loading data: ' + error);
    }
    
    // Load data on page load
    window.onload = loadData;
  </script>
</body>
</html>
`;
  }
}
