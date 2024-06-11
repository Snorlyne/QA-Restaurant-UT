import { useState } from "react";
import Loader from "../../../components/loader";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Button, Grid, Typography } from "@mui/material";

export default function UsuarioComponent() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loader />}
      <Grid container mt={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" color="#0C0C0C">
            Información de Usuario
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="success"
            // onClick={() => navigate("/dashboard/clientes/crear")}
            endIcon={<AddCircleIcon />}
          >
            Agregar
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          sx={{
            backgroundColor: "white",
            padding: 2,
            borderRadius: 5,
            width: 100,
          }}
        >
          <Box
            sx={{
              height: 450,
              width: "100%",
            }}
          ></Box>
        </Grid>
      </Grid>
    </>
  );
}
