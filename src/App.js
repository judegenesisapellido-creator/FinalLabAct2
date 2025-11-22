import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./page/LandingPage";
import "./style/App.css";

// --- MOCK API GENERATOR ---
const generateMockData = () => {
  const products = [
    "Logitech MX Master 3S",
    "Razer DeathAdder V3",
    "Keychron Q1 Pro",
    "Corsair K70 RGB",
    "SteelSeries Apex Pro",
    "HyperX Cloud II",
    "Logitech G Pro X Superlight",
    "Razer BlackWidow V4",
    "Glorious Model O",
    "Anne Pro 2",
    "Drop ALT Mechanical Keyboard",
    "Sennheiser PC38X",
    "Razer Viper Ultimate",
    "Ducky One 3 Mini",
    "SteelSeries Arctis Nova Pro",
    "Logitech G502 HERO",
    "Wooting 60HE",
    "Finalmouse Starlight-12",
    "Cherry MX Board 3.0",
    "Razer Huntsman Mini",
  ];

  return Array.from({ length: 100 }, (_, index) => {
    const isLowStock = Math.random() > 0.7;
    const sales = Math.floor(Math.random() * 40) + 5;
    const leadTime = Math.floor(Math.random() * 10) + 3;

    const threshold = Math.ceil((sales / 7) * leadTime);
    const inventory = isLowStock
      ? Math.floor(Math.random() * threshold)
      : Math.floor(Math.random() * 50) + threshold;

    return {
      id: index + 1,
      name: `${products[index % products.length]} - Batch ${
        Math.floor(index / products.length) + 1
      }`,
      inventory,
      sales,
      leadTime,
      safety: Math.floor(sales * 0.5),
      prediction: "Pending",
      supply: (inventory / (sales / 7)).toFixed(1),
    };
  });
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
      const link = document.createElement("link");
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

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

    setTimeout(() => {
      const fetchedData = generateMockData();
      setData(fetchedData);
      setStats((prev) => ({ ...prev, total: fetchedData.length }));
    }, 800);
  }, []);

  // --- TENSORFLOW LOGIC  ---
  const runForecastAnalysis = async () => {
    if (!isTfReady || !window.tf) {
      alert("TensorFlow Engine loading... please wait.");
      return;
    }

    setIsProcessing(true);
    setStats((prev) => ({ ...prev, status: "Analyzing..." }));

    try {
      const tf = window.tf;

      // PREPARE TRAINING DATA
      const trainInputs = [];
      const trainLabels = [];

      for (let i = 0; i < 200; i++) {
        const stock = Math.floor(Math.random() * 50);
        const avgSales = Math.floor(Math.random() * 60) + 5;
        const leadTime = Math.floor(Math.random() * 10) + 1;

        // Simple logic for training labels: 1 = Reorder, 0 = Don't Reorder
        const needed = (avgSales / 7) * leadTime;

        trainInputs.push([stock, avgSales, leadTime]);
        trainLabels.push([stock < needed ? 1 : 0]);
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

      // 4. Predict (Applied to dashboard items)
      // Convert dashboard data to tensors
      const inputValues = data.map((item) => [
        item.inventory,
        item.sales,
        item.leadTime,
      ]);
      const newProduct = tf.tensor2d(inputValues);

      const result = model.predict(newProduct);
      const predictions = await result.data();

      // Update UI
      let reorderCount = 0;
      const updatedData = data.map((item, index) => {
        const value = predictions[index];
        const shouldReorder = value > 0.5; // "Reorder" : "No Reorder"

        if (shouldReorder) reorderCount++;

        return {
          ...item,
          prediction: shouldReorder ? "Reorder" : "Hold",
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
