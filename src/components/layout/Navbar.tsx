import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Heart, Menu, X, LogOut, User, LayoutDashboard, Moon, Sun, Crown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/medicine-awareness', label: 'Medicine Awareness' },
    { href: '/hospital-finder', label: 'Find Hospitals' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300"
            >
              <Heart className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">SDOP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative overflow-hidden"
            >
              <Sun className={`h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
              <Moon className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            </Button>

            {user ? (
              <>
                {isPremium && (
                  <Button variant="ghost" onClick={() => navigate('/premium')} className="text-warning">
                    <Crown className="w-4 h-4 mr-2" />
                    Premium
                  </Button>
                )}
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate('/account')}>
                  <User className="w-4 h-4 mr-2" />
                  Account
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')} className="bg-gradient-to-r from-primary to-coral hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {user ? (
                  <>
                    {isPremium && (
                      <Button variant="ghost" onClick={() => { navigate('/premium'); setMobileMenuOpen(false); }} className="justify-start text-warning">
                        <Crown className="w-4 h-4 mr-2" />
                        Premium
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="justify-start">
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => { navigate('/account'); setMobileMenuOpen(false); }} className="justify-start">
                      Account
                    </Button>
                    <Button variant="outline" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button onClick={() => { navigate('/auth?mode=signup'); setMobileMenuOpen(false); }}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
