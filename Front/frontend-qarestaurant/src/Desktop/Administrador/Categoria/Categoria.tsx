import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import axios from "axios";
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
// import IResponse from "../../../interfaces/IResponse.";
import Loader from "../../../components/loader";


interface CompanyData {
  id: number;
  nombre: string;
}

const filterRows = (rows: CompanyData[], term: string) => {
  const searchTerm = term.toLowerCase();
  return rows.filter(row =>
    row.nombre.toLowerCase().includes(searchTerm)
  );
};

export default function Categoria() {
  const [rows, setRows] = useState<CompanyData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 150 },
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
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/dashboard/empresas/editar/${params.row.id}`)}
            sx={{ marginRight: 1 }}
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
        </Box>
      ),
    },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7047/APICategoria",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.result;
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    const confirmation = await Swal.fire({
      title: "¿Está seguro de eliminar la empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    });

    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `https://localhost:7047/APICompany/Id?Id=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.isSuccess) {
          Swal.fire("Eliminado!", response.data.message, "success");
          fetchData();
        } else {
          Swal.fire("Error!", response.data.message, "error");
        }
      } catch (error: any) {
        Swal.fire("Error!", error.message, "error");
      } finally {
        setLoading(false);
      }
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
              onClick={() => navigate("/dashboard/categoria/crearcategoria")}
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