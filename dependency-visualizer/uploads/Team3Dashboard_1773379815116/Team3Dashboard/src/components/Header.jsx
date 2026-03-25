import { useState } from 'react'
import { Search, UserCircle, Bell, Settings, X, Mail, ShieldCheck, CheckSquare, XCircle, AlertTriangle, Clock } from 'lucide-react'

const BREADCRUMBS = {
    dashboard: 'Dashboard',
    overview: 'Overview',
    'my-work': 'My Work',
    completed: 'Completed',
    rejected: 'Rejected',
    notifications: 'Notifications',
}

const NOTIFICATIONS = [
    { id: 1, type: 'assignment', message: 'New article "AI in Healthcare" assigned to you by Lead Editor John.', time: '1h ago', color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20' },
    { id: 2, type: 'rejection', message: '"Missing Sources Report" was rejected. Please review feedback.', time: '3h ago', color: 'text-brand-red bg-brand-red/10 border-brand-red/20' },
    { id: 3, type: 'reminder', message: 'Reminder: "Economic Forecast Q3" final check is due today.', time: 'Yesterday', color: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20' },
    { id: 4, type: 'assignment', message: 'New briefing doc shared by Editorial Head — Q3 Publishing Guide.', time: 'Yesterday', color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20' },
    { id: 5, type: 'reminder', message: 'Weekly progress report is due by EOD.', time: '2 days ago', color: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20' },
]

const TypeIcon = ({ type }) => {
    if (type === 'assignment') return <CheckSquare className="w-4 h-4" />
    if (type === 'rejection') return <XCircle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
}

export default function Header({ activeTab, setActiveTab }) {
    const [profileOpen, setProfileOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)

    const label = BREADCRUMBS[activeTab] || 'Dashboard'

    const toggleProfile = () => { setProfileOpen(p => !p); setNotifOpen(false) }
    const toggleNotif = () => { setNotifOpen(n => !n); setProfileOpen(false) }

    return (
        <header className="fixed top-0 right-0 left-64 h-20 bg-bg-dark/85 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
            {/* Left: breadcrumb */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                    <span>Team 3</span>
                    <span className="opacity-30">/</span>
                    <span className="text-gray-300">{label}</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">{label}</h1>
            </div>

            {/* Right: search + profile + notif */}
            <div className="flex items-center gap-5">
                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-purple transition-colors" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="bg-bg-card border border-white/5 rounded-xl pl-10 pr-4 py-2 w-56 text-sm text-white focus:ring-1 focus:ring-brand-purple/40 outline-none transition-all placeholder:text-gray-600"
                    />
                </div>

                <div className="flex items-center gap-3 border-l border-white/10 pl-5 h-8 relative">
                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={toggleProfile}
                            className={`hover:text-white transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg ${profileOpen ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                        >
                            <UserCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-xs font-bold tracking-wide">David</span>
                        </button>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-72 bg-bg-dark border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-60">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">My Profile</span>
                                    <button onClick={() => setProfileOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                                    </button>
                                </div>
                                <div className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-brand-purple/20 border-2 border-brand-purple/30 flex items-center justify-center">
                                            <UserCircle className="w-12 h-12 text-brand-purple" />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand-green rounded-full border-2 border-bg-dark" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">David</h3>
                                        <p className="text-[10px] text-brand-purple font-bold uppercase tracking-wider mt-0.5">Senior Publisher</p>
                                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                                            <Mail className="w-3 h-3 text-gray-500" />
                                            <p className="text-xs text-gray-400">david@archelos.com</p>
                                        </div>
                                    </div>
                                    <div className="w-full pt-3 border-t border-white/5">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Supervision</span>
                                            </div>
                                            <p className="text-xs font-bold text-white">
                                                Under: <span className="text-brand-purple">Lead Editor John</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 bg-white/5 border-t border-white/5">
                                    <button className="flex-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                                        <Settings className="w-3.5 h-3.5" /> Settings
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={toggleNotif}
                            className={`relative p-2 rounded-lg transition-all ${notifOpen ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border-2 border-bg-dark shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
                        </button>

                        {notifOpen && (
                            <div className="absolute top-12 right-0 w-80 bg-bg-dark border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-60">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Recent Alerts</span>
                                    <button onClick={() => setNotifOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                                    </button>
                                </div>
                                <div className="py-1 divide-y divide-white/5 max-h-[380px] overflow-y-auto custom-scrollbar">
                                    {NOTIFICATIONS.map(n => (
                                        <div key={n.id} className="p-4 hover:bg-white/[0.03] transition-colors">
                                            <div className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${n.color}`}>
                                                    <TypeIcon type={n.type} />
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <p className="text-xs font-semibold text-white leading-relaxed">{n.message}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                        <Clock className="w-3 h-3" />{n.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { setActiveTab('notifications'); setNotifOpen(false) }}
                                    className="w-full py-3.5 bg-white/5 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple hover:text-white hover:bg-brand-purple/10 transition-all flex items-center justify-center gap-2"
                                >
                                    View All Notifications <Bell className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
