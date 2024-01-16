import { Box, Button, TextField, useMediaQuery, Autocomplete } from "@mui/material";
import * as React from "react";
import { Link } from 'react-router-dom';
//components
import Header from "../../components/Header";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//api
import useFetch from "../../service/getApi";

const Competence = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const [selectedDepartment, setSelectedDepartment] = React.useState(null);
    const [selectedArea, setSelectedArea] = React.useState(null);
    const [selectedEmployee, setSelectedEmployee] = React.useState(null);
    const [selectedAudit, setSelectedAudit] = React.useState(null);

    const { data: departments, loading, depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL +  "area/getAreas");
    const { data: employees, error: empError } = useFetch(REACT_APP_API_URL + "employee/getEmployeeByDepartment/" + selectedDepartment?.DepartmentId);
    const { data: audits, error: auditError } = useFetch(REACT_APP_API_URL + "audit/getAudits");
    const { data: auditInfo, error: auditInfoError} = useFetch(REACT_APP_API_URL +  "audit/GetAuditCompetenceForEmployee/" + `${selectedEmployee?.id}/` + `${selectedAudit?.AuditId}`);

    if(loading) return <Loading />
    if(depError?.length > 0 || areaError.length > 0 || empError.length > 0 || auditError.length > 0 || auditInfoError.length > 0){
        return <Error err={depError + '|' + areaError + '|' + empError + '|' + auditError + '|' + auditInfoError} />
    }
    
    const handleOpenAuditForm = () => {
        localStorage.setItem('completedFormHistoryId', JSON.stringify(auditInfo?.AuditHistoryId));
        console.log(auditInfo?.AuditHistoryId)
    }

    return(
        <Box margin="20px">
            <Header title="Kompetencja Pracownika" subtitle="Sprawdź lub aktualizuj kompetencje pracownika."/>
                        <Box display="grid"
                             gap="30px"
                             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                             sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>
                            
                            {/* Select department */}
                            <Autocomplete freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d?.DepartmentId === user?.Department?.DepartmentId))}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(event, value) => { setSelectedDepartment(value)}}
                                getOptionLabel={(option) => option.Name}                             
                                renderInput={(params) => (
                                <TextField {...params} 
                                            fullWidth
                                            label="Dział"
                                            />)}/>     

                            {/* Select area */}
                            <Autocomplete freeSolo
                                          id="free-solo-2-demo"
                                          disableClearable
                                          onChange={(event, value) => {setSelectedArea(value)}}
                                          options={areas?.filter(a => a?.Department?.DepartmentId === selectedDepartment?.DepartmentId)}
                                          sx={{ gridColumn: "span 2" }}
                                          getOptionLabel={(option) => option.Name}
                                          renderInput={(params) => (
                                <TextField label={selectedDepartment === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                            {...params}
                                            fullWidth
                                           />)}/>
                            {/* Select employee */}
                            <Autocomplete freeSolo
                                          disableClearable
                                          id="free-solo-2-demo"
                                          sx={{ gridColumn: "span 4" }}
                                          options={ employees }
                                          getOptionLabel={(option) => option?.Employee?.FullName}
                                          onChange={(event, value) => {setSelectedEmployee(value)}}
                                          renderInput={(params) => (
                                <TextField {...params} 
                                            fullWidth
                                            label={selectedArea === null ? ("Najpierw wybierz obszar") : ("Pracownik")}
                                            />)}/>
                            {/* Select audit  */}
                            <Autocomplete freeSolo
                                          disableClearable
                                          id="free-solo-2-demo"
                                          sx={{ gridColumn: "span 4" }}
                                          options={ audits.filter(a => a?.Area?.AreaId === selectedArea?.AreaId) }
                                          getOptionLabel={(option) => option?.Name}
                                          onChange={(event, value) => { setSelectedAudit(value)}}
                                          renderInput={(params) => (
                                <TextField {...params} 
                                            fullWidth
                                            label={selectedArea === null ? ("Najpierw wybierz pracownika") : ("Kompetencja")}
                                            />)}/>

                            {/* level */}
                            <TextField  label = {auditInfo.length === 0 ? "Obecny Poziom" : null}
                                        type="text"
                                        value={auditInfo?.CurrentAuditInfo === null ? "" : auditInfo?.CurrentAuditInfo?.Item2}
                                        readOnly
                                        sx={{ gridColumn: "span 2" }}/>
                            
                            {/* date of last audit */}
                            <TextField  label={auditInfo.length === 0 ? "Data ostatniego audytu" : null}
                                        type="text"
                                        value={auditInfo?.CurrentAuditInfo === null ? "" : auditInfo?.CurrentAuditInfo?.Item1}
                                        readOnly
                                        sx={{ gridColumn: "span 2" }}/>

                            {auditInfo.length !== 0 &&
                                <Button color="secondary" sx={{ gridColumn: "span 4" }} onClick={() => handleOpenAuditForm()} >
                                    <Link to={"/audit-form/form"}
                                        target={"_blank"}
                                        style={{ color: "#20c292", fontWeight: '600', textDecoration: 'none' }}>
                                        Otwórz formularz audytu
                                    </Link>
                                </Button>
                            }
                        </Box>
        </Box>
    );
}

export default Competence;