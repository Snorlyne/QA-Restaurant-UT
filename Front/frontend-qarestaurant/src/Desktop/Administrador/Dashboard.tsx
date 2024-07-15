import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HailIcon from "@mui/icons-material/Hail";
import LogoutIcon from "@mui/icons-material/Logout";
import logoSinBG from "./../../assets/img/logoSinBG.png";
import ClientesComponent from "./Cliente/Cliente";
import { useEffect, useState } from "react";
import InicioComponent from "./Inicio";
import {
  Autocomplete,
  Avatar,
  Grid,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import deepOrange from "@mui/material/colors/deepOrange";
import EmpresaComponent from "./Empresa/Empresa";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import EmpresaCreateEditComponent from "./Empresa/EmpresaCE";
import ClienteCEComponent from "./Cliente/ClienteCE";
import authService from "../../services/AuthServices";
import Swal from "sweetalert2";
import EmpleadoComponent from "./Empleado/Empleado";
import EmpleadoCEComponent from "./Empleado/EmpleadoCE";
import ProtectedRoute from "../../auth/ProtectedRoute";
import Inventario from "./Inventario/Inventario";
import ProductoCE from "./Inventario/ProductoCE";
import InventoryIcon from "@mui/icons-material/Inventory";
import Categoria from "./Categoria/Categoria";
import CategoriaCE from "./Categoria/CategoriaCE";
import CategoryIcon from "@mui/icons-material/Category";
import CambioDePassword from "../../components/Usuario/CambioDePassword";
import ModalUsuario from "../../components/Usuario/ModalUsuario";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: "rgb(72, 111, 153)",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: "rgb(72, 111, 153)",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
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

const StyledList = styled(List)({
  "& .MuiListItemButton-root:hover": {
    "&, & .MuiListItemIcon-root": {
      color: "white",
    },
  },
});

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard",
  },
  { text: "Clientes", icon: <HailIcon />, link: "/dashboard/clientes" },
  {
    text: "Empresas",
    icon: <StorefrontIcon />,
    link: "/dashboard/empresas",
  },
  { text: "Empleados", icon: <HailIcon />, link: "/dashboard/empleados" },

  {
    text: "Inventario",
    icon: <InventoryIcon />,
    link: "/dashboard/inventario",
  },
  {
    text: "Categorias",
    icon: <CategoryIcon />,
    link: "/dashboard/categorias",
  },

  // { text: 'Configuración General', icon: <InboxIcon />, component: <ConfiguracionGeneralComponent /> }
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userNombre, setUserNombre] = useState<string | null>("");
  const [selectedItem, setSelectedItem] = useState<any>();
  const [selectedComponent, setSelectedComponent] = useState<any>();
  const [selectedMenuItems, setSelectedMenuItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  useEffect(() => {
    const currentPathname = location.pathname;
    const segments = currentPathname.split("/");
    const baseRoute = segments.length >= 3 ? `/${segments[2]}` : "";
    const selectedItem = selectedMenuItems.find(
      (item) => item.link === "/dashboard" + baseRoute
    );
    if (selectedItem) {
      setSelectedItem(selectedItem);
      setSelectedComponent(selectedItem);
    }
  }, [location.pathname, selectedMenuItems]);

  const handleAutocompleteChange = (event: any, value: any) => {
    setSearchTerm(value);
    const selectedItem = selectedMenuItems.find((item) => item.text === value);
    if (selectedItem) {
      setSelectedItem(selectedItem);
      navigate(selectedItem.link);
    }
  };

  const handleDrawerOpenClose = () => setOpen(!open);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará la sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cerrar sesión",
      customClass: {
        container: "custom-swal-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          authService.logout();
        }
      }
    });
  };
  useEffect(() => {
    setUserNombre(authService.getUser());
    const role = authService.getRole();
    if (role === "Root") {
      setSelectedMenuItems(
        menuItems.filter(
          (item) =>
            item.text !== "Inventario" &&
            item.text !== "Empleados" &&
            item.text !== "Categorias"
        )
      );
    } else {
      setSelectedMenuItems(
        menuItems.filter(
          (item) => item.text !== "Empresas" && item.text !== "Clientes"
        )
      );
    }
  }, [navigate, userNombre]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "white",
          color: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpenClose}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selectedComponent?.text}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            display: "block",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            ...theme.mixins.toolbar,
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <img
              src={logoSinBG}
              alt="QA Restaurant"
              style={{
                width: "35%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                transform: "scale(3)",
                position: "relative",
                left: "4rem",
              }}
            />
          </Box>
          <Divider
            sx={{
              backgroundColor: "white",
            }}
          />
          <Grid
            container
            py={2}
            px={1}
            sx={{
              ...(!open && {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }),
            }}
          >
            <Button
              sx={{
                padding: 0,
                fontStyle: "normal",
                textTransform: "none",
                width: "100%",
              }}
              onClick={handleOpenModal}
            >
              <Grid
                item
                xs={2}
                sx={{
                  ...(!open && {
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    top: "1.5rem",
                    paddingRight: "0",
                  }),
                }}
              >
                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                  {userNombre?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid
                item
                xs={10}
                pl={2}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  ...(!open && { display: "none", transition: "ease-in" }),
                }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    color: "white",
                    width: "100%",
                    textAlign: "start",
                  }}
                >
                  {userNombre}
                </Typography>
              </Grid>
            </Button>
          </Grid>
          <ModalUsuario
            open={isModalOpen}
            handleClose={handleCloseModal}
            userNombre={userNombre}
          />
        </DrawerHeader>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            overflowY: "hidden",
            overflowX: "hidden",
            position: "absolute",
            top: "10rem",
            ...(!open && { top: "7rem" }),
          }}
        >
          <Divider
            sx={{
              backgroundColor: "white",
            }}
          />
          <Autocomplete
            freeSolo
            disableClearable
            sx={{
              ".MuiOutlinedInput-root": {
                padding: "0px",
                backgroundColor: "#F8F3F3",
              },
              paddingX: "5px",
              paddingY: "10px",
              ...(!open && { display: "none", transition: "ease-in" }),
            }}
            options={selectedMenuItems.map((option) => option.text)}
            value={searchTerm}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  borderRadius: ".3rem",
                }}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        sx={{
                          marginRight: "10px",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                placeholder="Buscar"
              />
            )}
          />
          <StyledList
            sx={{
              paddingTop: "0px",
            }}
          >
            <List
              sx={{
                minHeight: 30,
                backgroundColor: "rgba(72, 111, 153, 1)",
              }}
            >
              {selectedMenuItems.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{
                      display: "block",
                      padding: "5px",
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 30,
                        justifyContent: open ? "initial" : "center",
                        width: "100%",
                        borderRadius: ".3rem",
                        backgroundColor:
                          selectedItem && selectedItem.link === item.link
                            ? "#A0C9D7"
                            : "transparent",
                        color:
                          selectedItem && selectedItem.link === item.link
                            ? "white"
                            : "#CFCFCF",
                        "&:hover": {
                          backgroundColor:
                            selectedItem && selectedItem.link === item.link
                              ? "#A0C9D7"
                              : "#ffffff1a",
                          color: "white",
                        },
                      }}
                      component={Link}
                      to={item.link}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                          color:
                            selectedItem && selectedItem.link === item.link
                              ? "white"
                              : "#CFCFCF",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </StyledList>
        </Box>
        <Box
          sx={{
            position: "relative",
            bottom: 0,
            right: 0,
            top: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            color: "white",
          }}
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{
              padding: 1,
              fontSize: "12px",
              "& .MuiButton-startIcon": {
                ...(!open && { margin: 0 }),
              },
            }}
            onClick={handleLogout}
          >
            <div
              style={{
                ...(!open && { display: "none", transition: "ease-in" }),
              }}
            >
              Cerrar Sesión
            </div>
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route index element={<InicioComponent />} />

          <Route
            path="empresas"
            element={
              <ProtectedRoute roles={["Root"]} element={<EmpresaComponent />} />
            }
          />
          <Route
            path="empresas/crear"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<EmpresaCreateEditComponent />}
              />
            }
          />
          <Route
            path="empresas/editar/:id"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<EmpresaCreateEditComponent />}
              />
            }
          />
          <Route
            path="clientes"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<ClientesComponent />}
              />
            }
          />
          <Route
            path="clientes/crear"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<ClienteCEComponent />}
              />
            }
          />
          <Route
            path="clientes/editar/:id"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<ClienteCEComponent />}
              />
            }
          />

          <Route
            path="clientes/crear"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<ClienteCEComponent />}
              />
            }
          />
          <Route
            path="cientes/editar/:id"
            element={
              <ProtectedRoute
                roles={["Root"]}
                element={<ClienteCEComponent />}
              />
            }
          />

          <Route
            path="empleados"
            element={
              <ProtectedRoute
                roles={["Admin"]}
                element={<EmpleadoComponent />}
              />
            }
          />
          <Route path="empleados/crear" element={<EmpleadoCEComponent />} />
          <Route
            path="empleados/editar/:id"
            element={<EmpleadoCEComponent />}
          />
          <Route
            path="inventario"
            element={
              <ProtectedRoute roles={["Admin"]} element={<Inventario />} />
            }
          />
          <Route
            path="inventario/crear"
            element={
              <ProtectedRoute roles={["Admin"]} element={<ProductoCE />} />
            }
          />
          <Route
            path="inventario/editar/:id"
            element={
              <ProtectedRoute roles={["Admin"]} element={<ProductoCE />} />
            }
          />
          <Route
            path="categorias"
            element={
              <ProtectedRoute roles={["Admin"]} element={<Categoria />} />
            }
          />
          <Route
            path="categorias/crear"
            element={
              <ProtectedRoute roles={["Admin"]} element={<CategoriaCE />} />
            }
          />
          <Route
            path="categorias/editar/:id"
            element={
              <ProtectedRoute roles={["Admin"]} element={<CategoriaCE />} />
            }
          />

          <Route
            path="Password"
            element={
              <ProtectedRoute
                roles={["Admin", "Root", "Meseros"]}
                element={<CambioDePassword />}
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
