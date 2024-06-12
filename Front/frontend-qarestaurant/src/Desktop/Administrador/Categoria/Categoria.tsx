import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import axios from "axios";
import { useEffect, useState } from "react";
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
import IResponse from "../../../interfaces/IResponse.";
import Loader from "../../../components/loader";

interface CompanyData {
  nombre: string;
}

const filterRows = (rows: CompanyData[], term: string) => {
  return rows.filter((row) =>
    row.nombre.toLowerCase().includes(term.toLowerCase())
  );
};
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJyb290QHJvb3QuY29tIiwicm9sZSI6IlJvb3QiLCJuYmYiOjE3MTc2OTc2OTMsImV4cCI6MTcxNzc4NDA5MywiaWF0IjoxNzE3Njk3NjkzfQ.5iX7_S2cI0882NIwj7nVw29FqMxKWjH6DfGzoSOORJs";

export default function Categorias() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<CompanyData[]>(rows);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (event: any) => {
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
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/dashboard/empresas/editar/${params.row.id}`)
            }
            sx={{
              marginRight: 3,
              marginLeft: 2,
            }}
            endIcon={<EditIcon />}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => fetchDelete(params.row.id)}
            endIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </>
      ),
    },
  ];
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7047/APICompany/lista",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setRows(data.result);
      setFilteredRows(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchDelete = async (id: number) => {
    let response: any;

    try {
      await Swal.fire({
        title: "¿Está seguro de eliminar la empresa?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          response = await axios.delete(
            `https://localhost:7047/APICompany/Id?Id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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
        }
        fetchData();
      });
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
    fetchData();
  }, []);

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
              onClick={() => navigate("/dashboard/categoria/crearCategoria")}
            >
              <AddCircleIcon />
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
