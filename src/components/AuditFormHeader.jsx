import { Box, TextField, useMediaQuery } from "@mui/material";
import * as React from 'react';
//components
import Header from "./Header";

const AuditFormHeader = ({ formData, setFormData }) => {
    const isNonMobile = useMediaQuery("(min-width:600px)"); // responsive

    const handleUniqueIdentifierChange = (event) => {
        // Update the formData with the new value
        setFormData({
          ...formData,
          uniqueIdentifier: event.target.value,
        });
    };
    
    const handleDraftedChange = (event) => {
    // Update the formData with the new value
    setFormData({
        ...formData,
        drafted: event.target.value,
    });
    };

    const handleCheckedChange = (event) => {
    // Update the formData with the new value
    setFormData({
        ...formData,
        checked: event.target.value,
    });
    };

    const handleApprovedChange = (event) => {
    // Update the formData with the new value
    setFormData({
        ...formData,
        approved: event.target.value,
    });
    };

    return (
        <Box margin="20px">
            <Header subtitle="Nagłówek formularza"/>
            <Box display="grid"
                    gap="25px"
                    gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                    sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 3"}}}>
                {/* Unique Identifier TextField */}
                <TextField fullWidth
                    variant="outlined"
                    type="text"
                    label="Unikatowy numer formularza"
                    onChange={handleUniqueIdentifierChange} // Update the data on change
                    value={formData.uniqueIdentifier}
                    name="uniqueIdentifier"
                    sx={{ gridColumn: "span 3" }}/>

                {/* Drafted TextField */}
                <TextField fullWidth
                    variant="outlined"
                    type="text"
                    label="Sporządzony"
                    onChange={handleDraftedChange} // Update the data on change
                    value={formData.drafted}
                    name="drafted"
                    sx={{ gridColumn: "span 1" }}/>

                {/* Checked TextField */}
                <TextField fullWidth
                    variant="outlined"
                    type="text"
                    label="Sprawdzający"
                    onChange={handleCheckedChange} // Update the data on change
                    value={formData.checked}
                    name="checked"
                    sx={{ gridColumn: "span 1" }}/>

                {/* Approved TextField */}
                <TextField fullWidth
                    variant="outlined"
                    type="text"
                    label="Zatwierdził"
                    onChange={handleApprovedChange} // Update the data on change
                    value={formData.approved}
                    name="approved"
                    sx={{ gridColumn: "span 1" }}/>
            </Box>
        </Box>
    );
};

export default AuditFormHeader;
