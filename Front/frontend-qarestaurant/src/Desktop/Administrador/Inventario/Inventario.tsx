import React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

export default function Inventario() {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', width: 130 },
    // Agrega más columnas aquí
  ];

  const rows = [
    { id: 1, nombre: 'Producto 1' },
    // Agrega más filas aquí
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>Productos</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        style={{backgroundColor: 'white'}}
      />
    </div>
  );
}