"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAnalyze } from "@/lib/useAnalyze";
import {
  COMPETITORS,
  COMPETITOR_KEYS,
  AUDIENCES,
  SAVED_ANALYSES,
} from "@/lib/competitors";

const colorMap: Record<string, string> = {
  affirm: "#00d4aa",
  klarna: "#ffb3c7",
  afterpay: "#b2fce4",
  paypal: "#ffd86e",
  zip: "#a78bfa",
  sezzle: "#67e8f9",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("landscape");
  const [selectedCompetitor, setSelectedCompetitor] = useState("klarna");
  const [selectedAudience, setSelectedAudience] = useState("");

  const {
    output: analysisOutput,
    isStreaming: analysisStreaming,
    error: analysisError,
    analyze: runAnalysis,
    reset: resetAnalysis,
  } = useAnalyze();

  const {
    output: pulseOutput,
    isStreaming: pulseStreaming,
    error: pulseError,
    analyze: runPulse,
  } = useAnalyze();

  const comp = COMPETITORS[selectedCompetitor];
  const affirm = COMPETITORS.affirm;

  function handleOverlap() {
    runAnalysis({
      type: "overlap",
      competitor: comp.name,
      affirmData: affirm,
      competitorData: comp,
    });
  }

  function handleSharpen() {
    if (!selectedAudience) return;
    runAnalysis({
      type: "sharpen",
      competitor: comp.name,
      audience: selectedAudience,
      affirmData: affirm,
      competitorData: comp,
    });
  }

  function handlePulse() {
    runPulse({
      type: "pulse",
      allCompetitors: COMPETITORS,
    });
  }

  function handleCompetitorChange(key: string) {
    setSelectedCompetitor(key);
    resetAnalysis();
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "pulse", label: "Weekly Pulse" },
    { id: "landscape", label: "Landscape" },
    { id: "overlap", label: "Overlap Analyzer" },
    { id: "sharpen", label: "Sharpener" },
  ];

  return (
    <div>
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 border-b border-[#334155] bg-[#0f172a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00d4aa] flex items-center justify-center font-extrabold text-[#0f172a] text-sm">
                C
              </div>
              <div>
                <div className="font-bold text-white text-base leading-tight">Compete</div>
                <div className="text-[10px] text-[#94a3b8] leading-tight">Competitive Messaging Center</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); resetAnalysis(); }}
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
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00d4aa]" />
              <span className="text-xs text-[#94a3b8]">Live — powered by Claude</span>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); resetAnalysis(); }}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ========== WEEKLY PULSE ========== */}
        {activeTab === "pulse" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Weekly Competitive Pulse</h1>
              <p className="text-[#94a3b8] mt-1">AI-generated intelligence brief on competitive positioning shifts. Run every Monday to stay ahead.</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <button onClick={handlePulse} disabled={pulseStreaming} className="mb-6 px-6 py-2.5 rounded-lg bg-[#00d4aa] text-[#0f172a] font-semibold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {pulseStreaming ? "Generating pulse..." : "Generate This Week's Pulse"}
                </button>
                {pulseError && <p className="text-red-400 text-sm mb-4">{pulseError}</p>}
                {(pulseOutput || pulseStreaming) ? (
                  <AnalysisResult content={pulseOutput} isStreaming={pulseStreaming} streamLabel="Analyzing competitive landscape..." onCopy={() => handleCopy(pulseOutput)} onDownload={() => handleDownload(pulseOutput, "weekly-pulse.md")} />
                ) : (
                  <EmptyState icon="&#9733;" title="Your weekly intel brief" desc='Click "Generate" to get this week&apos;s competitive analysis across all 5 competitors.' />
                )}
              </div>
              <div className="w-full lg:w-72 shrink-0">
                <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Recent Analyses</h3>
                  <div className="space-y-2">
                    {SAVED_ANALYSES.map((h, i) => (
                      <div key={i} className="p-3 rounded-lg border border-[#334155] hover:border-[#475569] hover:bg-[#1e293b] transition-colors cursor-pointer">
                        <div className="text-[10px] text-[#94a3b8]">{h.date}</div>
                        <div className="text-xs font-medium text-white mt-1">{h.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== LANDSCAPE ========== */}
        {activeTab === "landscape" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Competitive Landscape</h1>
              <p className="text-[#94a3b8] mt-1">Our positioning vs. what competitors are saying. All sourced from public materials.</p>
            </div>
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-[#00d4aa] mb-3">Our Positioning</div>
              <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: "#00d4aa" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
                  <div>
                    <h2 className="text-xl font-bold text-white">Affirm</h2>
                    <p className="text-sm text-[#94a3b8] italic mt-0.5">&quot;{affirm.tagline}&quot;</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#00d4aa]/15 text-[#00d4aa]">Home team</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  <Section title="Consumer Value Props" items={affirm.consumer} color="#00d4aa" />
                  <Section title="Merchant Value Props" items={affirm.merchant} color="#00d4aa" />
                  <Section title="Our Differentiators" items={affirm.differentiators} color="#00d4aa" />
                </div>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Competitors We Track</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {COMPETITOR_KEYS.map((key) => {
                const c = COMPETITORS[key];
                return (
                  <div key={key} className="rounded-xl border border-[#334155] bg-[#1e293b]/50 overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: colorMap[key] }}>
                    <div className="px-5 py-4 border-b border-[#334155]">
                      <h3 className="text-lg font-bold text-white">{c.name}</h3>
                      <p className="text-xs text-[#94a3b8] italic mt-0.5">&quot;{c.tagline}&quot;</p>
                    </div>
                    <div className="p-5 space-y-4">
                      <Section title="Consumer Value Props" items={c.consumer.slice(0, 4)} color={colorMap[key]} />
                      <Section title="Merchant Value Props" items={c.merchant.slice(0, 3)} color={colorMap[key]} />
                      <Section title="Their Differentiators" items={c.differentiators.slice(0, 3)} color={colorMap[key]} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== OVERLAP ANALYZER ========== */}
        {activeTab === "overlap" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Overlap Analyzer</h1>
              <p className="text-[#94a3b8] mt-1">Find where our messaging collides with a competitor — and where we have whitespace to own.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="px-4 py-2.5 rounded-lg bg-[#1e293b] border border-[#334155] text-white text-sm font-medium appearance-none cursor-pointer min-w-[200px]">
                {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
              </select>
              <button onClick={handleOverlap} disabled={analysisStreaming} className="px-6 py-2.5 rounded-lg bg-[#00d4aa] text-[#0f172a] font-semibold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {analysisStreaming ? "Analyzing..." : "Analyze Overlap"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-5" style={{ borderTopWidth: 3, borderTopColor: "#00d4aa" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Our Messaging</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00d4aa]/15 text-[#00d4aa]">Affirm</span>
                </div>
                <Section title="Key Messages" items={[...affirm.consumer.slice(0, 3), ...affirm.differentiators.slice(0, 2)]} color="#00d4aa" />
              </div>
              <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 p-5" style={{ borderTopWidth: 3, borderTopColor: colorMap[selectedCompetitor] }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">{comp.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-[#94a3b8]">Competitor</span>
                </div>
                <Section title="Key Messages" items={[...comp.consumer.slice(0, 3), ...comp.differentiators.slice(0, 2)]} color={colorMap[selectedCompetitor]} />
              </div>
            </div>
            {analysisError && <p className="text-red-400 text-sm mb-4">{analysisError}</p>}
            {(analysisOutput || analysisStreaming) && (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Analyzing our messaging overlap with ${comp.name}...`} onCopy={() => handleCopy(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `overlap-vs-${selectedCompetitor}.md`)} />
            )}
          </div>
        )}

        {/* ========== SHARPENER ========== */}
        {activeTab === "sharpen" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Message Sharpener</h1>
              <p className="text-[#94a3b8] mt-1">Pick a competitor and target audience. Get our positioning rewritten to win that specific matchup.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="px-4 py-2.5 rounded-lg bg-[#1e293b] border border-[#334155] text-white text-sm font-medium appearance-none cursor-pointer min-w-[200px]">
                {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
              </select>
              <select value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)} className="px-4 py-2.5 rounded-lg bg-[#1e293b] border border-[#334155] text-white text-sm font-medium appearance-none cursor-pointer min-w-[280px]">
                <option value="">Select an audience...</option>
                {AUDIENCES.map((a) => (<option key={a} value={a}>{a}</option>))}
              </select>
              <button onClick={handleSharpen} disabled={analysisStreaming || !selectedAudience} className="px-6 py-2.5 rounded-lg bg-[#00d4aa] text-[#0f172a] font-semibold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {analysisStreaming ? "Sharpening..." : "Sharpen Positioning"}
              </button>
            </div>
            {analysisError && <p className="text-red-400 text-sm mb-4">{analysisError}</p>}
            {!selectedAudience && !analysisOutput && !analysisStreaming && (
              <EmptyState icon="&#9998;" title="Select a competitor and audience" desc="Choose who we're up against and who we're talking to. Claude will rewrite our positioning to be sharper for that specific matchup." />
            )}
            {(analysisOutput || analysisStreaming) && (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Sharpening our positioning against ${comp.name} for ${selectedAudience}...`} onCopy={() => handleCopy(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `sharpen-vs-${selectedCompetitor}.md`)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function Section({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">{title}</div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#cbd5e1] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnalysisResult({ content, isStreaming, streamLabel, onCopy, onDownload }: { content: string; isStreaming: boolean; streamLabel: string; onCopy: () => void; onDownload: () => void }) {
  return (
    <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[#00d4aa] text-sm">
              <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
              {streamLabel}
            </span>
          )}
          {!isStreaming && content && <span className="text-[#94a3b8] text-sm">Complete</span>}
        </div>
        {content && !isStreaming && (
          <div className="flex gap-2">
            <button onClick={onCopy} className="px-3 py-1 text-xs font-medium rounded-lg bg-[#334155] text-[#94a3b8] hover:text-white hover:bg-[#475569] transition-colors">Copy</button>
            <button onClick={onDownload} className="px-3 py-1 text-xs font-medium rounded-lg bg-[#334155] text-[#94a3b8] hover:text-white hover:bg-[#475569] transition-colors">Download .md</button>
          </div>
        )}
      </div>
      <div className="p-6 overflow-y-auto max-h-[600px]">
        <div className={`prose-output ${isStreaming ? "streaming-cursor" : ""}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[#334155] bg-[#1e293b]/50 flex items-center justify-center min-h-[300px]">
      <div className="text-center text-[#94a3b8]">
        <p className="text-4xl mb-3 opacity-30" dangerouslySetInnerHTML={{ __html: icon }} />
        <p className="text-lg font-medium text-white">{title}</p>
        <p className="text-sm mt-1 max-w-sm mx-auto">{desc}</p>
      </div>
    </div>
  );
}
