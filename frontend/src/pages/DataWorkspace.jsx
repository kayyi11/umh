// frontend/src/pages/DataWorkspace.jsx
import DataStats from "../components/DataStats";
import EditableDataTable from "../components/EditableDataTable";

export default function DataWorkspace() {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Data Workspace</h1>
      </header>

      {/* Statistics Cards */}
      <DataStats />

      {/* Table Editor */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-4">
           <h2 className="text-2xl font-bold text-white">Table Editor</h2>
           <p className="text-slate-500 text-sm italic">Showing live data from Firestore</p>
        </div>
        <EditableDataTable />
      </div>
    </div>
  );
}