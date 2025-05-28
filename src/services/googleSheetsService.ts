
export interface SchoolData {
  id: number;
  name: string;
  location: string;
  totalStudents: number;
  grades: string;
  logo: string;
  color: string;
  description: string;
  email: string;
  password: string;
}

export interface UserCredentials {
  email: string;
  password: string;
  schoolIds: number[];
}

export class GoogleSheetsDataService {
  private spreadsheetId: string;
  private apiKey: string;

  constructor() {
    // Using the spreadsheet ID from your URL
    this.spreadsheetId = '1vqK2rB6EUCODcBxn3K5nnxavm3_ldXLY4TbvfrTdaIg';
    // You'll need to provide your Google Sheets API key
    this.apiKey = localStorage.getItem('googleSheetsApiKey') || '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('googleSheetsApiKey', apiKey);
  }

  async fetchSchoolData(): Promise<SchoolData[]> {
    if (!this.apiKey) {
      throw new Error('Google Sheets API key is required');
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Schools!A:J?key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch school data');
      }

      const data = await response.json();
      const rows = data.values || [];
      
      // Skip header row
      const schoolRows = rows.slice(1);
      
      return schoolRows.map((row: string[], index: number) => ({
        id: index + 1,
        name: row[0] || '',
        location: row[1] || '',
        totalStudents: parseInt(row[2]) || 0,
        grades: row[3] || '',
        logo: row[4] || '🏫',
        color: row[5] || 'from-blue-500 to-blue-600',
        description: row[6] || '',
        email: row[7] || '',
        password: row[8] || ''
      }));
    } catch (error) {
      console.error('Error fetching school data:', error);
      throw error;
    }
  }

  async fetchUserCredentials(): Promise<UserCredentials[]> {
    if (!this.apiKey) {
      throw new Error('Google Sheets API key is required');
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Users!A:C?key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user credentials');
      }

      const data = await response.json();
      const rows = data.values || [];
      
      // Skip header row
      const userRows = rows.slice(1);
      
      return userRows.map((row: string[]) => ({
        email: row[0] || '',
        password: row[1] || '',
        schoolIds: row[2] ? row[2].split(',').map(id => parseInt(id.trim())) : []
      }));
    } catch (error) {
      console.error('Error fetching user credentials:', error);
      throw error;
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    // Note: This is a simplified reset - in production you'd want proper validation
    // For now, we'll just update localStorage with the new password
    const resetData = {
      email,
      newPassword,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`passwordReset_${email}`, JSON.stringify(resetData));
    
    // In a real implementation, you'd update the Google Sheet here
    // For now, we'll just return success
    return true;
  }

  getResetPassword(email: string): string | null {
    const resetData = localStorage.getItem(`passwordReset_${email}`);
    if (resetData) {
      const parsed = JSON.parse(resetData);
      return parsed.newPassword;
    }
    return null;
  }
}
