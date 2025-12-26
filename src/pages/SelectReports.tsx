import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import {
  CreditCard,
  ArrowLeft,
  Shield,
  Loader2,
  CheckCircle2,
  IndianRupee,
  Lock,
  Tag
} from 'lucide-react';

const bureaus = [
  { 
    id: 'cibil', 
    name: 'TransUnion CIBIL', 
    color: 'blue',
    logo: '🔵',
    description: 'Most widely used bureau in India'
  },
  { 
    id: 'experian', 
    name: 'Experian', 
    color: 'purple',
    logo: '🟣',
    description: 'Global credit bureau with detailed analysis'
  },
  { 
    id: 'equifax', 
    name: 'Equifax', 
    color: 'red',
    logo: '🔴',
    description: 'Comprehensive credit history tracking'
  },
  { 
    id: 'crif', 
    name: 'CRIF High Mark', 
    color: 'green',
    logo: '🟢',
    description: 'Microfinance & rural credit specialist'
  }
];

const PRICE_PER_BUREAU = 99;

export default function SelectReports() {
  const navigate = useNavigate();
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem('creditCheckFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const toggleBureau = (bureauId: string) => {
    setSelectedBureaus(prev => 
      prev.includes(bureauId) 
        ? prev.filter(id => id !== bureauId)
        : [...prev, bureauId]
    );
  };

  const selectAll = () => {
    if (selectedBureaus.length === bureaus.length) {
      setSelectedBureaus([]);
    } else {
      setSelectedBureaus(bureaus.map(b => b.id));
    }
  };

  const totalAmount = selectedBureaus.length * PRICE_PER_BUREAU;

  const handlePayment = async () => {
    if (selectedBureaus.length === 0) {
      toast.error('Please select at least one credit bureau');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store selection and navigate to payment
    sessionStorage.setItem('selectedBureaus', JSON.stringify(selectedBureaus));
    sessionStorage.setItem('paymentAmount', String(totalAmount));

    navigate(createPageUrl('PaymentGateway'));
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card sticky top-0 z-10">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('CheckScore'))}>
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
            <Lock className="w-4 h-4 text-accent" />
            Secure Payment
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
              Select Credit Reports
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose which credit bureau reports you want to purchase. Each report costs ₹99.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Bureau Selection */}
            <div className="md:col-span-2 space-y-4">
              {/* Select All */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-muted-foreground">Select bureaus to check</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectAll}
                >
                  {selectedBureaus.length === bureaus.length ? 'Deselect All' : 'Select All (Best Value)'}
                </Button>
              </div>

              {bureaus.map((bureau, index) => {
                const isSelected = selectedBureaus.includes(bureau.id);
                return (
                  <motion.div
                    key={bureau.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-card ${
                        isSelected ? 'ring-2 ring-primary border-primary' : ''
                      }`}
                      onClick={() => toggleBureau(bureau.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleBureau(bureau.id)}
                          />
                          <div className={`w-12 h-12 bg-${bureau.color}-50 rounded-xl flex items-center justify-center text-2xl`}>
                            {bureau.logo}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{bureau.name}</p>
                            <p className="text-sm text-muted-foreground">{bureau.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">₹{PRICE_PER_BUREAU}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}

              {/* Referral Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <Label htmlFor="referral" className="text-sm font-medium">Referral Code (Optional)</Label>
                        <Input
                          id="referral"
                          placeholder="Enter partner code"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-24 shadow-card">
                  <CardContent className="p-6">
                    <h3 className="font-display font-bold text-foreground mb-4">Order Summary</h3>
                    
                    <div className="space-y-3 mb-4">
                      {selectedBureaus.map(bureauId => {
                        const bureau = bureaus.find(b => b.id === bureauId);
                        return (
                          <div key={bureauId} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <span>{bureau?.logo}</span> {bureau?.name}
                            </span>
                            <span className="text-foreground">₹{PRICE_PER_BUREAU}</span>
                          </div>
                        );
                      })}
                      {selectedBureaus.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Select bureaus to see pricing
                        </p>
                      )}
                    </div>

                    {selectedBureaus.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-primary flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {totalAmount}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing || selectedBureaus.length === 0}
                      className="w-full mt-6 gap-2"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay ₹{totalAmount}
                        </>
                      )}
                    </Button>

                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground justify-center">
                      <Shield className="w-4 h-4 text-accent" />
                      Secured with 256-bit encryption
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
