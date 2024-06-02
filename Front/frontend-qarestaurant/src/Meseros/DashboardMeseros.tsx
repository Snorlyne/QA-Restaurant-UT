import {Button, Card, CardContent, Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const tools = [
    { title: 'Mesa 1', description: 'Ultimo pedido a las:', pedido: '7:00pm', preparado: 'Pedido listo', preparacion: 'En preparacion' },
    { title: 'Mesa 2', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'En preparacion' },
    { title: 'Mesa 3', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'En preparacion' },
    { title: 'Mesa 4', description: 'Ultimo pedido a las:', pedido: '9:00pm', preparado: 'Pedido listo', preparacion: 'En preparacion' }
]

const cardButtons = ['Nueva orden', 'Pagar']

const DashboardMeseros = () => (
    <Grid container spacing={2} sx={{ padding: 5, backgroundColor: '#fff6ed', justifyContent:'center', alignItems: 'center' }}>
        {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
                <Card sx={{
                    display: 'flex',
                    padding: 2,
                    backgroundColor: 'white',
                    height: '300px',
                    borderRadius: 5
                }}> 
                    <CardContent sx={{ flexGrow: 1, display: 'flex' }}>
                        <Grid container sx={{ padding: 1, flexDirection: 'column', gap: 1}}>
                            <Grid item>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>{tool.title}</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="body2">{tool.description}</Typography>
                                <Typography variant="body2" fontWeight={600}>{tool.pedido}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">{tool.preparacion}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ justifyContent: 'end', gap: 2}}>
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
                                        maxHeight:'50px',
                                        padding: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mt: 4
                                    }}>
                                    <Typography sx={{
                                        fontFamily: 'Poppins, sans-serif',
                                        
                                    }}>
                                        {cardButton}
                                    </Typography>
                                </Button>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        ))}

        <Grid item>
            <Button sx={{backgroundColor:'#00a507',color:'white', width:'250px',borderRadius: 15, mt: 5, padding: 2}}>
                <AddIcon/>
            </Button>
        </Grid>
    </Grid>
)

export default DashboardMeseros