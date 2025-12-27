import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import {
  FileText,
  User,
  CreditCard,
  Phone,
  IndianRupee,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const PRICE_PER_BUREAU = 99;

const bureaus = [
  { id: 'cibil', name: 'CIBIL', logo: '🔵' },
  { id: 'experian', name: 'Experian', logo: '🟣' },
  { id: 'equifax', name: 'Equifax', logo: '🔴' },
  { id: 'crif', name: 'CRIF High Mark', logo: '🟢' },
];

interface ClientData {
  full_name: string;
  pan_number: string;
  mobile: string;
  date_of_birth: string;
}

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (clientData: ClientData, bureaus: string[]) => Promise<void>;
  walletBalance: number;
}

export default function GenerateReportDialog({ 
  isOpen, 
  onClose, 
  onGenerate,
  walletBalance 
}: GenerateReportDialogProps) {
  const [clientData, setClientData] = useState<ClientData>({
    full_name: '',
    pan_number: '',
    mobile: '',
    date_of_birth: ''
  });
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalAmount = selectedBureaus.length * PRICE_PER_BUREAU;
  const hasInsufficientBalance = totalAmount > walletBalance;

  const handleBureauToggle = (bureauId: string) => {
    setSelectedBureaus(prev => 
      prev.includes(bureauId) 
        ? prev.filter(b => b !== bureauId)
        : [...prev, bureauId]
    );
  };

  const validateForm = () => {
    if (!clientData.full_name.trim()) {
      toast.error('Please enter client name');
      return false;
    }
    if (!clientData.pan_number.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      toast.error('Please enter valid PAN number');
      return false;
    }
    if (!clientData.mobile.match(/^[6-9]\d{9}$/)) {
      toast.error('Please enter valid mobile number');
      return false;
    }
    if (selectedBureaus.length === 0) {
      toast.error('Please select at least one bureau');
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onGenerate(clientData, selectedBureaus);
      toast.success('Report generated successfully!');
      onClose();
      // Reset form
      setClientData({ full_name: '', pan_number: '', mobile: '', date_of_birth: '' });
      setSelectedBureaus([]);
      setShowConfirm(false);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirm} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Generate Credit Report
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Client Details */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="full_name" className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" /> Client Name
                </Label>
                <Input
                  id="full_name"
                  placeholder="Enter client full name"
                  value={clientData.full_name}
                  onChange={(e) => setClientData({ ...clientData, full_name: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <Label htmlFor="pan_number" className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4" /> PAN Number
                </Label>
                <Input
                  id="pan_number"
                  placeholder="ABCDE1234F"
                  value={clientData.pan_number}
                  onChange={(e) => setClientData({ ...clientData, pan_number: e.target.value.toUpperCase() })}
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" /> Mobile Number
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-md text-slate-600">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    placeholder="9876543210"
                    value={clientData.mobile}
                    onChange={(e) => setClientData({ ...clientData, mobile: e.target.value.replace(/\D/g, '') })}
                    maxLength={10}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dob" className="mb-1 block">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={clientData.date_of_birth}
                  onChange={(e) => setClientData({ ...clientData, date_of_birth: e.target.value })}
                />
              </div>
            </div>

            {/* Bureau Selection */}
            <div>
              <Label className="mb-2 block">Select Credit Bureaus</Label>
              <div className="grid grid-cols-2 gap-2">
                {bureaus.map(bureau => {
                  const isSelected = selectedBureaus.includes(bureau.id);
                  return (
                    <div
                      key={bureau.id}
                      onClick={() => handleBureauToggle(bureau.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={isSelected} className="pointer-events-none" />
                        <span className="text-lg">{bureau.logo}</span>
                        <span className="text-sm font-medium text-slate-700">{bureau.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Reports Selected</span>
                <span className="font-medium">{selectedBureaus.length} bureau(s)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cost per Report</span>
                <span className="font-medium">₹{PRICE_PER_BUREAU}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-medium text-slate-800">Total Amount</span>
                <span className="font-bold text-purple-600 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Wallet Balance</span>
                <span className={`font-medium ${hasInsufficientBalance ? 'text-red-600' : 'text-emerald-600'}`}>
                  ₹{walletBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {hasInsufficientBalance && selectedBureaus.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Insufficient wallet balance. Please load funds first.</span>
              </div>
            )}

            <Button
              onClick={handleProceed}
              disabled={hasInsufficientBalance || selectedBureaus.length === 0 || isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Generate Report (₹${totalAmount} from Wallet)`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Report Generation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Client Name</span>
                <span className="font-medium">{clientData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">PAN</span>
                <span className="font-medium">{clientData.pan_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mobile</span>
                <span className="font-medium">{clientData.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Bureaus</span>
                <span className="font-medium">{selectedBureaus.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-800">Amount to Deduct</span>
              <span className="text-xl font-bold text-purple-700">₹{totalAmount}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirm} 
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm & Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
