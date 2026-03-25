import { Download, CheckCircle2, Calendar } from 'lucide-react'

const COMPLETED = [
    { title: 'Quantum Computing Leaps', approver: 'Lead Editor John', date: 'Mar 3, 2026', type: 'Published' },
    { title: 'Cybersecurity Threat Landscape', approver: 'Senior Pub Mary', date: 'Mar 2, 2026', type: 'Published' },
    { title: 'AI Revolution in Journalism', approver: 'Lead Editor John', date: 'Feb 28, 2026', type: 'Published' },
    { title: 'Future of Renewable Energy', approver: 'Senior Pub Mary', date: 'Feb 25, 2026', type: 'Published' },
    { title: 'Global Economic Outlook 2026', approver: 'Director Review', date: 'Feb 20, 2026', type: 'Published' },
]

export default function Completed() {
    return (
        <div className="space-y-6 animate-page">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Completed & Published</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Articles you have published successfully</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-brand-green" />
                    <span className="text-sm font-bold text-brand-green">{COMPLETED.length} Published</span>
                </div>
            </div>

            <div className="bg-bg-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest font-bold text-gray-500 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-5">Article Title</div>
                    <div className="col-span-3">Approved By</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">File</div>
                </div>

                <div className="divide-y divide-white/5">
                    {COMPLETED.map((a, i) => (
                        <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-5">
                                <p className="text-sm font-semibold text-white truncate pr-4 group-hover:text-brand-green transition-colors">{a.title}</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-sm text-gray-400">{a.approver}</p>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />{a.date}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-lg">
                                    <CheckCircle2 className="w-3 h-3" /> Done
                                </span>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-green/10 text-brand-green hover:bg-brand-green/25 transition-all">
                                    <Download className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
