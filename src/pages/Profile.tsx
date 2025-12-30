import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useHealthData } from '@/hooks/useHealthData';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Calendar, MapPin, Save, Coins, Activity, FileText, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  full_name: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { credits, totalEarned, totalSpent } = useCredits();
  const { stats } = useHealthData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    location: ''
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          location: data.location || ''
        });
      } else {
        setProfile(prev => ({ ...prev, email: user?.email || '' }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          location: profile.location || null
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast({ title: 'Profile updated successfully!' });
    } catch (error: any) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {profile.full_name || 'Your Profile'}
              </h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Coins className="w-10 h-10 text-primary" />
                    <div>
                      <div className="text-3xl font-bold text-primary">{credits}</div>
                      <div className="text-sm text-muted-foreground">Available Credits</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/20 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-semibold text-success">{totalEarned}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div>
                      <div className="font-semibold text-coral">{totalSpent}</div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-ocean" />
                    <div>
                      <div className="text-2xl font-bold">{stats?.totalEntries ?? 0}</div>
                      <div className="text-sm text-muted-foreground">Health Entries</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-mint-dark" />
                    <div>
                      <div className="text-2xl font-bold capitalize">{stats?.weeklyTrend ?? 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">Weekly Trend</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Account Security</span>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    Email Verified
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-3">
                    Your account is secured with email authentication.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={profile.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profile.date_of_birth || ''}
                        onChange={(e) => setProfile(p => ({ ...p, date_of_birth: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={profile.gender || ''} 
                        onValueChange={(v) => setProfile(p => ({ ...p, gender: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location || ''}
                        onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button onClick={handleSave} disabled={loading} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}