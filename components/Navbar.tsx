"use client";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "pulse", label: "Weekly Pulse" },
  { id: "landscape", label: "Landscape" },
  { id: "overlap", label: "Overlap Analyzer" },
  { id: "sharpen", label: "Sharpener" },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#334155] bg-[#0f172a]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00d4aa] flex items-center justify-center font-extrabold text-[#0f172a] text-sm">
              C
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">
                Compete
              </div>
              <div className="text-[10px] text-[#94a3b8] leading-tight">
                Competitive Messaging Center
              </div>
            </div>
          </div>

          {/* Tabs — Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#00d4aa]/15 text-[#00d4aa]"
                    : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d4aa]" />
            <span className="text-xs text-[#94a3b8]">Live — powered by Claude</span>
          </div>
        </div>

        {/* Tabs — Mobile */}
        <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-[#00d4aa]/15 text-[#00d4aa]"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
