export const generateMockProducts = (count = 100) => {
  const products = [];

  const brands = [
    "Attack Shark",
    "Logitech",
    "Razer",
    "Keychron",
    "SteelSeries",
    "HyperX",
    "Glorious",
    "Corsair",
    "Finalmouse",
    "Wooting",
    "Ducky",
  ];

  const models = [
    "X6",
    "X3",
    "Superlight",
    "Pro Wireless",
    "Viper V3",
    "DeathAdder",
    "Huntsman Mini",
    "Apex Pro",
    "Cloud III",
    "Model O",
    "One 3 Mini",
    "60HE",
    "K70 RGB",
    "BlackWidow",
    "G502 Hero",
  ];

  const types = [
    "Wireless Mouse",
    "Mechanical Keyboard",
    "Gaming Headset",
    "Mousepad",
    "Gaming Mouse",
    "Tactile Keyboard",
    "Linear Keyboard",
  ];

  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    const name = `${brand} ${model} ${type}`;

    const currentInventory = Math.floor(Math.random() * 200) + 5;
    const avgSalesPerWeek = Math.floor(Math.random() * 50) + 2;
    const daysToReplenish = Math.floor(Math.random() * 14) + 2;

    products.push({
      id: i,
      productName: name,
      currentInventory,
      avgSalesPerWeek,
      daysToReplenish,
      prediction: "Pending",
    });
  }

  return products;
};
