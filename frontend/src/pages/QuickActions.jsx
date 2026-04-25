import { useState } from 'react';
import ActionCard from '../components/ActionCard';
import StatusTracker from '../components/StatusTracker';
import ProcessingLog from '../components/ProcessingLog';

export default function QuickActions() {
  // ==========================================
  // DATA MODELS & STATE
  // ==========================================
  
  const actionCardsData = [
    {
      id: 'supplier',
      title: 'Supplier Email',
      description: 'Quick start on contacting your supplier',
      iconThemeClass: 'bg-blue-500/10 text-blue-400',
      activeBorderClass: 'border-[#3B82F6]',
      activeBtnClass: 'bg-[#3B82F6]',
      iconSvg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Message',
      description: 'Notify team about new price update',
      iconThemeClass: 'bg-green-500/10 text-green-400',
      activeBorderClass: 'border-[#10B981]',
      activeBtnClass: 'bg-[#10B981]',
      iconSvg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
    },
    {
      id: 'pricelist',
      title: 'Updated Price List',
      description: 'Generate and export new price list',
      iconThemeClass: 'bg-purple-500/10 text-purple-400',
      activeBorderClass: 'border-[#8B5CF6]',
      activeBtnClass: 'bg-[#8B5CF6]',
      iconSvg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    }
  ];

  const trackerSteps = [
    { title: 'Price increase simulated', subtitle: '+8% profit', status: 'completed' },
    { title: 'Supplier email sent', subtitle: '(Waiting reply)', status: 'pending' },
    { title: 'Price list updated', subtitle: '(Pending approval)', status: 'pending' },
    { title: 'Team notified', subtitle: '(Pending)', status: 'pending' }
  ];

  // ==========================================
  // COMPONENT STATE
  // ==========================================

  const [activeDraft, setActiveDraft] = useState('supplier');
  const [isExecuting, setIsExecuting] = useState(false);

  // Live drafted actions from the Executor agent
  const [draftedActions, setDraftedActions] = useState(null);
  const [isDraftsLoading, setIsDraftsLoading] = useState(false);
  const [draftsError, setDraftsError] = useState(null);

  // ========== NEW: Edit-related state ==========
  const [isEditing, setIsEditing] = useState(false);
  const [editedDrafts, setEditedDrafts] = useState({});    // key: action_id, value: custom text
  const [editBuffer, setEditBuffer] = useState('');        // temporary value while editing

  // ==========================================
  // FETCH DRAFTED ACTIONS (user-triggered)
  // ==========================================

  const fetchDraftedActions = async () => {
    setIsDraftsLoading(true);
    setDraftsError(null);
    try {
      const response = await fetch('http://localhost:5000/api/draft-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setDraftedActions(data.drafted_actions || []);
    } catch (err) {
      console.error('Failed to fetch drafted actions:', err);
      setDraftsError('Failed to load AI drafts. Please try again.');
    } finally {
      setIsDraftsLoading(false);
    }
  };

  // ==========================================
  // HELPERS (unchanged except for edit support)
  // ==========================================

  const getOriginalContent = (actionId) => {
    const draft = draftedActions.find(d => d.action_id === actionId);
    if (!draft) return 'No draft available for this action.';
    if (draft.action_type === 'email' && draft.subject) {
      return `Subject: ${draft.subject}\n\n${draft.body}`;
    }
    return draft.body || 'No content available.';
  };

  // Returns either the user's edited version or the original AI draft
  const getActiveDraftContent = () => {
    if (isDraftsLoading) return 'Loading AI-generated draft...';
    if (draftsError) return draftsError;
    if (draftedActions === null) return '';
    return editedDrafts[activeDraft] ?? getOriginalContent(activeDraft);
  };

  // ==========================================
  // EDIT / SAVE / CANCEL / RESET HANDLERS
  // ==========================================

  const handleEdit = () => {
    setEditBuffer(getActiveDraftContent());
    setIsEditing(true);
  };

  const handleSave = () => {
    setEditedDrafts(prev => ({ ...prev, [activeDraft]: editBuffer }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditBuffer('');
    setIsEditing(false);
  };

  const handleReset = () => {
    // Remove edited version for this action
    setEditedDrafts(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[activeDraft];
      return newDrafts;
    });
    setIsEditing(false);
    setEditBuffer('');
  };

  // When switching tabs, exit edit mode without saving any changes
  const handleTabSwitch = (id) => {
    if (isEditing) {
      setIsEditing(false);
      setEditBuffer('');
    }
    setActiveDraft(id);
  };

  // ==========================================
  // EXECUTE HANDLER (unchanged)
  // ==========================================

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      alert('All actions executed successfully!');
    }, 2000);
  };

  // ==========================================
  // DERIVED FLAGS
  // ==========================================
  const hasUserEdit = !!editedDrafts[activeDraft];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* Header (unchanged) */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Quick Actions</h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-[#34D399]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]"></span>
            </span>
            <span>Live Sync</span>
          </div>
          <div className="text-sm text-slate-400">Last updated: 10s ago</div>
          <div className="flex items-center space-x-3 bg-[#1F2937] px-3 py-1.5 rounded-full border border-[#7F92BB]/30">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white">U</div>
            <span className="font-medium text-white text-sm pr-2">User</span>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[calc(100vh-180px)]">
        
        {/* Top Left: Generated Actions List */}
        <div className="lg:col-span-4 bg-[#121826] rounded-xl border border-[#7F92BB]/30 p-5 flex flex-col shadow-lg">
          <h2 className="text-white font-bold text-lg mb-4">Generated Actions</h2>
          {draftedActions === null && !isDraftsLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              {draftsError && <p className="text-red-400 text-sm">{draftsError}</p>}
              <button
                onClick={fetchDraftedActions}
                className="flex items-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-md"
              >
                ⚡ Generate Recommended Actions
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {actionCardsData.map(card => (
                  <ActionCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    iconSvg={card.iconSvg}
                    iconThemeClass={card.iconThemeClass}
                    activeBorderClass={card.activeBorderClass}
                    activeBtnClass={card.activeBtnClass}
                    isActive={activeDraft === card.id}
                    onClick={handleTabSwitch}
                  />
                ))}
              </div>
              {!isDraftsLoading && (
                <button
                  onClick={fetchDraftedActions}
                  className="mt-3 w-full border border-[#7F92BB]/40 hover:border-[#7F92BB] hover:bg-white/5 text-slate-300 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                >
                  Regenerate
                </button>
              )}
            </>
          )}
        </div>

        {/* Top Middle: Smart Draft Preview Area (with edit functionality) */}
        <div className="lg:col-span-5 bg-[#121826] rounded-xl border border-[#7F92BB]/30 p-5 flex flex-col shadow-lg">
          {/* Header with optional "Edited" badge */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Smart Draft Preview</h2>
            {hasUserEdit && !isEditing && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full">
                Edited
              </span>
            )}
          </div>

          <div className={`flex-1 bg-[#1F2937] rounded-xl border p-5 mb-5 relative overflow-hidden transition-all ${
            isEditing
              ? 'border-[#3B82F6]/60 ring-1 ring-[#3B82F6]/30'
              : 'border-[#7F92BB]/20'
          }`}>
            <div className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest text-[#7F92BB]">
              {isDraftsLoading ? 'Processing...' : isEditing ? 'Editing' : draftedActions === null ? '' : 'AI Draft'}
            </div>

            {isDraftsLoading ? (
              <ProcessingLog />
            ) : (
              <textarea
                className={`w-full h-full bg-transparent text-sm leading-relaxed resize-none focus:outline-none ${
                  draftsError ? 'text-red-400' : 'text-slate-200'
                }`}
                value={isEditing ? editBuffer : getActiveDraftContent()}
                readOnly={!isEditing}
                onChange={e => setEditBuffer(e.target.value)}
                autoFocus={isEditing}
              />
            )}
          </div>

          {/* Buttons: Show Save/Cancel when editing, else Edit/Reset */}
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-transparent border border-[#7F92BB]/40 hover:border-[#7F92BB] hover:bg-white/5 text-white py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  disabled={isDraftsLoading || draftedActions === null || !!draftsError}
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md"
                >
                  Edit Draft
                </button>
                <button
                  onClick={handleReset}
                  disabled={isDraftsLoading || draftedActions === null || !hasUserEdit}
                  className="flex-1 bg-transparent border border-[#7F92BB]/40 hover:border-[#7F92BB] hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* Top Right: Decision Tracker Panel (unchanged) */}
        <div className="lg:col-span-3 bg-[#121826] rounded-xl border border-[#7F92BB]/30 p-5 flex flex-col shadow-lg">
          <h2 className="text-white font-bold text-lg mb-6">Decision Tracker</h2>
          <StatusTracker steps={trackerSteps} />
        </div>

        {/* Bottom Left: Execute Actions CTA (unchanged) */}
        <div className="lg:col-span-5 bg-[#121826] rounded-xl border border-[#7F92BB]/30 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-white font-bold text-lg mb-2">Execute Actions</h2>
            <p className="text-slate-400 text-sm">Review all actions and execute them in one click.</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleExecute}
              disabled={isExecuting || draftedActions === null}
              className={`w-3/4 flex items-center justify-center space-x-3 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-[0_4px_15px_-3px_rgba(217,119,6,0.4)] active:scale-95 ${
                isExecuting || draftedActions === null
                  ? 'bg-[#B45309] cursor-wait opacity-70'
                  : 'bg-[#D97706] hover:bg-[#B45309]'
              }`}
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Executing Automation...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>Execute All Actions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Right: Impact Tracker Stats (unchanged) */}
        <div className="lg:col-span-7 bg-[#121826] rounded-xl border border-[#7F92BB]/30 p-6 flex flex-col shadow-lg">
          <h2 className="text-white font-bold text-lg mb-5">Impact Tracker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="bg-[#1F2937] p-4 rounded-xl border border-[#7F92BB]/20 flex flex-col justify-center relative overflow-hidden">
              <p className="text-slate-400 text-xs font-semibold mb-1">Time Saved</p>
              <div className="text-white font-bold text-2xl">2 <span className="text-sm text-slate-400 font-normal">hours</span></div>
              <div className="absolute right-4 bottom-4 text-[#3B82F6] opacity-80">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <div className="bg-[#1F2937] p-4 rounded-xl border border-[#7F92BB]/20 flex flex-col justify-center">
              <p className="text-slate-400 text-xs font-semibold mb-1">Est. Profit Increase</p>
              <div className="text-[#34D399] font-bold text-2xl">RM200</div>
              <p className="text-xs text-slate-500 mt-1">(estimated)</p>
            </div>
            <div className="bg-[#1F2937] p-4 rounded-xl border border-[#7F92BB]/20 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold mb-1">Actions Completed</p>
                <div className="text-white font-bold text-2xl flex items-baseline">
                  1<span className="text-slate-500 text-lg">/4</span>
                </div>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-700" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                  <path className="text-[#8B5CF6]" strokeDasharray="25, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-5 w-full flex-shrink-0"></div>
    </>
  );
}