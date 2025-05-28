
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeySetup = ({ onApiKeySet, currentApiKey }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      toast({
        title: "API Key Set",
        description: "Google Sheets API key has been saved successfully.",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-600" />
          Google Sheets API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
            <li>Create a new project or select existing one</li>
            <li>Enable the Google Sheets API</li>
            <li>Create credentials (API Key)</li>
            <li>Restrict the API key to Google Sheets API</li>
            <li>Make sure your spreadsheet is publicly viewable or shared with the API</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google Sheets API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Google Sheets API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Save API Key
          </Button>
        </form>

        {currentApiKey && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            ✓ API Key is configured and ready to use
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
