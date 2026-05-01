'use client';

import { useState } from 'react';
import { Bug, Lightbulb, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedbackActions';


const feedbackOptions = [
  { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', active: 'ring-red-500' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', active: 'ring-amber-500' },
  { id: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', active: 'ring-blue-500' },
];

export default function FeedbackSection() {
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType || !message.trim()) return;

    setIsSubmitting(true);
    
    const result = await submitFeedback(feedbackType, message);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSuccess(true);
      // Reset form after a few seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFeedbackType(null);
        setMessage('');
      }, 4000);
    } else {
      alert(result.error || "Failed to submit feedback");
    }
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">We Value Your Feedback</h2>
          <p className="text-lg text-slate-700 font-light max-w-2xl mx-auto">
            Help us improve Mark Tracker. Let us know if you found a bug, want a new feature, or have general suggestions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-500">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Thank You for Your Feedback!</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                We&apos;ve received your message and our team will look into it. Your input is vital in making Mark Tracker better.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in fade-in duration-500">
              {/* Type Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  1. Select Feedback Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFeedbackType(option.id)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                        feedbackType === option.id
                          ? `${option.bg} ${option.border} ${option.active} ring-2 ring-offset-2 scale-[1.02] sm:scale-105`
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <option.icon size={28} className={feedbackType === option.id ? option.color : 'text-slate-400'} />
                      <span className={`text-sm font-bold ${feedbackType === option.id ? 'text-slate-900' : 'text-slate-500'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className={`space-y-4 transition-all duration-500 ${feedbackType ? 'opacity-100 max-h-125' : 'opacity-50 max-h-125 grayscale-50'}`}>
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                  <span>2. Tell us more details</span>
                  <span className="text-slate-400 font-medium">{message.length}/500</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={feedbackType ? "What's on your mind?" : "Please select a feedback type first..."}
                  className="w-full text-base border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-32 placeholder:text-slate-400"
                  maxLength={500}
                  required
                  disabled={!feedbackType}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!feedbackType || !message.trim() || isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
