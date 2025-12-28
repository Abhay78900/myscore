import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Mail, Lock, ArrowLeft, Eye, EyeOff, User, Building2, Shield } from 'lucide-react';
import { setCurrentUserRole } from '@/data/mockData';
import { toast } from 'sonner';

// Mock credentials for demo
const MOCK_USERS = {
  'user@demo.com': { password: 'user123', role: 'USER' as const, name: 'John Doe' },
  'partner@demo.com': { password: 'partner123', role: 'PARTNER_ADMIN' as const, name: 'Partner Admin' },
  'admin@demo.com': { password: 'admin123', role: 'MASTER_ADMIN' as const, name: 'Master Admin' },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS[email.toLowerCase() as keyof typeof MOCK_USERS];
    
    if (user && user.password === password) {
      setCurrentUserRole(user.role);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userName', user.name);
      
      toast.success(`Welcome back, ${user.name}!`);
      
      // Role-based redirect
      switch (user.role) {
        case 'MASTER_ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'PARTNER_ADMIN':
          navigate('/partner/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      toast.error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock signup - in real app, this would create a user
    setCurrentUserRole('USER');
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userName', fullName);
    
    toast.success('Account created successfully!');
    navigate('/dashboard');
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { icon: User, label: 'User', email: 'user@demo.com', password: 'user123', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: Building2, label: 'Partner', email: 'partner@demo.com', password: 'partner123', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { icon: Shield, label: 'Admin', email: 'admin@demo.com', password: 'admin123', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-display">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
                <CardDescription>
                  {isSignup 
                    ? 'Sign up to start checking your credit score' 
                    : 'Sign in to your account to continue'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
                  {isSignup && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6">
                  <p className="text-center text-sm text-muted-foreground">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignup(!isSignup)}
                      className="text-primary hover:underline font-medium"
                    >
                      {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>

                {!isSignup && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-4">Demo Credentials (Click to fill)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {demoCredentials.map((demo) => {
                        const Icon = demo.icon;
                        return (
                          <button
                            key={demo.label}
                            type="button"
                            onClick={() => fillDemoCredentials(demo.email, demo.password)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all hover:shadow-sm ${demo.color}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{demo.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-primary items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md text-center"
        >
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <CreditCard className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Your Credit Health, Simplified
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Access your credit scores from all 4 major bureaus - CIBIL, Experian, Equifax & CRIF High Mark - all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            {['🔵 CIBIL', '🟣 Experian', '🔴 Equifax', '🟢 CRIF'].map((bureau) => (
              <span key={bureau} className="text-sm text-primary-foreground/70">{bureau}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
