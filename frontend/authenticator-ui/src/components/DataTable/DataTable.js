import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { makeStyles } from "@material-ui/core/styles";

const tableRootStyle = makeStyles({
    root: {
        backgroundColor: '#0e2036',
        color: 'white',
        borderRadius: '5px !important',
        borderColor: 'var(--borderColor) !important',
        margin: '0px 5px'
    }
});

const customStyle = {
    '& .MuiDataGrid-toolbarContainer': {
        borderBottom: '1px solid var(--borderColor)',
    },
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
        color: 'rgb(201, 209, 217)'
    },
    '& .MuiTablePagination-selectLabel': {
        color: '#1976d2 !important',
        margin: '0px'
    },
    '& .MuiTablePagination-selectIcon': {
        color:'#1976d2 !important'
    },
    '& .MuiTablePagination-displayedRows': {
        color: '#1976d2 !important',
        margin: '0px'
    },
    '& .MuiTablePagination-actions > button': {
        color: '#1976d2 !important'
    },
    '& .MuiDataGrid-selectedRowCount': {
        color: '#1976d2 !important'
    }
};

/*
    @Props:
        1. height: Height of the Data Grid
        2. columns: Array of Objects which define the Column of the data grid
        3. rows: Array of Objects which correspond to a data row in the Table
        4. customCellStyles: Object which defines the extra style of the Cell or Row
        5. setSelectedRows: Function which will be called when a checkbox against the Row is selected
*/

export default function DataTable({ height, columns, rows, customCellStyles, setSelectedRows }) {
  const classes = tableRootStyle();
  const customStyles = {...customStyle, ...customCellStyles};
  
  return (
    <Box sx={{ height: `${height}`,width: '100%'}} >
      <DataGrid
        className={[classes.root, 'data-mui-color-scheme="dark"']}
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

DataTable.propTypes = {
    height: PropTypes.string,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    customCellStyles: PropTypes.object,
    setSelectedRows: PropTypes.func.isRequired,
}

DataTable.defaultProps = {
    height: '350px',
    columns: [],
    rows: []
}
