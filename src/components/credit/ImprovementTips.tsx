import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Clock,
  CreditCard,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { cn } from "@/lib/utils";

const tipCategories = [
  {
    id: 'payment',
    icon: Clock,
    title: 'Payment History',
    color: 'from-blue-500 to-blue-600',
    tips: [
      'Set up auto-pay for all EMIs and credit card bills',
      'Pay at least minimum due on credit cards before due date',
      'Keep payment reminders 5 days before due dates',
      'If facing difficulties, contact lender before missing payment'
    ]
  },
  {
    id: 'utilization',
    icon: CreditCard,
    title: 'Credit Utilization',
    color: 'from-purple-500 to-purple-600',
    tips: [
      'Keep credit card utilization below 30%',
      'Request credit limit increase to lower utilization ratio',
      'Pay off credit card dues before statement date',
      'Spread expenses across multiple cards if available'
    ]
  },
  {
    id: 'age',
    icon: Calendar,
    title: 'Credit Age',
    color: 'from-teal-500 to-teal-600',
    tips: [
      'Keep your oldest credit accounts open',
      'Avoid closing old credit cards even if unused',
      'Use old accounts occasionally to keep them active',
      'Be patient - credit age improves naturally over time'
    ]
  },
  {
    id: 'mix',
    icon: Shield,
    title: 'Credit Mix',
    color: 'from-amber-500 to-amber-600',
    tips: [
      'Maintain a healthy mix of secured and unsecured credit',
      'Consider having both loan and credit card accounts',
      'Only take new credit when genuinely needed',
      'Avoid too many unsecured loans'
    ]
  },
  {
    id: 'enquiries',
    icon: Search,
    title: 'New Credit',
    color: 'from-red-500 to-red-600',
    tips: [
      'Avoid multiple loan applications in short period',
      'Check eligibility using soft inquiry tools first',
      'Space out credit applications by 3-6 months',
      'Focus on getting approved for existing applications'
    ]
  }
];

interface ImprovementTipsProps {
  report: {
    score_factors?: {
      payment_history?: number;
      credit_utilization?: number;
      credit_age?: number;
      credit_mix?: number;
      new_credit?: number;
    };
  };
}

export default function ImprovementTips({ report }: ImprovementTipsProps) {
  const scoreFactors = report.score_factors || {};
  
  // Sort categories by priority (lowest scores first)
  const prioritizedCategories = [...tipCategories].sort((a, b) => {
    const aScore = (scoreFactors as any)[a.id === 'enquiries' ? 'new_credit' : a.id === 'age' ? 'credit_age' : a.id === 'mix' ? 'credit_mix' : a.id] || 50;
    const bScore = (scoreFactors as any)[b.id === 'enquiries' ? 'new_credit' : b.id === 'age' ? 'credit_age' : b.id === 'mix' ? 'credit_mix' : b.id] || 50;
    return aScore - bScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Credit Improvement Tips</h2>
        </div>
        <p className="text-teal-100">
          Follow these personalized recommendations to improve your credit score over time.
          Improvements typically take 3-6 months to reflect in your score.
        </p>
      </motion.div>

      {/* Priority Action */}
      {prioritizedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Priority Focus Area</h3>
              <p className="text-amber-700">
                Based on your credit profile, focus on improving your <strong>{prioritizedCategories[0].title}</strong> first.
                This factor has the most room for improvement.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips Categories */}
      <div className="space-y-4">
        {prioritizedCategories.map((category, index) => {
          const Icon = category.icon;
          const factorKey = category.id === 'enquiries' ? 'new_credit' : category.id === 'age' ? 'credit_age' : category.id === 'mix' ? 'credit_mix' : category.id;
          const score = (scoreFactors as any)[factorKey] || 50;
          const status = score >= 80 ? 'good' : score >= 60 ? 'moderate' : 'needs_work';

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              <div className={cn(
                "p-4 flex items-center justify-between",
                `bg-gradient-to-r ${category.color}`
              )}>
                <div className="flex items-center gap-3 text-white">
                  <Icon className="w-6 h-6" />
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  status === 'good' ? "bg-white/20 text-white" :
                  status === 'moderate' ? "bg-white/30 text-white" :
                  "bg-white text-slate-700"
                )}>
                  {status === 'good' ? 'On Track' : status === 'moderate' ? 'Moderate' : 'Needs Work'}
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-50 rounded-xl p-5"
      >
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Expected Improvement Timeline
        </h3>
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-teal-200" />
          <div className="space-y-4 ml-8">
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 bg-teal-500 rounded-full" />
              <div>
                <p className="font-medium text-slate-700">1-2 Months</p>
                <p className="text-sm text-slate-500">Payment history improvements start reflecting</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 bg-teal-400 rounded-full" />
              <div>
                <p className="font-medium text-slate-700">3-4 Months</p>
                <p className="text-sm text-slate-500">Credit utilization changes affect score</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] w-3 h-3 bg-teal-300 rounded-full" />
              <div>
                <p className="font-medium text-slate-700">6+ Months</p>
                <p className="text-sm text-slate-500">Significant score improvement visible</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
