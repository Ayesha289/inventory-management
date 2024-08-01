import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

const CustomAlertWrapper = styled(Alert)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper, // Neutral background color
    color: theme.palette.text.primary, // Neutral text color
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.pxToRem(14),
    boxShadow: theme.shadows[1],
}));

const CustomAlert = ({ message, duration = 3000 }) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (message) {
            setOpen(true);
            const timer = setTimeout(() => {
                setOpen(false);
            }, duration); // Timeout duration

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [message, duration]);

    if (!open) return null;

    return (
        <CustomAlertWrapper>
            {message}
        </CustomAlertWrapper>
    );
};

CustomAlert.propTypes = {
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
};

export default CustomAlert;
