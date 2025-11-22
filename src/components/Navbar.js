import React from "react";

const Navbar = ({ onRunForecast, isTraining }) => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-custom">
      <div className="container">
        <div className="d-flex flex-column">
          <h1 className="nav-title">Peripherals Inventory Forecast</h1>
          <span className="nav-subtitle">
            Predictive Stock Analytics Dashboard
          </span>
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="d-none d-md-inline text-white-50 small">
            {isTraining ? "Analyzing..." : "Ready"}
          </span>
          <button
            className="btn d-flex align-items-center gap-2 px-4 py-2 action-btn"
            onClick={onRunForecast}
            disabled={isTraining}
          >
            {isTraining ? "Analyzing..." : "Run Forecast Analysis"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
