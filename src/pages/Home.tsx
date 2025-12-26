import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Lock,
  Star,
  FileText,
  Zap,
  Building2,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { setCurrentUserRole } from '@/data/mockData';

const bureaus = [
  { name: 'TransUnion CIBIL', logo: '🔵', color: 'bg-blue-50 text-blue-600' },
  { name: 'Experian', logo: '🟣', color: 'bg-purple-50 text-purple-600' },
  { name: 'Equifax', logo: '🔴', color: 'bg-red-50 text-red-600' },
  { name: 'CRIF High Mark', logo: '🟢', color: 'bg-green-50 text-green-600' }
];

const features = [
  {
    icon: Building2,
    title: 'All 4 Bureau Scores',
    description: 'Get scores from CIBIL, Experian, Equifax & CRIF in one place'
  },
  {
    icon: FileText,
    title: 'Detailed Analysis',
    description: 'Complete breakdown of loans, cards, payments & enquiries'
  },
  {
    icon: Lock,
    title: '100% Secure',
    description: 'Bank-grade 256-bit encryption protects your data'
  },
  {
    icon: Zap,
    title: 'Instant Report',
    description: 'Get your comprehensive report in under 2 minutes'
  }
];

const stats = [
  { value: '1 Cr+', label: 'Reports Generated' },
  { value: '4', label: 'Credit Bureaus' },
  { value: '99.9%', label: 'Accuracy' },
  { value: '₹99', label: 'Per Report' }
];

export default function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setCurrentUserRole('USER');
    navigate(createPageUrl('CheckScore'));
  };

  const handleAdminLogin = () => {
    setCurrentUserRole('MASTER_ADMIN');
    navigate(createPageUrl('MasterAdminDashboard'));
  };

  const handlePartnerLogin = () => {
    setCurrentUserRole('PARTNER_ADMIN');
    navigate(createPageUrl('PartnerDashboard'));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(createPageUrl('Dashboard'))}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={handlePartnerLogin}>
              Partner Portal
            </Button>
            <Button variant="ghost" onClick={handleAdminLogin}>
              Admin
            </Button>
            <Button onClick={handleGetStarted} className="gap-2">
              Check Score <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate(createPageUrl('Dashboard'))}>
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handlePartnerLogin}>
              Partner Portal
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleAdminLogin}>
              Admin
            </Button>
            <Button className="w-full" onClick={handleGetStarted}>
              Check Score
            </Button>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 md:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Trusted by 1 Crore+ Indians
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
                Check Credit Score from
                <span className="text-gradient"> All 4 Bureaus</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get your comprehensive credit report from CIBIL, Experian, Equifax & CRIF High Mark - 
                all in one place. Starting at just ₹99 per bureau, instant and 100% secure.
              </p>

              {/* Bureau Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {bureaus.map((bureau, i) => (
                  <motion.div
                    key={bureau.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${bureau.color}`}
                  >
                    <span>{bureau.logo}</span>
                    <span className="font-medium text-sm">{bureau.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-lg px-8 gap-2"
                >
                  Get Your Credit Report <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg"
                  onClick={() => navigate(createPageUrl('Dashboard'))}
                >
                  View Demo Dashboard
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-accent" />
                  No Impact on Score
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-5 h-5 text-accent" />
                  Bank-grade Security
                </div>
              </div>
            </motion.div>

            {/* Score Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-card rounded-3xl shadow-card border border-border p-6 md:p-8">
                {/* Average Score */}
                <div className="bg-gradient-navy rounded-2xl p-6 mb-6 text-white">
                  <p className="text-white/60 text-sm mb-1">Average Credit Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-bold">756</span>
                    <span className="text-white/60">/ 900</span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                    Excellent
                  </span>
                </div>

                {/* 4 Bureau Scores */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'CIBIL', score: 762, bg: 'bg-blue-50', text: 'text-blue-600' },
                    { name: 'Experian', score: 748, bg: 'bg-purple-50', text: 'text-purple-600' },
                    { name: 'Equifax', score: 755, bg: 'bg-red-50', text: 'text-red-600' },
                    { name: 'CRIF', score: 760, bg: 'bg-green-50', text: 'text-green-600' }
                  ].map((bureau, i) => (
                    <motion.div
                      key={bureau.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={`${bureau.bg} rounded-xl p-4 text-center`}
                    >
                      <p className={`${bureau.text} font-medium text-sm`}>{bureau.name}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{bureau.score}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">₹99/Bureau</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 md:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">{stat.value}</p>
                <p className="text-primary-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Check with CreditCheck?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get the most comprehensive view of your credit health from all major credit bureaus in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:shadow-card transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
              Ready to Check Your Credit Score?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join over 1 Crore Indians who trust CreditCheck for their credit health monitoring. 
              Get scores from all 4 bureaus starting at just ₹99.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="text-lg px-8 gap-2"
            >
              Get Your Report Now <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 md:px-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">CreditCheck</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CreditCheck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
