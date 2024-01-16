import * as React from "react";
//materia ui Lib
import { Box, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, Button, TextField } from "@mui/material";
//components
import Header from "../../components/Header";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import Alerts from "../../components/Alerts";
//endpoint
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from "../../env";
//api
import usePost from "../../service/postApi";
import useFetch from "../../service/getApi";
//colors
import { tokens } from "../../theme";

const UpdatePersonalPurpose = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const [open, setOpen] = React.useState(true); // dialog box state check button
    const [department, setDepartment] = React.useState(null);
    const [selectAudit, setSelectAudit] = React.useState(null);
    const [purpose, setPurpose] = React.useState('');

    const { data: result, error: postError, postData: postData} = usePost();

    const { data: departments, loading, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: auditsWithPurpose, error: auditsWithPurposeError } = useFetch(REACT_APP_API_URL + "PersonalPurpose/getDepartmentAuditsWithPurpose/" + department?.DepartmentId);

    React.useEffect(() => {
        if (selectAudit) {
            setPurpose(selectAudit.Purpose || '');
        }
    }, [selectAudit]);

    if(loading) return <Loading />
    if(depError?.length > 0 || auditsWithPurposeError?.length > 0){
        return <Error err={depError + '|' + auditsWithPurposeError} />
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const handleUpdatePurpose = () => {
        const obj = {
            AuditId: selectAudit?.Audit?.AuditId,
            Purpose: purpose,
            DepartmentId: department?.DepartmentId,
        }  

        setDepartment(null);
        setSelectAudit(null);
        setPurpose(null);

        postData( REACT_APP_API_URL + 'PersonalPurpose/UpdateCreatePersonalPurpose', obj);

        setTimeout(window.location.reload(), 300);
    }

    console.log(auditsWithPurpose)

    return (
        <Box sx={{ margin: "20px"}}>
            <Header title="Cel Osobowy" subtitle="Edytuj lub Stwórz nowy cel osobowy"/>
            <Box display="flex" justifyContent="Start" marginTop="6px" 
                 maxHeight="40px"  
                 sx={{ gridColumn: "span 2" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Edytuj/Stwórz Nowy Cel Ssobowy</Button>  
                <Box>
                    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                        <DialogTitle>Edytuj lub Stwórz nowy cel osobowy</DialogTitle>
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
                                            sx={{ gridColumn: "span 4" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Dział"/>)}/>

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setSelectAudit(newValue)}}
                                            options={auditsWithPurpose}
                                            getOptionLabel={(option) => option?.Audit?.Name}
                                            sx={{ gridColumn: "span 4" }}
                                            renderInput={(params) => (
                                    <TextField label={department === null ? ("Najpierw wybierz dział") : ("Audit")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <TextField
                                    required
                                    id="outlined-helperText"
                                    label={selectAudit?.Purpose === null ? "Najpierw wybierz audyt" : "Cel Osobowy"}
                                    type="text"
                                    fullWidth
                                    onChange={(event) => setPurpose(event.target.value)}
                                    value={purpose}
                                    name="purpose"
                                    sx={{ gridColumn: "span 2" }}/>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={handleClose}>Cancel</Button>
                            <Button color="secondary" onClick={handleUpdatePurpose}>Ok</Button>
                            {postError !== null ? <Alerts severity="error" message="Cel NIE Osobowy został zmieniony !"/> : null}
                            {result !== null ? (result ? <Alerts severity="success" message="Cel Osobowy został zmieniony !"/> : <Alerts severity="error" message="Cel NIE Osobowy został zmieniony !"/> ) : (null)}
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}

export default UpdatePersonalPurpose;
