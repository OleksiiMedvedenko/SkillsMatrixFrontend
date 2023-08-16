import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
//components 
import Header from "../../components/Header";
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//data 
import useFetch from "../../data/ApiData";
//api
import { REACT_APP_API_HOST_URL, REACT_APP_API_URL } from "../../env";
import axios from "axios";
//color import 
import { pink } from '@mui/material/colors';
import { SignalWifiStatusbarNullRounded } from "@mui/icons-material";

const CreateAudit = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(sessionStorage.getItem("user"));

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Dialog box for create audit
    const [open, setOpen] = React.useState(true);
    const [departmnet, setDepartmnet] = React.useState(null);
    const [audit, setArea] = React.useState(null);
    const [auditName, setAuditName] = React.useState(null);
    const [importance, setImportance] = React.useState(null);
    const [isIncludeLink, setIsIncludeLink] = React.useState(SignalWifiStatusbarNullRounded);

    const handleCreateAudit = () => {
        if (audit !== null && departmnet !== null && auditName !== null)
        {
            const obj = {
                AreaId: audit?.AreaId,
                AuditName: auditName,
                Importance : importance,
                IsIncludeLink: isIncludeLink !== true ? false : isIncludeLink,
            }  
            
            console.log(obj)

            axios.post(REACT_APP_API_URL +  'audit/CreateAuditType' , obj)
                .then(response => {
                console.log(response.data);
                setDepartmnet(null);
                setArea(null);
                setAuditName(null);
                setIsIncludeLink(null);
                setImportance(null);
                window.confirm(`the audit has been created!'${auditName}'`);
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

    const inputStyle = departmnet?.DepartmentId !== 2 ? { visibility: 'collapse' } : { visibility: 'visible' };
    return(
        <Box margin="20px">
            <Header title="Vacancy name" subtitle="Create a new audit."/>
             {/* Create new Audit */}
            <Box display="flex" justifyContent="Start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 2" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Create New Audit</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Create New Audit</DialogTitle>
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
                                            onChange={(event, newValue) => {setDepartmnet(newValue)}}
                                            sx={{ gridColumn: "span 2" }}
                                            renderInput={(params) => (
                                            <TextField {...params} 
                                                        fullWidth
                                                        label="Department"/>)}/>     

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setArea(newValue)}}
                                            options={areas.filter(a => a?.Department?.DepartmentId === departmnet?.DepartmentId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 2", width: "160px" }}
                                            renderInput={(params) => (
                                    <TextField label={departmnet === null ? ("First select a department") : ("Area")}
                                                {...params} 
                                                fullWidth/>)}/>

                                <TextField required
                                    id="outlined-required"
                                    type="text"
                                    label="Audit name"
                                    onChange={(newValue) => {setAuditName(newValue.target.value)}}
                                    sx={{ gridColumn: "span 4" }}/>
                                
                                <TextField
                                    id="outlined-helperText"
                                    type="text"
                                    label="Position weight"
                                    onChange={(newValue) => {setImportance(newValue.target.value)}}
                                    sx={{ gridColumn: 'span 4', visibility: inputStyle }}
                                    inputProps={{
                                        pattern: '^[0-9]*[.]?[0-9]*$', // Regular expression to match decimal numbers
                                      }}/>

                                <FormGroup style={{ gridColumn: "span 4"} }>
                                    <FormControlLabel control={<Checkbox value={isIncludeLink || null} 
                                                                         onChange={(event, newValue) => {setIsIncludeLink(newValue)}} 
                                                                         sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] },}}/>} 
                                                      label="Should a competency have a link?" style={{ color: colors.greenAccent[500] }}/>
                                </FormGroup>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleCreateAudit}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>  

        </Box>
    );
}

export default CreateAudit;

