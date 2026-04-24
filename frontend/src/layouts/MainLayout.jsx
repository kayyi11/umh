// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function MainLayout() {
  // useLocation hooks into the current URL path to highlight the active menu item
  const location = useLocation();

  // State to control sidebar expansion/collapse
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // SVG Icons for the navigation menu
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Data Extract",
      path: "/data",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
      ),
    },
    {
      name: "Insight",
      path: "/insight",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Quick Actions",
      path: "/actions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Reports",
      path: "/reports",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#0B1220] font-sans text-slate-200 overflow-hidden">
      {/* Dynamic Sidebar Container */}
      <aside
        className={`bg-[#1F2937] shadow-xl flex flex-col border-r border-[#7F92BB]/20 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header: Logo & Hamburger Menu */}
        <div
          className={`h-20 border-b border-[#7F92BB]/20 flex items-center transition-all duration-300 ${
            isSidebarOpen ? "px-6 justify-between" : "px-0 justify-center"
          }`}
        >
          {/* Brand Logo (hides when collapsed) */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
            }`}
          >
            <img
              src="/logo.png"
              alt="Z Intelligence Logo"
              className="h-8 w-auto object-contain drop-shadow-md"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="hidden text-white font-extrabold text-xl tracking-widest whitespace-nowrap">
              Z INTELLIGENCE
            </span>
          </div>

          {/* Hamburger Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:bg-white/10 hover:text-white rounded-full transition-colors flex-shrink-0"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center rounded-xl font-medium transition-all duration-200 group ${
                  isSidebarOpen ? "px-4 py-3.5" : "p-3 justify-center"
                } ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
                title={!isSidebarOpen ? item.name : ""} // Provides a tooltip when collapsed
              >
                {/* Fixed Icon Container */}
                <div
                  className={`flex-shrink-0 ${isActive ? "text-white" : "text-[#7F92BB] group-hover:text-white transition-colors"}`}
                >
                  {item.icon}
                </div>

                <span
                  className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "ml-4 opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 hidden"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area: Automatically expands to fill remaining space */}
      <main className="flex-1 p-10 overflow-y-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
