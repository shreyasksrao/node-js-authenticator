import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { makeStyles } from "@material-ui/core/styles";

const tableRootStyle = makeStyles({
    root: {
        backgroundColor: '#0e2036',
        color: 'white',
        borderRadius: '15px !important',
        borderColor: 'var(--borderColor) !important',
        margin: '0px 5px'
    }
});

const customStyle = {
    '& .MuiDataGrid-columnHeaders': {
        marginBottom: '5px',
        borderColor: 'var(--borderColor)',
        borderBottom: '3px solid var(--borderColor)',
        color: 'white',
        fontSize: '18px',
        padding: '0px 0px',
    }, 
    '& .MuiDataGrid-footerContainer': {
        borderColor: 'var(--borderColor)',
        borderTop: '3px solid var(--borderColor) !important', 
    },
    '& .MuiDataGrid-row': {
        padding: '0px',
        margin: '0px',
        borderColor: 'var(--borderColor)'
    },
    '& .MuiDataGrid-cell': {
        borderBottom: '1px solid var(--borderColor)',
        fontSize: '12px',
        color: 'darkgray'
    },
    '& .MuiTablePagination-selectLabel': {
        color: '#1976d2 !important',
        margin: '0px'
    },
    '& .MuiTablePagination-selectIcon': {
        color:'black !important'
    },
    '& .MuiTablePagination-displayedRows': {
        color: 'red !important',
        margin: '0px'
    },
    '& .MuiTablePagination-actions > button': {
        color: 'red !important'
    }
};

export default function DataTable({ columns, rows, customCellStyles, setSelectedRows }) {
  const classes = tableRootStyle();
  const customStyles = {...customStyle, ...customCellStyles};
  
  return (
    <Box sx={{ height: '350px',width: '100%'}} >
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}   
        checkboxSelection
        sx={customStyles}
        onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = rows.filter((row) =>
              selectedIDs.has(row.id),
            );
  
            setSelectedRows(selectedRows);
          }}
      />
    </Box>
  );
}
