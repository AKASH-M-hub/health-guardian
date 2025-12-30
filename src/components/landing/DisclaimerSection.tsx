import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shield, Heart } from 'lucide-react';

export function DisclaimerSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Important Medical Disclaimer
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg">
                SDOP is a <strong className="text-foreground">clinical decision support tool</strong>, 
                not a diagnostic system. Our AI predictions are designed to support, not replace, 
                professional medical advice.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    What SDOP Does
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                      <span>Analyzes lifestyle patterns for potential risk indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                      <span>Provides educational health information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                      <span>Suggests when to consult healthcare professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                      <span>Helps prepare questions for doctor visits</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    What SDOP Does NOT Do
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span>Diagnose diseases or medical conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span>Prescribe medications or treatments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span>Replace professional medical consultation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span>Provide emergency medical advice</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex items-center gap-4">
                <Shield className="w-8 h-8 text-primary" />
                <p className="text-sm">
                  <strong className="text-foreground">Always consult a qualified healthcare professional</strong> for 
                  medical advice, diagnosis, or treatment. If you're experiencing a medical emergency, 
                  please call emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
