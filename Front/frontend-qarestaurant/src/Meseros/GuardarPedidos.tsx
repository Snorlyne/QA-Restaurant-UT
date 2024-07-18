import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/LogoAzul.jpg";
import TableChartIcon from "@mui/icons-material/TableChart";
import OrderItem from "./OrdenItem";
import { Card, Input } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Hidden from "@mui/material/Hidden";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Select, FormControl, InputLabel } from "@mui/material";
import apiClient from "../auth/AuthInterceptor";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#486F99",
  color: "#ffffff",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: "#486F99",
  color: "#ffffff",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const MenuItem = styled(ListItem)(({ theme }) => ({
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#648be1",
  },
  "&.Mui-selected": {
    backgroundColor: "#A0C9D7",
    "&:hover": {
      backgroundColor: "#A0C9D7",
    },
  },
}));

// const items = [
//   {
//     id: 1,
//     name: 'Cheese Pizza',
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFr7UUQCqtJ6Juf0IGcgyJEuMLg9TEUd_mgg&s',
//     quantity: 1,
//   },
//   {
//     id: 2,
//     name: 'Pepperoni Pizza',
//     image: 'https://images.ecestaticos.com/WJT0BFvdZ4poZa5PiFHuCXX2sTo=/0x0:2121x1414/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F96f%2F563%2Fc84%2F96f563c8404ac8cd97c158887aa56ae1.jpg',
//     quantity: 1,
//   },
// ];

interface Product {
  id: number;
  nombre: string;
  imagenInventario: string | null;
  categoria: string;
  descripcion: string;
  precio: number;
  quantity: number;
}

interface CategoriaData {
  id: number;
  nombreCategoria: string;
}

// Define la interfaz para los productos en la orden
export interface OrderItemProduct {
  fK_inventory_id: number;
  adicional: string;
}

// Define la interfaz para la solicitud de orden
export interface OrderRequest {
  mesa: number;
  ordenes: OrderItemProduct[];
}

// Define la interfaz para la respuesta de la API de orden
export interface OrderResponse {
  isSuccess: boolean;
  message: string;
  idComanda: number; // Asumiendo que idComanda es devuelto por el servidor
}

const App: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [additionText, setAdditionText] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<CategoriaData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [additions, setAdditions] = useState<{ [key: number]: string }>({});
  const [tableNumber, setTableNumber] = useState(id);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false)

  const handleTableChange = (event:any) => {
    const value = event.target.value;
    // Ensure the value is a number between 1 and 20
    if (value === "" || (Number(value) >= 1 && Number(value) <= 20)) {
      setTableNumber(value);
    }
  };
  const handleCancel = () => {
    navigate("/meseros2");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/Categoria");
        setCategories(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if(id !== undefined) {
      setInputDisabled(true);
    }

    const fetchProducts = async () => {
      try {
        const responseProduct = await apiClient.get("/Inventario");
        setProducts(responseProduct.data.result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [id]);

  const handleSave = async () => {
    const ordenes: OrderItemProduct[] = selectedProducts.map(product => ({
      fK_inventory_id: product.id,
      adicional: additions[product.id] || "", // Suponiendo que additions contiene los detalles adicionales
    }));

    const orderRequest: OrderRequest = {
      mesa: tableNumber !== undefined ? parseInt(tableNumber) : 0,
      ordenes: ordenes,
    };

    try {
      const response = await apiClient.post<OrderResponse>(
        "/Mesero/ComandasYOrdenes",
        orderRequest
      );
      if (response.data.isSuccess) {
        console.log(
          "Orden guardada con éxito. ID de comanda:",
          response.data.idComanda
        );
        // Aquí puedes manejar la respuesta según tus necesidades
        navigate("/meseros2");
      } else {
        console.error("Error al guardar la orden:", response.data.message);
        // Aquí puedes manejar el caso de error
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      // Aquí puedes manejar los errores de red u otros errores
    }
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión, por ejemplo:
    // Limpiar el almacenamiento local, redirigir a la página de inicio de sesión, etc.
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleModalOpen = (itemId: number) => {
    setCurrentItem(itemId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setAdditionText("");
  };

  const handleAdditionTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdditionText(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log(`Selected Category: ${categoryName}`);
    setSelectedCategory(categoryName);
  };

  let filteredProducts = [];
  if (selectedCategory !== "Todos") {
    filteredProducts = products.filter(
      (product) =>
        (selectedCategory === null || product.categoria === selectedCategory) &&
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else {
    filteredProducts = products.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }


  const handleAddProduct = (product: Product) => {
    setSelectedProducts(prevProducts => [...prevProducts, product]);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(prevProducts => {
      const index = prevProducts.findIndex(p => p.id === productId);
      if (index > -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts.splice(index, 1);
        return updatedProducts;
      }
      return prevProducts;
    });
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "fixed", backgroundColor: "white" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar sx={{ backgroundColor: "#486F99" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Hidden lgUp>
                {/* ...PONER LA RUTA DE RUBEN */}
                <Link
                  to="/meseros2"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "flex",
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      marginRight: 3,
                      backgroundColor: "#A0C9D7",
                      borderRadius: "20px",
                    }}
                  />
                </Link>
              </Hidden>
              Nuevas Ordenes
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon sx={{ color: "white" }} />
                ) : (
                  <ChevronLeftIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {/* <LogoContainer>
              <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto' }} />
            </LogoContainer> */}
            {/* <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', display: 'block' }}>Categorias</Typography> */}
            <Divider />
            <List>
              <MenuItem key={1} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleCategoryClick("Todos")}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    <TableChartIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Todos"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    onClick={() =>
                      handleCategoryClick(category.nombreCategoria)
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "#ffffff",
                      }}
                    >
                      <TableChartIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={category.nombreCategoria}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </MenuItem>
              ))}
            </List>
          </Drawer>

          {/* ..contenido... */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl variant="outlined" fullWidth>
                <TextField
                  label="Número de Mesa"
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 1, max: 20 }}
                  value={tableNumber}
                  onChange={handleTableChange}
                  fullWidth
                  disabled={ inputDisabled}
                />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 2,
                }}
              >
                <TextField
                  value={searchTerm}
                  onChange={handleSearchChange}
                  label="Buscar"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                />
              </Box>
            </Box>
            {/* ...otros componentes... */}
            <Grid container spacing={2}>
              {filteredProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={6} lg={6} key={product.id} marginTop={5}>
                      <OrderItem
                        image={
                          product.imagenInventario ||
                          "https://png.pngtree.com/element_our/20190602/ourlarge/pngtree-no-photo-taking-photo-illustration-image_1407166.jpg"
                        }
                        title={product.nombre}
                        quantity={1}
                        onAdd={() => handleAddProduct(product)}
                        onRemove={() => handleRemoveProduct(product.id)}
                        // onAddExtras={() => handleModalOpen(product.id)}
                        // onInfoClick={() =>
                        //   console.log(`Información de ${product.nombre}`)
                        // }
                        product={product} // Nueva propiedad pasada al componente
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No hay productos registrados
                </Typography>
              )}
            </Grid>
          </Box>
        </Box>
        {/* <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>Agregar adiciones</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Adición"
              type="text"
              fullWidth
              value={additionText}
              onChange={handleAdditionTextChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSave} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog> */}
        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  position: "relative",
                  right: { xs: "-20%", sm: "-70%", md: "-15%", lg: "55%" },
                  fontSize: "16px",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  justifyContent: "center",
                  alignContent: "center",
                  textTransform: "none",
                  backgroundColor: "green",
                  width: { xs: "70%", sm: "80%", md: "80%", lg: "100%" },
                  top: "-10px",
                }}
              >
                Guardar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={{
                  position: "relative",
                  left: { xs: "20%", sm: "68%", md: "60%", lg: "45%" },
                  fontSize: "16px",
                  padding: "3px 10px",
                  borderRadius: "10px",
                  justifyContent: "center",
                  alignContent: "center",
                  textTransform: "none",
                  backgroundColor: "red",
                  width: { xs: "70%", sm: "30%", md: "30%", lg: "40%" },
                  top: { xs: "-10%", sm: "-10%" },
                }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
      {/* <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>
          Agregar adiciones a{" "}
          {selectedProductId !== null &&
            products.find((p) => p.id === selectedProductId)?.nombre}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Adición"
            type="text"
            fullWidth
            value={additionText}
            onChange={handleAdditionTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default App;
