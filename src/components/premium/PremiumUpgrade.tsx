import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Check, Star, Zap, Shield, Bell, BarChart3, Sparkles, QrCode, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PREMIUM_FEATURES = [
  { icon: Bell, label: 'Medication Reminders', description: 'Never miss a dose with smart alerts' },
  { icon: BarChart3, label: 'Advanced Analytics', description: 'Deep insights into your health trends' },
  { icon: Sparkles, label: 'Priority AI Access', description: 'Faster responses & unlimited chats' },
  { icon: Shield, label: 'Expert Consultations', description: 'Connect with health professionals' },
  { icon: Zap, label: 'Real-time Monitoring', description: 'Live health tracking dashboard' },
  { icon: Star, label: 'Premium Reports', description: 'Detailed PDF health reports' },
];

// Sample QR code as base64 (you would replace this with your actual QR)
const QR_CODE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='white' width='200' height='200'/%3E%3Cg fill='black'%3E%3Crect x='20' y='20' width='60' height='60'/%3E%3Crect x='120' y='20' width='60' height='60'/%3E%3Crect x='20' y='120' width='60' height='60'/%3E%3Crect x='30' y='30' width='40' height='40' fill='white'/%3E%3Crect x='130' y='30' width='40' height='40' fill='white'/%3E%3Crect x='30' y='130' width='40' height='40' fill='white'/%3E%3Crect x='40' y='40' width='20' height='20'/%3E%3Crect x='140' y='40' width='20' height='20'/%3E%3Crect x='40' y='140' width='20' height='20'/%3E%3Crect x='90' y='20' width='20' height='20'/%3E%3Crect x='90' y='50' width='20' height='20'/%3E%3Crect x='90' y='90' width='20' height='20'/%3E%3Crect x='120' y='90' width='20' height='20'/%3E%3Crect x='150' y='90' width='30' height='20'/%3E%3Crect x='20' y='90' width='30' height='20'/%3E%3Crect x='90' y='120' width='20' height='20'/%3E%3Crect x='90' y='150' width='20' height='20'/%3E%3Crect x='120' y='120' width='60' height='60'/%3E%3Crect x='130' y='130' width='40' height='40' fill='white'/%3E%3Crect x='140' y='140' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E";

interface PremiumUpgradeProps {
  trigger?: React.ReactNode;
}

export function PremiumUpgrade({ trigger }: PremiumUpgradeProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'confirm' | 'success'>('info');
  const [transactionId, setTransactionId] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handlePaymentConfirm = async () => {
    if (!transactionId.trim()) {
      toast({ title: 'Enter transaction ID', description: 'Please enter your payment transaction ID', variant: 'destructive' });
      return;
    }

    setVerifying(true);
    
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, you would verify the payment with your backend
    if (transactionId.length >= 6) {
      setStep('success');
      toast({ title: '🎉 Welcome to Premium!', description: 'Your account has been upgraded successfully!' });
      
      // Update user premium status in database (you would implement this)
      // await supabase.from('user_subscriptions').insert({ user_id: user?.id, type: 'premium' });
    } else {
      toast({ title: 'Invalid Transaction', description: 'Please check your transaction ID', variant: 'destructive' });
    }
    
    setVerifying(false);
  };

  const resetModal = () => {
    setStep('info');
    setTransactionId('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetModal(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-primary to-coral text-white">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-warning" />
            {step === 'success' ? 'Welcome to Premium!' : 'Upgrade to Premium'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' && 'Unlock advanced features for just ₹1'}
            {step === 'payment' && 'Scan QR code to complete payment'}
            {step === 'confirm' && 'Enter your transaction details'}
            {step === 'success' && 'Your account has been upgraded'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid gap-3 py-4">
                {PREMIUM_FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Check className="w-4 h-4 text-success ml-auto" />
                  </motion.div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-coral/10 border-primary/30">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Special Launch Price</p>
                  <p className="text-3xl font-bold text-primary">₹1</p>
                  <p className="text-xs text-muted-foreground">One-time payment • Lifetime access</p>
                </CardContent>
              </Card>

              <Button className="w-full mt-4" onClick={() => setStep('payment')}>
                Proceed to Payment
              </Button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              <div className="text-center">
                <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-lg">
                  <img src={QR_CODE_IMAGE} alt="Payment QR Code" className="w-48 h-48" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Scan with any UPI app to pay <span className="font-bold text-primary">₹1</span>
                </p>
                <Badge variant="outline" className="mb-4">
                  <QrCode className="w-3 h-3 mr-1" />
                  UPI Payment
                </Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep('info')}>
                  Back
                </Button>
                <Button className="flex-1" onClick={() => setStep('confirm')}>
                  I've Paid
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4 space-y-4"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">Transaction ID / UTR Number</label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your UPI transaction ID"
                  className="text-center font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  You can find this in your payment app's transaction history
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('payment')}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handlePaymentConfirm} disabled={verifying}>
                  {verifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify Payment
                </Button>
              </div>
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
              <h3 className="text-xl font-bold mb-2">You're Now Premium! 🎉</h3>
              <p className="text-muted-foreground text-sm mb-6">
                All premium features are now unlocked for your account.
              </p>
              <Button onClick={() => setOpen(false)}>
                Start Exploring
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
