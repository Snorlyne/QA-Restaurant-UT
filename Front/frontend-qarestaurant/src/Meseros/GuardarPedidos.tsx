import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import logo from '../img/LogoAzul.jpg';
import TableChartIcon from '@mui/icons-material/TableChart';
import OrderItem from './OrdenItem';
import { Card } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Hidden from '@mui/material/Hidden';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const handleSave = () => {
  console.log('Guardar');
  // Aquí puedes agregar la lógica para guardar
};

const handleCancel = () => {
  console.log('Cancelar');
  // Aquí puedes agregar la lógica para cancelar
};


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#486F99',
  color: '#ffffff',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: '#486F99',
  color: '#ffffff',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const MenuItem = styled(ListItem)(({ theme }) => ({
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#648be1',
  },
  '&.Mui-selected': {
    backgroundColor: '#A0C9D7',
    '&:hover': {
      backgroundColor: '#A0C9D7',
    },
  },
}));


const items = [
  {
    id: 1,
    name: 'Cheese Pizza',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFr7UUQCqtJ6Juf0IGcgyJEuMLg9TEUd_mgg&s',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    image: 'https://images.ecestaticos.com/WJT0BFvdZ4poZa5PiFHuCXX2sTo=/0x0:2121x1414/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F96f%2F563%2Fc84%2F96f563c8404ac8cd97c158887aa56ae1.jpg',
    quantity: 1,
  },
];

const App: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<number | null>(null);
  const [additionText, setAdditionText] = React.useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
    setAdditionText('');
  };

  const handleAdditionTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionText(event.target.value);
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredProducts = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Card sx={{display:'flex', flexDirection: 'column', height:'100vh', justifyContent:'space-between'}}>
    <Box sx={{ display: 'fixed', backgroundColor:'white' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
      <Toolbar sx={{ backgroundColor: '#486F99' }}> 
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Hidden lgUp>
             {/* ...PONER LA RUTA DE RUBEN */}
          <Link to="/meseros" style={{ color: 'inherit', textDecoration: 'none' }}>
  <ArrowBackIcon sx={{ marginRight: 3, backgroundColor: '#A0C9D7', borderRadius:'20px'}}/>
  </Link>
</Hidden>
QA Restaurant
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <LogoContainer>
            <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto' }} />
        </LogoContainer>
        <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center', display: 'block'}}>Mesas</Typography>
        <Divider />

        <List>
          {['Mesa 1', 'Mesa 2', 'Mesa 3'].map((text, index) => (
            <MenuItem key={text} disablePadding selected={index === 0} sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  {index % 2 === 0 ?  <TableChartIcon /> :  <TableChartIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </MenuItem>
          ))}
        </List>
      
  <ListItem key="Cerrar sesión" button onClick={handleLogout}
  sx={{'&:hover': { color: 'red' }}}>
  <ListItemIcon sx={{'&:hover': {color: '#648be1'}}}>
  <ExitToAppIcon sx={{ color: 'white', '&:hover': { color: 'red' }, justifyContent: 'center'}} />
  </ListItemIcon>
  <ListItemText primary="Cerrar sesión" />
</ListItem>
      </Drawer>

{/* ..contenido... */}
<Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
<TextField
  value={searchTerm}
  onChange={handleSearchChange}
  label="Buscar"
  variant="outlined"    
  InputProps={{
    startAdornment: (
      <SearchIcon />
    ),
  }}
/>
</Box>
  {/* ...otros componentes... */}
  <Grid container spacing={2}>
  {filteredProducts.map((item) =>  (
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <OrderItem
          key={item.id}
          image={item.image}
          title={item.name}
          quantity={item.quantity}
          onAdd={() => console.log(`Añadir más de ${item.name}`)}
          onRemove={() => console.log(`Eliminar uno de ${item.name}`)}
          onAddExtras={() => handleModalOpen(item.id)}
          onInfoClick={() => console.log(`Información de ${item.name}`)}
        />
      </Grid>
    ))}
  </Grid>
</Box>
</Box>
<Dialog open={modalOpen} onClose={handleModalClose}>
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
</Dialog>
<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2,  }}>
<Grid container spacing={2} justifyContent="flex-end">
<Grid item xs={12} sm={6} md={4} lg={3}>
        <Button variant="contained" onClick={handleSave}
            sx={{ 
              position: 'relative',
              right: { xs: '-20%', sm: '-70%', md: '-15%', lg: '55%'},
              fontSize: '16px', 
              padding: '10px 20px',
              borderRadius: '15px',
              justifyContent: 'center',
              alignContent: 'center',
              textTransform: 'none',
              backgroundColor: 'green',
              width: { xs: '70%', sm:'80%', md: '80%', lg: '100%'},
              top: '-10px'
            }}
            >
          Guardar
        </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
        <Button variant="contained" onClick={handleCancel}
            sx={{ 
              position: 'relative',
              left: { xs: '20%', sm:'68%',md: '60%', lg: '45%'},
              fontSize: '16px', 
              padding: '3px 10px',
              borderRadius: '10px',
              justifyContent: 'center',
              alignContent: 'center',
              textTransform: 'none',
              backgroundColor: 'red',
              width: { xs: '70%', sm:'30%', md: '30%', lg: '40%'},
              top: { xs:'-10%', sm:'-10%'}
              
            }}
            >
          Cancelar
        </Button>
        </Grid>
        </Grid>
        </Box>
        </Card>
    </>
  );
};

export default App;