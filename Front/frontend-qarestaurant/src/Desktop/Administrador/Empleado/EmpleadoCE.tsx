import {
  Grid,
  FormControl,
  TextField,
  Box,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useCallback, useEffect, useState } from "react";
import IResponse from "../../../interfaces/IResponse.";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../../components/loader";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Cancel } from "@mui/icons-material";
import authService from "../../../AuthService/authService";

interface RoleData {
  id: number;
  nombre: string;
}
interface PersonData {
  nombre: string;
  apellido_Paterno: string;
  apellido_Materno: string;
  curp: string;
  fechaNacimiento: Date | string;
  foto: string | null;
  role: number | null; 
}
const initialPersonData: PersonData = {
  nombre: "",
  apellido_Paterno: "",
  apellido_Materno: "",
  curp: "",
  fechaNacimiento: "",
  foto: null,
  role: null,
};
const initialErrors = {
  nombre: "",
  apellido_Paterno: "",
  apellido_Materno: "",
  curp: "",
  fechaNacimiento: "",
  foto: "",
  role: "",
};

const MAX_FILE_SIZE_MB = 2; // Tamaño máximo de archivo en MB

export default function EmpleadoCEComponent() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("Registrar empleado");
  const [personData, setPersonData] = useState<PersonData>(initialPersonData);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const token = authService.getToken();
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const roles: RoleData[] = [
    { id: 3, nombre: "Chef" },
    { id: 4, nombre: "Mesero" },
    { id: 5, nombre: "Cajero" },
  ];
  // Manejador genérico para cambios en los inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPersonData({
      ...personData,
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
  // Manejo del cambio de selección del rol
  const handleRoleChange = (event: any, value: RoleData | null) => {
    setPersonData((prevData) => ({
      ...prevData,
      role: value ? value.id : 0,
    }));
    setSelectedRole(value);

    const error = validateField("role", value ? value.id : 0);
    setErrors((prevErrors) => ({
      ...prevErrors,
      role: error,
    }));

    // Actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  };

  // Verificar si hay errores o campos vacíos
  const hasErrorsOrEmptyFields = useCallback((): boolean => {
    const fields = [
      "nombre",
      "apellido_Paterno",
      "apellido_Materno",
      "curp",
      "fechaNacimiento",
      "foto",
      "role",
    ];
    const hasErrors = Object.values(errors).some((error) => error !== "");

    const hasEmptyFields = fields
      .filter((field) => field !== "foto")
      .some((field) => {
        return !personData[field as keyof PersonData];
      });

    return hasErrors || hasEmptyFields;
  }, [errors, personData]);

  const validateField = (
    name: string,
    value: string | number | null | Date
  ): string => {
    if (!value && name !== "foto") {
      return "Este campo es obligatorio.";
    }
    switch (name) {
      case "nombre":
        if (
          typeof value === "string" &&
          (value.length < 3 || value.length > 30)
        ) {
          return "El nombre debe tener entre 3 y 30 caracteres.";
        }
        break;
      case "apellido_Paterno":
        if (
          typeof value === "string" &&
          (value.length < 3 || value.length > 30)
        ) {
          return "El apellido paterno debe tener entre 3 y 30 caracteres.";
        }
        break;
      case "apellido_Materno":
        if (
          typeof value === "string" &&
          (value.length < 3 || value.length > 30)
        ) {
          return "El apellido materno debe tener entre 3 y 30 caracteres.";
        }
        break;
      case "curp":
        if (typeof value === "string" && value.length !== 18) {
          return "El CURP debe tener 18 caracteres.";
        }
        break;
      case "fechaNacimiento":
        if (value && new Date(value).toString() === "Invalid Date") {
          return "La fecha de nacimiento no es válida.";
        } else {
          const currentDate = new Date();
          const birthDate = new Date(value!);
          let age = currentDate.getFullYear() - birthDate.getFullYear();
          const monthDifference = currentDate.getMonth() - birthDate.getMonth();
          const dayDifference = currentDate.getDate() - birthDate.getDate();

          // Ajustar la edad si no ha llegado el cumpleaños este año
          if (
            monthDifference < 0 ||
            (monthDifference === 0 && dayDifference < 0)
          ) {
            age--;
          }

          // Verificar si la persona tiene menos de 18 años
          if (age < 18) {
            return "Debe ser mayor de 18 años.";
          }
        }
        break;
      case "role":
        if (value === 0) {
          return "Debes seleccionar un rol.";
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
      let response: any;
      const data = personData;
      if (!id) {
        response = await axios.post(
          "https://localhost:7047/APIColaborador",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.put(
          `https://localhost:7047/APIColaborador/Id?Id=${id}`,
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
            container: "custom-swal-container",
          },
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
            container: "custom-swal-container",
          },
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
          container: "custom-swal-container",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (personData.foto != null) {
      setPersonData({
        ...personData,
        foto: null,
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7047/APIColaborador/Id?Id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.result;
        setPersonData({
          nombre: data.nombre,
          apellido_Paterno: data.apellido_Paterno,
          apellido_Materno: data.apellido_Materno,
          curp: data.curp,
          fechaNacimiento: data.fechaNacimiento,
          foto: data.foto,
          role: data.role.id,
        });
        setSelectedRole(data.role);
        setFile(data.foto ? dataURLToFile(data.foto, "foto.png") : null);
      } catch (error) {
        console.error("Error fetching cliente data:", error);
      } finally {
        setLoading(false);
      }
    };
    const dataURLToFile = (dataurl: any, filename: any) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };
    if (id) {
      setDisabledBtn(false);
      fetchData();
      setTitle("Editar empleado");
    }
  }, [id, token]);

  useEffect(() => {
    // Verificar errores y campos vacíos iniciales y actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  }, [personData, errors, hasErrorsOrEmptyFields]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        Swal.fire({
          icon: "info",
          text: "Solo se aceptan imágenes con las extensiones .png",
          customClass: {
            container: "custom-swal-container",
          },
        });
        return;
      }

      if (acceptedFiles.length === 0) {
        Swal.fire({
          icon: "info",
          text: "No se detectó ninguna imagen cargada.",
          customClass: {
            container: "custom-swal-container",
          },
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        Swal.fire({
          icon: "info",
          text: `El tamaño de la imagen es mayor a ${MAX_FILE_SIZE_MB}MB.`,
          customClass: {
            container: "custom-swal-container",
          },
        });
        return;
      }

      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPersonData({ ...personData, foto: reader.result!.toString() });
      };
      reader.readAsDataURL(file);
    },
  });
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
              height: "100%",
              width: "100%",
            }}
          >
            <Grid container spacing={3} p={2}>
              <Grid item xs={12} md={6} lg={6}>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={12} lg={12}>
                    <div
                      {...getRootProps()}
                      style={{
                        border: "2px dashed #ccc",
                        padding: "15px 0",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {file && File !== null && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Imagen"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      <input {...getInputProps()} />
                      <Typography variant="body1">
                        Arrastra y suelta aquí una imagen o haz clic para
                        seleccionarla.
                      </Typography>
                    </div>
                    <Button
                      onClick={handleRemove}
                      variant="text"
                      color="error"
                      sx={{
                        ...(file == null && {
                          display: "none",
                          transition: "ease-in",
                        }),
                      }}
                    >
                      Eliminar archivo
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
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
                        name="nombre"
                        label="Nombre"
                        value={personData.nombre}
                        onChange={handleInputChange}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="apellido_Paterno"
                        label="Apellido Paterno"
                        value={personData.apellido_Paterno}
                        onChange={handleInputChange}
                        error={!!errors.apellido_Paterno}
                        helperText={errors.apellido_Paterno}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="apellido_Materno"
                        label="Apellido Materno"
                        value={personData.apellido_Materno}
                        onChange={handleInputChange}
                        error={!!errors.apellido_Materno}
                        helperText={errors.apellido_Materno}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  ...(file == null && {
                    paddingTop: { xs: "0 !important" },
                  }),
                }}
              >
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    ...(file == null && {
                      marginTop: { xs: 0, md: 20 },
                    }),
                  }}
                >
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="curp"
                        label="CURP"
                        value={personData.curp}
                        onChange={handleInputChange}
                        error={!!errors.curp}
                        helperText={errors.curp}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        name="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        value={
                          personData.fechaNacimiento
                            ? new Date(personData.fechaNacimiento)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        error={!!errors.fechaNacimiento}
                        helperText={errors.fechaNacimiento}
                        sx={{ backgroundColor: "#F8F3F3" }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={roles}
                        value={selectedRole}
                        getOptionLabel={(option) => option.nombre}
                        onChange={handleRoleChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecciona un rol"
                            error={!!errors.role}
                            helperText={errors.role}
                            sx={{ backgroundColor: "#F8F3F3" }}
                          />
                        )}
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
