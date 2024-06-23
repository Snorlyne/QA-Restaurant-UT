import { Box, Container, Typography, Grid } from "@mui/material";
import YearSales from "./Graficos/GraficoYearSales";

export default function InicioComponent() {
  return (
    <Box sx={{ marginTop: 3, width: "100%"}}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Resumen de ventas
        </Typography>
      </Box>
      <Box marginTop={5}>
        <Typography variant="h5" component="h2" gutterBottom>
          Estadísticas
        </Typography>
      </Box>
    <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Box width={"100%"}>
            <YearSales />
        </Box>
      </Grid>
        </Grid>
    </Box>
  );
}
