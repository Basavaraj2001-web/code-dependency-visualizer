import { useState } from 'react'
import { CheckCircle2, XCircle, Send, FileText, Shield, AlignLeft, Search, Flame, LayoutTemplate } from 'lucide-react'

const CHECKLIST_ITEMS = [
    { id: 'fact', label: 'Fact Check', icon: Shield },
    { id: 'legal', label: 'Legal Review', icon: FileText },
    { id: 'format', label: 'Format Check', icon: AlignLeft },
    { id: 'seo', label: 'SEO Config', icon: Search },
]

const ACTIVE_TASKS = [
    {
        id: 1,
        title: 'AI in Healthcare',
        sender: 'Sanjay (Team 2)',
        priority: 'HIGH',
        checks: { fact: true, legal: false, format: true, seo: false },
        colorClass: 'brand-purple',
        hex: '#8b5cf6'
    },
    {
        id: 2,
        title: 'Sustainable Energy Policies',
        sender: 'Rohan (Team 2)',
        priority: 'MEDIUM',
        checks: { fact: true, legal: true, format: false, seo: false },
        colorClass: 'brand-blue',
        hex: '#3b82f6'
    },
    {
        id: 3,
        title: 'Space Exploration Updates',
        sender: 'Neha (Team 2)',
        priority: 'LOW',
        checks: { fact: false, legal: false, format: false, seo: false },
        colorClass: 'brand-green',
        hex: '#10b981'
    },
]

const PRIORITY = {
    HIGH: 'text-brand-red bg-brand-red/10 border-brand-red/20',
    MEDIUM: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
    LOW: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
}

function TaskCard({ task }) {
    const [checks, setChecks] = useState(task.checks)

    const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }))
    const allDone = Object.values(checks).every(Boolean)
    const doneCount = Object.values(checks).filter(Boolean).length
    const progress = (doneCount / 4) * 100

    return (
        <div className="bg-gradient-to-b from-[#1a1f3c] to-[#12162b] rounded-3xl border border-purple-900/40 hover:border-brand-purple/40 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500 overflow-hidden flex flex-col group">
            {/* Card header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${PRIORITY[task.priority]}`}>
                                {task.priority} PRIORITY
                            </span>
                            {task.priority === 'HIGH' && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-md">
                                    <Flame className="w-2.5 h-2.5" /> Due Soon
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-white group-hover:text-brand-purple transition-colors">{task.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Forwarded by: <span className="text-gray-300">{task.sender}</span></p>
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-bold px-0.5">
                        <span className="text-gray-400 uppercase tracking-widest text-[10px]">Readiness</span>
                        <span className={`text-${task.colorClass}`}>{progress}%</span>
                    </div>
                    <div className="h-2 bg-[#0a0f1a] rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full bg-${task.colorClass} shadow-[0_0_10px_${task.hex}] rounded-full transition-all duration-700`} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Checklist */}
            <div className="p-6 grid grid-cols-2 gap-3 flex-1 bg-[#111827]/50">
                {CHECKLIST_ITEMS.map(item => {
                    const Icon = item.icon
                    const done = checks[item.id]
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggle(item.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${done ? 'bg-brand-green/10 border-brand-green/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-brand-green hover:bg-brand-green/20' : 'bg-[#0a0f1a] border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'}`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${done ? 'bg-brand-green text-black' : 'bg-gray-800 text-gray-400'}`}>
                                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">{item.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Action bar */}
            <div className="p-6 pt-0 bg-[#111827]/50 flex gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl border border-brand-red/30 bg-brand-red/5 text-brand-red hover:bg-brand-red/15 hover:border-brand-red/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all flex-1">
                    <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                    disabled={!allDone}
                    className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex-[2] ${allDone ? 'bg-brand-green text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-[1.02] cursor-pointer' : 'bg-[#0a0f1a] text-gray-600 cursor-not-allowed border border-gray-800'}`}
                >
                    <Send className="w-4 h-4" /> {allDone ? 'Publish' : 'Pending Tasks'}
                </button>
            </div>
        </div>
    )
}

export default function MyWork() {
    return (
        <div className="space-y-7 animate-page relative">

            {/* Page Header matching DashboardHome */}
            <div className="bg-gradient-to-r from-[#0f1a35] via-[#111d40] to-transparent border border-brand-blue/20 rounded-2xl p-7 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)' }} />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
                                <LayoutTemplate className="w-3 h-3" /> Active Work Queue
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">My Active Work</h2>
                        <p className="text-sm text-gray-300 mt-2 font-medium">Complete all mandated checks before forwarding your items to publishing.</p>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Queue Status</div>
                        <div className="flex items-center gap-2 bg-[#0a0f1a] px-4 py-2 rounded-xl border border-gray-800">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="text-sm font-black text-white tabular-nums">{ACTIVE_TASKS.length} Pending</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {ACTIVE_TASKS.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
        </div>
    )
}
