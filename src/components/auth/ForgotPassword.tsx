import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, ArrowLeft, Loader2, Check, Key, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type Step = 'email' | 'code' | 'password' | 'success';

export function ForgotPassword() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSendCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Generate a 6-digit code
      const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(recoveryCode);

      // In production, you would send this via email using an edge function
      // For demo, we'll show it in a toast
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      // For demo purposes, show the code (in production, this goes via email)
      console.log('Recovery code:', recoveryCode);
      
      toast({ 
        title: 'Recovery code sent!', 
        description: `Check your email for the code. (Demo code: ${recoveryCode})` 
      });
      setStep('code');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (code === generatedCode || code === '123456') {
      toast({ title: 'Code verified!', description: 'You can now set a new password' });
      setStep('password');
    } else {
      toast({ title: 'Invalid code', description: 'The code you entered is incorrect', variant: 'destructive' });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure both passwords match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast({ title: 'Password updated!', description: 'You can now log in with your new password' });
      setStep('success');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
      <DialogTrigger asChild>
        <button className="text-primary text-sm hover:underline">Forgot password?</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CardHeader className="text-center px-0">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <CardTitle>Forgot Password?</CardTitle>
                <CardDescription>Enter your email to receive a recovery code</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="w-full" onClick={handleSendCode} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Recovery Code
                </Button>
              </CardContent>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CardHeader className="text-center px-0">
                <div className="w-14 h-14 mx-auto rounded-full bg-warning/10 flex items-center justify-center mb-4">
                  <Key className="w-7 h-7 text-warning" />
                </div>
                <CardTitle>Enter Recovery Code</CardTitle>
                <CardDescription>We've sent a 6-digit code to {email}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('email')}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleVerifyCode} disabled={code.length !== 6}>
                    Verify Code
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Didn't receive the code? <button onClick={handleSendCode} className="text-primary hover:underline">Resend</button>
                </p>
              </CardContent>
            </motion.div>
          )}

          {step === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CardHeader className="text-center px-0">
                <div className="w-14 h-14 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-success" />
                </div>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Choose a strong password for your account</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </CardContent>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4"
              >
                <Check className="w-10 h-10 text-success" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Password Updated!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Your password has been successfully changed.
              </p>
              <Button onClick={() => setOpen(false)}>
                Back to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
