import {
  Grid,
  FormControl,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useCallback, useEffect, useState } from "react";
import IResponse from "../../../interfaces/IResponse.";
import Swal from "sweetalert2";
import Loader from "../../../components/loader";
import { useParams } from "react-router-dom";
import { Cancel } from "@mui/icons-material";
import categoriaServices from "../../../services/CategoriasServices";
import ICategoriaDto from "../../../interfaces/Categoria/ICategoriaDto";

const initialCategoriaData: ICategoriaDto = {
  nombreCategoria: "",
};
const initialErrors = {
  nombreCategoria: "",
};


export default function EmpleadoCEComponent() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("Registrar Categoria");
  const [categoriaData, setCategoriaData] = useState<ICategoriaDto>(initialCategoriaData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [disabledBtn, setDisabledBtn] = useState(true);


  // Manejador genérico para cambios en los inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCategoriaData({
      ...categoriaData,
      [name]: value,
    });
    // Validar el campo en tiempo real y actualizar el estado de errores
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setDisabledBtn(hasErrorsOrEmptyFields());
  };

  // Verificar si hay errores o campos vacíos
  const hasErrorsOrEmptyFields = useCallback((): boolean => {
    const fields = [
      "nombreCategoria",
    ];
    const hasErrors = Object.values(errors).some((error) => error !== "");

    const hasEmptyFields = fields
      .some((field) => {
        return !categoriaData[field as keyof ICategoriaDto];
      });

    return hasErrors || hasEmptyFields;
  }, [errors, categoriaData]);

  const validateField = (
    name: string,
    value: string | number | null | Date | boolean | File | undefined
  ): string => {
    switch (name) {
      case "nombreCategoria":
        if (
          typeof value === "string" &&
          (value.length < 3 || value.length > 30)
        ) {
          return "El nombre debe tener entre 3 y 30 caracteres.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const setDatos = async () => {
    try {
      setLoading(true);
      let response: IResponse;
      const data = categoriaData;
      if (!id) {
        response = await categoriaServices.post(data);
      } else {
        response = await categoriaServices.put(id, data);
      }
      if (response.isSuccess) {
        Swal.fire({
          title: response.message,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
          customClass: {
            container: "custom-swal-container",
          },
        }).then(() => {
          window.history.back();
        });
      } else {
        Swal.fire({
          title: response.message,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
          customClass: {
            container: "custom-swal-container",
          },
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Se ha producido un error",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
        customClass: {
          container: "custom-swal-container",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await categoriaServices.getCategoria(id)
        setCategoriaData({
          nombreCategoria: data.nombreCategoria,
        });
      } catch (error) {
        console.error("Error fetching categoria data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      setTitle("Editar categoría");
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    // Verificar errores y campos vacíos iniciales y actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  }, [categoriaData, errors, hasErrorsOrEmptyFields]);

  

  return (
    <>
      {loading && <Loader />}
      <Grid container mt={2}>
        <Grid container mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="#0C0C0C">
              {title}
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
              color="error"
              onClick={() => window.history.back()}
              endIcon={<Cancel />}
              sx={{
                marginLeft: 0,
                marginRight: 3,
              }}
            >
              Cancelar
            </Button>
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
            <Grid container spacing={3} p={2}>
              <Grid item xs={12} md={6} lg={6}>
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="nombreCategoria"
                        label="Nombre categoria"
                        value={categoriaData.nombreCategoria}
                        onChange={handleInputChange}
                        error={!!errors.nombreCategoria}
                        helperText={errors.nombreCategoria}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}