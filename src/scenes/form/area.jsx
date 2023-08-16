import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from 'react';
import Header from "../../components/Header";
import axios from "axios";

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//Autocomplete box
import Autocomplete from '@mui/material/Autocomplete';

//data
import useFetch from "../../data/ApiData";

//api
import { REACT_APP_API_URL } from "../../env";
import { REACT_APP_API_HOST_URL } from "../../env";

//pages
import Loading from "../../components/Loadig";
import Error from "../../components/Error";

const Area = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Dialog box for create vacancy
    const [open, setOpen] = React.useState(true);
    const [department, setDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);

    const handleCreateArea = () => {
        if (department !== null && area !== null && area !== '')
        {
            const obj = {
                DepartmentId: department.DepartmentId,
                AreaName: area
            }  
    
            axios.post(REACT_APP_API_URL +  'area/createArea' , obj)
                .then(response => {
                console.log(response.data);
                setDepartment(null);
                setArea(null);
                window.confirm(`The area has been created!`);
                setOpen(false);
                })
                .catch(error => {
                console.error(error); 
            });
        }
    }
        
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
        setOpen(false);
        }
    };

    const { data: departments, loading, error } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />

    return(
        <Box margin="20px">
            <Header title="New Area" subtitle="Create a new area."/>
            <Box display="flex" justifyContent="start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 4" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Create a new area</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Create a new area</DialogTitle>
                    <DialogContent>
                        <Box component="form"
                                flexWrap="wrap" 
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{"& > div": { gridColumn: isNonMobile ? undefined : "span 4", minWidth: isNonMobile ? "320px" : undefined}}}>
                            {/* Select department */}
                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                            getOptionLabel={(option) => option.Name}
                                            onChange={(event, newValue) => {setDepartment(newValue)}}
                                            sx={{ gridColumn: "span 4" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Department"/>)}/>     
                                
                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    label="Area Name"
                                    onChange={(newValue) => {setArea(newValue.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateArea}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>  
        </Box>
    );
}

export default Area;