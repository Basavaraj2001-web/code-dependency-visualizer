import { Download, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const STATUS_STYLES = {
    'PENDING': { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20', icon: Clock },
    'IN PROGRESS': { bg: 'bg-brand-purple/10', text: 'text-brand-purple', border: 'border-brand-purple/20', icon: Loader2 },
    'READY': { bg: 'bg-brand-green/10', text: 'text-brand-green', border: 'border-brand-green/20', icon: CheckCircle2 },
    'REVIEW': { bg: 'bg-brand-blue/10', text: 'text-brand-blue', border: 'border-brand-blue/20', icon: AlertCircle },
}

const ARTICLES = [
    { title: 'AI in Healthcare', sender: 'Sanjay (Team 2)', date: 'Mar 4, 2026', status: 'IN PROGRESS' },
    { title: 'Space Exploration Updates', sender: 'Neha (Team 2)', date: 'Mar 4, 2026', status: 'PENDING' },
    { title: 'Economic Forecast Q3', sender: 'Vikram (Team 2)', date: 'Mar 3, 2026', status: 'READY' },
    { title: 'Global Tech Trends 2026', sender: 'Riya (Team 2)', date: 'Mar 3, 2026', status: 'REVIEW' },
    { title: 'Sustainable Energy Policies', sender: 'Rohan (Team 2)', date: 'Mar 2, 2026', status: 'IN PROGRESS' },
    { title: 'Cybersecurity Threat 2026', sender: 'Priya (Team 2)', date: 'Mar 1, 2026', status: 'PENDING' },
]

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || STATUS_STYLES['PENDING']
    const Icon = s.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${s.bg} ${s.text} ${s.border}`}>
            <Icon className="w-3 h-3" /> {status}
        </span>
    )
}

export default function Overview() {
    const handlePull = (title) => console.log('Pulling:', title)

    return (
        <div className="space-y-6 animate-page">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Assigned Articles</h2>
                    <p className="text-sm text-gray-500 mt-0.5">All articles assigned to you from Team 2</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-bg-card border border-white/5 px-4 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                    {ARTICLES.length} articles
                </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
                {['All', 'Pending', 'In Progress', 'Ready', 'Review'].map(f => (
                    <button key={f} className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${f === 'All' ? 'bg-brand-purple/20 border-brand-purple/30 text-brand-purple' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-bg-card rounded-2xl border border-white/5 overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest font-bold text-gray-500 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-4">Article Title</div>
                    <div className="col-span-3">From (Sender)</div>
                    <div className="col-span-2">Assigned Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                    {ARTICLES.map((a, i) => (
                        <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-4">
                                <p className="text-sm font-semibold text-white group-hover:text-brand-purple transition-colors truncate pr-3">{a.title}</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-sm text-gray-400">{a.sender}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">{a.date}</p>
                            </div>
                            <div className="col-span-2">
                                <StatusBadge status={a.status} />
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button
                                    onClick={() => handlePull(a.title)}
                                    className="flex items-center gap-1.5 text-xs text-brand-blue border border-brand-blue/30 bg-brand-blue/5 px-3 py-1.5 rounded-lg hover:bg-brand-blue/15 transition-all"
                                >
                                    <Download className="w-3 h-3" /> Pull
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
