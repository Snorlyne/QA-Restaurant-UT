import { useState, useEffect, useCallback } from "react";
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
import ventasServices from "../../../services/VentasServices";
import { IVentaPerYear } from "../../../interfaces/IVentaPerYear";

const fakeSalesData = [
  { mes: "January", valor: 650, anio: 2023 },
  { mes: "February", valor: 590.99, anio: 2023 },
  { mes: "March", valor: 800.12, anio: 2023 },
  { mes: "April", valor: 430.80, anio: 2023 },
  { mes: "May", valor: 560, anio: 2023 },
  { mes: "June", valor: 750, anio: 2023 },
  { mes: "July", valor: 1200, anio: 2023 },
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
  const [totalSales, setTotalSales] = useState("0");
  const [sales, setSales] = useState<IVentaPerYear[]>([]);
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

  const fetchData = useCallback(async () => {
    // setLoading(true);
    try {
      const data = await ventasServices.getPearYear();
      setSales(data);
    } catch (error) {
      console.error("Error:", error);
    }
    // setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // Obtener el total de ventas del año actual
  }, [fetchData])

  useEffect(() => {
    let filteredData: IVentaPerYear[] = [];

    if(selectedYear === 2023){
      filteredData = fakeSalesData.filter((item) =>
          selectedYear ? item.anio === selectedYear : true
        );
    }
    else{
      filteredData = sales.filter((item) => item.anio === selectedYear);
    }
    // Procesar los datos al formato requerido por Chart.js
    const processedData = {
      labels: filteredData.map((item) => item.mes),
      datasets: [
        {
          label: "Ventas Mensuales",
          data: filteredData.map((item) => item.valor),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    setChartData(processedData);
    // Calcular el total de ventas del año seleccionado
    const total = filteredData.reduce((acc, item) => acc + item.valor, 0);
    const formattedTotal = total.toFixed(2);
    setTotalSales(formattedTotal);
  }, [sales, selectedYear]);

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
            {Array.from(new Set(fakeSalesData.map((item) => item.anio))).map(
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
