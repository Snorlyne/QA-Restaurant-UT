import {
  Grid,
  FormControl,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ChangeEvent, useEffect, useState } from "react";
import IResponse from "../../../interfaces/IResponse.";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../../components/loader";
import { useParams } from "react-router-dom";

interface CompanyData {
  nombre: string;
}
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJyb290QHJvb3QuY29tIiwicm9sZSI6IlJvb3QiLCJuYmYiOjE3MTc2OTc2OTMsImV4cCI6MTcxNzc4NDA5MywiaWF0IjoxNzE3Njk3NjkzfQ.5iX7_S2cI0882NIwj7nVw29FqMxKWjH6DfGzoSOORJs";
export default function EmpresaCreateEditComponent() {
  const { id } = useParams();
  const [nombre, setNombre] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disabledBtn, setdisabledBtn] = useState(true);

  const handleInputNombre = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setNombre(inputValue);
    if (inputValue.length < 3 || inputValue.length > 30) {
      setError("El nombre debe tener entre 3 y 30 caracteres");
      setdisabledBtn(true);
    } else {
      setError("");
      setdisabledBtn(false);
    }
  };
  const setDatos = async () => {
    setLoading(true);
    let response: any;

    try {
      let data: CompanyData = {
        nombre: nombre,
      };
      if (!id) {
        response = await axios.post("https://localhost:7047/APICompany", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.put(
          `https://localhost:7047/APICompany/Id?Id=${id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const dataResponse: IResponse = response.data;

      if (dataResponse.isSuccess) {
        Swal.fire({
          title: dataResponse.message,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        }).then(() => {
          window.history.back();
        });
      } else {
        Swal.fire({
          title: dataResponse.message,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: error.message,
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7047/APICompany/Id?Id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setNombre(data.result.nombre);
      } catch (error) {
        console.error("Error fetching empresa data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      setdisabledBtn(false);
      fetchData();
    }
  }, [id]);
  return (
    <>
      {loading && <Loader />}
      <Grid container mt={2}>
        <Grid container mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="#0C0C0C">
              Registrar Empresa
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
              onClick={setDatos}
              endIcon={<CheckIcon />}
              disabled={loading || disabledBtn}
            >
              Guardar
            </Button>
          </Grid>
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
              height: 530,
              width: "100%",
            }}
          >
            <Grid container spacing={2} p={5}>
              <Grid item xs={12} md={6} lg={6}>
                <FormControl fullWidth>
                  <TextField
                    type="text"
                    name="nombre"
                    label="Nombre"
                    error={!!error}
                    helperText={error}
                    sx={{
                      backgroundColor: "#F8F3F3",
                    }}
                    value={nombre}
                    onChange={handleInputNombre}
                    inputProps={{ minLength: 3, maxLength: 30 }}
                    autoComplete="off"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}