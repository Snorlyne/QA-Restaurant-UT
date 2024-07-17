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
import apiClient from "../../../auth/AuthInterceptor";
import IProductoDto from "../../../interfaces/Inventario/IProductoDto";
import inventarioServices from "../../../services/InventarioServices";
import categoriaServices from "../../../services/CategoriasServices";
import ICategoria from "../../../interfaces/Categoria/ICategoria";
import { dataURLToFile } from "../../../assets/utils/DataURLToFile";

interface CategoriaData{
  id:number;
  nombreCategoria:string;
}
const initialProductoData: IProductoDto = {
  nombre: "",
  descripcion: "",
  precio: 0,
  preparado: true,
  imagenInventario: null,
  categoria: 0,
};
const initialErrors = {
  nombre: "",
  descripcion: "",
  precio: "",
  preparado: "",
  imagenInventario: "",
  categoria: "",
};

const MAX_FILE_SIZE_MB = 2; // Tamaño máximo de archivo en MB

export default function EmpleadoCEComponent() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("Registrar Producto");
  const [productData, setProductData] = useState<IProductoDto>(initialProductoData);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [categorias, setCategorias] = useState<CategoriaData[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaData | null>(null);



  // Manejador genérico para cambios en los inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let parsedValue: string | number = value;
      if (name === "precio") {
      parsedValue = parseFloat(value);
    }
    setProductData({
      ...productData,
      [name]: parsedValue,
    });
    
    // Validar el campo en tiempo real y actualizar el estado de errores
    const error = validateField(name, parsedValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setDisabledBtn(hasErrorsOrEmptyFields());
  };
    // Manejo del cambio de selección de la categoría
  const handleCategoriaChange = (event: any, value: CategoriaData | null) => {
    setProductData((prevData) => ({
      ...prevData,
      categoria: value ? value.id : 0,
    }));
    setSelectedCategoria(value);

    const error = validateField("categoria", value ? value.id : 0);
    setErrors((prevErrors) => ({
      ...prevErrors,
      categoria: error,
    }));

    // Actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  };

  // Verificar si hay errores o campos vacíos
  const hasErrorsOrEmptyFields = useCallback((): boolean => {
    const fields = [
      "nombre",
      "descripcion",
      "precio",
      "preparado",
      "imagenInventario",
      "categoria",
    ];
    const hasErrors = Object.values(errors).some((error) => error !== "");

    const hasEmptyFields = fields
      .filter((field) => field !== "imagenInventario")
      .some((field) => {
        return !productData[field as keyof IProductoDto];
      });

    return hasErrors || hasEmptyFields;
  }, [errors, productData]);

  const validateField = (
    name: string,
    value: string | number | null | Date | boolean | File | undefined
  ): string => {
    if (!value && name !== "imagenInventario") {
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
        case "descripcion":
        if (
          typeof value === "string" &&
          (value.length < 3 || value.length > 1000)
        ) {
          return "La descripción debe tener entre 3 y 1000 caracteres.";
        }
        break;
      case "categoria":
        if (value === 0) {
          return "Debes seleccionar una categoria.";
        }
        break;
      case "precio":
        if (typeof value !== "number" || value <= 0) {
          return "Debes agregar un precio válido.";
        }
        break;
      case "preparado":
        if (typeof value !== "boolean") {
          return "Debes seleccionar si esta disponible o no.";
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
      const data = productData;
      if (!id) {
        response = await inventarioServices.post(data);
      } else {
        response = await inventarioServices.put(id, data);
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
    if (productData.imagenInventario != null) {
      setProductData({
        ...productData,
        imagenInventario: null,
      });
    }
  };
  const fetchCategoria = useCallback(async (selectedId: number | null) => {
    try {
      const response = await categoriaServices.getCategorias();
      setCategorias(response);
      if (selectedId) {
        const categoria = response.find(
          (categoria: ICategoria) => categoria.id === selectedId
        );
        setSelectedCategoria(categoria || null);
      }
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setDisabledBtn(false);
        fetchCategoria(null);
        return;
      }
      try {
        setTitle("Editar producto");
        setLoading(true);
        const response = await inventarioServices.getProducto(id);
        setProductData(response);
        fetchCategoria(response.categoria);
        console.log(response.categoria);
        setFile(
          response.imagenInventario ? dataURLToFile(response.imagenInventario, "foto.png") : null
        );
      } catch (error) {
        console.error("Error fetching producto data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCategoria, id]);

  useEffect(() => {
    // Verificar errores y campos vacíos iniciales y actualizar el estado del botón
    setDisabledBtn(hasErrorsOrEmptyFields());
  }, [productData, errors, hasErrorsOrEmptyFields]);

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
        setProductData({ ...productData, imagenInventario: reader.result!.toString() });
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
                      <TextField
                        type="text"
                        name="nombre"
                        label="Nombre"
                        value={productData.nombre}
                        onChange={handleInputChange}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControl fullWidth>
                      <TextField
                        type="number"
                        name="precio"
                        label="Precio"
                        value={productData.precio}
                        onChange={handleInputChange}
                        error={!!errors.precio}
                        helperText={errors.precio}
                        sx={{ backgroundColor: "#F8F3F3" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={categorias}
                        value={selectedCategoria}
                        getOptionLabel={(option) => option.nombreCategoria}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={handleCategoriaChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecciona una categoría"
                            error={!!errors.categoria}
                            helperText={errors.categoria}
                            sx={{ backgroundColor: "#F8F3F3" }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={[{ title: 'Sí', value: true }, { title: 'No', value: false }]}
                        getOptionLabel={(option) => option.title}
                        value={{ title: productData.preparado ? 'Sí' : 'No', value: productData.preparado }}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={(event, newValue) => {
                          setProductData({
                            ...productData,
                            preparado: newValue ? newValue.value : false,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="preparado"
                            label="Preparacion"
                            error={!!errors.preparado}
                            helperText={errors.preparado}
                            sx={{ backgroundColor: "#F8F3F3" }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
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
                      marginTop: { xs: 0, md: 5 },
                    }),
                  }}
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        name="descripcion"
                        label="Descripción"
                        value={productData.descripcion}
                        onChange={handleInputChange}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion}
                        sx={{ backgroundColor: "#F8F3F3" }}
                        multiline
                        rows={5}
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
