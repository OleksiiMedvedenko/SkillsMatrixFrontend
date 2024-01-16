import { Box, Button, TextField, useMediaQuery, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import * as React from 'react';
//components
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Alerts from "../../components/Alerts";
//api
import useFetch from "../../service/getApi";
import usePost from "../../service/postApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";

const Area = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Dialog box for create vacancy
    const [open, setOpen] = React.useState(true);
    const [department, setDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);

    const { data: result, error: postError, postData: postData} = usePost();
    const { data: departments, loading, error } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />
    
    const handleCreateArea = () => {
        if (department !== null && area !== null && area !== '')
        {
            const obj = {
                DepartmentId: department.DepartmentId,
                AreaName: area
            }  
            setDepartment(null);
            setArea(null);

            postData(REACT_APP_API_URL +  'area/createArea', obj);

            setTimeout(window.location.reload(), 300);
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

    return(
        <Box margin="20px">
            <Header title="Nowy Obszar" subtitle="Utwórz nowy obszar."/>
            <Box display="flex" justifyContent="start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 4" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Utwórz Nowe Stanowisko</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Stworzyć nowe stanowisko</DialogTitle>
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
                                                        label="Dział"/>)}/>     
                                
                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    label="Nazwa obszaru"
                                    onChange={(newValue) => {setArea(newValue.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateArea}>Ok</Button>
                        {postError !== null ? <Alerts severity="error" message="Obszar NIE został utworzony!"/> : null}
                        {result !== null ? (result ? <Alerts severity="success" message="Obszar został utworzony"/> : <Alerts severity="error" message="Obszar NIE został utworzony"/> ) : (null)}
                    </DialogActions>
                </Dialog>
            </Box>  
        </Box>
    );
}

export default Area;