import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
// components
import Header from "../../components/Header";
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//data 
import useFetch from "../../data/ApiData";
//api
import { REACT_APP_API_HOST_URL, REACT_APP_API_URL } from "../../env";
import axios from "axios";

const CreateVacancy = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Dialog box for create vacancy
    const [open, setOpen] = React.useState(true);
    const [dBoxDepartmnet, setDBoxDepartmnet] = React.useState(null);
    const [dBoxAuditArea, setDBoxAuditArea] = React.useState(null);
    const [dBoxVacancyName, setDBoxVacancyName] = React.useState(null);

    const handleCreateVacancy = () => {
        if (dBoxDepartmnet !== null && dBoxAuditArea !== null && dBoxVacancyName !== null)
        {
            const obj = {
                AreaId: dBoxAuditArea?.AreaId,
                PositionName: dBoxVacancyName
            }  
    
            axios.post(REACT_APP_API_URL +  'position/createPosition' , obj)
                .then(response => {
                console.log(response.data);

                window.confirm(`The position has been created!`);
                setDBoxDepartmnet(null);
                setDBoxAuditArea(null);
                setDBoxVacancyName(null);
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
    const { data: areas } = useFetch(REACT_APP_API_URL + "area/getAreas");

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />

    return(
        <Box margin="20px">
            <Header title="New Position" subtitle="Create a new position."/>
            {/* Create new vacancy */}
            <Box display="flex" justifyContent="start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 4" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Create a New Position</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Create a new position</DialogTitle>
                    <DialogContent>
                        <Box component="form"
                                flexWrap="wrap" 
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>
                            {/* Select department */}
                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                            getOptionLabel={(option) => option.Name}
                                            onChange={(event, newValue) => {setDBoxDepartmnet(newValue)}}
                                            sx={{ gridColumn: "span 2" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Department"/>)}/>     
                                {/* Select area */}
                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setDBoxAuditArea(newValue)}}
                                            options={areas.filter(a => a?.Department?.DepartmentId === dBoxDepartmnet?.DepartmentId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 2", width: "160px" }}
                                            renderInput={(params) => (
                                    <TextField label={dBoxDepartmnet === null ? ("First select a department") : ("Area")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    label="Vacancy name"
                                    onChange={(value) => {setDBoxVacancyName(value.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateVacancy}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>  
        </Box>
    );
}

export default CreateVacancy;