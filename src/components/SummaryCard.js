import React from "react";

const SummaryCard = ({ title, value, subtext, type }) => {
  let valueClass = "text-dark";

  if (type === "alert") {
    valueClass = "text-danger";
  } else if (type === "success") {
    valueClass = "text-success";
  }

  return (
    <div className="col-md-4 mb-4">
      <div className="summary-card">
        <div className="d-flex flex-column justify-content-center h-100">
          <div className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
            {title}
          </div>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "600" }}
            className={valueClass}
          >
            {value}
          </div>
          {subtext && (
            <div className="text-muted mt-1" style={{ fontSize: "0.9rem" }}>
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
