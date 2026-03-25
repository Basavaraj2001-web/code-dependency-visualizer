import { Download, XCircle, MessageSquare } from 'lucide-react'

const REJECTED = [
    {
        title: 'Missing Sources Report',
        rejector: 'Editor Alex',
        sender: 'Team 2 – Rohit',
        reason: 'FAILED FINAL CHECK',
        feedback: 'Sources unverified. Please cross-reference all claims and resubmit with citations.',
        date: 'Mar 3, 2026',
    },
    {
        title: 'Unverified Financial Data',
        rejector: 'Compliance Team',
        sender: 'Team 2 – Priya',
        reason: 'COMPLIANCE ISSUE',
        feedback: 'Financial figures do not match official reports. Requires data audit.',
        date: 'Mar 2, 2026',
    },
    {
        title: 'Incomplete Investigation Piece',
        rejector: 'Lead Editor John',
        sender: 'Team 2 – Ankit',
        reason: 'INCOMPLETE CONTENT',
        feedback: 'Article lacks a conclusion and three key interview quotes are missing.',
        date: 'Feb 28, 2026',
    },
]

export default function Rejected() {
    return (
        <div className="space-y-6 animate-page">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Rejected Articles</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Articles rejected with feedback — review and resubmit</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 px-4 py-2 rounded-xl">
                    <XCircle className="w-4 h-4 text-brand-red" />
                    <span className="text-sm font-bold text-brand-red">{REJECTED.length} Rejected</span>
                </div>
            </div>

            <div className="space-y-4">
                {REJECTED.map((a, i) => (
                    <div key={i} className="bg-bg-card rounded-2xl border border-white/5 hover:border-brand-red/20 transition-all duration-300 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-red/10 text-brand-red border border-brand-red/20">
                                            {a.reason}
                                        </span>
                                        <span className="text-[10px] text-gray-600">{a.date}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-white">{a.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                        <span>Rejected by: <span className="text-gray-400 font-medium">{a.rejector}</span></span>
                                        <span>From: <span className="text-gray-400 font-medium">{a.sender}</span></span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-brand-red/30 bg-brand-red/5 text-brand-red hover:bg-brand-red/15 transition-all">
                                        <Download className="w-3.5 h-3.5" /> View File
                                    </button>
                                </div>
                            </div>

                            {/* Feedback box */}
                            <div className="mt-4 bg-brand-red/5 border border-brand-red/15 rounded-xl p-4 flex gap-3">
                                <MessageSquare className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-1">Editor Feedback</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{a.feedback}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
