import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';

function CellTooltip( { tooltipTitle, cellValue }) {
  return (
    <Tooltip title={tooltipTitle} >
        <span className="table-cell-trucate" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{cellValue}</span>
    </Tooltip>
  )
}

CellTooltip.propTypes = {
    tooltipTitle: PropTypes.string.isRequired,
    cellValue: PropTypes.string.isRequired
};

export default CellTooltip
