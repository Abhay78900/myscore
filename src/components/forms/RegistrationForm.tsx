import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, User, Phone, Calendar, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

interface FormData {
  full_name: string;
  pan_number: string;
  mobile: string;
  date_of_birth: string;
  email: string;
  consent: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    pan_number: '',
    mobile: '',
    date_of_birth: '',
    email: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const validateMobile = (mobile: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required';
    }
    if (!validatePAN(formData.pan_number)) {
      newErrors.pan_number = 'Invalid PAN format';
    }
    if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.consent) {
      newErrors.consent = 'Please accept the terms';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        pan_number: formData.pan_number.toUpperCase(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Enter Your Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name (as per PAN)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`pl-10 ${errors.full_name ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name}</p>
                )}
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <Label htmlFor="pan_number">PAN Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="pan_number"
                    placeholder="ABCDE1234F"
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                    maxLength={10}
                    className={`pl-10 uppercase ${errors.pan_number ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.pan_number && (
                  <p className="text-sm text-destructive">{errors.pan_number}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className={`pl-10 ${errors.mobile ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-sm text-destructive">{errors.mobile}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className={`pl-10 ${errors.date_of_birth ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
              />
              <div className="text-sm">
                <Label htmlFor="consent" className="font-normal cursor-pointer">
                  I authorize CreditCheck to fetch my credit reports from all bureaus. I have read and agree to the{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </Label>
                {errors.consent && (
                  <p className="text-destructive mt-1">{errors.consent}</p>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Select Reports'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegistrationForm;
