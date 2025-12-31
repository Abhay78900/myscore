import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Partner } from '@/types';
import { Building2 } from 'lucide-react';

interface PartnerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  onSubmit: (data: Partial<Partner> & { password?: string }) => void;
}

export default function PartnerFormDialog({ isOpen, onClose, partner, onSubmit }: PartnerFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pan_number: '',
    password: '',
    commission_rate: '20',
    status: 'active' as 'active' | 'inactive' | 'suspended',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        email: partner.email,
        phone: partner.phone || '',
        address: partner.address || '',
        pan_number: '',
        password: '',
        commission_rate: partner.commission_rate.toString(),
        status: partner.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        pan_number: '',
        password: '',
        commission_rate: '20',
        status: 'active',
      });
    }
  }, [partner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const franchiseId = partner?.franchise_id || `FRN${Date.now().toString().slice(-6)}`;
    
    onSubmit({
      id: partner?.id || `partner_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      owner_email: formData.email,
      franchise_id: franchiseId,
      phone: formData.phone,
      address: formData.address,
      commission_rate: parseFloat(formData.commission_rate),
      status: formData.status,
      wallet_balance: partner?.wallet_balance || 0,
      total_wallet_loaded: partner?.total_wallet_loaded || 0,
      total_sales: partner?.total_sales || 0,
      total_revenue: partner?.total_revenue || 0,
      total_commission_earned: partner?.total_commission_earned || 0,
      total_commission_paid: partner?.total_commission_paid || 0,
      created_date: partner?.created_date || new Date().toISOString(),
      password: formData.password,
    });
    
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {partner ? 'Edit Partner' : 'Create New Partner'}
          </DialogTitle>
          <DialogDescription>
            {partner ? 'Update partner information' : 'Add a new partner or franchise to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                placeholder="Enter business name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="partner@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                value={formData.pan_number}
                onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                maxLength={10}
              />
            </div>

            {!partner && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!partner}
                  minLength={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="50"
                placeholder="20"
                value={formData.commission_rate}
                onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter full business address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : partner ? 'Update Partner' : 'Create Partner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
