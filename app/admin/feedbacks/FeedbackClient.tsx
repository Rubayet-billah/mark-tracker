'use client';

import { useState } from 'react';
import { updateFeedbackStatus } from '@/app/actions/feedbackActions';
import { Bug, Lightbulb, MessageCircle, CheckCircle, Clock, CheckCircle2 } from 'lucide-react';

type Feedback = {
  _id: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  submittedBy?: {
    name: string;
    email: string;
  };
};

export default function FeedbackClient({ initialFeedbacks }: { initialFeedbacks: Feedback[] }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const result = await updateFeedbackStatus(id, newStatus);
    if (result.success && result.feedback) {
      setFeedbacks((prev) => 
        prev.map((fb) => fb._id === id ? { ...fb, status: result.feedback.status } : fb)
      );
    } else {
      alert(result.error || "Failed to update status");
    }
    setUpdatingId(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug size={20} className="text-red-500" />;
      case 'feature': return <Lightbulb size={20} className="text-amber-500" />;
      case 'general': return <MessageCircle size={20} className="text-blue-500" />;
      default: return <MessageCircle size={20} className="text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold"><Clock size={14} /> Pending</span>;
      case 'reviewed': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold"><CheckCircle size={14} /> Reviewed</span>;
      case 'resolved': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold"><CheckCircle2 size={14} /> Resolved</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">{status}</span>;
    }
  };

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <MessageCircle size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No feedback yet</h3>
        <p className="text-slate-500">There are currently no feedback submissions to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold w-16 text-center">Type</th>
              <th className="px-6 py-4 font-semibold w-[30%]">User</th>
              <th className="px-6 py-4 font-semibold w-[40%]">Message</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Date</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Status</th>
              <th className="px-6 py-4 font-semibold text-right w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center" title={fb.type}>
                    {getIcon(fb.type)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {fb.submittedBy ? (
                    <div>
                      <div className="font-bold text-slate-900">{fb.submittedBy.name}</div>
                      <div className="text-xs text-slate-500">{fb.submittedBy.email}</div>
                    </div>
                  ) : (
                    <div className="italic text-slate-400">Anonymous</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-700 whitespace-pre-wrap">{fb.message}</p>
                </td>
                <td className="px-6 py-4 text-center text-slate-600">
                  {new Date(fb.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(fb.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <select 
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    value={fb.status}
                    onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                    disabled={updatingId === fb._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
