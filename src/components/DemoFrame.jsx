import React, { useEffect, useRef, useState } from "react";

/**
 * Typewriter: character-by-character text reveal.
 * Uses ref for onDone callback to avoid re-triggering when parent re-renders.
 */
function Typewriter({ text, speed = 18, onDone, className = "" }) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);

  // Sync onDone ref without adding to effect dependencies
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let i = 0;
    setVisible("");
    setDone(false);

    const iv = setInterval(() => {
      i += 1;
      setVisible(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);

    return () => clearInterval(iv);
  }, [text, speed]);

  return (
    <span className={className}>
      {visible}
      {!done && <span className="demo-tw-cursor">|</span>}
    </span>
  );
}

/** SVG icon paths and Icon component */
const Icon = ({ d, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  email:
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5",
  dashboard:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  table: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18",
  people:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  invite:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6",
  plus: "M12 5v14M5 12h14",
  chevron: "M6 9l6 6 6-6",
  layout: "M4 6h16M4 12h16M4 18h7",
};

/** Tab helpers */
function isCrmTab(tab) {
  return tab === "table" || tab === "pipeline";
}

function shouldSkipCrmTopIntro(prevTab, nextTab) {
  return isCrmTab(prevTab) && isCrmTab(nextTab);
}

/** Maps active tab to sidebar highlight state */
function getHighlight(activeTab) {
  switch (activeTab) {
    case "ai-analyst":
      return { nav: "chat" };
    case "table":
      return { subitem: "all-people" };
    case "pipeline":
      return { subitem: "pipeline" };
    case "email":
      return { nav: "email" };
    default:
      return { nav: "chat" };
  }
}

/** Main navigation sidebar */
function Sidebar({ activeTab, onTabChange }) {
  const hl = getHighlight(activeTab);
  const nav = (k) => (hl.nav === k ? "is-active" : "");
  const sub = (k) => (hl.subitem === k ? "is-active" : "");

  return (
    <aside className="demo-sidebar">
      <div className="demo-sidebar-top">
        <div className="demo-logo-row">
          <div className="demo-logo-mark">
            <img
              src="/softsync-icon.webp"
              alt="SoftSync"
              style={{ width: 18, height: 18, objectFit: "contain" }}
            />
          </div>
          <span className="demo-logo-text">SoftSync</span>
          <span className="demo-logo-caret">
            <Icon d={ICONS.chevron} size={14} />
          </span>
        </div>
        <button className="demo-sidebar-icon-btn">
          <Icon d={ICONS.layout} size={16} />
        </button>
      </div>

      <nav className="demo-nav">
        <button
          className={`demo-nav-item is-linked ${nav("chat")}`}
          onClick={() => onTabChange?.("ai-analyst")}
        >
          <span className="demo-nav-chat-icon">✦</span>
          <span>Chat</span>
        </button>

        <button className={`demo-nav-item ${nav("search")}`}>
          <Icon d={ICONS.search} size={15} />
          <span>Search</span>
        </button>

        <button className={`demo-nav-item ${nav("notification")}`}>
          <Icon d={ICONS.bell} size={15} />
          <span>Notification</span>
        </button>

        <button
          className={`demo-nav-item is-linked ${nav("email")}`}
          onClick={() => onTabChange?.("email")}
        >
          <Icon d={ICONS.email} size={15} />
          <span>Email</span>
        </button>

        <button className={`demo-nav-item ${nav("dashboards")}`}>
          <Icon d={ICONS.dashboard} size={15} />
          <span>Dashboards</span>
        </button>
      </nav>

      <div className="demo-sidebar-section">
        <div className="demo-sidebar-section-header">
          <span>My groups</span>
          <Icon d={ICONS.chevron} size={13} />
        </div>

        <div className="demo-sidebar-group-item">
          <div className="demo-group-label">
            <span className="demo-group-emoji">🤑</span>
            <span className="demo-group-name">Leads</span>
          </div>

          <div className="demo-group-subnav">
            <div
              className={`demo-group-subitem is-linked ${sub("pipeline")}`}
              onClick={() => onTabChange?.("pipeline")}
              style={{ cursor: "pointer" }}
            >
              <Icon d={ICONS.table} size={13} />
              <span>Pipeline</span>
            </div>

            <div
              className={`demo-group-subitem is-linked ${sub("all-people")}`}
              onClick={() => onTabChange?.("table")}
              style={{ cursor: "pointer" }}
            >
              <Icon d={ICONS.people} size={13} />
              <span>All people</span>
            </div>
          </div>
        </div>

        <div className="demo-sidebar-group-item">
          <div className="demo-group-label">
            <span className="demo-group-emoji">🤝</span>
            <span className="demo-group-name">Clients</span>
          </div>

          <div className="demo-group-subnav">
            <div className="demo-group-subitem">
              <Icon d={ICONS.table} size={13} />
              <span>Pipeline</span>
            </div>
            <div className="demo-group-subitem">
              <Icon d={ICONS.people} size={13} />
              <span>All people</span>
            </div>
          </div>
        </div>

        <button className="demo-new-group-btn">
          <Icon d={ICONS.plus} size={13} />
          <span>New Group</span>
        </button>
      </div>

      <div className="demo-sidebar-section demo-sidebar-section--muted">
        <div className="demo-sidebar-section-header">
          <span>Chat</span>
          <Icon d={ICONS.chevron} size={13} />
        </div>
        <p className="demo-sidebar-empty">No chats yet</p>
      </div>

      <div className="demo-sidebar-footer">
        <div className="demo-sidebar-footer-user">
          <div className="demo-avatar">FJ</div>
          <div className="demo-user-info">
            <p className="demo-user-name">Filip Johnson</p>
            <p className="demo-user-email">filip@softsync.ai</p>
          </div>
        </div>

        <div className="demo-sidebar-footer-actions">
          <button className="demo-footer-action-btn">
            <Icon d={ICONS.settings} size={14} />
            <span>Settings</span>
          </button>
          <button className="demo-footer-action-btn">
            <Icon d={ICONS.invite} size={14} />
            <span>Invite members</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Message and avatar badge components */
const AiBadge = () => (
  <div className="demo-message-badge">
    <img
      src="/softsync-icon.webp"
      alt="AI"
      style={{ width: 16, height: 16, objectFit: "contain" }}
    />
  </div>
);

const UserBadge = () => (
  <div className="demo-user-msg-badge">
    <Icon d={ICONS.people} size={14} />
  </div>
);

const TypingDots = () => (
  <div className="demo-typing-dots">
    <span />
    <span />
    <span />
  </div>
);

/** Suggestion chips for AI Analyst welcome state */
const SUGGESTIONS = [
  "Which accounts haven't been contacted in 30 days?",
  "Draft a re-engagement email for Stripe",
  "What's our pipeline health this quarter?",
  "Show me at-risk deals",
];

/** AI Analyst initial welcome screen */
function WelcomeScreen({ onDone }) {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHighlighted(true), 2000);
    const t2 = setTimeout(onDone, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className="demo-welcome demo-welcome-anim">
      <div className="demo-welcome-logo">
        <img
          src="/softsync-icon.webp"
          alt="SoftSync"
          style={{ width: 48, height: 48, objectFit: "contain" }}
        />
      </div>
      <h3 className="demo-welcome-title">What can SoftSync help with today?</h3>
      <p className="demo-welcome-sub">
        Get more from your internal data and external sources.
      </p>
      <div className="demo-suggestions">
        {SUGGESTIONS.map((s, i) => (
          <div
            key={i}
            className={`demo-suggestion-chip${i === 0 && highlighted ? " is-active" : ""}`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/** AI Analyst chat conversation flow */
function AnalystChat({ demo, onSendActive }) {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef(null);

  const AI_TYPE_SPEED = 20; // ms per character (higher = slower)
  const AI_READ_PAUSE_MS = 900;
  const USER_READ_PAUSE_MS = 1400;

  const next = (p) => setPhase(p);

  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => onSendActive?.(true), 1900);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      onSendActive?.(false);
    }
  }, [phase, onSendActive]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const scroll = () => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    const t1 = setTimeout(scroll, 80);
    const t2 = setTimeout(scroll, 600);
    const t3 = setTimeout(scroll, phase >= 10 ? 3200 : 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  useEffect(() => {
    let timer;

    if (phase === 2) timer = setTimeout(() => next(3), USER_READ_PAUSE_MS);
    if (phase === 3) timer = setTimeout(() => next(4), 1400);
    if (phase === 5) timer = setTimeout(() => next(6), AI_READ_PAUSE_MS);
    if (phase === 7) timer = setTimeout(() => next(8), USER_READ_PAUSE_MS);
    if (phase === 8) timer = setTimeout(() => next(9), 1400);
    if (phase === 10) timer = setTimeout(() => next(11), AI_READ_PAUSE_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="demo-content-wrap" ref={scrollRef}>
      {phase === 0 && <WelcomeScreen onDone={() => next(1)} />}

      {phase >= 1 && (
        <div className="demo-chat-area">
          <div className="demo-message demo-message-assistant demo-msg-enter">
            <AiBadge />
            <div className="demo-bubble demo-bubble-assistant">
              {phase === 1 ? (
                <Typewriter
                  text="Hi! I'm your SoftSync AI Analyst. I surface insights from your CRM data, flag risks, and help you take action."
                  speed={AI_TYPE_SPEED}
                  onDone={() => setTimeout(() => next(2), 600)}
                />
              ) : (
                "Hi! I'm your SoftSync AI Analyst. I surface insights from your CRM data, flag risks, and help you take action."
              )}
            </div>
          </div>

          {phase >= 2 && (
            <div className="demo-message demo-message-user demo-msg-enter">
              <div className="demo-bubble demo-bubble-user">{demo.prompt}</div>
              <UserBadge />
            </div>
          )}

          {phase >= 3 && phase < 4 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <TypingDots />
            </div>
          )}

          {phase >= 4 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <div className="demo-bubble demo-bubble-assistant demo-bubble-stack">
                {phase === 4 ? (
                  <Typewriter
                    text={demo.responseIntro}
                    speed={AI_TYPE_SPEED}
                    onDone={() => setTimeout(() => next(5), 300)}
                  />
                ) : (
                  <p>{demo.responseIntro}</p>
                )}

                {phase >= 5 && (
                  <div className="demo-insight-card demo-card-enter">
                    <div className="demo-card-header">
                      <span className="demo-card-header-label">
                        <span className="demo-card-sparkle">✦</span> Stale accounts — action needed
                      </span>
                    </div>
                    <div className="demo-account-list">
                      {demo.cards?.map((card) => (
                        <div key={card.company} className="demo-account-row">
                          <div className={`demo-account-badge ${card.tone || ""}`}>{card.badge}</div>
                          <div className="demo-account-main">
                            <p className="demo-account-company">{card.company}</p>
                            <p className="demo-account-contact">{card.contact}</p>
                          </div>
                          <div className="demo-account-side">
                            <p className="demo-account-value">{card.value}</p>
                            <p className={`demo-account-meta ${card.tone || ""}`}>{card.meta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="demo-card-footer">Synced from HubSpot · 4 min ago</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase >= 6 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <div className="demo-bubble demo-bubble-assistant">
                {phase === 6 ? (
                  <Typewriter
                    text={demo.assistantFollowup}
                    speed={AI_TYPE_SPEED}
                    onDone={() => setTimeout(() => next(7), 700)}
                  />
                ) : (
                  demo.assistantFollowup
                )}
              </div>
            </div>
          )}

          {phase >= 7 && (
            <div className="demo-message demo-message-user demo-msg-enter">
              <div className="demo-bubble demo-bubble-user">{demo.userFollowup}</div>
              <UserBadge />
            </div>
          )}

          {phase >= 8 && phase < 9 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <TypingDots />
            </div>
          )}

          {phase >= 9 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <div className="demo-bubble demo-bubble-assistant demo-bubble-stack">
                {phase === 9 ? (
                  <Typewriter
                    text="Here's a re-engagement draft personalised to Stripe's recent usage and your last interaction with Sarah."
                    speed={AI_TYPE_SPEED}
                    onDone={() => setTimeout(() => next(10), 300)}
                  />
                ) : (
                  <p>
                    Here's a re-engagement draft personalised to Stripe's recent usage and your last
                    interaction with Sarah.
                  </p>
                )}

                {phase >= 10 && (
                  <div className="demo-draft-card demo-card-enter">
                    <div className="demo-draft-title">
                      <span className="demo-card-sparkle">✦</span> {demo.finalCard?.title}
                    </div>
                    <div className="demo-draft-field">
                      <span>Subject</span>
                      <strong>{demo.finalCard?.subject}</strong>
                    </div>
                    <div className="demo-draft-body">
                      <p>Hi Sarah,</p>
                      <p>
                        I noticed we haven't caught up since your team started exploring the new sync
                        workflows. A few customers in your space are seeing 3× faster data refresh cycles —
                        happy to walk through what that could look like for Stripe.
                      </p>
                      <p>Would 20 min this week work?</p>
                    </div>
                    <div className="demo-draft-footer">
                      <span>Based on last interaction · Oct 3 · HubSpot</span>
                      <div className="demo-draft-actions">
                        <button className="demo-draft-btn-ghost">Edit</button>
                        <button className="demo-draft-btn-primary">Send</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase >= 11 && (
            <div className="demo-message demo-message-assistant demo-msg-enter">
              <AiBadge />
              <div className="demo-bubble demo-bubble-assistant">
                {phase === 11 ? (
                  <Typewriter
                    text="I can adjust the tone, add Stripe's recent milestones, or queue this for sending. What would you like?"
                    speed={AI_TYPE_SPEED}
                    onDone={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({
                          top: scrollRef.current.scrollHeight,
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                ) : (
                  "I can adjust the tone, add Stripe's recent milestones, or queue this for sending. What would you like?"
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * CRM shared chrome (toolbar, subtoolbar, searchbar).
 * When showImmediately: skips fade-in. Otherwise fades in and removes pointer-events block after animation.
 */
const CRM_FADE_DURATION_MS = 600;

function CrmTopSection({ showImmediately = false, children, className = "", delay = 0 }) {
  const [fadeDone, setFadeDone] = useState(showImmediately);

  useEffect(() => {
    if (showImmediately) {
      setFadeDone(true);
      return;
    }
    const t = setTimeout(() => {
      setFadeDone(true);
    }, delay + CRM_FADE_DURATION_MS);
    return () => clearTimeout(t);
  }, [showImmediately, delay]);

  if (showImmediately) {
    return <div className={`${className} crm-top-static`}>{children}</div>;
  }

  return (
    <div
      className={`${className} crm-fade-in ${fadeDone ? "" : "crm-hidden"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Table view. Timeline: 300ms chrome, 650ms thead, 950ms rows; 6s search focus, type, filter.
 */
const LEADS_ROWS = [
  {
    avatar: "JA",
    name: "James Anderson",
    company: "SoftSync.ai",
    companyBadge: "SS",
    email: "james.anderson@softsync.ai",
    status: "To connected",
    statusColor: "yellow",
    title: "Product Designer",
    interaction: "J James Anderson",
  },
  {
    avatar: "MT",
    name: "Michael Turner",
    company: "EXL Exiservice",
    companyBadge: "EXL",
    email: "michael.turner@exl.com",
    status: "Connected",
    statusColor: "green",
    title: "Web Designer",
    interaction: "J James Anderson",
  },
  {
    avatar: "AM",
    name: "Alex Morgan",
    company: "Wisflux Tech Labs",
    companyBadge: "W",
    email: "alex.morgan@wisflux.com",
    status: "Pending",
    statusColor: "orange",
    title: "Motion Designer",
    interaction: "J James Anderson",
  },
  {
    avatar: "EC",
    name: "Emily Carter",
    company: "Black Rocket",
    companyBadge: "BR",
    email: "emily.carter@blackrocket.com",
    status: "Rejected",
    statusColor: "red",
    title: "HR Manager",
    interaction: "J James Anderson",
  },
  {
    avatar: "SR",
    name: "Sophia Reynolds",
    company: "Hawkscode",
    companyBadge: "H",
    email: "sophia.reynolds@hawkscode.io",
    status: "Qualified",
    statusColor: "blue",
    title: "Operations Manager",
    interaction: "J James Anderson",
  },
];

const STATUS_COLORS = {
  yellow: { bg: "#fef9c3", color: "#a16207" },
  green:  { bg: "#dcfce7", color: "#15803d" },
  orange: { bg: "#ffedd5", color: "#c2410c" },
  red:    { bg: "#fee2e2", color: "#b91c1c" },
  blue:   { bg: "#dbeafe", color: "#1d4ed8" },
  purple: { bg: "#ede9fe", color: "#6d28d9" },
};

function TableView({ suppressTopIntro = false }) {
  const [phase, setPhase] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState(false);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const SEARCH_QUERY = "Alex Morgan";
  const TABLE_MIDPOINT_MS = 6000;

  useEffect(() => {
    setPhase(0);
    setSearchText("");
    setFiltered(false);
    setSelectedRows(new Set());
    setSelectAll(false);

    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 950),
      setTimeout(() => setPhase(4), TABLE_MIDPOINT_MS),
      setTimeout(() => setPhase(5), TABLE_MIDPOINT_MS + 500),
      setTimeout(() => setPhase(6), TABLE_MIDPOINT_MS + 1000),
      setTimeout(() => setPhase(7), TABLE_MIDPOINT_MS + 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 6) return;
    let i = 0;
    setSearchText("");
    const iv = setInterval(() => {
      i += 1;
      setSearchText(SEARCH_QUERY.slice(0, i));
      if (i >= SEARCH_QUERY.length) clearInterval(iv);
    }, 70);
    return () => clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase === 7) setFiltered(true);
  }, [phase]);

  const visibleRows = filtered
    ? LEADS_ROWS.filter((r) =>
        r.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : LEADS_ROWS;

  const toggleRow = (name) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      setSelectAll(next.size === visibleRows.length);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(visibleRows.map((r) => r.name)));
      setSelectAll(true);
    }
  };

  return (
    <div className="crm-table-view">
      <CrmTopSection showImmediately={suppressTopIntro} className="crm-toolbar" delay={0}>
        <div className="crm-toolbar-left">
          <div className="crm-leads-title">
            <span className="crm-leads-emoji">🟣</span>
            <span className="crm-leads-name">Leads</span>
          </div>
          <button className="crm-btn-ghost">
            <span>+</span> Create
          </button>
          <button className="crm-btn-ghost">
            <span className="crm-icon-link">⊘</span> Enroll
          </button>
        </div>
        <div className="crm-toolbar-right">
          <button className="crm-btn-outline">✦ Smart Import</button>
          <button className="crm-btn-outline">↑ Share</button>
        </div>
      </CrmTopSection>

      <CrmTopSection showImmediately={suppressTopIntro} className="crm-subtoolbar" delay={40}>
        <div className="crm-view-selector">
          <span className="crm-view-icon">⊞</span> All People - Leads{" "}
          <span className="crm-chevron">⌃</span>
        </div>
        <div className="crm-view-count">
          <button className="crm-view-count-icon" type="button" aria-label="View settings">
            <Icon d={ICONS.settings} size={15} />
          </button>
          <span className="crm-view-count-text">5 in view</span>
        </div>
      </CrmTopSection>

      <CrmTopSection showImmediately={suppressTopIntro} className="crm-searchbar-row" delay={80}>
        <div className={`crm-search-input-wrap ${phase >= 4 ? "is-focused" : ""}`}>
          <span className="crm-search-icon">🔍</span>
          <span className="crm-search-text">
            {phase >= 6 ? searchText : "Search records..."}
            {phase === 6 && searchText.length < SEARCH_QUERY.length && (
              <span className="demo-tw-cursor">|</span>
            )}
          </span>
        </div>

        <div className="crm-filter-actions">
          <button className="crm-icon-btn">⇅</button>
          <button className="crm-icon-btn">⊟</button>
          <button className="crm-icon-btn">↻</button>
          <button className="crm-icon-btn">⋯</button>
          <button className="crm-icon-btn">✦</button>
          <button className="crm-enrich-btn">✦ Enrich (0)</button>
        </div>

        <button className="crm-add-col-btn">+</button>
      </CrmTopSection>

      <div className="crm-lower">
        <div className="crm-table-wrap">
          <div
            className={`crm-thead ${phase >= 2 ? "crm-fade-in" : "crm-hidden"} ${
              selectAll ? "crm-thead-selected" : ""
            }`}
          >
            <div className="crm-th crm-th-check">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                title="Select all rows"
              />
            </div>
            <div className="crm-th crm-th-name"></div>
            <div className="crm-th">Company</div>
            <div className="crm-th">✉ Email</div>
            <div className="crm-th">▼ Status</div>
            <div className="crm-th">⊞ Job Title</div>
            <div className="crm-th">👤 Interaction B</div>
          </div>

          <div className="crm-tbody">
            {LEADS_ROWS.map((row, i) => {
              const isVisible = !filtered || visibleRows.includes(row);
              if (filtered && !isVisible) return null;

              const isSelected = selectedRows.has(row.name);

              return (
                <div
                  key={row.name}
                  className={`crm-tr ${phase >= 3 ? "crm-row-in" : "crm-hidden"} ${
                    isSelected ? "crm-tr-selected" : ""
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                  onClick={() => toggleRow(row.name)}
                >
                  <div className="crm-td crm-td-check">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="crm-td crm-td-name">
                    <div className="crm-avatar-circle">{row.avatar}</div>
                    <span>{row.name}</span>
                  </div>

                  <div className="crm-td crm-td-company">
                    <div className="crm-company-badge">{row.companyBadge}</div>
                    <span>{row.company}</span>
                  </div>

                  <div className="crm-td crm-td-email">{row.email}</div>

                  <div className="crm-td">
                    <span
                      className="crm-status-badge"
                      style={{
                        background: STATUS_COLORS[row.statusColor]?.bg,
                        color: STATUS_COLORS[row.statusColor]?.color,
                      }}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="crm-td">
                    <span className="crm-tag">{row.title}</span>
                  </div>

                  <div className="crm-td crm-td-interaction">
                    <span className="crm-interaction-pill">{row.interaction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`crm-add-contacts ${phase >= 3 ? "crm-fade-in" : "crm-hidden"}`}
          style={{ animationDelay: "520ms" }}
        >
          <div className="crm-add-contacts-divider" />
          <button className="crm-add-contacts-btn">
            <span className="crm-add-contacts-plus">+</span>
            <span className="crm-add-contacts-text">Add Contacts</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Pipeline view column definitions and card data */
const PIPELINE_COLS = [
  {
    id: "lead",
    label: "Lead",
    count: 213,
    color: "#4b6eff",
    cards: [
      {
        id: "gh",
        initials: "GH",
        bg: "#1a1a2e",
        name: "GitHub - x20 Enterprise",
        tier: "Enterprise",
        tierColor: "#ede9fe",
        tierText: "#7c3aed",
        value: "$13,500.00",
        avatar: "EB",
        avatarBg: "#dbeafe",
        avatarText: "#1d4ed8",
        assignee: "Ethan Blake",
        age: "2d",
      },
      {
        id: "sl",
        initials: "S",
        bg: "#22c55e",
        name: "Slack - Expansion",
        tier: "Plus",
        tierColor: "#dbeafe",
        tierText: "#1d4ed8",
        value: "$9,600.00",
        avatar: "EC",
        avatarBg: "#fce7f3",
        avatarText: "#be185d",
        assignee: "Emily Carter",
        age: "25d",
      },
      {
        id: "st",
        initials: "S",
        bg: "#6366f1",
        name: "Stripe",
        tier: null,
        value: "$30,620.00",
        avatar: "LW",
        avatarBg: "#d1fae5",
        avatarText: "#065f46",
        assignee: "Lucas Weber",
        age: "14d",
      },
    ],
  },
  {
    id: "contacted",
    label: "Contacted",
    count: 346,
    color: "#a855f7",
    cards: [
      {
        id: "ic",
        initials: "I",
        bg: "#3b82f6",
        name: "Intercom - Automations",
        tier: "Medium",
        tierColor: "#dbeafe",
        tierText: "#1d4ed8",
        value: "$12,000.00",
        avatar: "SJ",
        avatarBg: "#fef3c7",
        avatarText: "#b45309",
        assignee: "Sarah Johnson",
        age: "7d",
      },
      {
        id: "sg",
        initials: "SG",
        bg: "#16a34a",
        name: "Segment - x30 Pro",
        tier: "Pro",
        tierColor: "#dcfce7",
        tierText: "#15803d",
        value: "$8,500.00",
        avatar: "DC",
        avatarBg: "#ede9fe",
        avatarText: "#6d28d9",
        assignee: "David Chen",
        age: "12d",
      },
    ],
  },
  {
    id: "qualification",
    label: "Qualification",
    count: 62,
    color: "#ec4899",
    cards: [
      {
        id: "no",
        initials: "N",
        bg: "#111827",
        name: "Notion - Exec",
        tier: "Medium",
        tierColor: "#dbeafe",
        tierText: "#1d4ed8",
        value: "$15,000.00",
        avatar: "LW",
        avatarBg: "#fee2e2",
        avatarText: "#b91c1c",
        assignee: "Lisa Wang",
        age: "5d",
      },
    ],
  },
  {
    id: "evaluation",
    label: "Evaluation",
    count: 44,
    color: "#f97316",
    cards: [
      {
        id: "lo",
        initials: "L",
        bg: "#9333ea",
        name: "Loom",
        tier: "Medium",
        tierColor: "#dbeafe",
        tierText: "#1d4ed8",
        value: "$7,200.00",
        avatar: "AK",
        avatarBg: "#d1fae5",
        avatarText: "#065f46",
        assignee: "Alex Kim",
        age: "18d",
      },
      {
        id: "re",
        initials: "R",
        bg: "#ef4444",
        name: "Retool",
        tier: "Excellent",
        tierColor: "#fce7f3",
        tierText: "#be185d",
        value: "$22,000.00",
        avatar: "MG",
        avatarBg: "#f3f4f6",
        avatarText: "#374151",
        assignee: "Maria Garcia",
        age: "20d",
      },
    ],
  },
];

/**
 * Pipeline kanban card. Props: analysisState (null|tracing|done), statusTag, isDimmed, isAtRisk, suppressAnalysis.
 */
function PipelineCard({
  card,
  colIdx,
  cardIdx,
  visible,
  analysisState,
  statusTag,
  isDimmed,
  isAtRisk,
  suppressAnalysis,
}) {
  return (
    <div
      className={`kb-card ${visible ? "kb-card-in" : "kb-card-hidden"} ${
        analysisState === "done" && !suppressAnalysis ? "kb-card-analysed" : ""
      } ${isDimmed ? "kb-card-dimmed" : ""} ${isAtRisk ? "kb-card-at-risk" : ""}`}
      style={{
        "--kb-slide-delay": `${colIdx * 90 + cardIdx * 55}ms`,
        animationDelay: `${colIdx * 90 + cardIdx * 55}ms`,
      }}
    >
      {analysisState === "tracing" && (
        <svg
          className="kb-trace-svg"
          aria-hidden="true"
        >
          <rect
            className="kb-trace-rect"
            x="1" y="1"
            rx="11" ry="11"
          />
        </svg>
      )}

      {/* Static green border overlay after trace completes */}
      {analysisState === "done" && (
        <span className="kb-analysed-border" aria-hidden="true" />
      )}

      {isAtRisk && (
        <svg
          className="kb-trace-svg kb-trace-svg-risk"
          aria-hidden="true"
        >
          <rect
            className="kb-trace-rect-risk"
            x="1" y="1"
            rx="11" ry="11"
          />
        </svg>
      )}

      <div className="kb-card-header">
        <div className="kb-company-logo" style={{ background: card.bg }}>
          {card.initials}
        </div>
        <span className="kb-card-name">{card.name}</span>
      </div>

      {card.tier && (
        <div className="kb-tier-badge" style={{ background: card.tierColor, color: card.tierText }}>
          <span className="kb-tier-icon">📊</span> {card.tier}
        </div>
      )}

      <div className="kb-card-value">{card.value}</div>

      <div className="kb-card-meta">
        <div className="kb-assignee">
          <div className="kb-avatar" style={{ background: card.avatarBg, color: card.avatarText }}>
            {card.avatar}
          </div>
          <span>{card.assignee}</span>
        </div>
        <div className="kb-age">🕐 {card.age}</div>
      </div>

      {analysisState === "done" && statusTag && !suppressAnalysis && (
        <div className="kb-status-tag kb-status-tag-enter">
          <span className="kb-status-dot" />
          {statusTag}
        </div>
      )}

      {isAtRisk && (
        <div className="kb-status-tag kb-status-tag-at-risk">
          <span className="kb-status-dot kb-status-dot-at-risk" />
          At risk
        </div>
      )}
    </div>
  );
}

function PipelineView({ suppressTopIntro = false }) {
  const [phase, setPhase] = useState(0);

  const [analysisMap, setAnalysisMap] = useState({});  // card id → null|tracing|done
  const [searchPhase, setSearchPhase] = useState(0);   // 0 idle, 1 typing, 2 typed, 3 at-risk, 4 dimmed
  const [searchText, setSearchText] = useState("");

  const setCardState = (id, state) =>
    setAnalysisMap((prev) => ({ ...prev, [id]: state }));

  useEffect(() => {
    setPhase(0);
    setAnalysisMap({});
    setSearchPhase(0);
    setSearchText("");

    const CARDS_LAND = 2700;

    const timers = [
      setTimeout(() => setPhase(1), 180),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 700),
      setTimeout(() => setPhase(4), 900),

      setTimeout(() => setCardState("sl", "tracing"), 900 + CARDS_LAND),
      setTimeout(() => setCardState("sl", "done"),    900 + CARDS_LAND + 1400),

      setTimeout(() => setCardState("no", "tracing"), 900 + CARDS_LAND + 1400 + 600),
      setTimeout(() => setCardState("no", "done"),    900 + CARDS_LAND + 1400 + 600 + 1400),

      setTimeout(() => setSearchPhase(1), 900 + CARDS_LAND + 1400 + 600 + 1400 + 400),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const ANALYSIS_TARGETS = {
    sl: "Next step",
    no: "Evaluated",
  };

  const SEARCH_QUERY = "at risk";

  useEffect(() => {
    if (searchPhase !== 1) return;
    let i = 0;
    setSearchText("");
    const iv = setInterval(() => {
      i += 1;
      setSearchText(SEARCH_QUERY.slice(0, i));
      if (i >= SEARCH_QUERY.length) {
        clearInterval(iv);
        setTimeout(() => setSearchPhase(2), 600);
      }
    }, 70);
    return () => clearInterval(iv);
  }, [searchPhase]);

  useEffect(() => {
    if (searchPhase !== 2) return;
    const t = setTimeout(() => setSearchPhase(3), 900);
    return () => clearTimeout(t);
  }, [searchPhase]);

  useEffect(() => {
    if (searchPhase !== 3) return;
    const t = setTimeout(() => setSearchPhase(4), 900);
    return () => clearTimeout(t);
  }, [searchPhase]);

  return (
    <div className="kb-view">
      <CrmTopSection showImmediately={suppressTopIntro} className="crm-toolbar" delay={0}>
        <div className="crm-toolbar-left">
          <div className="crm-leads-title">
            <span className="crm-leads-emoji">🟣</span>
            <span className="crm-leads-name">Leads</span>
          </div>
          <button className="crm-btn-ghost">
            <span>+</span> Create
          </button>
          <button className="crm-btn-ghost">
            <span className="crm-icon-link">⊘</span> Enroll
          </button>
        </div>
        <div className="crm-toolbar-right">
          <button className="crm-btn-outline">✦ Smart Import</button>
          <button className="crm-btn-outline">↑ Share</button>
        </div>
      </CrmTopSection>

      <CrmTopSection showImmediately={suppressTopIntro} className="crm-subtoolbar" delay={40}>
        <div className="crm-view-selector">
          <span className="crm-view-icon">⊞</span> Pipeline - Leads{" "}
          <span className="crm-chevron">⌃</span>
        </div>
        <div className="crm-view-count">
          <button className="crm-view-count-icon" type="button" aria-label="View settings">
            <Icon d={ICONS.settings} size={15} />
          </button>
          <span className="crm-view-count-text">8 in view</span>
        </div>
      </CrmTopSection>

      <CrmTopSection showImmediately={suppressTopIntro} className="crm-searchbar-row" delay={80}>
        <div className={`crm-search-input-wrap ${searchPhase >= 1 ? "is-focused" : ""}`}>
          <span className="crm-search-icon">🔍</span>
          <span className="crm-search-text">
            {searchPhase >= 1 ? searchText : "Search records..."}
            {searchPhase === 1 && searchText.length < SEARCH_QUERY.length && (
              <span className="demo-tw-cursor">|</span>
            )}
          </span>
          {searchPhase >= 2 && (
            <span className="crm-search-match-count">2 matches</span>
          )}
        </div>
        <div className="crm-filter-actions">
          <button className="crm-icon-btn">⇅</button>
          <button className="crm-icon-btn">⊟</button>
          <button className="crm-icon-btn">↻</button>
          <button className="crm-icon-btn">⋯</button>
          <button className="crm-icon-btn">✦</button>
          <button className="crm-enrich-btn">✦ Enrich (0)</button>
        </div>
        <button className="crm-add-col-btn">+</button>
      </CrmTopSection>

      <div className={`crm-lower kb-lower-enter ${phase >= 2 ? "kb-lower-visible" : ""}`}>
        <div className="kb-board">
          {PIPELINE_COLS.map((col, colIdx) => (
            <div
              key={col.id}
              className={`kb-col ${phase >= 3 ? "kb-col-slide-in" : "kb-col-hidden"}`}
              style={{ "--kb-col-delay": `${colIdx * 80}ms` }}
            >
              <div className="kb-col-header">
                <span className="kb-col-dot" style={{ background: col.color }} />
                <span className="kb-col-label">{col.label}</span>
                <span className="kb-col-count">{col.count}</span>
                <button className="kb-col-add">+</button>
              </div>

              <div className="kb-col-cards">
                {col.cards.map((card, cardIdx) => (
                  <PipelineCard
                    key={card.id}
                    card={card}
                    colIdx={colIdx}
                    cardIdx={cardIdx}
                    visible={phase >= 4}
                    analysisState={analysisMap[card.id] ?? null}
                    statusTag={ANALYSIS_TARGETS[card.id] ?? null}
                    isDimmed={searchPhase >= 3 && card.id !== "st" && card.id !== "re"}
                    isAtRisk={searchPhase >= 4 && (card.id === "st" || card.id === "re")}
                    suppressAnalysis={searchPhase >= 3}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/** Email composer view. Chrome phases: tab bar, From, To, Subject; body typewriter with variable pills. */

function VarPill({ label }) {
  return (
    <span className="em-var-pill">{label}</span>
  );
}

function SlashDropdown({ highlightIndex }) {
  const options = ["First Name", "Last Name", "Company", "Your Name", "Organization"];
  return (
    <span className="em-slash-dropdown">
      {options.map((opt, i) => (
        <span
          key={opt}
          className={`em-slash-option ${i === highlightIndex ? "is-selected" : ""}`}
        >
          {opt}
          {i === highlightIndex && <span className="em-slash-check">✓</span>}
        </span>
      ))}
    </span>
  );
}

const EMAIL_SEGMENTS = [
  { type: "text",  content: "Hey " },
  { type: "slash", highlightIndex: 0, varLabel: "first_name" },
  { type: "var",   label: "first_name" },
  { type: "text",  content: ",\n\nHope you\u2019re having a fantastic week!\n\nMy name is " },
  { type: "slash", highlightIndex: 3, varLabel: "your_name" },
  { type: "var",   label: "your_name" },
  { type: "text",  content: " and I\u2019m a business development associate here at " },
  { type: "slash", highlightIndex: 2, varLabel: "company" },
  { type: "var",   label: "company" },
  { type: "text",  content: ".\n\nTo be honest, the business development associate is just a fancy term to say \u201cI\u2019m helping companies grow!\u201d" },
  { type: "shimmer" },
];

function EmailView({ onSent }) {
  const [chromePhase, setChromePhase] = useState(0);
  const [bodyPhase, setBodyPhase] = useState(-1);
  const [bodyText, setBodyText] = useState("");
  const [dropdownHighlight, setDropdownHighlight] = useState(null);
  const [sendState, setSendState] = useState("idle");
  const [showNotif, setShowNotif] = useState(false);
  const sentFiredRef = useRef(false);

  useEffect(() => {
    if (bodyPhase < 0) return;
    const seg = EMAIL_SEGMENTS[bodyPhase];
    if (!seg) return;

    if (seg.type === "text") {
      let i = 0;
      setBodyText("");
      const iv = setInterval(() => {
        i++;
        setBodyText(seg.content.slice(0, i));
        if (i >= seg.content.length) {
          clearInterval(iv);
          setTimeout(() => setBodyPhase(p => p + 1), 160);
        }
      }, 38);
      return () => clearInterval(iv);
    }

    if (seg.type === "slash") {
      setBodyText("");
      setTimeout(() => {
        setDropdownHighlight(seg.highlightIndex);
        setTimeout(() => {
          setDropdownHighlight(null);
          
          setBodyPhase(p => p + 1); // move to var segment
        }, 1000);
      }, 120);
    }

    if (seg.type === "var") {
      setBodyText("");
      
      setTimeout(() => setBodyPhase(p => p + 1), 340);
    }

    if (seg.type === "shimmer") {
      
      setTimeout(() => setSendState("ready"), 700);
    }
  }, [bodyPhase]);

  useEffect(() => {
    if (chromePhase === 4) {
      setTimeout(() => setBodyPhase(0), 500);
    }
  }, [chromePhase]);

  useEffect(() => {
    if (sendState === "ready") {
      setTimeout(() => setSendState("sending"), 1400);
    }
    if (sendState === "sending") {
      setTimeout(() => {
        setSendState("sent");
        setShowNotif(true);
      }, 1800);
    }
  }, [sendState]);

  useEffect(() => {
    if (!showNotif || sentFiredRef.current) return;
    sentFiredRef.current = true;
    onSent?.();
  }, [showNotif, onSent]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setChromePhase(1), 300),
      setTimeout(() => setChromePhase(2), 700),
      setTimeout(() => setChromePhase(3), 1050),
      setTimeout(() => setChromePhase(4), 1380),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const revealedSegments = [];
  for (let i = 0; i < EMAIL_SEGMENTS.length; i++) {
    const seg = EMAIL_SEGMENTS[i];
    if (i < bodyPhase) {
      if (seg.type === "text")    revealedSegments.push({ ...seg, done: true });
      else if (seg.type === "var")     revealedSegments.push(seg);
      else if (seg.type === "shimmer") revealedSegments.push(seg);
    } else if (i === bodyPhase) {
      if (seg.type === "text")    revealedSegments.push({ ...seg, current: true, text: bodyText });
      else if (seg.type === "slash")   revealedSegments.push({ ...seg, current: true });
      else if (seg.type === "var")     revealedSegments.push({ ...seg, current: true });
      else if (seg.type === "shimmer") revealedSegments.push({ ...seg, current: true });
    } else {
      break;
    }
  }

  const sendLabel = sendState === "sending" ? "Sending…" : "Send 400";
  const sendIcon  = sendState === "sending" ? "em-send-icon spinning" : "em-send-icon";

  return (
    <div className="em-view">

      <div className={`em-tabs-row em-section ${chromePhase >= 1 ? "em-section-in" : ""}`}
           style={{ "--em-delay": "0ms" }}>
        <div className="em-tab is-active">Sent</div>
        <div className="em-tab">Drafts</div>
        <div className="em-tab">Templates</div>
        <div className="em-tab-spacer" />
        <button className="em-btn-ghost">Save draft</button>
        <button className={`em-btn-send ${sendState === "ready" ? "is-ready" : ""} ${sendState === "sending" ? "is-sending" : ""} ${sendState === "sent" ? "is-sent" : ""}`}>
          <svg className={sendIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          {sendLabel}
        </button>
      </div>

      <div className={`em-field-row em-section ${chromePhase >= 2 ? "em-section-in" : ""}`}
           style={{ "--em-delay": "0ms" }}>
        <span className="em-field-label">From:</span>
        <div className="em-field-value">
          <span className="em-avatar-pill" style={{ background: "#f97316" }}>JA</span>
          <strong>James Anderson</strong>
          <span className="em-email-addr">jamesanderson@gmail.com</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>

      <div className={`em-field-row em-section ${chromePhase >= 3 ? "em-section-in" : ""}`}
           style={{ "--em-delay": "0ms" }}>
        <span className="em-field-label">To:</span>
        <div className="em-field-value">
          <span className="em-recip-avatars">
            <span className="em-recip-av" style={{ background: "#f97316" }}>A</span>
            <span className="em-recip-av" style={{ background: "#6366f1" }}>B</span>
            <span className="em-recip-av" style={{ background: "#3b82f6" }}>C</span>
          </span>
          <strong>400 recipients</strong>
          <span className="em-email-addr">(each message will be sent individually)</span>
        </div>
        <div className="em-cc-bcc">Cc &nbsp; Bcc</div>
      </div>

      <div className={`em-field-row em-field-row--subject em-section ${chromePhase >= 4 ? "em-section-in" : ""}`}
           style={{ "--em-delay": "0ms" }}>
        <span className="em-field-label">Subject:</span>
        <div className="em-field-value">
          Can I help <span className="em-subject-var">company</span> accomplish <span className="em-subject-var">tasks</span> ?
        </div>
      </div>

      {chromePhase >= 4 && <div className="em-divider" />}

      <div className="em-body">
        {bodyPhase >= 0 && (
          <div className="em-body-content">
            {revealedSegments.map((seg, i) => {
              if (seg.type === "text") {
                const text = seg.current ? seg.text : seg.content;
                const lines = text.split("\n");
                return (
                  <span key={i}>
                    {lines.map((line, li) => (
                      <span key={li}>
                        {li > 0 && <br />}
                        {line}
                      </span>
                    ))}
                    {seg.current && (
                      <span className="demo-tw-cursor">|</span>
                    )}
                  </span>
                );
              }
              if (seg.type === "slash" && seg.current) {
                return (
                  <span key={i} style={{ position: "relative", display: "inline" }}>
                    <span style={{ opacity: 0.35, color: "var(--ss-text-soft)" }}>/</span>
                    {dropdownHighlight !== null && (
                      <SlashDropdown highlightIndex={dropdownHighlight} />
                    )}
                  </span>
                );
              }
              if (seg.type === "var") {
                return (
                  <span key={i}>
                    <VarPill label={seg.label} />
                    {seg.current && <span className="demo-tw-cursor">|</span>}
                  </span>
                );
              }
              if (seg.type === "shimmer") {
                return (
                  <span key={i} className="em-shimmer-block">
                    <br /><br />
                    <span className="em-shimmer-line" style={{ width: "82%" }} />
                    <br />
                    <span className="em-shimmer-line" style={{ width: "58%" }} />
                    <br />
                    <span className="em-shimmer-line" style={{ width: "70%" }} />
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {showNotif && (
        <div className="em-notif em-notif-enter">
          <span className="em-notif-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <div className="em-notif-text">
            <strong>Email Sent Successfully!</strong>
            <span>400 personalized emails have been sent to your leads.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Demo frame root: tab content router and stage container */
export default function DemoFrame({ demo, activeTab, onTabChange, onEmailSent }) {
  const [visibleKey, setVisibleKey] = useState(demo.id);
  const [sendBtnActive, setSendBtnActive] = useState(false);
  const [skipCrmTopIntro, setSkipCrmTopIntro] = useState(false);

  const previousTabRef = useRef(activeTab);

  useEffect(() => {
    const prevTab = previousTabRef.current;
    const nextTab = activeTab;

    setVisibleKey(demo.id);
    setSendBtnActive(false);
    setSkipCrmTopIntro(shouldSkipCrmTopIntro(prevTab, nextTab));

    previousTabRef.current = nextTab;
  }, [demo.id, activeTab]);

  let content;

  if (demo.id === "table") {
    content = <TableView suppressTopIntro={skipCrmTopIntro} />;
  } else if (demo.id === "pipeline") {
    content = <PipelineView suppressTopIntro={skipCrmTopIntro} />;
  } else if (demo.id === "email") {
    content = <EmailView onSent={onEmailSent} />;
  } else {
    content = <AnalystChat demo={demo} onSendActive={setSendBtnActive} />;
  }

  const stageClassName = isCrmTab(demo.id) ? "demo-stage" : "demo-stage demo-stage-fade";

  return (
    <div className="demo-frame-wrap">
      <div className="demo-frame-glow" aria-hidden="true" />

      <div className="demo-frame">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

        <div className="demo-main">
          <div key={visibleKey} className={stageClassName}>
            {content}
          </div>

          {demo.id === "ai-analyst" && (
            <>
              <div className="demo-inputbar">
                <div className="demo-inputbar-inner">
                  <input
                    type="text"
                    readOnly
                    placeholder="Find the right people for the right deal..."
                  />
                  <button
                    type="button"
                    className={sendBtnActive ? "is-active" : ""}
                    aria-label="Send"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="demo-inputbar-hint">
                Press Enter to send. Shift + Enter for new line.
                <br />
                Use @ to mention teammates, records, or groups.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}