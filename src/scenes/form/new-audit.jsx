import { Box, FormGroup, FormControlLabel, Checkbox, Button, TextField, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import { tokens } from "../../theme";
import * as React from "react";
//components 
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Alerts from "../../components/Alerts";
//api
import usePost from "../../service/postApi"; 
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";

const CreateAudit = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Dialog box for create audit
    const [open, setOpen] = React.useState(true);
    const [department, setDepartment] = React.useState(null);
    const [audit, setArea] = React.useState(null);
    const [auditName, setAuditName] = React.useState(null);
    const [importance, setImportance] = React.useState(null);

    const { data: result, error: postError, postData: postData} = usePost();
    const { data: departments, loading, depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL + "area/getAreas");

    if(loading) return <Loading />
    if(depError?.length > 0 || areaError?.length > 0) return <Error err={depError + '|' + areaError} />

    const handleCreateAudit = () => {
        if (audit !== null && department !== null && auditName !== null)
        {
            const obj = {
                AreaId: audit?.AreaId,
                AuditName: auditName,
                Importance : importance
            }  

            postData(REACT_APP_API_URL +  'audit/CreateAuditType', obj);

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

    // const inputStyle = department?.DepartmentId !== 5 ? { visibility: 'collapse' } : { visibility: 'visible' };
    const inputStyle = true;
    return(
        <Box margin="20px">
            <Header title="Nowy Audyt" subtitle="Utwórz nowy audyt."/>
             {/* Create new Audit */}
            <Box display="flex" justifyContent="Start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 2" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Utwórz Nowy Audyt</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Utwórz Nową Kompetencje</DialogTitle>
                    <DialogContent>
                        <Box component="form"
                                flexWrap="wrap" 
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                            getOptionLabel={(option) => option.Name}
                                            onChange={(event, newValue) => {setDepartment(newValue)}}
                                            sx={{ gridColumn: "span 2" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Dział"/>)}/>     

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setArea(newValue)}}
                                            options={areas.filter(a => a?.Department?.DepartmentId === department?.DepartmentId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 2", width: "160px" }}
                                            renderInput={(params) => (
                                    <TextField label={department === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    label="Nazwa Kompetencji"
                                    onChange={(newValue) => {setAuditName(newValue.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                                
                                <TextField
                                    id="outlined-helperText"
                                    type="text"
                                    label="Waga Kompetencji"
                                    onChange={(newValue) => {setImportance(newValue.target.value)}}
                                    sx={{ gridColumn: 'span 4', visibility: inputStyle }}
                                    inputProps={{
                                        pattern: '^[0-9]*[.]?[0-9]*$', // Regular expression to match decimal numbers
                                      }}/>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateAudit}>Ok</Button>
                        {postError !== null ? <Alerts severity="error" message="Audyt NIE został utworzony!"/> : null}
                        {result !== null ? (result ? <Alerts severity="success" message="Audyt został utworzony!"/> : <Alerts severity="error" message="Audyt NIE został utworzony!"/> ) : (null)}
                    </DialogActions>
                </Dialog>
            </Box>  

        </Box>
    );
}

export default CreateAudit;

