
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DemoHeader from "../components/DemoHeader";
import DemoTabs from "../components/DemoTabs";
import DemoFrame from "../components/DemoFrame";
import "../styles/product-demo.css";

const TAB_DURATIONS_MS = {
  "ai-analyst": 30000,
  table: 12000,
  pipeline: 15500,
  email: 24000,
};

const DEMO_TABS = [
  {
    id: "ai-analyst",
    label: "AI-ANALYST",
    prompt: "Which accounts haven't been contacted in 30 days?",
    responseIntro:
      "Found 3 high-value accounts with no activity in 30+ days. Combined pipeline value: $840K.",
    cards: [
      {
        company: "Stripe",
        contact: "Sarah Kim",
        value: "$320K",
        meta: "38 days ago",
        tone: "danger",
        badge: "ST",
      },
      {
        company: "Shopify",
        contact: "Marcus Lee",
        value: "$280K",
        meta: "41 days ago",
        tone: "warning",
        badge: "SH",
      },
      {
        company: "Notion",
        contact: "Priya Nair",
        value: "$240K",
        meta: "35 days ago",
        tone: "danger",
        badge: "NO",
      },
    ],
    assistantFollowup:
      "Want me to draft a personalised re-engagement email for any of these?",
    userFollowup: "Yes — draft one for Stripe",
    finalCard: {
      title: "Draft · Re-engagement — Stripe",
      subject: "Checking in — quick question for you",
      body: `Hi Sarah,

Noticed there hasn't been much activity on the account recently, so I wanted to check in.

Given Stripe's recent usage trends, I thought it might be helpful to reconnect and see whether priorities have shifted or if there's anything blocking next steps on your side.

Would you be open to a quick check-in this week?

Best,
Filip`,
    },
  },
  {
    id: "table",
    label: "TABLE",
    prompt: "Show me enterprise accounts at risk this quarter",
    responseIntro:
      "Here are the accounts with low engagement signals and renewals inside the next 90 days.",
    table: {
      columns: ["Account", "Owner", "Health", "Renewal", "ARR"],
      rows: [
        ["Northstar", "Ava", "At risk", "Apr 18", "$120K"],
        ["Vertex", "Liam", "Watch", "May 03", "$84K"],
        ["Meridian", "Noah", "At risk", "May 11", "$210K"],
        ["Arcflow", "Mia", "Watch", "Jun 02", "$96K"],
      ],
    },
    assistantFollowup:
      "I can also group these by owner or highlight the accounts that need outreach this week.",
  },
  {
    id: "pipeline",
    label: "PIPELINE",
    prompt: "What needs attention in pipeline this week?",
    responseIntro:
      "Three deals are likely to stall unless someone follows up before Friday.",
    pipeline: [
      {
        stage: "Qualified",
        deals: [
          { name: "Greenleaf", value: "$42K", status: "Needs intro" },
          { name: "Northbeam", value: "$28K", status: "Waiting reply" },
        ],
      },
      {
        stage: "Proposal",
        deals: [
          { name: "Vanta", value: "$88K", status: "Security review" },
          { name: "Pulse", value: "$64K", status: "Pricing questions" },
        ],
      },
      {
        stage: "Negotiation",
        deals: [{ name: "Obsidian", value: "$120K", status: "Legal blocked" }],
      },
    ],
    assistantFollowup:
      "Want me to prepare next steps for the deals with blockers?",
  },
  {
    id: "email",
    label: "EMAIL",
    prompt: "Draft a follow-up for Greenleaf after yesterday's demo",
    responseIntro:
      "Done — I used the buyer's key concerns, implementation timing, and their growth plans to shape the draft.",
    email: {
      to: "Simon Mitchell",
      subject: "Following up on yesterday's demo",
      preview: `Hi Simon,

Thanks again for the time yesterday. Based on your questions around rollout speed, data flexibility, and team adoption, I think there's a clear path for Greenleaf to get value quickly.

One thing that stood out was your concern about migration delays. I pulled together a few examples of teams that moved to SoftSync in under a week, and I'd be happy to share those in more detail.

Would Tuesday or Wednesday work for a short follow-up?`,
    },
    assistantFollowup:
      "I can shorten the draft, make it more direct, or tailor it to a technical buyer instead.",
  },
];

export default function ProductDemo() {
  const [activeTab, setActiveTab] = useState(DEMO_TABS[0].id);
  const [progressKey, setProgressKey] = useState(0);
  const timeoutRef = useRef(null);
  const [tabDurationMs, setTabDurationMs] = useState(
    TAB_DURATIONS_MS[DEMO_TABS[0].id] ?? 18000
  );

  const activeDemo = useMemo(
    () => DEMO_TABS.find((tab) => tab.id === activeTab) || DEMO_TABS[0],
    [activeTab]
  );

  const rotateToNextTab = useCallback(() => {
    setActiveTab((current) => {
      const currentIndex = DEMO_TABS.findIndex((tab) => tab.id === current);
      const nextIndex = (currentIndex + 1) % DEMO_TABS.length;
      return DEMO_TABS[nextIndex].id;
    });
    setProgressKey((prev) => prev + 1);
  }, []);

  const scheduleNextRotation = useCallback(
    (currentTabId, overrideDurationMs) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const duration = overrideDurationMs ?? (TAB_DURATIONS_MS[currentTabId] ?? 18000);
    setTabDurationMs(duration);

    timeoutRef.current = setTimeout(() => {
      rotateToNextTab();
    }, duration);
    },
    [rotateToNextTab]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    scheduleNextRotation(activeTab);
  }, [activeTab, scheduleNextRotation]);

  const handleEmailSent = useCallback(() => {
    if (activeTab !== "email") return;
    scheduleNextRotation("email", 4000);
  }, [activeTab, scheduleNextRotation]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setProgressKey((prev) => prev + 1);
  }, []);

  return (
    <section
      className="product-demo-section"
      aria-labelledby="product-demo-title"
      style={{ "--ss-tab-duration": `${tabDurationMs}ms` }}
    >
      <div className="product-demo-shell">
        <DemoHeader />

        <div className="demo-stage-grid">
          <div
            className="demo-stage-guide demo-stage-guide-left"
            aria-hidden="true"
          />
          <div
            className="demo-stage-guide demo-stage-guide-right"
            aria-hidden="true"
          />
          <div className="demo-stage-guide-horizontal" aria-hidden="true" />

          <div className="demo-showcase-zone">
            <DemoTabs
              tabs={DEMO_TABS}
              activeTab={activeTab}
              onChange={handleTabChange}
              progressKey={progressKey}
            />

            <DemoFrame
              demo={activeDemo}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onEmailSent={handleEmailSent}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
