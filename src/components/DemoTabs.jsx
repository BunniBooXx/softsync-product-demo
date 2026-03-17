import React from "react";

export default function DemoTabs({
  tabs,
  activeTab,
  onChange,
  progressKey,
}) {
  return (
    <div className="demo-tabs" role="tablist" aria-label="Product demo tabs">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`demo-tab ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            <span className="demo-tab-label">{tab.label}</span>

            {isActive ? (
              <span
                key={progressKey}
                className="demo-tab-progress"
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}