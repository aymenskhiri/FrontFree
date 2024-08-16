import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({ row, columns, onUpdate, onDelete, renderAdditionalDetails, icons }) {
  const [open, setOpen] = React.useState(false);

  const {
    CollapseIcon = KeyboardArrowDownIcon,
    ExpandIcon = KeyboardArrowUpIcon,
    UpdateIcon = null,
    DeleteIcon = null
  } = icons || {};

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ExpandIcon /> : <CollapseIcon />}
          </IconButton>
        </TableCell>
        {columns.map((column) => (
          <TableCell key={column.field} align={column.align}>
            {column.render ? column.render(row[column.field], row) : row[column.field]}
          </TableCell>
        ))}
        {onUpdate && onDelete && (
          <TableCell>
            {UpdateIcon && (
              <IconButton color="primary" onClick={() => onUpdate(row)}>
                <UpdateIcon />
              </IconButton>
            )}
            {DeleteIcon && (
              <IconButton color="secondary" onClick={() => onDelete(row.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      {renderAdditionalDetails && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                   Details
                </Typography>
                <Table size="small" aria-label="details">
                  <TableBody>
                    {renderAdditionalDetails(row)}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  renderAdditionalDetails: PropTypes.func,
  icons: PropTypes.shape({
    CollapseIcon: PropTypes.elementType,
    ExpandIcon: PropTypes.elementType,
    UpdateIcon: PropTypes.elementType,
    DeleteIcon: PropTypes.elementType,
  }),
};

export default function DynamicTable({ columns, data, title, onUpdate, onDelete, renderAdditionalDetails, icons }) {
  return (
    <div>
     <div style={{ textAlign: 'center' }}>{title && <h2>{title}</h2>}</div>
     <br/><br/>
     <Box sx={{ marginLeft: 3, marginRight: 3 }}>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <Row
                key={index}
                row={row}
                columns={columns}
                onUpdate={onUpdate}
                onDelete={onDelete}
                renderAdditionalDetails={renderAdditionalDetails}
                icons={icons}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </div>
  );
}

DynamicTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  renderAdditionalDetails: PropTypes.func,
  icons: PropTypes.shape({
    CollapseIcon: PropTypes.elementType,
    ExpandIcon: PropTypes.elementType,
    UpdateIcon: PropTypes.elementType,
    DeleteIcon: PropTypes.elementType,
    
  }),
};
