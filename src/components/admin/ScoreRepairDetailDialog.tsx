import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScoreRepairRequest } from '@/types';
import { Wrench, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ScoreRepairDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: ScoreRepairRequest | null;
  onUpdateStatus: (requestId: string, status: ScoreRepairRequest['status'], notes?: string) => void;
}

export default function ScoreRepairDetailDialog({ isOpen, onClose, request, onUpdateStatus }: ScoreRepairDetailDialogProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: ScoreRepairRequest['status']) => {
    if (!request) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateStatus(request.id, newStatus, notes);
    setLoading(false);
    setNotes('');
    onClose();
  };

  if (!request) return null;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    contacted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            Score Repair Request
          </DialogTitle>
          <DialogDescription>
            Manage score repair request for {request.user_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium">{request.user_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile</p>
              <p className="font-medium">{request.user_mobile}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{request.user_email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p className="font-medium">{format(new Date(request.created_date), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Score Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Current Score</p>
              <p className="text-2xl font-bold text-red-600">{request.current_score}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center flex items-center justify-center">
              <span className="text-2xl">→</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Target Score</p>
              <p className="text-2xl font-bold text-emerald-600">{request.target_score}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <Badge className={statusColors[request.status]}>{request.status.replace('_', ' ')}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Service Charge</p>
              <p className="font-bold text-lg">₹{request.service_charge}</p>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {request.status === 'pending' && (
              <Button 
                onClick={() => handleStatusUpdate('contacted')}
                disabled={loading}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="w-4 h-4" />
                Mark Contacted
              </Button>
            )}
            
            {(request.status === 'pending' || request.status === 'contacted') && (
              <Button 
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={loading}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Clock className="w-4 h-4" />
                Start Processing
              </Button>
            )}
            
            {request.status === 'in_progress' && (
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={loading}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Completed
              </Button>
            )}
            
            {request.status !== 'completed' && request.status !== 'cancelled' && (
              <Button 
                variant="outline"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={loading}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                Cancel Request
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
