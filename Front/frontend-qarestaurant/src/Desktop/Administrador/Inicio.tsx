import { Box, Container, Typography, Grid } from "@mui/material";
import YearSales from "./Graficos/GraficoYearSales";
import authService from "../../services/AuthServices";

export default function InicioComponent() {
  const isRoot = authService.getRole() === "Root" ? true : false;
  if (isRoot) {
    return (
    <>
    <Container maxWidth="lg" sx={{
      height: "80vh",
    }}>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
        <Typography variant="h4" component="h1">
          No perteneces a una empresa
        </Typography>
      </Box>
    </Container>
    </>
  );
  } else {
    return (
      <Box sx={{ marginTop: 3, width: "100%" }}>
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
}
