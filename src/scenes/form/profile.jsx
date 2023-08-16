import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Header from "../../components/Header";

//
import axios from "axios";
//pages
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//data
import useFetch from "../../data/ApiData";
//api 
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from "../../env";

const initialValues = {
    firstName: "",
    lastName: "",
    login: "",
    area: "",
    department: "",
    vacancy: "",
    supervisor: "",
}

const createSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    area: yup.object().required("required"),
    department: yup.object().required("required"),
    vacancy: yup.object().required("required"),
})

const Profile = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)"); // responsive
    const user = JSON.parse(sessionStorage.getItem("user"));

    const [department, setDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);

    //fetch data 
    const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas } = useFetch(REACT_APP_API_URL +  "area/getAreas");
    const { data: supervisors } = useFetch(REACT_APP_API_URL +  "employee/getEmployeeByDepartment/" + department?.DepartmentId);
    const { data: vacancys, loading, error} = useFetch(REACT_APP_API_URL +  "Position/getPositions");

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />

    const handleFormSubmit = (values) => {

        const obj = {
            FirstName: values.firstName,
            LastName: values.lastName,
            Login: values.login,
            AreaId: values.area.AreaId,
            DepartmentId: values.department.DepartmentId,
            PositionId: values.vacancy.PositionId,
            SupervisorId: values.supervisor.id
        }  

        axios.post(REACT_APP_API_URL +  'employee/createEmployee' , obj)
            .then(response => {
            window.confirm(`The employee was created!`);
            })
            .catch(error => {
            console.error(error); 
        });
    }

    return(
        <Box margin="20px">
            <Header title="Add employee" subtitle="Create a new employee profile"/>
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={createSchema}>
                {({values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue}) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="grid"
                             gap="30px"
                             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                             sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>
                            {/* enter name */}
                            <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Name"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.firstName}
                                       name="firstName"
                                       error={!!touched.firstName && !!errors.firstName}
                                       helperText={touched.firstName && errors.firstName}
                                       sx={{ gridColumn: "span 2" }}/>

                            {/* enter last Name */}
                            <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Last name"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.lastName}
                                       name="lastName"
                                       error={!!touched.lastName && !!errors.lastName}
                                       helperText={touched.lastName && errors.lastName}
                                       sx={{ gridColumn: "span 2" }}/>
                                       
                            {/* Login */}
                            <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Login"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.login}
                                       name="login"
                                       error={!!touched.login && !!errors.login}
                                       helperText={touched.login && errors.login}
                                       sx={{ gridColumn: "span 4" }}/>

                            {/* Enter Department */}
                            <Autocomplete 
                                options={ user?.Permission?.Name === "Admin" ? (departments) : (departments.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(event, newValue) => {setFieldValue("department", newValue)
                                                                setDepartment(newValue)}}
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

                            {/* Enter area */}
                            <Autocomplete onChange={(event, value) => {setFieldValue("area" ,value)
                                                                       setArea(value)}}
                                          options={areas?.filter(a => a?.Department?.DepartmentId === values?.department?.DepartmentId)}
                                          sx={{ gridColumn: "span 2" }}
                                          getOptionLabel={(option) => option.Name}
                                          renderInput={(params) => (
                                <TextField label={ department === null ? ("Firstly select a department") : ("Area")}
                                            {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.area && !!errors.area}
                                            helperText={touched.area && errors.area}
                                            value={values.area}/>)}/>

                            {/*select vacancy */}
                            <Autocomplete onChange={(event, newValue) => {setFieldValue("vacancy", newValue)}}
                                          options={ vacancys.filter(v => v?.AreaId === values?.area?.AreaId)}
                                          getOptionLabel={(option) => option.Name}
                                          sx={{ gridColumn: "span 4"}}
                                          renderInput={(params) => (
                                            <TextField label={ area === null ? ("Firstly select area") : ("Position")}
                                            {...params}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.vacancy && !!errors.vacancy}
                                            helperText={touched.vacancy && errors.vacancy}
                                            value={values.vacancy}/>
                                          )}/>
                            
                            {/* Enter Supervisor */}
                            <Autocomplete sx={{ gridColumn: "span 4" }}
                                          options={ supervisors } // .filter(s => s.department === selectedDepartment)
                                          onChange={(event, value) => {setFieldValue("supervisor", value)}}
                                          getOptionLabel={(option) => option?.Employee?.FullName}
                                          renderInput={(params) => (
                                            <TextField {...params} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!touched.supervisor && !!errors.supervisor}
                                                        helperText={touched.supervisor && errors.supervisor}
                                                        label={values?.department === null ? ("NFirstly select a department") : ("Supervisor")}
                                                        value={values.supervisor}/>)}/>
                        </Box>
                        <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Create a new employee
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default Profile;
