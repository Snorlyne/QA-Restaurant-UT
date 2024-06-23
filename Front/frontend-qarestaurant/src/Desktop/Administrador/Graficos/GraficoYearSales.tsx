import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

const fakeSalesData = [
  { month: "January", value: 650, year: 2023 },
  { month: "February", value: 590, year: 2023 },
  { month: "March", value: 800, year: 2023 },
  { month: "April", value: 810, year: 2023 },
  { month: "May", value: 560, year: 2023 },
  { month: "June", value: 550, year: 2023 },
  { month: "July", value: 400, year: 2023 },
];

Chart.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  TimeSeriesScale,
  LineElement
);

export default function YearSales() {
  const [totalSales, setTotalSales] = useState(0);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Ventas Mensuales",
        data: [],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });
  // Obtener el año actual
  const currentYear = new Date().getFullYear();

  // Estado inicial con el año actual seleccionado por defecto
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);

  useEffect(() => {
    // Filtrar datos por el año seleccionado
    const filteredData = fakeSalesData.filter((item) =>
      selectedYear ? item.year === selectedYear : true
    );

    // Procesar los datos al formato requerido por Chart.js
    const processedData = {
      labels: filteredData.map((item) => item.month),
      datasets: [
        {
          label: "Ventas Mensuales",
          data: filteredData.map((item) => item.value),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    setChartData(processedData);
    // Calcular el total de ventas del año seleccionado
    const total = filteredData.reduce((acc, item) => acc + item.value, 0);
    setTotalSales(total);
  }, [selectedYear]);

  const options: Partial<ChartOptions<"line">> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Ventas: $${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Meses",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Ventas",
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <Select
            labelId="year-select-label"
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
            fullWidth
          >
            <MenuItem key={currentYear} value={currentYear}>
              {currentYear}
            </MenuItem>
            {Array.from(new Set(fakeSalesData.map((item) => item.year))).map(
              (year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              height: "auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%", // Ajusta el gráfico al contenedor
                backgroundColor: "white",
                borderRadius: ".5rem",
              }}
            >
              <Line
                data={chartData}
                options={options}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              width={"100%"}
              sx={{
                backgroundColor: "white",
                padding: 2,
                borderRadius: 5,
              }}
            >
              <Typography variant="h5" color="initial" textAlign={"center"}>
                Ventas totales
              </Typography>
              <Typography variant="h6" color="initial" textAlign={"center"}>
                {totalSales}MXN
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
