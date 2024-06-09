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
import LoadingButton from "@mui/lab/LoadingButton";
import { useDropzone } from "react-dropzone";
import { Cancel } from "@mui/icons-material";

interface PersonData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: Date;
  foto: string | null;
  fkCompanyId: number;
}

const MAX_FILE_SIZE_MB = 2; // Tamaño máximo de archivo en MB
const MAX_WIDTH = 800; // Ancho máximo de la imagen
const MAX_HEIGHT = 600; // Altura máxima de la imagen

const token = localStorage.getItem("token");
export default function ClienteCEComponent() {
  const { id } = useParams();
  const [nombre, setNombre] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const [foto, setFoto] = useState<any>(null);
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
      let data: PersonData = {
        nombre: nombre,
        apellidoPaterno: "",
        apellidoMaterno: "",
        curp: "",
        fechaNacimiento: new Date(),
        foto: file,
        fkCompanyId: 0,
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
          customClass: {
            container: 'custom-swal-container',
          }
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
          customClass: {
            container: 'custom-swal-container',
          }
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
        customClass: {
          container: 'custom-swal-container',
        }
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        Swal.fire({
          icon: "info",
          text: "Solo se aceptan imágenes con las extensiones .png, .jpg, .jpeg y .webp.",
          customClass: {
            container: 'custom-swal-container',
          }
        });
        return;
      }

      if (acceptedFiles.length === 0) {
        Swal.fire({
          icon: "info",
          text: "No se detectó ninguna imagen cargada.",
          customClass: {
            container: 'custom-swal-container',
          }
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        Swal.fire({
          icon: "info",
          text: `El tamaño de la imagen es mayor a ${MAX_FILE_SIZE_MB}MB.`,
          customClass: {
            container: 'custom-swal-container',
          }
        });
        return;
      }

      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
          setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    },
  });

  const handleRemove = () => {
    setFile(null);
    if (foto != null) {
      setFoto(null);
    }
  };
  return (
    <>
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
              color="error"
              onClick={() => window.history.back()}
              endIcon={<Cancel />}
              sx={{
                marginLeft: 0,
                marginRight: 3
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
            <Grid container spacing={2} p={5}>
              <Grid item xs={12} md={6} lg={6}>
                <Grid container justifyContent="center" alignItems="center">
                  {file && (
                    <Grid item xs={12} md={12} lg={12}>
                      <Typography variant="body1">
                        Imagen seleccionada: {file.name}
                      </Typography>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Imagen seleccionada"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          marginTop: "10px",
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={12} lg={12}>
                    <div
                      {...getRootProps()}
                      style={{
                        border: "2px dashed #ccc",
                        padding: "20px 0",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <input {...getInputProps()} />
                      <Typography variant="body1">
                        Arrastra y suelta aquí una imagen o haz clic para
                        seleccionarla.
                      </Typography>
                    </div>
                    <Button onClick={handleRemove}>Eliminar archivo</Button>
                  </Grid>
                </Grid>
              </Grid>
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
