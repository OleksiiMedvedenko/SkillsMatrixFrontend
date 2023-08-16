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


const UpdateAudit = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(sessionStorage.getItem("user"));

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Dialog box for create audit
    const [open, setOpen] = React.useState(true);
    const [departmnet, setDepartmnet] = React.useState(null);
    const [area, setArea] = React.useState(null);
    const [audit, setAudit] = React.useState(null);

    const [auditName, setAuditName] = React.useState(audit?.Name || '');
    const [importance, setImportance] = React.useState(audit?.Importance || '');
    const [isIncludeLink, setIsIncludeLink] = React.useState(audit?.IsIncludeLink || false);

    const handleUpdateAudit = () =>{ 

        const obj = {
            AuditId: audit?.AuditId,
            AuditName: auditName,
            Importance : importance === "" ? null : importance,
            IsIncludeLink: isIncludeLink,
        }  
        
        console.log(obj)

        axios.post( REACT_APP_API_URL +  'audit/UpdateAuditType' , obj)
            .then(response => {
            console.log(response.data);
            setDepartmnet(null);
            setArea(null);
            window.confirm(`The audit has been updated !`);
            setOpen(false);
            })
            .catch(error => {
            console.error(error); 
        });
    }

    React.useEffect(() => {
        if (audit) {
          setAuditName(audit.Name || '');
          setImportance(audit.Importance || '');
          setIsIncludeLink(audit.IsIncludeLink || false);
        }
      }, [audit]);

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
    const { data: audits } = useFetch(REACT_APP_API_URL + "audit/getAudits");

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />

    const inputStyle = departmnet?.DepartmentId !== 2 ? { visibility: 'collapse' } : { visibility: 'visible' };

    const initialValues= {
        auditId: audit === null ? "" : audit?.AuditId,
        name: audit === null ? "" : audit?.Name,
        importance: audit === null ? "" : audit?.Importance,
        isIncludeLink: audit === null ? false : audit?.IsIncludeLink
    }

    return(
        <Box margin="20px">
            <Header title="Update Audit" subtitle="Update Audit"/>
             {/* Update Audit */}
            <Box display="flex" justifyContent="Start" marginTop="6px" maxHeight="40px"  sx={{ gridColumn: "span 2" }}>
                <Button onClick={handleClickOpen} color="secondary" variant="contained">Update Audit</Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Update Audit</DialogTitle>
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
                                            onChange={(event, newValue) => {setDepartmnet(newValue)
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
                                                        label="Department"/>)}/>     

                                <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, newValue) => {setArea(newValue)}}
                                            options={areas.filter(a => a?.Department?.DepartmentId === departmnet?.DepartmentId)}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ gridColumn: "span 4" }}
                                            renderInput={(params) => (
                                    <TextField label={departmnet === null ? ("First select a department") : ("Area")}
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
                                    <TextField label={departmnet === null ? ("First select a department") : ("Audit")}
                                                {...params} 
                                                fullWidth/>)}/>



                                    <TextField required
                                        id="outlined-helperText"
                                        label={audit === null ? "First, select an audit" : "Audit name"}
                                        type="text"
                                        fullWidth
                                        onChange={(newValue) => {setAuditName(newValue.target.value)}}
                                        value={auditName}
                                        name="name"
                                        sx={{ gridColumn: "span 2" }}/>
                                    
                                    <TextField id="outlined-helperText"
                                            label={audit === null ? "First, select an audit" : "The importance of competence"}
                                            type="text"
                                            fullWidth
                                            onChange={(newValue) => {setImportance(newValue.target.value)}}
                                            value={importance}
                                            name="importance"
                                            sx={{ gridColumn: "span 2", visibility: inputStyle }}
                                            inputProps={{
                                                pattern: '^[0-9]*[.]?[0-9]*$', // Regular expression to match decimal numbers
                                            }}/>

                                    <FormGroup style={{ gridColumn: "span 2"} }>
                                        <FormControlLabel control={
                                            <Checkbox checked={ isIncludeLink}
                                                        name="isIncludeLink"
                                                        onChange={(event) => {
                                                            const newValue = event.target.checked;
                                                            setIsIncludeLink(newValue);
                                                            }}
                                                        sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] },}}/>} 
                                                        label="Should a competency have a link?" style={{ color: colors.greenAccent[500] }}/>
                                    </FormGroup>              
                            </Box>
                        </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleUpdateAudit}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>  

        </Box>
    );
}

export default UpdateAudit;

