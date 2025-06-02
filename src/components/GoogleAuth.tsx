
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto">
            <img 
              src="https://thestempedia.com/wp-content/uploads/2023/06/STEMpedia-Main-Logo.png" 
              alt="STEMpedia Logo" 
              className="h-36 mx-auto object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              School Program Dashboard
            </CardTitle>
            <p className="text-gray-600 mt-2">Sign in with your authorized Google account</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Authorized Email Addresses Only</p>
                <ul className="text-xs space-y-1">
                  <li>• trainer@lpsmohali.com</li>
                  <li>• coordinator@ntpcsimhadri.com</li>
                  <li>• admin@tclmithapur.com</li>
                  <li>• teacher@edifybangalore.com</li>
                  <li>• demo@stempedia.com</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuth;
