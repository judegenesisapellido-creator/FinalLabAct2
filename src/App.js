import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./page/LandingPage";
import "./style/App.css";

// --- API FETCHING LOGIC (Moved here from Data.js) ---
const API_URL = "http://localhost:8082/api/products"; // Port 8082 based on your screenshot

const fetchProductsFromApi = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const laravelData = await response.json();

    // Map Laravel fields to React App fields
    return laravelData.map((item) => ({
      id: item.id,
      productName: item.name,
      currentInventory: item.current_inventory || item.stock, // Fallback if naming differs
      avgSalesPerWeek: item.avg_sales_per_week || item.avg_sales,
      daysToReplenish: item.days_to_replenish || item.lead_time,
      prediction: "Pending",
    }));
  } catch (error) {
    console.error("Failed to fetch API data:", error);
    return [];
  }
};

export default function App() {
  const [data, setData] = useState([]);
  const [isTfReady, setIsTfReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    reorder: 0,
    status: "Waiting for Analysis",
  });

  // 1. Load Bootstrap & TensorFlow.js
  useEffect(() => {
    const loadScripts = async () => {
      // Bootstrap
      const link = document.createElement("link");
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // TensorFlow.js
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest";
      script.async = true;
      script.onload = () => {
        console.log("TensorFlow loaded");
        setIsTfReady(true);
      };
      document.body.appendChild(script);
    };

    loadScripts();

    // --- FETCH DATA FROM LARAVEL API ---
    const loadData = async () => {
      setStats((prev) => ({ ...prev, status: "Fetching from API..." }));

      const apiData = await fetchProductsFromApi();

      if (apiData.length > 0) {
        setData(apiData);
        setStats((prev) => ({
          ...prev,
          total: apiData.length,
          status: "Data Loaded",
        }));
      } else {
        setStats((prev) => ({ ...prev, status: "API Error / No Data" }));
      }
    };

    loadData();
  }, []);

  // --- TENSORFLOW LOGIC (Based strictly on the PDF Guide) ---
  const runForecastAnalysis = async () => {
    if (!isTfReady || !window.tf) {
      alert("TensorFlow Engine loading... please wait.");
      return;
    }

    setIsProcessing(true);
    setStats((prev) => ({ ...prev, status: "Training Model..." }));

    try {
      const tf = window.tf;

      // PREPARE TRAINING DATA
      const trainInputs = [];
      const trainLabels = [];

      for (let i = 0; i < 200; i++) {
        const stock = Math.floor(Math.random() * 500) + 10;
        const sales = Math.floor(Math.random() * 80) + 5;
        const lead = Math.floor(Math.random() * 20) + 3;

        // Logic: 1 = Reorder, 0 = Don't Reorder
        const daysSupply = stock / (sales / 7);
        const shouldReorder = daysSupply < lead ? 1 : 0;

        trainInputs.push([stock, sales, lead]);
        trainLabels.push([shouldReorder]);
      }

      const trainingData = tf.tensor2d(trainInputs);
      const outputData = tf.tensor2d(trainLabels);

      // 1. Create model
      const model = tf.sequential();
      model.add(
        tf.layers.dense({ inputShape: [3], units: 8, activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

      // 2. Compile model
      model.compile({
        optimizer: "adam",
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });

      // 3. Train model
      await model.fit(trainingData, outputData, {
        epochs: 200,
        shuffle: true,
      });

      // 4. Predict
      const inputValues = data.map((item) => [
        item.currentInventory,
        item.avgSalesPerWeek,
        item.daysToReplenish,
      ]);
      const newProduct = tf.tensor2d(inputValues);

      const result = model.predict(newProduct);
      const predictions = await result.data();

      // Update UI with results
      let reorderCount = 0;
      const updatedData = data.map((item, index) => {
        const value = predictions[index];
        const shouldReorder = value > 0.5;

        if (shouldReorder) reorderCount++;

        return {
          ...item,
          prediction: shouldReorder
            ? "Suggestion: Reorder"
            : "Suggestion: Hold",
        };
      });
      
      setData(updatedData);
      setStats({
        total: updatedData.length,
        reorder: reorderCount,
        status: "Analysis Complete",
      });

      // Cleanup
      trainingData.dispose();
      outputData.dispose();
      newProduct.dispose();
      result.dispose();
    } catch (err) {
      console.error("TF Error:", err);
      setStats((prev) => ({ ...prev, status: "Error in Analysis" }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar onRunForecast={runForecastAnalysis} isProcessing={isProcessing} />
      <LandingPage
        data={data}
        stats={stats}
        isProcessing={isProcessing}
        isTfReady={isTfReady}
      />
    </div>
  );
}
