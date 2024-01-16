import { Box, useMediaQuery, FormGroup, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import * as React from "react";
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


const UpdateAudit = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Dialog box for create audit
    const [open, setOpen] = React.useState(true);
    const [department, setDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);
    const [audit, setAudit] = React.useState(null);

    const [auditName, setAuditName] = React.useState(audit?.Name || '');
    const [importance, setImportance] = React.useState(audit?.Importance || '');

    React.useEffect(() => {
        if (audit) {
            setAuditName(audit.Name || '');
            setImportance(audit.Importance || '');
        }
    }, [audit]);

    const { data: result, error: postError, postData: postData} = usePost();
    const { data: departments, loading, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL + "area/getAreas");
    const { data: audits, error: auditError } = useFetch(REACT_APP_API_URL + "audit/getAudits");

    if(loading) return <Loading />
    if(depError?.length > 0 || areaError?.length > 0 || auditError?.length > 0){
        return <Error err={depError + '|' + areaError + '|' + auditError} />
    }

    const handleUpdateAudit = () =>{ 

        const obj = {
            AuditId: audit?.AuditId,
            AuditName: auditName,
            Importance : importance === "" ? null : importance,
        }  

        setDepartment(null);
        setArea(null);

        postData( REACT_APP_API_URL + 'audit/UpdateAuditType', obj);

        setTimeout(window.location.reload(), 300);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    // const inputStyle = department?.DepartmentId !== 5 || department?.DepartmentId !== 6 ? { visibility: 'collapse' } : { visibility: 'visible' };
    const inputStyle = true;

    const initialValues= {
        auditId: audit === null ? "" : audit?.AuditId,
        name: audit === null ? "" : audit?.Name,
        importance: audit === null ? "" : audit?.Importance,
    }

    return(
        <Box margin="20px">
            <Header title="Aktualizuj Kompetencje" subtitle="Aktualizuj Kompetencje."/>
             {/* Update Audit */}
            <Box display="flex" justifyContent="Start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 2" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Aktualizuj Kompetencje</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Aktualizuj Kompetencje</DialogTitle>
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
                                            onChange={(event, newValue) => {setDepartment(newValue)
                                                                            // setArea(null)
                                                                            // setAudit(null)
                                                                            // setAuditName(null)
                                                                            // setImportance(null)
                                                                            // setIsIncludeLink(null)
                                                                        }}
                                            sx={{ gridColumn: "span 4" }}
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
                                            sx={{ gridColumn: "span 4" }}
                                            renderInput={(params) => (
                                    <TextField label={department === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setAudit(newValue)}}
                                            options={audits.filter(a => a?.Area?.AreaId === area?.AreaId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 4"}}
                                            renderInput={(params) => (
                                    <TextField label={department === null ? ("Najpierw wybierz dział") : ("Kompetencje")}
                                                {...params} 
                                                fullWidth/>)}/>



                                    <TextField required
                                        id="outlined-helperText"
                                        label={audit === null ? "Naipierw wybierz kompetencje" : "Nazwa kompetencji"}
                                        type="text"
                                        fullWidth
                                        onChange={(newValue) => {setAuditName(newValue.target.value)}}
                                        value={auditName}
                                        name="name"
                                        sx={{ gridColumn: "span 2" }}/>
                                    
                                    <TextField id="outlined-helperText"
                                            label={audit === null ? "Naipierw wybierz kompetencje" : "Waga kompetencje"}
                                            type="text"
                                            fullWidth
                                            onChange={(newValue) => {setImportance(newValue.target.value)}}
                                            value={importance}
                                            name="importance"
                                            sx={{ gridColumn: "span 2", visibility: inputStyle }}
                                            inputProps={{
                                                pattern: '^[0-9]*[.]?[0-9]*$', // Regular expression to match decimal numbers
                                            }}/>     
                            </Box>
                        </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleUpdateAudit}>Ok</Button>
                        {postError !== null ? <Alerts severity="error" message="Kompetencja NIE  zaktualizowana !"/> : null}
                        {result !== null ? (result ? <Alerts severity="success" message="Kompetencja zaktualizowana !"/> : <Alerts severity="error" message="Kompetencja NIE zaktualizowana !"/> ) : (null)}
                    </DialogActions>
                </Dialog>
            </Box>  

        </Box>
    );
}

export default UpdateAudit;

