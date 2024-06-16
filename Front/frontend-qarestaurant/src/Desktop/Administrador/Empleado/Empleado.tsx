import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import IResponse from "../../../interfaces/IResponse.";
import Loader from "../../../components/loader";
import apiClient from "../../../AuthService/authInterceptor";
import GeneralModal from "../../../components/GeneralModal";

interface PersonData {
  id: number;
  nombre: string;
  apellido_Paterno: string;
  apellido_Materno: string;
  curp: string;
  fechaNacimiento: Date | string;
  foto: string | null;
  email: string;
  puesto: string;
}

// Función para filtrar filas
const filterRows = (rows: PersonData[], term: string) => {
  const searchTerm = term.toLowerCase();
  return rows.filter((row) =>
    [
      row.nombre,
      row.apellido_Paterno,
      row.apellido_Materno,
      row.email,
      row.curp,
      row.puesto,
    ].some((field) => field.toLowerCase().includes(searchTerm))
  );
};

// Función para convertir dataURL a File
const dataURLToFile = (dataurl: string, filename: string): File => {
  const [header, data] = dataurl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  if (!mimeMatch) throw new Error("Invalid data URL format");
  const mime = mimeMatch[1];
  const bstr = atob(data);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
};

export default function EmpleadoComponent() {
  const [rows, setRows] = useState<PersonData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<PersonData | null>(null);

  // Manejar el cambio del término de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Columnas para DataGrid
  const columns: GridColDef[] = [
    {
      field: "foto",
      headerName: "Foto",
      flex: 1,
      maxWidth: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={URL.createObjectURL(dataURLToFile(params.value, "photo.png"))}
            alt="Imagen"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        ),
    },
    {
      field: "nombre",
      headerName: "Nombre Completo",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        return `${row.nombre || ""} ${row.apellido_Paterno || ""} ${
          row.apellido_Materno || ""
        }`;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "puesto",
      headerName: "Puesto",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      flex: 0.5,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenModal(params.row.id)}
            sx={{
              marginRight: 2,
              marginLeft: 2,
            }}
          >
            <InfoIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/dashboard/empleados/editar/${params.row.id}`)
            }
            sx={{ marginRight: 3, marginLeft: 2 }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => fetchDelete(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  // Función para obtener datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/APIColaborador/lista");
      const data = response.data.result;
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, []);

  // Función para eliminar un colaborador
  const fetchDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro de eliminar al colaborador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await apiClient.delete(`/APIColaborador/Id?Id=${id}`);
        fetchData();
      }
    } catch (error: any) {
      Swal.fire("Error!", error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchById = (id: number): PersonData | undefined => {
    return rows.find((row: PersonData) => row.id === id);
  };

  const handleOpenModal = async (id: number) => {
    // Busca la fila por ID
    const data = fetchById(id);
    if (data) {
      // Actualiza el estado del modal con la información de la fila
      setModalData(data);
      setOpenModal(true);
    } else {
      console.error("No se encontró la fila con el ID proporcionado");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  // Obtener datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrar filas cuando cambian las filas o el término de búsqueda
  useEffect(() => {
    setFilteredRows(filterRows(rows, searchTerm));
  }, [rows, searchTerm]);
  return (
    <>
      {loading && <Loader />}
      <Grid container mt={2}>
        <Grid container mb={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="#0C0C0C">
              Empleados registrados
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
              onClick={() => navigate("/dashboard/empleados/crear")}
              endIcon={<AddCircleIcon />}
            >
              Agregar
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
              display: "flex",
              zIndex: 1,
              paddingY: "10px",
              justifyContent: "flex-end",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                borderRadius: ".3rem",
                backgroundColor: "#F8F3F3",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              height: 450,
              width: "100%",
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20, 30]}
              sx={{
                ".MuiDataGrid-cell": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                },
              }}
              disableRowSelectionOnClick
              checkboxSelection={false}
            />
          </Box>
          <GeneralModal
            open={openModal}
            onClose={handleCloseModal}
            title="Detalles del Empleado"
            content={
              modalData ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Avatar
                      src={
                        modalData.foto
                          ? URL.createObjectURL(
                              dataURLToFile(modalData.foto, "foto")
                            )
                          : undefined
                      }
                      alt="Foto del Usuario"
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                      variant="square"
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6">
                      <strong>Nombre Completo:</strong>
                    </Typography>
                    <Typography variant="body1">{`${modalData.nombre} ${modalData.apellido_Paterno} ${modalData.apellido_Materno}`}</Typography>

                    <Typography variant="h6">
                      <strong>CURP:</strong>
                    </Typography>
                    <Typography variant="body1">{modalData.curp}</Typography>

                    <Typography variant="h6">
                      <strong>Correo:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {modalData.email}
                    </Typography>
                    <Typography variant="h6">
                      <strong>Puesto:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {modalData.puesto}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography variant="h6">
                      <strong>Fecha de Nacimiento:</strong>
                    </Typography>
                    <Typography variant="body1" marginLeft={1} marginTop={0.5}>
                      {new Date(modalData.fechaNacimiento).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <p>Cargando...</p>
              )
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
