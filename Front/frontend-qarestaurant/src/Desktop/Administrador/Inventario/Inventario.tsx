import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Box,
  Pagination,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from "@mui/icons-material/Info";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../../services/AuthServices';
import apiClient from '../../../auth/AuthInterceptor';
import Swal from "sweetalert2";
import IResponse from "../../../interfaces/IResponse.";
import GeneralModal from "../../../components/GeneralModal";
import Loader from "../../../components/loader";
import IProducto from '../../../interfaces/Inventario/IProducto';
import inventarioServices from '../../../services/InventarioServices';
import { dataURLToFile } from '../../../assets/utils/DataURLToFile';





const filterRows = (rows: IProducto[], term: string) => {
  return rows.filter((row) => {
    const searchTerm = term.toLowerCase();
    return (
      row.nombre.toLowerCase().includes(searchTerm)
    );
  });
};

const ITEMS_PER_PAGE = 8;

export default function Inventario() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState<IProducto[]>([]);
  const [rows, setRows] = useState<IProducto[]>([]);
  const [paginatedProducts, setPaginatedProducts] = useState<IProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<IProducto | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const updatePaginatedProducts = (filtered: IProducto[], currentPage: number) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setPaginatedProducts(filtered.slice(start, end));
  };

  //Obtener los datos de la API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inventarioServices.getProductos();
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, []);

  //eliminar un producto
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
          const response: IResponse = await inventarioServices.delete(id);
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

  const fetchById = (
    id: number
  ): IProducto | undefined => {
    return rows.find((row: IProducto) => row.id === id);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('Rows updated:', rows);
    const filtered = filterRows(rows, searchTerm);
    setFilteredRows(filtered);
    updatePaginatedProducts(filtered, page);
  }, [rows, searchTerm, page]);

  useEffect(() => {
    console.log('Filtered Rows updated:', filteredRows);
  }, [filteredRows]);

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


  return (
    <>
   {loading && <Loader />}
    <Grid sx={{ padding: 0, }} mt={2}>
      <Grid container mb={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4">Productos</Typography>
        </Grid>

        <Grid item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate('/dashboard/inventario/crear')}
            style={{ justifyContent: 'center' }}
            endIcon={<AddCircleIcon />}

          >
            Agregar
          </Button>
        </Grid>
      </Grid>

      <Grid item >
      <Card sx={{borderRadius:5}}>
        <CardContent sx={{height: "68vh"}}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              borderRadius: '.3rem',
              backgroundColor: '#F8F3F3',
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
        <Grid container spacing={2}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={product.id}>
              <Card sx={{ display: 'flex', alignItems: 'center', borderRadius: '24px', padding: 1, backgroundColor: '#EEF2FF'}}>
                <CardMedia
                  component='img'
                  sx={{ width: 70, height: 70, borderRadius: '50%' }}
                  image={product.imagenInventario || 'https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-no-photo-taking-photo-illustration-image_1407166.jpg'}
                  alt={product.nombre}
                  onError={(e) => { e.currentTarget.src = 'https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-no-photo-taking-photo-illustration-image_1407166.jpg'; }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 2, }}>
                  <Box sx={{ flex: 1 }}>
                      <Typography component='div' variant='h6'>
                        {product.nombre}
                      </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 1, paddingBottom: 1 }}>
                    
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(product.id)}
                    sx={{
                      marginRight: 2,
                      marginLeft: 2,
                    }}
                  >
                    <InfoIcon />
                  </Button>
                    <Button 
                    variant='contained' 
                    color='primary' 
                    sx={{ marginRight: 1 }}
                    onClick={() =>
                      navigate(`/dashboard/inventario/editar/${product.id}`)
                    }>
                      <EditIcon />
                    </Button>
                    <Button 
                    variant='contained' 
                    color='error'
                    onClick={() => handleDelete(product.id)}
>
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
          <GeneralModal
            open={openModal}
            onClose={handleCloseModal}
            title="Detalles del Producto"
            content={
              modalData ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Avatar
                      src={
                        modalData.imagenInventario
                          ? URL.createObjectURL(
                              dataURLToFile(modalData.imagenInventario, "foto")
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
                      <strong>Nombre:</strong>
                    </Typography>
                    <Typography variant="body1">{`${modalData.nombre}`}</Typography>

                    <Typography variant="h6">
                      <strong>Categoria:</strong>
                    </Typography>
                    <Typography variant="body1">{modalData.categoria}</Typography>

                    <Typography variant="h6">
                      <strong>Descripción:</strong>
                    </Typography>
                    <Typography variant="body1">{modalData.descripcion}</Typography>
                    <Typography variant="h6">
                      <strong>Precio:</strong>
                    </Typography>
                    <Typography variant="body1">${modalData.precio}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <p>Cargando...</p>
              )
            }
          />
        </Grid>

        <Box sx={{  ...(rows.length === 0 && {
                      display: "none",
                    }), ...(rows.length > 0 && {
                      display: "flex",
                    }), justifyContent: 'end', marginTop: 2, position: "relative", top: "42vh" }}>
          <Pagination
            count={Math.ceil(filteredRows.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handleChangePage}
            color='primary'
          />
        </Box>
        </CardContent>
      </Card>
      </Grid>
    </Grid>
    </>
  );
}
