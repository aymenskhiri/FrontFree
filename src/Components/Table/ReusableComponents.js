
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export function SearchField({ value, onChange }) {
    return (
        <TextField
            label="Search"
            variant="outlined"
            value={value}
            onChange={onChange}
            style={{ width: '300px' }}
        />
    );
}

SearchField.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export function ArrowFilter({ order, orderBy, property, onRequestSort }) {
    const isAsc = orderBy === property && order === 'asc';
    return (
        <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => onRequestSort(property)}
        >
            {property}
            <IconButton>
                <ArrowUpwardIcon
                    sx={{ fontSize: '0.75rem', color: 'grey', marginLeft:  '-5px', visibility: isAsc ? 'visible' : 'visible' }}
                />
            </IconButton>
            <IconButton>
                <ArrowDownwardIcon
                    sx={{ fontSize: '0.75rem', color: 'grey', marginLeft: '-20px', visibility: !isAsc ? 'visible' : 'visible' }}
                />
            </IconButton>
        </div>
    );
}

ArrowFilter.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};
