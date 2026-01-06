import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, MapPin, Star, Navigation, MessageCircle, ChevronRight, Loader2, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalRatings?: number;
  isOpen?: boolean | null;
  distance?: number;
}

interface DoctorCollaborationProps {
  onSelectHospital?: (hospital: Hospital) => void;
}

export function DoctorCollaboration({ onSelectHospital }: DoctorCollaborationProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      searchNearbyHospitals();
    }
  }, [location]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Don't use default - show message to user
          toast({ 
            title: 'Location access needed', 
            description: 'Please enable location access to find nearby hospitals.',
            variant: 'destructive'
          });
        },
        { timeout: 10000 }
      );
    } else {
      toast({ 
        title: 'Location not supported', 
        description: 'Your browser does not support geolocation.',
        variant: 'destructive'
      });
    }
  };

  const searchNearbyHospitals = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      // Fetch real hospitals from find-hospitals function - ONLY
      const { data, error } = await supabase.functions.invoke('find-hospitals', {
        body: { lat: location.lat, lng: location.lng, type: 'hospital', radius: 25000 }
      });

      if (error) {
        console.error('find-hospitals API error:', error);
        setHospitals([]); // Show empty, no fallback mocks
        toast({ 
          title: 'No hospitals found', 
          description: 'Could not find hospitals in your area. Please check your location.',
          variant: 'destructive'
        });
        return;
      }
      
      // Use ONLY real hospitals from API
      if (data?.hospitals && data.hospitals.length > 0) {
        console.log(`Found ${data.hospitals.length} real hospitals via API`);
        setHospitals(data.hospitals.slice(0, 10));
      } else {
        // No results from API
        console.warn('No hospitals found in API response');
        setHospitals([]);
        toast({ 
          title: 'No hospitals available', 
          description: 'No hospitals found near your location.',
          variant: 'default'
        });
      }
    } catch (error: any) {
      console.error('Error searching hospitals:', error);
      setHospitals([]);
      toast({ 
        title: 'Search error', 
        description: 'Failed to search for hospitals. Try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    if (onSelectHospital) {
      onSelectHospital(hospital);
    }
  };

  const startConsultation = () => {
    if (selectedHospital) {
      navigate(`/doctor-chat?hospital=${encodeURIComponent(selectedHospital.name)}&id=${selectedHospital.id}`);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Doctor Collaboration Mode
        </CardTitle>
        <CardDescription>
          Select a hospital to start AI-assisted consultation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm">Finding nearby hospitals...</span>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-2">
              {hospitals.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <h4 className="font-medium text-sm mb-1">No hospitals found</h4>
                    <p className="text-xs text-muted-foreground">Enable location access to find nearby hospitals</p>
                  </CardContent>
                </Card>
              ) : (
                hospitals.map((hospital, i) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedHospital?.id === hospital.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectHospital(hospital)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                              {hospital.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {hospital.address}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              {hospital.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-warning fill-warning" />
                                  {hospital.rating}
                                </span>
                              )}
                              {hospital.distance && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Navigation className="w-3 h-3" />
                                  {hospital.distance} km
                                </span>
                              )}
                            {hospital.isOpen !== null && (
                              <Badge variant={hospital.isOpen ? "default" : "secondary"} className="text-[10px] h-4">
                                {hospital.isOpen ? 'Open' : 'Closed'}
                              </Badge>
                            )}
                            </div>
                          </div>
                          {selectedHospital?.id === hospital.id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <ChevronRight className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        )}

        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              className="w-full bg-gradient-to-r from-primary to-coral" 
              onClick={startConsultation}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start AI Consultation for {selectedHospital.name}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
