import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Partner } from '@/types';
import { Plus, Minus } from 'lucide-react';

interface WalletManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  type: 'add' | 'deduct';
  onConfirm: (partnerId: string, amount: number, description: string) => void;
}

export default function WalletManagementDialog({ isOpen, onClose, partner, type, onConfirm }: WalletManagementDialogProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner || !amount || parseFloat(amount) <= 0) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onConfirm(partner.id, parseFloat(amount), description || (type === 'add' ? 'Admin credit' : 'Admin debit'));
    setLoading(false);
    setAmount('');
    setDescription('');
    onClose();
  };

  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'add' ? (
              <Plus className="w-5 h-5 text-emerald-600" />
            ) : (
              <Minus className="w-5 h-5 text-red-600" />
            )}
            {type === 'add' ? 'Add Funds' : 'Deduct Funds'}
          </DialogTitle>
          <DialogDescription>
            {type === 'add' ? 'Add funds to' : 'Deduct funds from'} {partner.name}'s wallet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold text-foreground">₹{partner.wallet_balance.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder={type === 'add' ? 'e.g., Monthly top-up' : 'e.g., Refund adjustment'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">New Balance</p>
              <p className={`text-2xl font-bold ${type === 'add' ? 'text-emerald-600' : 'text-red-600'}`}>
                ₹{(partner.wallet_balance + (type === 'add' ? parseFloat(amount) : -parseFloat(amount))).toLocaleString()}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className={type === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? 'Processing...' : type === 'add' ? 'Add Funds' : 'Deduct Funds'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
