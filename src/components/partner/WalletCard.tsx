import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, Loader2, IndianRupee, CreditCard, Smartphone, Building2, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  wallet_balance?: number;
  total_wallet_loaded?: number;
}

interface WalletCardProps {
  partner?: Partner;
  onLoadFunds?: (amount: number) => Promise<void>;
  isLoading?: boolean;
}

export default function WalletCard({ partner, onLoadFunds, isLoading }: WalletCardProps) {
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const walletBalance = partner?.wallet_balance || 0;
  const totalLoaded = partner?.total_wallet_loaded || 0;

  const handleProceedToPayment = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }
    setShowLoadDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePayment = async () => {
    const numAmount = parseInt(amount);
    
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    
    setLoadingFunds(true);
    
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // On success, add funds
    if (onLoadFunds) {
      await onLoadFunds(numAmount);
    }
    
    setPaymentSuccess(true);
    setLoadingFunds(false);
    
    // Reset after showing success
    setTimeout(() => {
      setShowPaymentDialog(false);
      setPaymentSuccess(false);
      setAmount('');
      setUpiId('');
    }, 2000);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Card', icon: CreditCard, description: 'Debit/Credit Card' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-5 h-5 text-emerald-200" />
                  <span className="text-emerald-200 text-sm font-medium">Partner Wallet</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹{walletBalance.toLocaleString()}</span>
                </div>
                <p className="text-emerald-200 text-sm mt-1">Available Balance</p>
              </div>
              <Button
                onClick={() => setShowLoadDialog(true)}
                className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2"
              >
                <Plus className="w-4 h-4" />
                Load Funds
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <div className="flex items-center gap-2 text-emerald-200 text-sm mb-1">
                  <ArrowDownLeft className="w-4 h-4" />
                  Total Loaded
                </div>
                <p className="text-xl font-semibold">₹{totalLoaded.toLocaleString()}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-200 text-sm mb-1">
                  <ArrowUpRight className="w-4 h-4" />
                  Total Spent
                </div>
                <p className="text-xl font-semibold">₹{(totalLoaded - walletBalance).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Load Funds Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Load Wallet Funds
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Enter Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9 text-lg"
                  min={100}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum ₹100</p>
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-2 block">Quick Select</label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(amt => (
                  <Button
                    key={amt}
                    variant={amount === String(amt) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAmount(String(amt))}
                    className={amount === String(amt) ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              disabled={!amount || parseInt(amount) < 100}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 gap-2"
            >
              <Plus className="w-5 h-5" />
              Proceed to Pay ₹{amount || 0}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Funds will be added instantly after payment confirmation
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Gateway Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Payment Gateway
            </DialogTitle>
            <DialogDescription>
              Complete payment to add ₹{amount} to your wallet
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess ? (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Payment Successful!</h3>
              <p className="text-slate-500">₹{amount} added to your wallet</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Amount Summary */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700">Amount to Pay</span>
                  <span className="text-2xl font-bold text-emerald-700">₹{amount}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Select Payment Method</p>
                <div className="grid gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-slate-800">{method.name}</p>
                          <p className="text-xs text-slate-500">{method.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UPI Input */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Enter UPI ID</label>
                  <Input
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="text-lg"
                  />
                </div>
              )}

              {/* Card Input (Demo) */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Expiry</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">CVV</label>
                      <Input placeholder="123" type="password" />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">Select Bank</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Bank</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={loadingFunds || (paymentMethod === 'upi' && !upiId)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 gap-2"
              >
                {loadingFunds ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Pay ₹{amount} Securely
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secured by 256-bit SSL encryption
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
