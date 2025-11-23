import React, { useState } from "react";
import SummaryCard from "../components/SummaryCard";

const LandingPage = ({ data, stats, isProcessing, isTfReady }) => {
  // State for the filter: 'all' or 'reorder'
  const [filterMode, setFilterMode] = useState("all");

  // Logic to filter data based on the radio button selection
  // UPDATED: Checks for 'Suggestion: Reorder'
  const filteredData =
    filterMode === "reorder"
      ? data.filter((item) => item.prediction === "Suggestion: Reorder")
      : data;

  return (
    <div className="container py-5">
      {/* Summary Cards */}
      <div className="row mb-4">
        <SummaryCard title="Total Products" value={stats.total} />
        <SummaryCard
          title="Reorder Recommendations"
          value={stats.reorder}
          subtext={stats.reorder > 0 ? "Action Required" : "Stock Healthy"}
          type={stats.reorder > 0 ? "alert" : "success"}
        />
        <SummaryCard
          title="System Status"
          value={stats.status}
          subtext={isTfReady ? "TensorFlow Ready" : "Loading Core..."}
          type={stats.status === "Analysis Complete" ? "success" : "default"}
        />
      </div>

      {/* Data Table */}
      <div className="card table-card">
        <div className="card-header bg-white py-3 px-4 border-bottom-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <h5 className="mb-0 text-muted">Inventory Data Feed</h5>

          {/* --- RADIO BOX FILTER SECTION --- */}
          <div className="d-flex align-items-center gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="dataFilter"
                id="filterAll"
                checked={filterMode === "all"}
                onChange={() => setFilterMode("all")}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label text-muted small"
                htmlFor="filterAll"
                style={{ cursor: "pointer" }}
              >
                Show All
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="dataFilter"
                id="filterReorder"
                checked={filterMode === "reorder"}
                onChange={() => setFilterMode("reorder")}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label text-danger small fw-bold"
                htmlFor="filterReorder"
                style={{ cursor: "pointer" }}
              >
                Show Reorder Only
              </label>
            </div>
            <span className="badge bg-light text-dark border ms-2">
              {filteredData.length} Shown
            </span>
          </div>
          {/* ------------------------------- */}
        </div>
        <div className="table-responsive" style={{ maxHeight: "600px" }}>
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-custom-header sticky-header">
              <tr>
                <th className="py-3 ps-4">Product Name</th>
                <th className="py-3">Current Inventory</th>
                <th className="py-3">Avg Sales/Week</th>
                <th className="py-3">Replenish Days</th>
                <th className="py-3 text-center">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    {data.length === 0
                      ? "Fetching Inventory Data..."
                      : "No Reorder Items Found"}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell table-cell-main ps-4">
                      {item.productName}
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          item.currentInventory < 20
                            ? "text-danger fw-bold"
                            : "text-dark"
                        }
                      >
                        {item.currentInventory} units
                      </span>
                    </td>
                    <td className="table-cell">{item.avgSalesPerWeek} / wk</td>
                    <td className="table-cell">{item.daysToReplenish} days</td>
                    <td className="table-cell text-center">
                      {/* UPDATED: Matches 'Suggestion: Reorder' */}
                      {item.prediction === "Suggestion: Reorder" && (
                        <span className="status-badge badge-reorder">
                          Suggestion: Reorder
                        </span>
                      )}
                      {/* UPDATED: Matches 'Suggestion: Hold' */}
                      {item.prediction === "Suggestion: Hold" && (
                        <span className="status-badge badge-hold">
                          Suggestion: Hold
                        </span>
                      )}
                      {item.prediction === "Pending" && (
                        <span className="status-badge badge-pending">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 text-center text-muted small">
        <p>Powered by TensorFlow.js • Local Browser Training & Inference</p>
      </div>
    </div>
  );
};
export default LandingPage;
