import React, { useState } from "react";
import { Button, Card, CardContent, Grid, Typography, Checkbox, FormControlLabel, Box } from "@mui/material";
import ITool from "../interfaces/IMeseros";
import AddIcon from '@mui/icons-material/Add';

const tools: ITool[] = [
    { title: 'Mesa 1', description: 'Ultimo pedido a las:', pedido: '7:00pm', pedidos: ['Caldo de pollo', 'Tacos de taco', 'orden3', 'orden4', 'Caldo de res', 'Tacos de taco', 'orden7', 'orden8']},
    { title: 'Mesa 2', description: 'Ultimo pedido a las:', pedido: '9:00pm', pedidos: ['Caldo de ave', 'Ensalada','Orden3','Orden4','Orden 5']},
    { title: 'Mesa 3', description: 'Ultimo pedido a las:', pedido: '9:00pm', pedidos: ['Nachos', 'Cheve','Pescado al ajillo','Orden milochomil', 'Orden5']},
    { title: 'Mesa 4', description: 'Ultimo pedido a las:', pedido: '9:00pm', pedidos: ['Guacamole', 'Tacos al pastor']},
];

const cardButtons = ['Nueva orden', 'Pagar'];

const DashboardMeseros: React.FC = () => {
    const [checkedState, setCheckedState] = useState<boolean[][]>(
        tools.map((tool) => tool.pedidos.map(() => false))
    );

    const handleCheckboxChange = (toolIndex: number, pedidoIndex: number) => {
        const newCheckedState = [...checkedState];
        newCheckedState[toolIndex] = [...newCheckedState[toolIndex]];
        newCheckedState[toolIndex][pedidoIndex] = !newCheckedState[toolIndex][pedidoIndex];
        setCheckedState(newCheckedState);
    };

    const countChecked = (toolIndex: number): number => {
        return checkedState[toolIndex].filter(Boolean).length;
    };

    const areAllChecked = (toolIndex: number): boolean => {
        return checkedState[toolIndex].every(Boolean);
    };

    return (
        <Grid container spacing={3} sx={{ padding: 5, backgroundColor: '#fff6ed', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {tools.map((tool, toolIndex) => (
                <Grid item xs={12} sm={6} md={6} key={toolIndex} sx={{ position: 'relative' }}>
                    <Box sx={{
                        width: '45px',
                        height: '45px',
                        color: 'white',
                        backgroundColor: '#00a507',
                        borderRadius: '50px',
                        position: 'absolute',
                        top: 10,
                        right: -10,
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography sx={{ textAlign: 'center' }}>{tool.pedidos.length - countChecked(toolIndex)}</Typography>
                    </Box>
                    <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: 5,
                        minHeight: '400px',
                        position: 'relative'
                    }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container sx={{ flexDirection: { sm: 'column', md: 'column', lg: 'row' } }}>
                                <Grid item sx={{ padding: 1, flexDirection: 'column', width: { sm: '100%', md: '100%', lg: '50%' }, justifyContent: 'start' }}>
                                    <Grid item>
                                        <Typography sx={{
                                            fontSize: '20px',
                                            fontWeight: 600
                                        }}>{tool.title}</Typography>
                                    </Grid>
                                    <Grid item sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2">{tool.description}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{tool.pedido}</Typography>
                                    </Grid>
                                    <Grid item mt={1}>
                                        <Typography 
                                        variant="body2"
                                        sx={{color: areAllChecked(toolIndex) ? '#00a507' : '#aab800',}}
                                        >
                                            {areAllChecked(toolIndex) ? 'Pedidos listos' : 'Pedidos en preparación'}
                                        </Typography>                       
                                    </Grid>
                                </Grid>

                                <Grid item sx={{ display: 'flex', justifyContent: { sm: 'center', md: 'center', lg: 'end' }, alignItems: 'center', gap: 2, width: { sm: '100%', md: '100%', lg: '50%' } }}>
                                    {cardButtons.map((cardButton) => (
                                        <Button
                                            key={cardButton}
                                            sx={{
                                                textTransform: 'none',
                                                color: 'black',
                                                border: '1px solid',
                                                borderColor: '#a0c9d7',
                                                borderRadius: '8px',
                                                minWidth: { sm: '60px', md: '60px', lg: '120px' },
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

                            <Grid container sx={{ padding: 1, mt: 2 }}>
                                <Grid item sx={{ flexGrow: 1, overflowY: { xs: 'scroll', sm: 'scroll', md: 'scroll', lg: 'hidden' } }}>
                                    <Typography variant='body2' sx={{ fontWeight: 600 }}>Pedidos listos:</Typography>
                                    <Box sx={{
                                        display: 'inline-grid',
                                        gridTemplateColumns: { sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                                        maxHeight: '150px',
                                        gap: 2,
                                    }}>
                                        {tool.pedidos.map((pedido, pedidoIndex) => (
                                            <Grid item key={pedidoIndex} xs={12} sm={12} md={4} lg={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checkedState[toolIndex][pedidoIndex]}
                                                            onChange={() => handleCheckboxChange(toolIndex, pedidoIndex)}
                                                            sx={{ transform: { xs: 'scale(1)', sm: 'scale(0.75)', md: 'scale(1)' } }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2" noWrap>{pedido}</Typography>
                                                    }
                                                />
                                            </Grid>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                </Grid>
            ))}

            <Grid item>
                <Button sx={{ backgroundColor: '#00a507', color: 'white', width: '250px', borderRadius: 15, padding: '12.5px' }}>
                    <AddIcon />
                </Button>
            </Grid>
        </Grid>
    );
}

export default DashboardMeseros;
