import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, Autocomplete } from "@mui/material";
import * as React from 'react'; 
// components
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Alerts from "../../components/Alerts";
//api 
import useFetch from "../../service/getApi";
import usePost from "../../service/postApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";

const CreateVacancy = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Dialog box for create vacancy
    const [open, setOpen] = React.useState(true);
    const [dBoxDepartment, setDBoxDepartment] = React.useState(null);
    const [dBoxAuditArea, setDBoxAuditArea] = React.useState(null);
    const [dBoxVacancyName, setDBoxVacancyName] = React.useState(null);

    const { data: result,error: postError, postData: postData} = usePost();
    const { data: departments, loading, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL + "area/getAreas");

    if(loading) return <Loading />
    if(depError.length > 0 || areaError.length > 0) return <Error err={depError + '|' + areaError} />

    const handleCreateVacancy = () => {
        if (dBoxDepartment !== null && dBoxAuditArea !== null && dBoxVacancyName !== null)
        {
            const obj = {
                AreaId: dBoxAuditArea?.AreaId,
                PositionName: dBoxVacancyName
            }  
            setDBoxDepartment('');
            setDBoxAuditArea('');
            setDBoxVacancyName('');

            postData(REACT_APP_API_URL +  'position/createPosition', obj);

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
            <Header title="Nowe Stanowisko" subtitle="Utwórz nowe stanowisko."/>
            {/* Create new vacancy */}
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
                                sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>
                            {/* Select department */}
                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                            getOptionLabel={(option) => option.Name}
                                            onChange={(event, newValue) => {setDBoxDepartment(newValue)}}
                                            sx={{ gridColumn: "span 2" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Dział"/>)}/>     
                                {/* Select area */}
                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setDBoxAuditArea(newValue)}}
                                            options={areas.filter(a => a?.Department?.DepartmentId === dBoxDepartment?.DepartmentId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 2", width: "270px" }}
                                            renderInput={(params) => (
                                    <TextField label={dBoxDepartment === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    width="250px"
                                    label="Nazwa stanowiska " // dla produkcji  Kompetencja stanowiskowa
                                    onChange={(value) => {setDBoxVacancyName(value.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateVacancy}>Ok</Button>
                        {postError !== null ? <Alerts severity="error" message="Stanowisko NIE został utworzone!"/> : null}
                        {result !== null ? (result ? <Alerts severity="success" message="Stanowisko zostało utworzone"/> : <Alerts severity="error" message="Stanowisko NIE został utworzone!"/> ) : (null)}
                    </DialogActions>
                </Dialog>
            </Box>  
        </Box>
    );
}

export default CreateVacancy;