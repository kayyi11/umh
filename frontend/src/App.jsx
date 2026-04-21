// Main Application Component
export default function App() {
  return (
    // Full screen flex layout with a light gray background
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">
          UM-Pulse
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Active navigation item */}
          <a href="#" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            📊 Dashboard
          </a>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            🧠 Strategist
          </a>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
            + New Analysis
          </button>
        </header>

        {/* 3. Alert Section (Your red card, upgraded!) */}
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center shadow-sm">
          <span className="text-xl mr-3">⚠️</span>
          <span className="font-semibold">Profit Dropping: Detected a 12% rise in raw material costs.</span>
        </div>

        {/* 4. Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">RM 45,231</p>
            <span className="text-green-500 text-sm font-medium">↑ 2.4% vs last month</span>
          </div>
          
          {/* Card 2: Profit Margin */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Profit Margin</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">18.5%</p>
            <span className="text-red-500 text-sm font-medium">↓ 1.2% vs last month</span>
          </div>
          
          {/* Card 3: Active AI Strategies */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">AI Strategies</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">3 Running</p>
            <span className="text-blue-500 text-sm font-medium">Simulation active</span>
          </div>
        </div>

        {/* 5. Chart Area Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-72 flex flex-col items-center justify-center">
          <span className="text-4xl mb-4">📈</span>
          <p className="text-gray-400 font-medium">Interactive Chart Component Will Go Here</p>
        </div>

      </main>
    </div>
  );
}