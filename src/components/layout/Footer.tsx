import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Mail, Phone } from 'lucide-react';

export const Footer = forwardRef<HTMLElement>(function Footer(_, ref) {
  return (
    <footer ref={ref} className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SDOP</span>
            </div>
            <p className="text-background/70 text-sm">
              Silent Disease Onset Predictor - AI-powered preventive healthcare for a healthier tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/features" className="hover:text-background transition-colors">Features</Link></li>
              <li><Link to="/medicine-awareness" className="hover:text-background transition-colors">Medicine Awareness</Link></li>
              <li><Link to="/hospital-finder" className="hover:text-background transition-colors">Find Hospitals</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-background transition-colors">Medical Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@sdop.health
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                1-800-SDOP-HELP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-background/70">
              <Shield className="w-4 h-4" />
              <span>Your data is encrypted and secure</span>
            </div>
            <p className="text-sm text-background/70">
              © {new Date().getFullYear()} SDOP. All rights reserved. Not a diagnostic tool.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
