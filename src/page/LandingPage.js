import React from "react";
import SummaryCard from "../components/SummaryCard";

const LandingPage = ({ data, stats, isTraining, isTfReady }) => {
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <SummaryCard title="Total Products Fetched" value={stats.total} />
        <SummaryCard
          title="Reorder Recommendations"
          value={stats.reorder}
          subtext={stats.reorder > 0 ? "Action Required" : "Stock Healthy"}
          type={stats.reorder > 0 ? "alert" : "success"}
        />
        <SummaryCard
          title="System Status"
          value={stats.status}
          subtext={isTfReady ? "Online Forecast Analysis" : "Loading Core..."}
          type={stats.status === "Analysis Complete" ? "success" : "default"}
        />
      </div>

      {/* Data Table */}
      <div className="card table-card">
        <div className="card-header bg-white py-3 px-4 border-bottom-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-muted">Inventory Data Feed</h5>
          <span className="badge bg-light text-dark border">
            {data.length} Records Loaded
          </span>
        </div>
        <div className="table-responsive" style={{ maxHeight: "600px" }}>
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-custom-header sticky-header">
              <tr>
                <th className="py-3 ps-4">Product Name</th>
                <th className="py-3">Inventory</th>
                <th className="py-3">Avg Sales/WK</th>
                <th className="py-3">Lead Time</th>
                <th className="py-3">Days of Supply</th>
                <th className="py-3 text-center">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Fetching Inventory Data...
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell table-cell-main ps-4">
                      {item.name}
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          item.inventory < 10
                            ? "text-danger fw-bold"
                            : "text-dark"
                        }
                      >
                        {item.inventory} units
                      </span>
                    </td>
                    <td className="table-cell">{item.sales} / wk</td>
                    <td className="table-cell">{item.leadTime} days</td>
                    <td className="table-cell">{item.supply} days</td>
                    <td className="table-cell text-center">
                      {item.prediction === "Reorder" && (
                        <span className="status-badge badge-reorder">
                          Reorder
                        </span>
                      )}
                      {item.prediction === "Hold" && (
                        <span className="status-badge badge-hold">Hold</span>
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
    </div>
  );
};

export default LandingPage;
