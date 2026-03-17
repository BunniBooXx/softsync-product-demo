import React from "react";

export default function DemoHeader() {
  return (
    <div className="demo-header">
      <div className="demo-eyebrow-pill-wrap">
        <span className="demo-eyebrow-pill-border" aria-hidden="true" />
        <span className="demo-eyebrow-pill-text">Built for go-to-market teams</span>
      </div>
      <h2 id="product-demo-title" className="demo-header-title">
        Your CRM,<br />finally intelligent.
      </h2>
      <p className="demo-header-subtitle">
        SoftSync connects your data, surfaces what matters, and helps your team act — without leaving the workflow.
      </p>
    </div>
  );
}