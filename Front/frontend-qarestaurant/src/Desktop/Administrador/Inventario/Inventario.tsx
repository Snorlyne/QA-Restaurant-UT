import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 2, nombre: 'Huevo', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 3, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 4, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 5, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 6, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 7, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 8, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 9, nombre: 'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
  { id: 10, nombre:'Cheese Pizza', image: 'https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg' },
];

const ITEMS_PER_PAGE = 8;

export default function Inventario() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleChangePage = (event: React.ChangeEvent<unknown> , value: number) => {
    setPage(value);
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">Productos</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => navigate("/dashboard/Inventario/crearproduc")}  
            style={{ justifyContent: "center" }}>
            <AddCircleIcon />
          </Button>
        </Box>
      </Box>
      
      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <TextField
            type="text"
            placeholder="Buscar..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon />
              ),
            }}
          />
        </Box>
        <Grid container spacing={2}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={product.id}>
              <Card sx={{ display: 'flex', alignItems: 'center', borderRadius: "24px", padding: 1, backgroundColor: '#EEF2FF' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 70, height: 70, borderRadius: '50%' }}
                  image={product.image}
                  alt={product.nombre}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', padding: '8px' }}>
                      <Typography component="div" variant="h6">
                        {product.nombre}
                      </Typography>
                    </CardContent>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 1, paddingBottom: 1 }}>
                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                      <EditIcon />
                    </Button>
                    <Button variant="contained" color="error">
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
          <Pagination
            count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Card>
    </Box>
  );
}
