import { useState } from 'react'
import { Clock, TrendingUp, Zap, List, Download, User, CheckCircle, XCircle, MonitorCheck, Flame } from 'lucide-react'

const INCOMING_QUEUE = [
    { name: 'Sanjay', title: 'Global Tech Trends 2026', priority: 'HIGH' },
    { name: 'Neha', title: 'Space Exploration Updates', priority: 'MEDIUM' },
    { name: 'Vikram', title: 'Economic Forecast Q3', priority: 'LOW' },
]

const TODAY_TASKS = [
    { title: 'AI in Healthcare', pct: 75, color: 'bg-brand-purple', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.5)]', label: 'text-brand-purple' },
    { title: 'Space Exploration Updates', pct: 45, color: 'bg-brand-blue', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]', label: 'text-brand-blue' },
    { title: 'Sustainable Energy Policies', pct: 100, color: 'bg-brand-green', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]', label: 'text-brand-green' },
    { title: 'Economic Forecast Q3', pct: 10, color: 'bg-brand-orange', glow: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]', label: 'text-brand-orange' },
]

const WEEKLY_BARS = [55, 70, 45, 90, 60, 80, 65]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DashboardHome() {
    return (
        <div className="space-y-7 animate-page">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-brand-purple/20 via-brand-blue/10 to-transparent border border-brand-purple/20 rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-brand-purple font-bold mb-1">Welcome back</p>
                    <h2 className="text-2xl font-black text-white">Good afternoon, David 👋</h2>
                    <p className="text-sm text-gray-400 mt-1">You have <span className="text-brand-purple font-bold">3 articles</span> ready for final check today.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 px-5 py-3 rounded-xl">
                    <Zap className="w-4 h-4 text-brand-purple" />
                    <span className="text-sm font-bold text-white">Senior Publisher</span>
                </div>
            </div>

            {/* Pipeline Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'TOTAL RECEIVED', value: '32', color: '#4f8ef7' },
                    { label: 'TOTAL PUBLISHED', value: '14', color: '#10d988' },
                    { label: 'TOTAL REJECTED', value: '5', color: '#f04b4b' },
                    { label: 'SENT TO TEAM 2', value: '4', color: '#8b5cf6' },
                    { label: 'IN PROGRESS', value: '7', color: '#fbbf24' },
                    { label: 'READY TO PUBLISH', value: '3', color: '#22d3ee' },
                ].map((m, i) => (
                    <div key={i} className="bg-[#111827] p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all cursor-default">
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: m.color }}>{m.label}</p>
                        <h4 className="text-2xl font-bold text-white tabular-nums">{m.value}</h4>
                    </div>
                ))}
            </div>

            {/* Incoming Queue */}
            <div className="bg-gradient-to-br from-[#1a1f3c] to-[#12162b] border border-purple-900/40 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="flex items-center gap-2 font-bold text-white">
                        <List className="w-4 h-4 text-orange-400" /> Incoming Queue
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                        {INCOMING_QUEUE.length} new
                    </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-12 text-[10px] uppercase tracking-wider font-bold text-gray-500 pb-3 border-b border-gray-800">
                    <p className="col-span-2">Name</p>
                    <p className="col-span-7">Title</p>
                    <p className="col-span-2">Priority</p>
                    <p className="col-span-1 text-right">Action</p>
                </div>

                {/* Rows */}
                {INCOMING_QUEUE.map((row, i) => {
                    const pColor = row.priority === 'HIGH'
                        ? 'text-brand-red bg-brand-red/10 border-brand-red/20'
                        : row.priority === 'MEDIUM'
                            ? 'text-brand-orange bg-brand-orange/10 border-brand-orange/20'
                            : 'text-brand-blue bg-brand-blue/10 border-brand-blue/20'
                    return (
                        <div key={i} className="grid grid-cols-12 items-center py-4 border-t border-gray-800 text-sm group hover:bg-white/[0.02] transition-colors -mx-6 px-6">
                            <p className="col-span-2 text-gray-300 font-medium">{row.name}</p>
                            <p className="col-span-7 text-white font-semibold group-hover:text-brand-purple transition-colors">{row.title}</p>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border ${pColor}`}>
                                    {row.priority}
                                </span>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button
                                    onClick={() => console.log('Pulling:', row.title)}
                                    className="flex items-center gap-1.5 text-brand-blue text-xs border border-brand-blue/40 bg-brand-blue/5 px-3 py-1.5 rounded-lg hover:bg-brand-blue/15 hover:scale-105 transition-all"
                                >
                                    <Download className="w-3 h-3" /> Pull File
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Editor to Publish — Action Bar */}
            <div className="relative overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-[#0f1a35] via-[#111d40] to-[#0a1628] p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)]">
                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)' }} />

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left — article info */}
                    <div className="flex items-center gap-5">
                        {/* Progress ring */}
                        <div className="relative flex-shrink-0 w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle cx="32" cy="32" r="26" fill="none" stroke="#3b82f6" strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 26}`}
                                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - 0.75)}`}
                                    className="transition-all duration-700"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.8))' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-black text-brand-blue">75%</span>
                            </div>
                        </div>

                        {/* Article meta */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-blue/60">Editor to Publish</span>
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                                    <Flame className="w-2.5 h-2.5" /> Due Today
                                </span>
                                {/* Live pulse */}
                                <span className="flex items-center gap-1 text-[9px] text-brand-green font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> LIVE
                                </span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Active Title</p>
                            <h2 className="text-xl font-black text-white tracking-tight">AI in Healthcare</h2>
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-brand-blue font-medium">
                                <User className="w-3.5 h-3.5" />
                                <span>David</span>
                                <span className="text-gray-600">·</span>
                                <span className="text-gray-400">Senior Publisher</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — action buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-brand-blue/30 bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/15 hover:border-brand-blue/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-200">
                            <MonitorCheck className="w-4 h-4" /> Local Check
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-brand-red/30 bg-brand-red/5 text-brand-red hover:bg-brand-red/10 hover:border-brand-red/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-200">
                            <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-black rounded-xl bg-brand-green text-black shadow-[0_0_24px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:shadow-[0_0_32px_rgba(16,185,129,0.6)] transition-all duration-200 hover:scale-105">
                            <CheckCircle className="w-4 h-4" /> APPROVED
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Task Progress */}
                <div className="bg-bg-card p-7 rounded-3xl border border-white/5 hover:border-brand-purple/20 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-7">
                        <h3 className="text-base font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-purple" /> Today's Task Progress
                        </h3>
                        <span className="text-[10px] text-brand-purple font-bold bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">Live</span>
                    </div>
                    <div className="space-y-5">
                        {TODAY_TASKS.map((t, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold px-0.5">
                                    <span className="text-gray-300 truncate pr-4">{t.title}</span>
                                    <span className={t.label + ' font-bold flex-shrink-0'}>{t.pct}%</span>
                                </div>
                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className={`h-full ${t.color} ${t.glow} rounded-full transition-all duration-700`} style={{ width: `${t.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Publishing Chart */}
                <div className="bg-bg-card p-7 rounded-3xl border border-white/5 hover:border-brand-purple/20 transition-all duration-500 group flex flex-col">
                    <div className="flex items-center justify-between mb-7">
                        <h3 className="text-base font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-green" /> Weekly Publishing
                        </h3>
                        <span className="text-[10px] text-brand-green font-bold bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">This Week</span>
                    </div>
                    <div className="flex-1 flex items-end gap-3 h-32">
                        {WEEKLY_BARS.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                <div
                                    className="w-full bg-brand-green/20 rounded-t-lg hover:bg-brand-green/50 transition-all duration-500 relative group/bar cursor-default"
                                    style={{ height: `${h}%`, minHeight: 4 }}
                                >
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-bold text-brand-green whitespace-nowrap">
                                        {h}%
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">{DAYS[i]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp className="w-4 h-4 text-brand-green" />
                        <span>Published rate <span className="text-brand-green font-bold">+15%</span> vs last week</span>
                    </div>
                </div>
            </div>

            {/* Performance Trend Chart */}
            <div className="bg-bg-card p-7 rounded-3xl border border-white/5 hover:border-brand-purple/20 transition-all duration-500 group">
                <div className="flex items-center justify-between mb-7">
                    <h3 className="text-base font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-purple" /> Performance Trend
                    </h3>
                    <div className="flex gap-2">
                        {['Day', 'Week', 'Month', 'Year'].map((p) => (
                            <button key={p} className={`text-[10px] font-bold px-3.5 py-1.5 rounded-lg border transition-all ${p === 'Month' ? 'bg-brand-purple/20 border-brand-purple/30 text-brand-purple' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(139,92,246,0.35)" />
                                <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                            </linearGradient>
                        </defs>
                        <path d="M0,170 Q120,160 220,130 T450,90 T650,60 T800,80 T1000,30 L1000,200 L0,200 Z" fill="url(#grad3)" />
                        <path d="M0,170 Q120,160 220,130 T450,90 T650,60 T800,80 T1000,30" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
                        {/* Dots */}
                        {[[0, 170], [220, 130], [450, 90], [650, 60], [800, 80], [1000, 30]].map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r={i === 0 || i === 5 ? 0 : 5} fill="#8b5cf6" stroke="#0a0b1e" strokeWidth="2" />
                        ))}
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => <span key={m}>{m}</span>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
