import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import {
  CreditCard,
  ArrowLeft,
  Shield,
  Loader2,
  CheckCircle2,
  Smartphone,
  Building,
  IndianRupee,
} from 'lucide-react';

export default function PaymentGateway() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount, setAmount] = useState(396);

  useEffect(() => {
    const storedAmount = sessionStorage.getItem('paymentAmount');
    if (storedAmount) {
      setAmount(Number(storedAmount));
    }
  }, []);

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    setPaymentSuccess(true);
    toast.success('Payment successful!');

    // Redirect to dashboard after success
    setTimeout(() => {
      navigate(createPageUrl('Dashboard'));
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </motion.div>
          
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your credit report is ready to view.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to your dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 bg-card border-b border-border">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('SelectReports'))}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">Payment</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-accent" />
            Secure Payment
          </div>
        </nav>
      </header>

      <main className="px-4 py-8 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Payment Methods */}
            <div className="md:col-span-3">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-display font-bold text-foreground mb-6">Select Payment Method</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    {/* UPI */}
                    <div className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">UPI</p>
                            <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                          </div>
                        </Label>
                      </div>
                      {paymentMethod === 'upi' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <Label htmlFor="upi-id" className="text-sm text-muted-foreground">Enter UPI ID</Label>
                          <Input
                            id="upi-id"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Card */}
                    <div className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Debit / Credit Card</p>
                            <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* NetBanking */}
                    <div className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Net Banking</p>
                            <p className="text-xs text-muted-foreground">All major banks</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full mt-6 h-12 gap-2"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ₹{amount}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2">
              <Card className="sticky top-4 shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">Order Summary</h3>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {amount}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-accent" />
                      Your payment is secured with 256-bit encryption
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
