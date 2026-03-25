import { useState } from 'react'
import { Bell, CheckSquare, XCircle, AlertTriangle, Clock } from 'lucide-react'

const ALL_NOTIFICATIONS = [
    { id: 1, type: 'assignment', message: 'New article "AI in Healthcare" assigned to you by Lead Editor John.', time: '1h ago', detail: 'Pull the file from the Incoming Queue and begin processing.' },
    { id: 2, type: 'rejection', message: '"Missing Sources Report" has been rejected. Please review the feedback.', time: '3h ago', detail: 'Open the Rejected tab to read editor comments and resubmit.' },
    { id: 3, type: 'reminder', message: 'Reminder: "Economic Forecast Q3" final check is due today.', time: '5h ago', detail: 'Complete all 4 internal checks before 6 PM to meet the deadline.' },
    { id: 4, type: 'assignment', message: 'New briefing doc shared by Editorial Head — Q3 Publishing Guide.', time: 'Yesterday', detail: 'Please review the new Q3 style guide attached.' },
    { id: 5, type: 'reminder', message: 'Weekly progress report is due by EOD.', time: 'Yesterday', detail: 'Submit your report through the portal by 5 PM Friday.' },
    { id: 6, type: 'rejection', message: '"Unverified Financial Data" failed compliance check.', time: '2 days ago', detail: 'All financial figures must be cross-referenced with official market reports.' },
    { id: 7, type: 'assignment', message: '"Space Exploration Updates" assigned — high priority article.', time: '2 days ago', detail: 'This article has a 48-hour processing window.' },
]

const FILTERS = ['All', 'Assignment', 'Rejection', 'Reminder']

const TYPE_CONFIG = {
    assignment: { icon: CheckSquare, color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20', label: 'Assignment' },
    rejection: { icon: XCircle, color: 'text-brand-red bg-brand-red/10 border-brand-red/20', label: 'Rejection' },
    reminder: { icon: AlertTriangle, color: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20', label: 'Reminder' },
}

export default function Notifications() {
    const [activeFilter, setActiveFilter] = useState('All')

    const filtered = activeFilter === 'All'
        ? ALL_NOTIFICATIONS
        : ALL_NOTIFICATIONS.filter(n => TYPE_CONFIG[n.type].label === activeFilter)

    return (
        <div className="space-y-6 animate-page">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <p className="text-sm text-gray-500 mt-0.5">All your assignments, rejections and reminders</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 px-4 py-2 rounded-xl">
                    <Bell className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm font-bold text-brand-purple">{ALL_NOTIFICATIONS.length} Total</span>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${activeFilter === f ? 'bg-brand-purple/20 border-brand-purple/30 text-brand-purple' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notification cards */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="bg-bg-card rounded-2xl border border-white/5 p-12 text-center">
                        <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No notifications in this category</p>
                    </div>
                )}
                {filtered.map((n) => {
                    const cfg = TYPE_CONFIG[n.type]
                    const Icon = cfg.icon
                    return (
                        <div key={n.id} className="bg-bg-card rounded-2xl border border-white/5 hover:border-brand-purple/15 transition-all duration-300 p-5 flex gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${cfg.color}`}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-semibold text-white leading-relaxed">{n.message}</p>
                                    <span className="text-[10px] text-gray-600 flex-shrink-0 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />{n.time}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{n.detail}</p>
                                <span className={`inline-block mt-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${cfg.color}`}>
                                    {cfg.label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
