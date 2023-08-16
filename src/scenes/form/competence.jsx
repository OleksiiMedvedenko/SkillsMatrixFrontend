import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Autocomplete from "@mui/material/Autocomplete";
import * as React from "react";
import { useEffect } from "react";
//datepicker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//components
import Header from "../../components/Header";
import Error from "../../components/Error";
import Loading from "../../components/Loadig";
//Api
import { REACT_APP_API_URL } from "../../env";
import { REACT_APP_API_HOST_URL } from "../../env";
import useFetch from "../../data/ApiData";
import axios from "axios";
//data 
import { auditsLevels } from "../../data/auditLevelMockData";

const initialValues = {
    image: "",
    employee: "",
    department: "",
    area: "",
    audit: "",
    newLevel: "",
    updateDateOfAudit: "",
    link: "",
}

const initialSchema = yup.object().shape({
    employee: yup.object().required("required"),
    department: yup.object().required("required"),
    area: yup.object().required("required"),
    audit: yup.object().required("required"),
    newLevel: yup.object().required("required"),
    updateDateOfAudit: yup.object().required("required"),
})

const Competence = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(sessionStorage.getItem("user"));

    const [selectedDepartment, setSelectedDepartment] = React.useState(null);
    const [selectedArea, setSelectedArea] = React.useState(null);
    const [selectedEmployee, setSelectedEmployee] = React.useState(null);
    const [selectedAudit, setSelectedAudit] = React.useState(null);

    const [selectedDate, setSelectedDate] = React.useState(null);

    const { data: departments, loading, error } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas } = useFetch(REACT_APP_API_URL +  "area/getAreas");
    const { data: employees } = useFetch(REACT_APP_API_URL + "employee/getEmployeeByDepartment/" + selectedDepartment?.DepartmentId);
    const { data: audits } = useFetch(REACT_APP_API_URL + "audit/getAudits");

    const { data: auditInfo} = useFetch(REACT_APP_API_URL +  "audit/GetAuditCompetenceForEmployee/" + `${selectedEmployee?.id}/` + `${selectedAudit?.AuditId}`);

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />
    
    const handleFormSubmit = (values) => {
        const obj = {
            AuditId: values?.audit?.AuditId,
            EmployeeId: values?.employee?.id,
            LastDate: auditInfo?.CurrentAuditInfo?.Item1 === undefined ? (selectedDate).format('MM/DD/YYYY HH:mm:ss') : auditInfo?.CurrentAuditInfo?.Item1,
            CurrentDate: (selectedDate).format('MM/DD/YYYY HH:mm:ss'),
            LastLevel: auditInfo?.CurrentAuditInfo?.Item2 === undefined ? values?.newLevel?.label : auditInfo?.CurrentAuditInfo?.Item2,
            CurrentLevel: values?.newLevel?.label
        }  
        console.log(obj)
        axios.post(REACT_APP_API_URL +  'audit/updateAuditInfo' , obj)
            .then(response => {
            console.log(response.data);
            window.confirm(`Information about this audit has been updated!`);
            window.location.reload();
            })
            .catch(error => {
            console.error(error); 
        });
    }

    console.log(auditInfo)

    return(
        <Box margin="20px">
            <Header title="Kompetencja Pracownika" subtitle="Sprawdź lub aktualizuj kompetencje pracownika."/>
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={initialSchema}>
                {({values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue}) => (
                    <form onSubmit={handleSubmit}>
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
                                onChange={(event, value) => {setFieldValue("department", value)
                                                             setSelectedDepartment(value)}}
                                getOptionLabel={(option) => option.Name}                             
                                renderInput={(params) => (
                                <TextField {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            label="Department"
                                            error={!!touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                            value={values.department}/>)}/>     

                            {/* Select area */}
                            <Autocomplete freeSolo
                                          id="free-solo-2-demo"
                                          disableClearable
                                          onChange={(event, value) => {setFieldValue("area", value)
                                                                       setSelectedArea(value)}}
                                          options={areas?.filter(a => a?.Department?.DepartmentId === values?.department?.DepartmentId)}
                                          sx={{ gridColumn: "span 2" }}
                                          getOptionLabel={(option) => option.Name}
                                          renderInput={(params) => (
                                <TextField label={selectedDepartment === null ? ("First select a department") : ("Area")}
                                            {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.area && !!errors.area}
                                            helperText={touched.area && errors.area}
                                            value={values.area}/>)}/>
                            {/* Select employee */}
                            <Autocomplete freeSolo
                                          disableClearable
                                          id="free-solo-2-demo"
                                          sx={{ gridColumn: "span 4" }}
                                          options={ employees }
                                          getOptionLabel={(option) => option?.Employee?.FullName}
                                          onChange={(event, value) => {setFieldValue("employee", value)
                                                                        setSelectedEmployee(value)}}
                                          renderInput={(params) => (
                                <TextField {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.employee && !!errors.employee}
                                            helperText={touched.employee && errors.employee}
                                            label={selectedArea === null ? ("First select area") : ("Employee")}
                                            value={values.employee}/>)}/>
                            {/* Select audit  */}
                            <Autocomplete freeSolo
                                          disableClearable
                                          id="free-solo-2-demo"
                                          sx={{ gridColumn: "span 4" }}
                                          options={ audits.filter(a => a?.Area?.AreaId === selectedArea?.AreaId) }
                                          getOptionLabel={(option) => option?.Name}
                                          onChange={(event, value) => {setFieldValue("audit", value)
                                                                        setSelectedAudit(value)}}
                                          renderInput={(params) => (
                                <TextField {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.audit && !!errors.audit}
                                            helperText={touched.audit && errors.audit}
                                            label={selectedArea === null ? ("First select an employee") : ("Competence")}
                                            value={values.audit}/>)}/>

                            {/* level */}
                            <TextField  label = {auditInfo.length === 0 ? "Current Level" : null}
                                        type="text"
                                        value={auditInfo?.CurrentAuditInfo === null ? "" : auditInfo?.CurrentAuditInfo?.Item2}
                                        readOnly
                                        sx={{ gridColumn: "span 2" }}/>
                            
                            {/* date of last audit */}
                            <TextField  label={auditInfo.length === 0 ? "Last audit date" : null}
                                        type="text"
                                        value={auditInfo?.CurrentAuditInfo === null ? "" : auditInfo?.CurrentAuditInfo?.Item1}
                                        readOnly
                                        sx={{ gridColumn: "span 2" }}/>
                            
                            <Header subtitle="Update employee competencies." sx={{ gridColumn: "span 4" }}/>

                            <Autocomplete freeSolo
                                          disableClearable
                                          id="free-solo-2-demo"
                                          sx={{ gridColumn: "span 4" }}
                                          options={ auditsLevels }
                                          onChange={(event, value) => {setFieldValue("newLevel", value)}}
                                          renderInput={(params) => (

                            <TextField {...params} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        fullWidth
                                        error={!!touched.newLevel && !!errors.newLevel}
                                        helperText={touched.newLevel && errors.newLevel}
                                        label={"New Level"}
                                        value={values.newLevel}/>)}/>  

                            {/* date picker*/}
                            <Box sx={{ margin: "-8px 0px 10px 0px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* update date of last audit */}
                                    <DemoContainer fullWidth components={['DatePicker']}>
                                        <DatePicker label="Audit date"
                                        sx={{ gridColumn: "span 2" }}
                                                    onChange={(value) => {setFieldValue("updateDateOfAudit", value)
                                                                            setSelectedDate(value)}}
                                                    renderInput={(params) => <TextField {...params} 
                                                                                        fullWidth
                                                                                        value={values.updateDateOfAudit} 
                                                                                        error={!!touched.updateDateOfAudit && !!errors.updateDateOfAudit}
                                                                                        helperText={touched.updateDateOfAudit && errors.updateDateOfAudit}
                                                                                        onChange={handleChange}
                                                                                        onBlur={handleBlur}/>} />                                       
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Update
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default Competence;