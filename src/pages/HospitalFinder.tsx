import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Clock, Navigation, ArrowLeft, Search, Building2, Stethoscope, Heart, Brain, Bone } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  specialty: string[];
  rating: number;
  hours: string;
  emergency: boolean;
}

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Healthcare Ave, Medical District',
    phone: '+1 (555) 123-4567',
    distance: '1.2 km',
    specialty: ['General', 'Emergency', 'Cardiology'],
    rating: 4.5,
    hours: '24/7',
    emergency: true
  },
  {
    id: '2',
    name: 'Heart & Vascular Center',
    address: '456 Cardiac Lane, Suite 100',
    phone: '+1 (555) 234-5678',
    distance: '2.8 km',
    specialty: ['Cardiology', 'Vascular Surgery'],
    rating: 4.8,
    hours: '8:00 AM - 6:00 PM',
    emergency: false
  },
  {
    id: '3',
    name: 'Mental Wellness Clinic',
    address: '789 Mind Street, Wellness Park',
    phone: '+1 (555) 345-6789',
    distance: '3.5 km',
    specialty: ['Psychiatry', 'Psychology', 'Counseling'],
    rating: 4.6,
    hours: '9:00 AM - 8:00 PM',
    emergency: false
  },
  {
    id: '4',
    name: 'Orthopedic Specialists',
    address: '321 Bone Health Blvd',
    phone: '+1 (555) 456-7890',
    distance: '4.1 km',
    specialty: ['Orthopedics', 'Sports Medicine', 'Physical Therapy'],
    rating: 4.4,
    hours: '7:00 AM - 7:00 PM',
    emergency: false
  },
  {
    id: '5',
    name: 'Community Health Center',
    address: '555 Primary Care Road',
    phone: '+1 (555) 567-8901',
    distance: '0.8 km',
    specialty: ['General', 'Pediatrics', 'Family Medicine'],
    rating: 4.3,
    hours: '8:00 AM - 5:00 PM',
    emergency: false
  },
  {
    id: '6',
    name: 'Emergency Medical Center',
    address: '911 Urgent Care Way',
    phone: '+1 (555) 678-9012',
    distance: '1.5 km',
    specialty: ['Emergency', 'Trauma', 'General'],
    rating: 4.7,
    hours: '24/7',
    emergency: true
  }
];

const SPECIALTIES = [
  { value: 'all', label: 'All Specialties' },
  { value: 'general', label: 'General Practice' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'psychiatry', label: 'Mental Health' },
  { value: 'emergency', label: 'Emergency' }
];

export default function HospitalFinder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName('Current Location');
          toast({ title: 'Location found', description: 'Showing hospitals near you' });
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          toast({ 
            title: 'Location access denied', 
            description: 'Enter your location manually',
            variant: 'destructive'
          });
          setLoading(false);
        }
      );
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            hospital.specialty.some(s => s.toLowerCase().includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return Heart;
      case 'psychiatry': case 'psychology': return Brain;
      case 'orthopedics': return Bone;
      default: return Stethoscope;
    }
  };

  const saveLocation = async () => {
    if (user && location) {
      try {
        await supabase.from('profiles').update({
          latitude: location.lat,
          longitude: location.lng,
          location: locationName
        }).eq('user_id', user.id);
        toast({ title: 'Location saved to profile' });
      } catch (error) {
        console.error('Error saving location:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-8 h-8 text-coral" />
              Hospital Finder
            </h1>
            <p className="text-muted-foreground">Find healthcare facilities near you</p>
          </div>

          {/* Location & Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Location</label>
                  <div className="flex gap-2">
                    <Input
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="Enter city or address"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={requestLocation} disabled={loading}>
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search hospitals..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map(spec => (
                        <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {location && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location detected
                  </Badge>
                  <Button variant="link" size="sm" onClick={saveLocation}>
                    Save to profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid gap-4">
            {filteredHospitals.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hospitals found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredHospitals.map((hospital, i) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                {hospital.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {hospital.address}
                              </p>
                            </div>
                            {hospital.emergency && (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                                24/7 Emergency
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 my-3">
                            {hospital.specialty.map(spec => {
                              const Icon = getSpecialtyIcon(spec);
                              return (
                                <Badge key={spec} variant="secondary" className="text-xs">
                                  <Icon className="w-3 h-3 mr-1" />
                                  {spec}
                                </Badge>
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {hospital.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {hospital.hours}
                            </span>
                            <span className="flex items-center gap-1">
                              <Navigation className="w-4 h-4" />
                              {hospital.distance}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{hospital.rating}</div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                          <Button size="sm">
                            <Navigation className="w-4 h-4 mr-1" />
                            Directions
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Hospital information shown is for demonstration purposes. In a production environment, this would connect to real healthcare facility databases.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
