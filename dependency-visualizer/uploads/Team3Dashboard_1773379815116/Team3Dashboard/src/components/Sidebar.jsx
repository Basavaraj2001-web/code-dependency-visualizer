import { LayoutDashboard, ListChecks, FileEdit, CheckCircle2, XCircle, Bell, LogOut } from 'lucide-react'

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'overview', label: 'Overview', icon: ListChecks },
    { id: 'my-work', label: 'My Work', icon: FileEdit },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function Sidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-dark/90 backdrop-blur-md text-white flex flex-col z-50 border-r border-white/5">
            {/* Logo */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
                        <span className="text-brand-purple font-black text-sm">T3</span>
                    </div>
                    <div>
                        <h2 className="text-base font-black tracking-tight text-brand-purple leading-none">TEAM 3</h2>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Publishing Portal</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-white/5 mb-4" />

            {/* Nav */}
            <nav className="flex flex-col gap-1.5 px-4 flex-1 overflow-y-auto custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left ${isActive
                                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/25'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]" />
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-white/5 mt-auto">
                {/* Employee badge */}
                <div className="mb-3 px-4 py-3 rounded-xl bg-brand-purple/5 border border-brand-purple/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Logged in as</p>
                    <p className="text-xs font-bold text-white">David</p>
                    <p className="text-[10px] text-brand-purple">Senior Publisher · Team 3</p>
                </div>
                <button
                    onClick={() => setActiveTab('signout')}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-xl w-full text-gray-400 hover:text-brand-red hover:bg-brand-red/5 transition-all group"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-brand-red transition-colors" />
                    <span className="text-sm font-semibold tracking-wide">Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
