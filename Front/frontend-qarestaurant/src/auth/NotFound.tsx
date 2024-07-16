import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "../assets/img/404.png";
export default function NotFound() {
  return (
    <Container>
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="wrap"
        display={"flex"}
      >
        <Grid
          item
          xs={12}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            mt={10}
            sx={{
              width: { xs: "70%", sm: "40%",  md: "40%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={Image}
              alt="403"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                position: "relative",
                borderRadius: "24px",
                padding: 1,
                backgroundColor: "#EEF2FF",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt={10} display={"flex"} justifyContent={"center"}>
            <Typography variant="h4" color="initial" textAlign={"center"}>
              Pagina no encontrada
            </Typography>
          </Box>
          <Box mt={2} display={"flex"} justifyContent={"center"}>
            <Typography variant="h6" color="initial" textAlign={"center"}>
              Puedes volver a la <a href="/">página principal</a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
