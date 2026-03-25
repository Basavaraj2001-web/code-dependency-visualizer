import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardHome from './components/DashboardHome'
import Overview from './components/Overview'
import MyWork from './components/MyWork'
import Completed from './components/Completed'
import Rejected from './components/Rejected'
import Notifications from './components/Notifications'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />
      case 'overview': return <Overview />
      case 'my-work': return <MyWork />
      case 'completed': return <Completed />
      case 'rejected': return <Rejected />
      case 'notifications': return <Notifications />
      default: return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-bg-main text-white overflow-hidden text-[13px]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth mt-20">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
