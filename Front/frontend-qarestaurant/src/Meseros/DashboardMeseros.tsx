import { Button, Card, CardContent, Grid, Typography, Checkbox, FormControlLabel } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const tools = [
    { title: 'Mesa 1', description: 'Ultimo pedido a las:', pedido: '7:00pm', preparado: 'Pedido listo', preparacion: 'Pedidos en preparacion', pedidos: ['Caldo de pollo', 'Tacos de taco', 'orden3', 'orden4', 'Caldo de res', 'Tacos de taco', 'orden7', 'orden8'] },
    { title: 'Mesa 2', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'Pedidos en preparacion', pedidos: ['Caldo de ave', 'Ensalada','Orden3','Orden4'] },
    { title: 'Mesa 3', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'Pedidos en preparacion', pedidos: ['Nachos', 'Cheve','Orden gigantititiisisisma','Orden milochomil', 'Orden5'] },
    { title: 'Mesa 4', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'Pedidos en preparacion', pedidos: ['Guacamole', 'Tacos al pastor'] },
]

const cardButtons = ['Nueva orden', 'Pagar']

const DashboardMeseros = () => (
    <Grid container spacing={2} sx={{ padding: 5, backgroundColor: '#fff6ed', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    minHeight: 350,
                }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Grid container sx={{flexDirection:'row'}}>
                            <Grid item sx={{ padding: 1, flexDirection: 'column', width:'50%',justifyContent:'start' }}>
                                <Grid item>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{tool.title}</Typography>
                                </Grid>
                                <Grid item sx={{ display: 'flex', gap: 1 }}>
                                    <Typography variant="body2">{tool.description}</Typography>
                                    <Typography variant="body2" fontWeight={600}>{tool.pedido}</Typography>
                                </Grid>
                                <Grid item mt={1}>
                                    <Typography variant="body2">{tool.preparacion}</Typography>
                                </Grid>                                
                            </Grid>

                            <Grid item sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2, width:'50%' }}>
                            {cardButtons.map((cardButton) => (
                                <Button
                                    key={cardButton}
                                    sx={{
                                        textTransform: 'none',
                                        color: 'black',
                                        border: '1px solid',
                                        borderColor: '#a0c9d7',
                                        borderRadius: '8px',
                                        minWidth: '120px',
                                        maxHeight: '50px',
                                        padding: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                    <Typography sx={{
                                        fontFamily: 'Poppins, sans-serif'
                                    }}>
                                        {cardButton}
                                    </Typography>
                                </Button>
                            ))}   
                            </Grid>                         
                        </Grid>
                        
                        <Grid container sx={{padding: 1, mt:2}}>
                                <Grid item>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>Pedidos listos:</Typography>
                                    <Grid container sx={{ display: 'inline-grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, maxHeight: '150px'}}>
                                        {tool.pedidos.map((pedido, idx) => (
                                            <Grid item key={idx} xs={6} md={4} lg={3}>
                                                <FormControlLabel
                                                    control={<Checkbox/>}
                                                    label={
                                                        <Typography variant="body2" noWrap>{pedido}</Typography>
                                                    }
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                        </Grid>

                    </CardContent>


                </Card>
            </Grid>
        ))}

        <Grid item>
            <Button sx={{ backgroundColor: '#00a507', color: 'white', width: '250px', borderRadius: 15, mt: 5, padding: 2 }}>
                <AddIcon />
            </Button>
        </Grid>
    </Grid>
)

export default DashboardMeseros;
