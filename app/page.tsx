"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAnalyze } from "@/lib/useAnalyze";
import {
  COMPETITORS,
  COMPETITOR_KEYS,
  AUDIENCES,
  SAVED_ANALYSES,
} from "@/lib/competitors";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCompetitor, setSelectedCompetitor] = useState("klarna");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [pasteSource, setPasteSource] = useState("Ad Copy");

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

  function handlePaste() {
    if (!pastedContent.trim()) return;
    runAnalysis({
      type: "paste",
      pastedContent: pastedContent,
      source: pasteSource,
      affirmData: affirm,
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

  function navigateTo(tab: string) {
    setActiveTab(tab);
    resetAnalysis();
  }

  const handleCopyFormatted = (text: string, label: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const formatted = `📊 ${label}\nGenerated ${dateStr} via Compete (Affirm PMM)\n${"—".repeat(40)}\n\n${text}\n\n${"—".repeat(40)}\n🔗 Generated with Compete — Affirm's AI competitive intelligence tool`;
    navigator.clipboard.writeText(formatted);
  };

  const handleCopyRaw = (text: string) => {
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
    { id: "home", label: "Home" },
    { id: "paste", label: "Paste & Analyze" },
    { id: "pulse", label: "Weekly Pulse" },
    { id: "overlap", label: "Overlap Analyzer" },
    { id: "sharpen", label: "Sharpener" },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== NAV BAR ===== */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo("home")}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#4A3AFF" />
                <path d="M10 22L16 10L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="12" y1="18" x2="20" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <div className="font-bold text-[#101820] text-lg leading-tight tracking-tight">Compete</div>
                <div className="text-[11px] text-[#9CA3AF] leading-tight">by Affirm PMM</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#F0EEFF] text-[#4A3AFF]"
                      : "text-[#6B7280] hover:text-[#101820] hover:bg-[#F4F5F7]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="relative w-2 h-2 rounded-full bg-[#4A3AFF] pulse-dot" />
              <span className="text-xs text-[#9CA3AF] font-medium">Powered by Claude</span>
            </div>
          </div>
          {/* Mobile tabs */}
          <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#F0EEFF] text-[#4A3AFF]"
                    : "text-[#6B7280] hover:text-[#101820]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ========== HOME ========== */}
        {activeTab === "home" && (
          <div>
            {/* Hero */}
            <div className="text-center mb-12 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EEFF] text-[#4A3AFF] text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A3AFF]" />
                AI-Powered Competitive Intelligence
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#101820] tracking-tight leading-tight">
                Know what they&apos;re saying.<br />
                <span className="text-[#4A3AFF]">Say it better.</span>
              </h1>
              <p className="text-lg text-[#6B7280] mt-4 max-w-2xl mx-auto leading-relaxed">
                Compete analyzes BNPL competitor positioning in real time and generates actionable messaging intelligence — so our PMM team always stays a step ahead.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              <ActionCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                }
                title="Weekly Pulse"
                description="Get a one-click competitive intelligence brief. AI analyzes all 5 competitors and surfaces what changed, what matters, and what to do about it."
                buttonText="Generate This Week's Pulse"
                onClick={() => { navigateTo("pulse"); handlePulse(); }}
                tag="Most used"
              />
              <ActionCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                }
                title="Paste & Analyze"
                description="Paste any competitor ad, email, or landing page. AI instantly tells you what they're saying and how we should respond."
                buttonText="Paste Content"
                onClick={() => navigateTo("paste")}
                tag="New"
              />
              <ActionCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                }
                title="Overlap Analyzer"
                description="Pick any competitor. AI compares their messaging to ours and finds exactly where we collide, where they're stronger, and where we have whitespace to own."
                buttonText="Find Messaging Gaps"
                onClick={() => navigateTo("overlap")}
              />
              <ActionCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                }
                title="Message Sharpener"
                description="Choose a competitor + target audience. AI rewrites our positioning to be sharper for that specific matchup — with copy that could actually ship."
                buttonText="Sharpen Our Messaging"
                onClick={() => navigateTo("sharpen")}
              />
            </div>

            {/* Recent Activity */}
            <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="font-semibold text-[#101820]">Recent Analyses</h3>
                <span className="text-xs text-[#9CA3AF]">{SAVED_ANALYSES.length} saved</span>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {SAVED_ANALYSES.map((h, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-[#F4F5F7] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                        h.type === "pulse" ? "bg-[#F0EEFF] text-[#4A3AFF]" :
                        h.type === "overlap" ? "bg-amber-50 text-amber-600" :
                        "bg-emerald-50 text-emerald-600"
                      }`}>
                        {h.type}
                      </span>
                      <span className="text-sm font-medium text-[#101820]">{h.title}</span>
                    </div>
                    <span className="text-xs text-[#9CA3AF]">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Quick Reference */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">Competitors We Track</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COMPETITOR_KEYS.map((key) => {
                  const c = COMPETITORS[key];
                  return (
                    <div key={key} className="border border-[#E5E7EB] rounded-lg p-4 bg-white hover:border-[#4A3AFF] hover:shadow-sm transition-all cursor-pointer" onClick={() => { setSelectedCompetitor(key); navigateTo("overlap"); }}>
                      <div className="font-semibold text-sm text-[#101820]">{c.name}</div>
                      <div className="text-[11px] text-[#9CA3AF] mt-1 italic line-clamp-1">{c.tagline}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== PASTE & ANALYZE ========== */}
        {activeTab === "paste" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#101820]">Paste & Analyze</h1>
              <p className="text-[#6B7280] mt-1">Drop in any competitor content — an ad, landing page, email, press release — and get instant competitive intelligence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Input side */}
              <div className="lg:col-span-2">
                <div className="border border-[#E5E7EB] rounded-xl bg-white p-5 sticky top-24">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-[#101820] mb-1.5 block">Content type</label>
                    <div className="flex flex-wrap gap-2">
                      {["Ad Copy", "Landing Page", "Email", "Press Release", "Social Post", "Other"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setPasteSource(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            pasteSource === s
                              ? "bg-[#F0EEFF] border-[#4A3AFF] text-[#4A3AFF]"
                              : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-[#101820] mb-1.5 block">Paste competitor content</label>
                    <textarea
                      value={pastedContent}
                      onChange={(e) => setPastedContent(e.target.value)}
                      placeholder={"Paste an ad, landing page copy, email, or press release from a competitor...\n\nExample: \"Pay in 4. No interest. No fees. Klarna makes shopping smoooth...\""}
                      className="w-full h-48 px-4 py-3 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#101820] placeholder-[#9CA3AF] resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handlePaste}
                    disabled={analysisStreaming || !pastedContent.trim()}
                    className="w-full px-5 py-3 rounded-lg bg-[#4A3AFF] text-white font-semibold text-sm hover:bg-[#3B2FD9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {analysisStreaming ? "Analyzing..." : "Analyze This Content"}
                  </button>

                  <p className="text-[10px] text-[#9CA3AF] mt-3 text-center">
                    AI compares this against our positioning and generates actionable intel
                  </p>
                </div>
              </div>

              {/* Output side */}
              <div className="lg:col-span-3">
                {analysisError && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{analysisError}</p>}
                {(analysisOutput || analysisStreaming) ? (
                  <AnalysisResult
                    content={analysisOutput}
                    isStreaming={analysisStreaming}
                    streamLabel="Analyzing competitor content against our positioning..."
                    shareLabel="Paste & Analyze — Competitor Content Intel"
                    onCopyFormatted={() => handleCopyFormatted(analysisOutput, "Paste & Analyze — Competitor Content Intel")}
                    onCopyRaw={() => handleCopyRaw(analysisOutput)}
                    onDownload={() => handleDownload(analysisOutput, "paste-analysis.md")}
                  />
                ) : (
                  <EmptyState
                    title="Paste something to analyze"
                    desc="Drop in a competitor ad, email, or landing page. AI will instantly tell you what they're saying, how it threatens our positioning, and what we should do about it."
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== WEEKLY PULSE ========== */}
        {activeTab === "pulse" && (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#101820]">Weekly Competitive Pulse</h1>
                <p className="text-[#6B7280] mt-1">One click. AI analyzes all 5 competitors and tells you what changed, what matters, and what to do.</p>
              </div>
              <button onClick={handlePulse} disabled={pulseStreaming} className="shrink-0 px-5 py-2.5 rounded-lg bg-[#4A3AFF] text-white font-semibold text-sm hover:bg-[#3B2FD9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                {pulseStreaming ? "Generating..." : "Generate Pulse"}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {pulseError && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{pulseError}</p>}
                {(pulseOutput || pulseStreaming) ? (
                  <AnalysisResult content={pulseOutput} isStreaming={pulseStreaming} streamLabel="Analyzing competitive landscape across all 5 competitors..." shareLabel="Weekly Competitive Pulse" onCopyFormatted={() => handleCopyFormatted(pulseOutput, "Weekly Competitive Pulse")} onCopyRaw={() => handleCopyRaw(pulseOutput)} onDownload={() => handleDownload(pulseOutput, "weekly-pulse.md")} />
                ) : (
                  <EmptyState
                    title="Your Monday morning starts here"
                    desc="Hit Generate to get a full competitive intelligence brief — positioning shifts, threat levels, and recommended actions for this week."
                  />
                )}
              </div>
              <div className="w-full lg:w-64 shrink-0">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <h3 className="text-sm font-semibold text-[#101820] mb-3">Recent Pulses</h3>
                  <div className="space-y-2">
                    {SAVED_ANALYSES.filter(h => h.type === "pulse").map((h, i) => (
                      <div key={i} className="p-3 rounded-lg border border-[#E5E7EB] hover:border-[#4A3AFF] hover:bg-[#F0EEFF]/30 transition-all cursor-pointer">
                        <div className="text-[10px] text-[#9CA3AF] font-medium">{h.date}</div>
                        <div className="text-xs font-medium text-[#101820] mt-1">{h.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== OVERLAP ANALYZER ========== */}
        {activeTab === "overlap" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#101820]">Overlap Analyzer</h1>
              <p className="text-[#6B7280] mt-1">Find where our messaging collides with a competitor — and where we have whitespace to own.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">Compare against:</span>
                <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#101820] text-sm font-medium cursor-pointer min-w-[180px]">
                  {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
                </select>
              </div>
              <button onClick={handleOverlap} disabled={analysisStreaming} className="px-5 py-2.5 rounded-lg bg-[#4A3AFF] text-white font-semibold text-sm hover:bg-[#3B2FD9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                {analysisStreaming ? "Analyzing..." : "Analyze Overlap"}
              </button>
            </div>

            {/* Side by side comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CompactCard label="Our Messaging" name="Affirm" items={[...affirm.consumer.slice(0, 3), ...affirm.differentiators.slice(0, 2)]} accent="#4A3AFF" badge="Us" />
              <CompactCard label="Their Messaging" name={comp.name} items={[...comp.consumer.slice(0, 3), ...comp.differentiators.slice(0, 2)]} accent="#6B7280" badge="Them" />
            </div>

            {/* Analysis output */}
            {analysisError && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{analysisError}</p>}
            {(analysisOutput || analysisStreaming) ? (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Finding messaging gaps between us and ${comp.name}...`} shareLabel={`Overlap Analysis — Affirm vs. ${comp.name}`} onCopyFormatted={() => handleCopyFormatted(analysisOutput, `Overlap Analysis — Affirm vs. ${comp.name}`)} onCopyRaw={() => handleCopyRaw(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `overlap-vs-${selectedCompetitor}.md`)} />
            ) : (
              <EmptyState
                title="Select a competitor and hit Analyze"
                desc="AI will compare our positioning head-to-head — finding overlaps, gaps, and opportunities."
              />
            )}
          </div>
        )}

        {/* ========== SHARPENER ========== */}
        {activeTab === "sharpen" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#101820]">Message Sharpener</h1>
              <p className="text-[#6B7280] mt-1">Pick a competitor and audience. AI rewrites our positioning to win that specific matchup — with copy that could actually ship.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">Against:</span>
                <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#101820] text-sm font-medium cursor-pointer min-w-[160px]">
                  {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">For:</span>
                <select value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)} className="px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#101820] text-sm font-medium cursor-pointer min-w-[260px]">
                  <option value="">Select an audience...</option>
                  {AUDIENCES.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
              <button onClick={handleSharpen} disabled={analysisStreaming || !selectedAudience} className="px-5 py-2.5 rounded-lg bg-[#4A3AFF] text-white font-semibold text-sm hover:bg-[#3B2FD9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                {analysisStreaming ? "Sharpening..." : "Sharpen Positioning"}
              </button>
            </div>

            {/* Output */}
            {analysisError && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">{analysisError}</p>}
            {(analysisOutput || analysisStreaming) ? (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Sharpening our messaging against ${comp.name} for ${selectedAudience}...`} shareLabel={`Message Sharpener — vs. ${comp.name} for ${selectedAudience}`} onCopyFormatted={() => handleCopyFormatted(analysisOutput, `Message Sharpener — vs. ${comp.name} for ${selectedAudience}`)} onCopyRaw={() => handleCopyRaw(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `sharpen-vs-${selectedCompetitor}.md`)} />
            ) : (
              <EmptyState
                title="Choose who we're up against and who we're talking to"
                desc="AI will rewrite our value props to be sharper for that specific competitive matchup — including a killer one-liner and sales talk track."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */

function ActionCard({ icon, title, description, buttonText, onClick, tag }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  tag?: string;
}) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl bg-white p-6 hover:border-[#4A3AFF] hover:shadow-md transition-all group relative">
      {tag && (
        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0EEFF] text-[#4A3AFF]">
          {tag}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-[#F0EEFF] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-[#101820] text-lg mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-5">{description}</p>
      <button onClick={onClick} className="w-full px-4 py-2.5 rounded-lg bg-[#4A3AFF] text-white font-semibold text-sm hover:bg-[#3B2FD9] transition-colors shadow-sm">
        {buttonText}
      </button>
    </div>
  );
}

function CompactCard({ label, name, items, accent, badge }: {
  label: string;
  name: string;
  items: string[];
  accent: string;
  badge: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5" style={{ borderTopWidth: 3, borderTopColor: accent }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{label}</div>
          <div className="font-bold text-[#101820] text-lg">{name}</div>
        </div>
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase" style={{ backgroundColor: `${accent}12`, color: accent }}>
          {badge}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#4B5563] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnalysisResult({ content, isStreaming, streamLabel, shareLabel, onCopyFormatted, onCopyRaw, onDownload }: {
  content: string;
  isStreaming: boolean;
  streamLabel: string;
  shareLabel: string;
  onCopyFormatted: () => void;
  onCopyRaw: () => void;
  onDownload: () => void;
}) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAction(action: () => void, label: string) {
    action();
    setCopied(label);
    setShowShareMenu(false);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] bg-[#F4F5F7]">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-2 text-[#4A3AFF] text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4A3AFF] animate-pulse" />
              {streamLabel}
            </span>
          )}
          {!isStreaming && content && (
            <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Analysis complete
            </span>
          )}
        </div>
        {content && !isStreaming && (
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {/* Copied toast */}
            {copied && (
              <span className="absolute -top-8 right-0 px-3 py-1 rounded-lg bg-[#101820] text-white text-xs font-medium shadow-lg animate-fade-in whitespace-nowrap">
                {copied}
              </span>
            )}

            {/* Share button (primary) */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4A3AFF] text-white text-xs font-semibold hover:bg-[#3B2FD9] transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share with Team
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#E5E7EB] bg-[#F4F5F7]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Share options</span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleAction(onCopyFormatted, "Copied for Slack/Email!")}
                    className="w-full text-left px-4 py-3 hover:bg-[#F0EEFF] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💬</span>
                      <div>
                        <div className="text-sm font-medium text-[#101820] group-hover:text-[#4A3AFF]">Copy for Slack / Email</div>
                        <div className="text-[11px] text-[#9CA3AF]">Formatted with header, date & footer</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAction(onCopyRaw, "Raw markdown copied!")}
                    className="w-full text-left px-4 py-3 hover:bg-[#F0EEFF] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📋</span>
                      <div>
                        <div className="text-sm font-medium text-[#101820] group-hover:text-[#4A3AFF]">Copy Raw Markdown</div>
                        <div className="text-[11px] text-[#9CA3AF]">Plain text, no formatting</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAction(onDownload, "Downloaded!")}
                    className="w-full text-left px-4 py-3 hover:bg-[#F0EEFF] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📥</span>
                      <div>
                        <div className="text-sm font-medium text-[#101820] group-hover:text-[#4A3AFF]">Download as .md File</div>
                        <div className="text-[11px] text-[#9CA3AF]">Save to share as an attachment</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
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

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-[#F4F5F7]/50 flex items-center justify-center min-h-[280px]">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-full bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A3AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <p className="text-base font-semibold text-[#101820]">{title}</p>
        <p className="text-sm text-[#6B7280] mt-1.5 max-w-md mx-auto leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
