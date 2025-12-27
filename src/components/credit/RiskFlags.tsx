import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface RiskFlagsProps {
  flags?: string[];
  isHighRisk?: boolean;
}

export default function RiskFlags({ flags, isHighRisk }: RiskFlagsProps) {
  if (!flags || flags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center"
      >
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-emerald-800">No Risk Flags</h3>
        <p className="text-emerald-600 mt-1">Your credit profile looks healthy!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {isHighRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">High Risk Profile</h3>
            <p className="text-sm text-red-600">Multiple risk factors detected. Immediate attention recommended.</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {flags.map((flag, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">{flag}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mt-4">
        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          How to Improve
        </h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            Pay all EMIs and credit card bills on time
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            Keep credit utilization below 30%
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            Avoid multiple loan applications in short period
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            Maintain a healthy mix of secured and unsecured credit
          </li>
        </ul>
      </div>
    </div>
  );
}
