import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import IResponse from "../../../interfaces/IResponse.";
import Loader from "../../../components/loader";
import InfoIcon from "@mui/icons-material/Info";
import GeneralModal from "../../../components/GeneralModal";
import ICliente from "../../../interfaces/Cliente/ICliente";
import clienteServices from "../../../services/ClientesServices";
import { dataURLToFile } from "../../../assets/utils/DataURLToFile";

const filterRows = (rows: ICliente[], term: string) => {
  return rows.filter((row) => {
    const searchTerm = term.toLowerCase();
    return (
      row.nombre.toLowerCase().includes(searchTerm) ||
      row.apellido_Paterno.toLowerCase().includes(searchTerm) ||
      row.apellido_Materno.toLowerCase().includes(searchTerm) ||
      row.user.email.toLowerCase().includes(searchTerm) ||
      row.company.nombre.toLowerCase().includes(searchTerm)
    );
  });
};
export default function ClientesComponent() {
  const [rows, setRows] = useState<ICliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<ICliente[]>(rows);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<ICliente | null>(null);

  const navigate = useNavigate();

  // Manejar el cambio del término de búsqueda
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const columns: GridColDef[] = [
    {
      field: "foto",
      headerName: "Foto",
      flex: 1,
      maxWidth: 100,
      renderCell: (params) =>
        params.value ? ( // Verifica si el valor de la imagen no es nulo
          <img
            src={URL.createObjectURL(dataURLToFile(params.value, "photo.png"))} // Crea un objeto File para la imagen y obtén su URL
            alt="Imagen"
            style={{ width: "100%", height: "100%", objectFit: "contain" }} // Estilo para la imagen
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
            No image
          </div>
        ),
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        return `${row.nombre || ""} ${row.apellido_Paterno || ""} ${
          row.apellido_Materno || ""
        }`;
      },
    },
    {
      field: "user",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      valueFormatter: (user: any) => user.email,
    },
    {
      field: "company",
      headerName: "Restaurante",
      flex: 1,
      minWidth: 150,
      valueFormatter: (company: any) => company.nombre,
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
              navigate(`/dashboard/clientes/editar/${params.row.id}`)
            }
            sx={{
              marginRight: 2,
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clienteServices.getClientes();
      setRows(response);
      setFilteredRows(response);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await Swal.fire({
        title: "¿Está seguro de eliminar al cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        customClass: {
          container: "custom-swal-container",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const response: IResponse = await clienteServices.delete(id);
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
          fetchData();
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error al Eliminar",
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
  const fetchById = (id: number): ICliente | undefined => {
    return rows.find((row: ICliente) => row.id === id);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
              Clientes registrados
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
              onClick={() => navigate("/dashboard/clientes/crear")}
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
            title="Detalles del Cliente"
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
                      {modalData.user.email}
                    </Typography>
                    <Typography variant="h6">
                      <strong>Negocio:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {modalData.company.nombre}
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
