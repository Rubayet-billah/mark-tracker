'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Bug, Lightbulb, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedbackActions';


const feedbackOptions = [
  { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', active: 'ring-red-500' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', active: 'ring-amber-500' },
  { id: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', active: 'ring-blue-500' },
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType) return;
    
    setIsSubmitting(true);
    
    const result = await submitFeedback(feedbackType, message);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSuccess(true);
      // Auto close and reset after success
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setFeedbackType(null);
          setMessage('');
        }, 300);
      }, 2500);
    } else {
      alert(result.error || "Failed to submit feedback");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open feedback form"
      >
        <MessageSquarePlus size={24} className="animate-pulse-slow" />
      </button>

      {/* Feedback Panel */}
      <div
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-3rem)] sm:w-95 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden transition-all duration-400 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquarePlus size={18} className="text-blue-600" />
            Send Feedback
          </h3>
          <button
            onClick={() => !isSubmitting && setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Thank You!</h4>
              <p className="text-sm text-slate-500">
                Your feedback helps us improve MarkTracker.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  What kind of feedback?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFeedbackType(option.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                        feedbackType === option.id
                          ? `${option.bg} ${option.border} ring-1 ${option.active}`
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <option.icon size={20} className={feedbackType === option.id ? option.color : 'text-slate-400'} />
                      <span className={`text-[10px] sm:text-xs font-medium text-center ${feedbackType === option.id ? 'text-slate-800' : 'text-slate-500'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className={`space-y-2 transition-all duration-300 ${feedbackType ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Details</span>
                  <span className="text-slate-400 font-normal">{message.length}/500</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-25 placeholder:text-slate-400"
                  maxLength={500}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!feedbackType || !message.trim() || isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
