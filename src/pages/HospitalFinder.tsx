import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Clock, Navigation, ArrowLeft, Search, Building2, Stethoscope, Heart, Brain, Bone, Star, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  rating: number;
  totalRatings?: number;
  isOpen?: boolean | null;
  types?: string[];
  distance?: number;
}

const SPECIALTIES = [
  { value: 'hospital', label: 'All Hospitals' },
  { value: 'doctor', label: 'Doctors/Clinics' },
  { value: 'pharmacy', label: 'Pharmacies' },
  { value: 'dentist', label: 'Dentists' },
];

export default function HospitalFinder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('hospital');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      searchNearbyHospitals();
    }
  }, [location, selectedType]);

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
          toast({ title: 'Location found', description: 'Searching for hospitals near you...' });
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          toast({ 
            title: 'Location access denied', 
            description: 'Using default location. Please enable location for accurate results.',
            variant: 'destructive'
          });
          // Use a default location (New York)
          setLocation({ lat: 40.7128, lng: -74.0060 });
          setLocationName('New York, NY');
          setLoading(false);
        }
      );
    }
  };

  const searchNearbyHospitals = async () => {
    if (!location) return;
    
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-hospitals', {
        body: { lat: location.lat, lng: location.lng, type: selectedType, radius: 10000 }
      });

      if (error) throw error;
      
      if (data?.hospitals) {
        setHospitals(data.hospitals);
        toast({ title: `Found ${data.hospitals.length} nearby places` });
      }
    } catch (error: any) {
      console.error('Error searching hospitals:', error);
      toast({ 
        title: 'Search error', 
        description: 'Could not fetch nearby hospitals. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSearching(false);
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    if (!searchQuery) return true;
    return hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           hospital.address?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDirectionsUrl = (hospital: Hospital) => {
    if (hospital.lat && hospital.lng && location) {
      // Use OpenStreetMap for directions (works without restrictions)
      return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat},${location.lng};${hospital.lat},${hospital.lng}`;
    }
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`;
  };

  const getMapUrl = (hospital: Hospital) => {
    if (hospital.lat && hospital.lng) {
      return `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=17/${hospital.lat}/${hospital.lng}`;
    }
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(hospital.name)}`;
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
            <p className="text-muted-foreground">Find real healthcare facilities near your location</p>
          </div>

          {/* Location & Search */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Location</label>
                  <div className="flex gap-2">
                    <Input
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="Detecting location..."
                      className="flex-1"
                      disabled
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
                      placeholder="Filter results..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
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
                    Live Location Active
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {searching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Searching nearby hospitals...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredHospitals.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No hospitals found</h3>
                    <p className="text-muted-foreground">Try enabling location or adjusting your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredHospitals.map((hospital, i) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
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
                              {hospital.isOpen !== null && (
                                <Badge className={hospital.isOpen ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                                  {hospital.isOpen ? 'Open Now' : 'Closed'}
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                              {hospital.distance && (
                                <span className="flex items-center gap-1">
                                  <Navigation className="w-4 h-4" />
                                  {hospital.distance} km away
                                </span>
                              )}
                              {hospital.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-warning fill-warning" />
                                  {hospital.rating} ({hospital.totalRatings} reviews)
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button size="sm" asChild>
                              <a href={getDirectionsUrl(hospital)} target="_blank" rel="noopener noreferrer">
                                <Navigation className="w-4 h-4 mr-1" />
                                Get Directions
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={getMapUrl(hospital)} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View on Maps
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-8">
            Results powered by Google Maps API. Real-time data based on your location.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
