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
import Swal from "sweetalert2";
import Loader from "../../../components/loader";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Cancel } from "@mui/icons-material";
import authService from "../../../services/AuthServices";
import IClienteDto from "../../../interfaces/Cliente/IClienteDto";
import clienteServices from "../../../services/ClientesServices";
import empresaServices from "../../../services/EmpresaServices";
import IEmpresa from "../../../interfaces/Empresa/IEmpresa";
import { dataURLToFile } from "../../../assets/utils/DataURLToFile";


const initialPersonData: IClienteDto = {
  nombre: "",
  apellido_Paterno: "",
  apellido_Materno: "",
  curp: "",
  fechaNacimiento: "",
  foto: null,
  fK_Company_Id: null,
};
const initialErrors = {
  nombre: "",
  apellido_Paterno: "",
  apellido_Materno: "",
  curp: "",
  fechaNacimiento: "",
  foto: "",
  fkCompanyId: "",
};

const MAX_FILE_SIZE_MB = 2; // Tamaño máximo de archivo en MB

export default function ClienteCEComponent() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("Registrar cliente");
  const [clienteData, setClienteData] = useState<IClienteDto>(initialPersonData);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [companies, setCompanies] = useState<IEmpresa[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<IEmpresa | null>(null);
  // Manejador genérico para cambios en los inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClienteData({
      ...clienteData,
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
  // Manejo del cambio de selección de empresa
  const handleCompanyChange = (event: any, value: IEmpresa | null) => {
    setClienteData((prevData) => ({
      ...prevData,
      fK_Company_Id: value ? value.id : 0,
    }));
    setSelectedCompany(value);

    const error = validateField("fkCompanyId", value ? value.id : 0);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fkCompanyId: error,
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
      "fK_Company_Id",
    ];
    const hasErrors = Object.values(errors).some((error) => error !== "");

    const hasEmptyFields = fields
      .filter((field) => field !== "foto")
      .some((field) => {
        return !clienteData[field as keyof IClienteDto];
      });

    return hasErrors || hasEmptyFields;
  }, [errors, clienteData]);

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
      case "fkCompanyId":
        if (value === 0) {
          return "Debes seleccionar una empresa.";
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
      const data = clienteData;
      if (!id) {
        response = await clienteServices.post(data);
      } else {
        response = await clienteServices.put(id, data);
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

  const handleRemove = () => {
    setFile(null);
    if (clienteData.foto != null) {
      setClienteData({
        ...clienteData,
        foto: null,
      });
    }
  };
  const fetchCompanies = useCallback(async (selectedId: number | null) => {
    try {
      const response = await empresaServices.getEmpresas();
      setCompanies(response);
      if (selectedId) {
        const company = response.find(
          (company: IEmpresa) => company.id === selectedId
        );
        console.log(company);
        setSelectedCompany(company || null);
      }
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        fetchCompanies(null);
        setDisabledBtn(false);
        return;
      }
      try {
        setTitle("Editar cliente");
        setLoading(true);
        const response = await clienteServices.getCliente(id);
        setClienteData(response)
        fetchCompanies(response.fK_Company_Id);
        setFile(
          response.foto ? dataURLToFile(response.foto, "foto.png") : null
        );
      } catch (error) {
        console.error("Error fetching cliente data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCompanies, id]);

  useEffect(() => {
    // Verificar errores y campos vacíos iniciales y actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  }, [clienteData, errors, hasErrorsOrEmptyFields]);

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
        setClienteData({ ...clienteData, foto: reader.result!.toString() });
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
                        maxWidth: "100%",
                        minHeight: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
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
                      <Typography
                        variant="body1"
                        sx={{
                          width: "100%",
                        }}
                      >
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
                      <Autocomplete
                        options={companies}
                        value={selectedCompany}
                        getOptionLabel={(option) => option.nombre}
                        onChange={handleCompanyChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecciona una empresa"
                            error={!!errors.fkCompanyId}
                            helperText={errors.fkCompanyId}
                            sx={{ backgroundColor: "#F8F3F3" }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="nombre"
                        label="Nombre"
                        value={clienteData.nombre}
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
                        value={clienteData.apellido_Paterno}
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
                        value={clienteData.apellido_Materno}
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
                  mt={10}
                >
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="curp"
                        label="CURP"
                        value={clienteData.curp}
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
                          clienteData.fechaNacimiento
                            ? new Date(clienteData.fechaNacimiento)
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
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
