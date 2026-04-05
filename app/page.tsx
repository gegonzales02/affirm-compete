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

/* ===== ICONS (consistent 20×20 stroke icons) ===== */
const icons = {
  pulse: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  paste: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  overlap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="7" />
      <circle cx="15" cy="12" r="7" />
    </svg>
  ),
  sharpen: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  share: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  chevronDown: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  slack: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
      <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
      <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
      <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
      <path d="M14 20.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5h1.5v1.5z" />
      <path d="M10 9.5C10 10.33 9.33 11 8.5 11h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" />
      <path d="M10 3.5C10 2.67 10.67 2 11.5 2S13 2.67 13 3.5 12.33 5 11.5 5H10V3.5z" />
    </svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

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
    runAnalysis({ type: "overlap", competitor: comp.name, affirmData: affirm, competitorData: comp });
  }
  function handleSharpen() {
    if (!selectedAudience) return;
    runAnalysis({ type: "sharpen", competitor: comp.name, audience: selectedAudience, affirmData: affirm, competitorData: comp });
  }
  function handlePaste() {
    if (!pastedContent.trim()) return;
    runAnalysis({ type: "paste", pastedContent, source: pasteSource, affirmData: affirm });
  }
  function handlePulse() {
    runPulse({ type: "pulse", allCompetitors: COMPETITORS });
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
    navigator.clipboard.writeText(`📊 ${label}\nGenerated ${dateStr} via Compete (Affirm PMM)\n${"—".repeat(40)}\n\n${text}\n\n${"—".repeat(40)}\nGenerated with Compete — Affirm's AI competitive intelligence tool`);
  };
  const handleCopyRaw = (text: string) => { navigator.clipboard.writeText(text); };
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
    { id: "home", label: "Home", icon: null },
    { id: "pulse", label: "Weekly Pulse", icon: null },
    { id: "paste", label: "Paste & Analyze", icon: null },
    { id: "overlap", label: "Overlap", icon: null },
    { id: "sharpen", label: "Sharpener", icon: null },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== NAV ===== */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <button onClick={() => navigateTo("home")} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#4A3AFF] flex items-center justify-center shadow-sm shadow-[#4A3AFF]/20 group-hover:shadow-md group-hover:shadow-[#4A3AFF]/25 transition-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L8 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="5.5" y1="10" x2="10.5" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-[#0F1629] text-[15px] tracking-tight">Compete</span>
            </button>

            {/* Desktop tabs */}
            <div className="hidden md:flex items-center gap-0.5 bg-[#F3F4F8] rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id)}
                  className={`px-3.5 py-[7px] rounded-lg text-[13px] font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-[#0F1629] shadow-sm"
                      : "text-[#8B91A8] hover:text-[#3D4663]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="relative w-[7px] h-[7px] rounded-full bg-[#4A3AFF] pulse-dot" />
              <span className="text-[12px] text-[#8B91A8] font-medium hidden sm:block">Powered by Claude</span>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#F0EEFF] text-[#4A3AFF]"
                    : "text-[#8B91A8] hover:text-[#3D4663]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-[1120px] mx-auto px-5 sm:px-8 py-10">

        {/* ========== HOME ========== */}
        {activeTab === "home" && (
          <div className="hero-gradient">
            {/* Hero */}
            <div className="text-center mb-14 pt-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EEFF] text-[#4A3AFF] text-[12px] font-semibold mb-5 tag-affirm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A3AFF]" />
                AI-Powered Competitive Intelligence
              </div>
              <h1 className="text-[2.75rem] sm:text-[3.25rem] font-extrabold text-[#0F1629] tracking-[-0.03em] leading-[1.1]">
                Know what they&apos;re saying.
                <br />
                <span className="bg-gradient-to-r from-[#4A3AFF] to-[#6C5CE7] bg-clip-text text-transparent">Say it better.</span>
              </h1>
              <p className="text-[17px] text-[#5A6180] mt-5 max-w-xl mx-auto leading-relaxed">
                Real-time BNPL competitive intelligence that turns positioning data into messaging you can actually ship.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              <ActionCard
                icon={icons.pulse}
                title="Weekly Pulse"
                description="AI analyzes all 5 competitors and surfaces what changed, what matters, and what to do."
                buttonText="Generate Pulse"
                onClick={() => { navigateTo("pulse"); handlePulse(); }}
                tag="Most used"
                delay={1}
              />
              <ActionCard
                icon={icons.paste}
                title="Paste & Analyze"
                description="Drop in competitor content and get instant intel on what they're saying and how to respond."
                buttonText="Paste Content"
                onClick={() => navigateTo("paste")}
                tag="New"
                delay={2}
              />
              <ActionCard
                icon={icons.overlap}
                title="Overlap Analyzer"
                description="Compare messaging head-to-head to find collisions, gaps, and whitespace to own."
                buttonText="Find Gaps"
                onClick={() => navigateTo("overlap")}
                delay={3}
              />
              <ActionCard
                icon={icons.sharpen}
                title="Sharpener"
                description="Pick a competitor + audience. AI rewrites our positioning for that specific matchup."
                buttonText="Sharpen Copy"
                onClick={() => navigateTo("sharpen")}
                delay={4}
              />
            </div>

            {/* Recent Activity */}
            <div className="card-elevated overflow-hidden mb-10">
              <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between">
                <h3 className="font-semibold text-[15px] text-[#0F1629]">Recent Analyses</h3>
                <span className="tag tag-affirm">{SAVED_ANALYSES.length} saved</span>
              </div>
              <div className="divide-y divide-[#F3F4F8]">
                {SAVED_ANALYSES.map((h, i) => (
                  <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#FAFBFD] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`tag ${h.type === "pulse" ? "tag-affirm" : h.type === "overlap" ? "tag-amber" : "tag-emerald"}`}>
                        {h.type}
                      </span>
                      <span className="text-[13.5px] font-medium text-[#0F1629]">{h.title}</span>
                    </div>
                    <span className="text-[12px] text-[#8B91A8] font-medium">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Quick Reference */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#E8EAF0]" />
                <span className="text-[11px] font-semibold text-[#8B91A8] uppercase tracking-[0.1em]">Competitors We Track</span>
                <div className="h-px flex-1 bg-[#E8EAF0]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COMPETITOR_KEYS.map((key) => {
                  const c = COMPETITORS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => { setSelectedCompetitor(key); navigateTo("overlap"); }}
                      className="card-elevated card-interactive p-4 text-left"
                    >
                      <div className="font-semibold text-[13px] text-[#0F1629]">{c.name}</div>
                      <div className="text-[11px] text-[#8B91A8] mt-1 line-clamp-1 leading-relaxed">{c.tagline}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== PASTE & ANALYZE ========== */}
        {activeTab === "paste" && (
          <div>
            <PageHeader
              title="Paste & Analyze"
              subtitle="Drop in any competitor content — ad, email, landing page, press release — and get instant competitive intelligence."
            />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <div className="card-elevated p-6 sticky top-20">
                  <div className="mb-5">
                    <label className="text-[13px] font-semibold text-[#0F1629] mb-2 block">Content type</label>
                    <div className="pill-group">
                      {["Ad Copy", "Landing Page", "Email", "Press Release", "Social Post", "Other"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setPasteSource(s)}
                          className={`pill ${pasteSource === s ? "pill-active" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="text-[13px] font-semibold text-[#0F1629] mb-2 block">Paste competitor content</label>
                    <textarea
                      value={pastedContent}
                      onChange={(e) => setPastedContent(e.target.value)}
                      placeholder={"Paste an ad, landing page copy, email, or press release from a competitor...\n\nExample: \"Pay in 4. No interest. No fees. Klarna makes shopping smoooth...\""}
                      className="textarea-styled h-48"
                    />
                  </div>
                  <button onClick={handlePaste} disabled={analysisStreaming || !pastedContent.trim()} className="btn-primary w-full">
                    {analysisStreaming ? "Analyzing..." : "Analyze This Content"}
                  </button>
                  <p className="text-[11px] text-[#B0B5C8] mt-3 text-center">Compares against Affirm positioning and generates actionable intel</p>
                </div>
              </div>
              <div className="lg:col-span-3">
                {analysisError && <ErrorBar message={analysisError} />}
                {(analysisOutput || analysisStreaming) ? (
                  <AnalysisResult
                    content={analysisOutput}
                    isStreaming={analysisStreaming}
                    streamLabel="Analyzing competitor content..."
                    shareLabel="Paste & Analyze — Competitor Content Intel"
                    onCopyFormatted={() => handleCopyFormatted(analysisOutput, "Paste & Analyze — Competitor Content Intel")}
                    onCopyRaw={() => handleCopyRaw(analysisOutput)}
                    onDownload={() => handleDownload(analysisOutput, "paste-analysis.md")}
                  />
                ) : (
                  <EmptyState icon={icons.paste} title="Paste something to analyze" desc="AI will break down what they're saying, identify threats, and tell you how to respond." />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== WEEKLY PULSE ========== */}
        {activeTab === "pulse" && (
          <div>
            <div className="flex items-start justify-between mb-8">
              <PageHeader
                title="Weekly Competitive Pulse"
                subtitle="One click. AI analyzes all 5 competitors and tells you what changed, what matters, and what to do."
                noMargin
              />
              <button onClick={handlePulse} disabled={pulseStreaming} className="btn-primary shrink-0 ml-6">
                {pulseStreaming ? "Generating..." : "Generate Pulse"}
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                {pulseError && <ErrorBar message={pulseError} />}
                {(pulseOutput || pulseStreaming) ? (
                  <AnalysisResult content={pulseOutput} isStreaming={pulseStreaming} streamLabel="Scanning competitive landscape..." shareLabel="Weekly Competitive Pulse" onCopyFormatted={() => handleCopyFormatted(pulseOutput, "Weekly Competitive Pulse")} onCopyRaw={() => handleCopyRaw(pulseOutput)} onDownload={() => handleDownload(pulseOutput, "weekly-pulse.md")} />
                ) : (
                  <EmptyState icon={icons.pulse} title="Your Monday morning starts here" desc="Generate a full competitive brief — positioning shifts, threat levels, and recommended actions." />
                )}
              </div>
              <div className="w-full lg:w-56 shrink-0">
                <div className="card-elevated p-4">
                  <h3 className="text-[13px] font-semibold text-[#0F1629] mb-3">Recent Pulses</h3>
                  <div className="space-y-2">
                    {SAVED_ANALYSES.filter(h => h.type === "pulse").map((h, i) => (
                      <div key={i} className="p-3 rounded-xl border border-[#E8EAF0] hover:border-[rgba(74,58,255,0.25)] hover:bg-[#F8F7FF] transition-all cursor-pointer">
                        <div className="text-[11px] text-[#8B91A8] font-medium">{h.date}</div>
                        <div className="text-[12px] font-medium text-[#0F1629] mt-1 leading-snug">{h.title}</div>
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
            <PageHeader title="Overlap Analyzer" subtitle="Find where our messaging collides with a competitor — and where we have whitespace to own." />

            <div className="card-elevated p-4 mb-6 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-medium text-[#8B91A8]">Compare against</span>
              <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="select-styled min-w-[180px]">
                {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
              </select>
              <button onClick={handleOverlap} disabled={analysisStreaming} className="btn-primary">
                {analysisStreaming ? "Analyzing..." : "Analyze Overlap"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <CompactCard label="Our Positioning" name="Affirm" items={[...affirm.consumer.slice(0, 3), ...affirm.differentiators.slice(0, 2)]} accent="#4A3AFF" />
              <CompactCard label="Their Positioning" name={comp.name} items={[...comp.consumer.slice(0, 3), ...comp.differentiators.slice(0, 2)]} accent="#8B91A8" />
            </div>

            {analysisError && <ErrorBar message={analysisError} />}
            {(analysisOutput || analysisStreaming) ? (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Comparing Affirm vs ${comp.name}...`} shareLabel={`Overlap Analysis — Affirm vs. ${comp.name}`} onCopyFormatted={() => handleCopyFormatted(analysisOutput, `Overlap Analysis — Affirm vs. ${comp.name}`)} onCopyRaw={() => handleCopyRaw(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `overlap-vs-${selectedCompetitor}.md`)} />
            ) : (
              <EmptyState icon={icons.overlap} title="Select a competitor and analyze" desc="AI will compare positioning head-to-head — finding overlaps, gaps, and opportunities." />
            )}
          </div>
        )}

        {/* ========== SHARPENER ========== */}
        {activeTab === "sharpen" && (
          <div>
            <PageHeader title="Message Sharpener" subtitle="Pick a competitor and audience. AI rewrites our positioning for that specific matchup — with copy that could ship." />

            <div className="card-elevated p-4 mb-6 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-medium text-[#8B91A8]">Against</span>
              <select value={selectedCompetitor} onChange={(e) => handleCompetitorChange(e.target.value)} className="select-styled min-w-[160px]">
                {COMPETITOR_KEYS.map((k) => (<option key={k} value={k}>{COMPETITORS[k].name}</option>))}
              </select>
              <span className="text-[13px] font-medium text-[#8B91A8]">for</span>
              <select value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)} className="select-styled min-w-[240px]">
                <option value="">Select audience...</option>
                {AUDIENCES.map((a) => (<option key={a} value={a}>{a}</option>))}
              </select>
              <button onClick={handleSharpen} disabled={analysisStreaming || !selectedAudience} className="btn-primary">
                {analysisStreaming ? "Sharpening..." : "Sharpen Positioning"}
              </button>
            </div>

            {analysisError && <ErrorBar message={analysisError} />}
            {(analysisOutput || analysisStreaming) ? (
              <AnalysisResult content={analysisOutput} isStreaming={analysisStreaming} streamLabel={`Sharpening against ${comp.name}...`} shareLabel={`Message Sharpener — vs. ${comp.name} for ${selectedAudience}`} onCopyFormatted={() => handleCopyFormatted(analysisOutput, `Message Sharpener — vs. ${comp.name} for ${selectedAudience}`)} onCopyRaw={() => handleCopyRaw(analysisOutput)} onDownload={() => handleDownload(analysisOutput, `sharpen-vs-${selectedCompetitor}.md`)} />
            ) : (
              <EmptyState icon={icons.sharpen} title="Choose matchup and audience" desc="AI will rewrite our value props for that competitive matchup — including a killer one-liner and talk track." />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8EAF0] mt-auto">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">
          <span className="text-[12px] text-[#B0B5C8]">Compete — Built for Affirm PMM</span>
          <span className="text-[12px] text-[#B0B5C8]">Powered by Claude AI</span>
        </div>
      </footer>
    </div>
  );
}

/* ======================================================== */
/*  SUB-COMPONENTS                                          */
/* ======================================================== */

function PageHeader({ title, subtitle, noMargin }: { title: string; subtitle: string; noMargin?: boolean }) {
  return (
    <div className={noMargin ? "" : "mb-8"}>
      <h1 className="text-[1.65rem] font-bold text-[#0F1629] tracking-[-0.02em]">{title}</h1>
      <p className="text-[15px] text-[#5A6180] mt-1 leading-relaxed max-w-2xl">{subtitle}</p>
    </div>
  );
}

function ErrorBar({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-[13px] font-medium mb-4">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {message}
    </div>
  );
}

function ActionCard({ icon, title, description, buttonText, onClick, tag, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  tag?: string;
  delay?: number;
}) {
  return (
    <div className={`card-elevated card-interactive p-6 group relative animate-slide-up animate-slide-up-${delay || 1}`}>
      {tag && (
        <span className={`absolute top-4 right-4 tag ${tag === "New" ? "tag-emerald" : "tag-affirm"}`}>
          {tag}
        </span>
      )}
      <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] flex items-center justify-center mb-4 text-[#4A3AFF] group-hover:bg-[#E8E5FF] transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-[#0F1629] text-[16px] mb-1.5 tracking-[-0.01em]">{title}</h3>
      <p className="text-[13px] text-[#5A6180] leading-relaxed mb-5">{description}</p>
      <button onClick={onClick} className="btn-primary w-full text-[13px] py-2.5">
        {buttonText}
        <span className="ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">{icons.arrowRight}</span>
      </button>
    </div>
  );
}

function CompactCard({ label, name, items, accent }: {
  label: string;
  name: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="card-elevated p-5 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />
      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B91A8]">{label}</div>
          <div className="font-bold text-[#0F1629] text-[17px] tracking-[-0.01em]">{name}</div>
        </div>
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[13px] text-[#3D4663] leading-relaxed">
            <span className="w-[5px] h-[5px] rounded-full mt-[7px] shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
            {item}
          </div>
        ))}
      </div>
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
    <div className="result-card animate-fade-in">
      <div className="result-header">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-2 text-[#4A3AFF] text-[13px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4A3AFF] animate-pulse" />
              {streamLabel}
            </span>
          )}
          {!isStreaming && content && (
            <span className="flex items-center gap-2 text-[#059669] text-[13px] font-medium">
              {icons.check}
              Analysis complete
            </span>
          )}
        </div>
        {content && !isStreaming && (
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {copied && (
              <span className="absolute -top-9 right-0 px-3 py-1.5 rounded-lg bg-[#0F1629] text-white text-[12px] font-medium shadow-xl animate-fade-in whitespace-nowrap">
                {copied}
              </span>
            )}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="btn-primary text-[12px] py-[7px] px-3.5"
            >
              {icons.share}
              <span>Share</span>
              {icons.chevronDown}
            </button>
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-[260px] dropdown-menu z-50 animate-fade-in">
                <div className="px-4 py-2.5 border-b border-[#F3F4F8]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B91A8]">Share options</span>
                </div>
                <div className="py-1.5">
                  <button onClick={() => handleAction(onCopyFormatted, "Copied for Slack!")} className="dropdown-item">
                    <div className="dropdown-icon bg-[#F0EEFF] text-[#4A3AFF]">{icons.slack}</div>
                    <div>
                      <div className="text-[13px] font-medium text-[#0F1629]">Copy for Slack / Email</div>
                      <div className="text-[11px] text-[#8B91A8]">With header, date & footer</div>
                    </div>
                  </button>
                  <button onClick={() => handleAction(onCopyRaw, "Markdown copied!")} className="dropdown-item">
                    <div className="dropdown-icon bg-[#F3F4F8] text-[#3D4663]">{icons.copy}</div>
                    <div>
                      <div className="text-[13px] font-medium text-[#0F1629]">Copy Raw Markdown</div>
                      <div className="text-[11px] text-[#8B91A8]">Plain text, no formatting</div>
                    </div>
                  </button>
                  <button onClick={() => handleAction(onDownload, "Downloaded!")} className="dropdown-item">
                    <div className="dropdown-icon bg-[#F3F4F8] text-[#3D4663]">{icons.download}</div>
                    <div>
                      <div className="text-[13px] font-medium text-[#0F1629]">Download .md File</div>
                      <div className="text-[11px] text-[#8B91A8]">Save as attachment</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="result-body">
        <div className={`prose-output ${isStreaming ? "streaming-cursor" : ""}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="empty-state">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8EAF0] flex items-center justify-center mx-auto mb-4 text-[#4A3AFF] shadow-sm">
          {icon}
        </div>
        <p className="text-[15px] font-semibold text-[#0F1629]">{title}</p>
        <p className="text-[13px] text-[#5A6180] mt-1.5 max-w-sm mx-auto leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
