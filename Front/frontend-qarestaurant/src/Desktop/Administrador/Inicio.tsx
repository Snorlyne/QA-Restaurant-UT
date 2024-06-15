import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface SalesData {
  totalSales: number;
  salesByEmployee: {
    employee: string;
    sales: number;
  }[];
}
// Datos falsos de ventas
const fakeSalesData = {
  totalSales: 50000,  // Total de ventas
  salesByEmployee: [
    { employee: "Juan Pérez", sales: 8000 },
    { employee: "María García", sales: 12000 },
    { employee: "Carlos López", sales: 15000 },
    { employee: "Ana Rodríguez", sales: 5000 },
    { employee: "Luis Hernández", sales: 10000 },
  ],
};

export default function InicioComponent() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      // try {
      //   const response = await axios.get("https://api.example.com/sales"); // Cambia la URL a tu API
      //   setSalesData(response.data);
      // } catch (error) {
      //   console.error("Error fetching sales data:", error);
      // } finally {
      //   setLoading(false);
      // }
      setSalesData(fakeSalesData);
      setLoading(false);
      //
    };

    fetchSalesData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const chartData = {
    labels: salesData?.salesByEmployee.map((data) => data.employee) || [],
    datasets: [
      {
        label: "Ventas por Empleado",
        data: salesData?.salesByEmployee.map((data) => data.sales) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: Partial<ChartOptions<"bar">> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Total de Ventas: ${salesData?.totalSales}`,
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}
