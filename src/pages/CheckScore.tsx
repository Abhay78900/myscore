import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import RegistrationForm from '@/components/forms/RegistrationForm';

export default function CheckScore() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Save form data for next step
      sessionStorage.setItem('creditCheckFormData', JSON.stringify(data));
      sessionStorage.setItem('pendingRegistration', 'true');
      
      // Redirect to report selection
      navigate(createPageUrl('SelectReports'));
    } catch (e) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('Home'))}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-accent" />
            256-bit Encrypted
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:py-12 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Check Your Credit Score
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get your comprehensive credit report from <span className="font-semibold text-foreground">all 4 credit bureaus</span> - 
              CIBIL, Experian, Equifax & CRIF High Mark. Just ₹99 per bureau.
            </p>
            
            {/* Bureau Logos */}
            <div className="flex justify-center items-center gap-6 mt-6">
              {['🔵 CIBIL', '🟣 Experian', '🔴 Equifax', '🟢 CRIF'].map((bureau, i) => (
                <motion.div
                  key={bureau}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-muted-foreground"
                >
                  {bureau}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <RegistrationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
