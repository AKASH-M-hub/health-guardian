import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuth() {
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    try {
      setResult('Testing Supabase connection...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`Error: ${error.message}`);
        console.error('Connection error:', error);
      } else {
        setResult(`Connected! Session: ${data.session ? 'Active' : 'None'}`);
        console.log('Connection successful:', data);
      }
    } catch (err) {
      setResult(`Exception: ${err}`);
      console.error('Exception:', err);
    }
  };

  const testSignUp = async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'test12345';
    
    setResult('Attempting test signup...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      setResult(`Signup Error: ${error.message}`);
      console.error('Signup error:', error);
    } else {
      setResult(`Signup successful! User: ${data.user?.email}`);
      console.log('Signup data:', data);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={testConnection} className="w-full">
              Test Supabase Connection
            </Button>
            <Button onClick={testSignUp} className="w-full" variant="outline">
              Test Signup (test@example.com)
            </Button>
          </div>
          
          {result && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-mono text-sm whitespace-pre-wrap">{result}</p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
            <p><strong>Key exists:</strong> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
