import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFeedbacks } from "@/app/actions/feedbackActions";
import FeedbackClient from "./FeedbackClient";

export const metadata = {
  title: 'Feedback Admin | Mark Tracker',
};

export default async function AdminFeedbackPage() {
  const session = await auth();

  if (!session || session.user?.role !== 'admin') {
    redirect("/");
  }

  const result = await getFeedbacks();

  if (result.error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">
          {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">User Feedback</h1>
          <p className="text-slate-600">Review and manage feedback submitted by users.</p>
        </div>

        <FeedbackClient initialFeedbacks={result.feedbacks || []} />
      </div>
    </div>
  );
}
