import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pill, Search, ArrowLeft, AlertTriangle, Info, Heart, Brain, Droplets, Shield, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { HumanBodyDiagram } from '@/components/ui/HumanBodyDiagram';
import { MAJOR_DISEASES, DISEASE_CATEGORIES } from '@/data/majorDiseases';

export default function MedicineAwareness() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<typeof MAJOR_DISEASES[0] | null>(null);

  const filteredDiseases = MAJOR_DISEASES.filter(disease => {
    const matchesSearch = 
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      disease.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || disease.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'high': return 'bg-warning/20 text-warning border-warning/30';
      case 'medium': return 'bg-ocean/20 text-ocean border-ocean/30';
      case 'low': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Pill className="w-8 h-8 text-primary" />
              Disease & Medicine Awareness
            </h1>
            <p className="text-muted-foreground">Explore 100+ major diseases, symptoms, and prevention methods</p>
          </div>

          {/* Important Disclaimer */}
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-warning mb-1">Educational Information Only</h3>
                  <p className="text-sm text-muted-foreground">
                    This information is for awareness purposes. Always consult qualified healthcare professionals for diagnosis and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Search & Filters */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search diseases, symptoms..."
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {DISEASE_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Showing {filteredDiseases.length} of {MAJOR_DISEASES.length} diseases
                  </p>
                </CardContent>
              </Card>

              {/* Disease List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredDiseases.slice(0, 30).map((disease, i) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50 ${
                        selectedDisease?.id === disease.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedDisease(disease)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{disease.name}</h3>
                              <Badge variant="outline" className={getSeverityColor(disease.severity)}>
                                {disease.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{disease.category}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {disease.symptoms.slice(0, 3).map(symptom => (
                                <Badge key={symptom} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {disease.prevalence}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Disease Detail with Body Diagram */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-primary" />
                    {selectedDisease ? selectedDisease.name : 'Select a Disease'}
                  </CardTitle>
                  {selectedDisease && (
                    <CardDescription>{selectedDisease.category}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedDisease ? (
                    <div className="space-y-4">
                      {/* Body Diagram */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground text-center mb-2">Affected Body Areas</p>
                        <HumanBodyDiagram 
                          affectedAreas={selectedDisease.affectedOrgans.map(organ => ({
                            id: organ,
                            name: organ.charAt(0).toUpperCase() + organ.slice(1),
                            severity: selectedDisease.severity === 'critical' ? 'high' : 
                                     selectedDisease.severity === 'high' ? 'medium' : 'low'
                          }))}
                        />
                      </div>

                      {/* Symptoms */}
                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-primary" />
                          Symptoms
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedDisease.symptoms.map(s => (
                            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {selectedDisease.riskFactors.map(r => (
                            <li key={r} className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2 text-success">
                          <Shield className="w-4 h-4" />
                          Prevention
                        </h4>
                        <ul className="space-y-1">
                          {selectedDisease.prevention.map(p => (
                            <li key={p} className="text-xs flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Click on a disease to see details and affected body areas</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Note */}
          <Card className="mt-8 border-dashed">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                For personalized medical advice or specific treatment options, please consult with your healthcare provider.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/hospital-finder')}>
                <MapPin className="w-4 h-4 mr-2" />
                Find Healthcare Providers Near You
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}