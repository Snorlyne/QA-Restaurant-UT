import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState } from "react";
import {
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
import Loader from "../../../components/loader";
import apiClient from "../../../auth/AuthInterceptor";
import IResponse from "../../../interfaces/IResponse.";
import ICategoria from "../../../interfaces/Categoria/ICategoria";
import categoriaServices from "../../../services/CategoriasServices";

interface CategoriaData extends ICategoria {}

const filterRows = (rows: CategoriaData[], term: string) => {
  const searchTerm = term.toLowerCase();
  return rows.filter((row) =>
    row.nombreCategoria.toLowerCase().includes(searchTerm)
  );
};

export default function EmpresaComponent() {
  const [rows, setRows] = useState<CategoriaData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<CategoriaData[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: "nombreCategoria", headerName: "Nombre", flex: 1, minWidth: 150 },
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
            color="primary"
            onClick={() =>
              navigate(`/dashboard/categorias/editar/${params.row.id}`)
            }
            sx={{ marginRight: 2 }}
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

  //Traer categoria
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriaServices.getCategorias();
      console.log("API Response:", data);
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, []);

  //Eliminar categoria

  const handleDelete = async (id: number) => {
    try {
      await Swal.fire({
        title: "¿Está seguro de eliminar esta categoria?",
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
          const response: IResponse = await categoriaServices.delete(id);
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
              title: "Error al Eliminar",
              icon: "error",
              text: response.message,
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
              Categorias
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
              onClick={() => navigate("/dashboard/categorias/crear")}
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
        </Grid>
      </Grid>
    </>
  );
}
