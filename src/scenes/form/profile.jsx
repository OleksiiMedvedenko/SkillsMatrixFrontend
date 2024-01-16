import { Box, Button, TextField, useMediaQuery, Autocomplete } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
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
import { REACT_APP_API_HOST_URL, REACT_APP_API_URL } from "../../env";

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
    area: yup.array().required("required"),
    department: yup.object().required("required"),
    vacancy: yup.object().required("required"),
})

const Profile = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)"); // responsive
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const [department, setDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);

    // post Data
    const { data: result, error: postError, postData: postData} = usePost();
    //fetch data 
    const { data: departments, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL +  "area/getAreas");
    const { data: supervisors, error: supError } = useFetch(REACT_APP_API_URL +  "employee/getEmployeeByDepartment/" + department?.DepartmentId);
    const { data: vacancys, loading, vacError} = useFetch(REACT_APP_API_URL +  "Position/getPositions");

    if(loading) return <Loading />
    if(depError?.length > 0 || areaError?.length > 0 || supError?.length > 0 || vacError?.length > 0){
        return <Error err={depError + '|' + areaError + '|' + supError + '|' + vacError} />
    } 

    const handleFormSubmit = (values) => {

        const areasID = values.area.map((obj) => obj.AreaId);
        const obj = {
            FirstName: values.firstName,
            LastName: values.lastName,
            Login: values.login,
            AreasId: areasID,
            DepartmentId: values.department.DepartmentId,
            PositionId: values.vacancy.PositionId,
            SupervisorId: values.supervisor.id
        }  

        console.log(obj)
        postData(REACT_APP_API_URL +  'employee/createEmployee', obj);

        setTimeout(window.location.reload(), 300);
    }

    // Select two or more AreaIds (departments)
    const selectedAreaIds = area?.map((obj) => obj.AreaId) // You can modify this array with the AreaIds you want to filter
    // Create an object to store positions in selected areas
    const positionsInSelectedAreas = {};

    // Filter positions that are in all selected areas
    const filteredPositions = vacancys?.filter((position) => {
        if (selectedAreaIds?.includes(position.AreaId)) {
            // This position is in one of the selected areas
            if (!positionsInSelectedAreas[position?.Name]) {
                positionsInSelectedAreas[position?.Name] = 1;
            } else {
                positionsInSelectedAreas[position?.Name]++;
            }
        }

        return positionsInSelectedAreas[position?.Name] === selectedAreaIds?.length;
    });

console.log("Positions in all selected areas:");
console.log(filteredPositions);

    return(
        <Box margin="20px">
            <Header title="Dodaj pracownika" subtitle="Utworz nowy profil pracownika"/>
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
                                       label="Imię"
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
                                       label="Nazwisko"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.lastName}
                                       name="lastName"
                                       error={!!touched.lastName && !!errors.lastName}
                                       helperText={touched.lastName && errors.lastName}
                                       sx={{ gridColumn: "span 2" }}/>

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
                                            label="Dział"
                                            error={!!touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                            value={values.department}/>)}/>   

                            {/* Enter area */}
                            <Autocomplete
                                  multiple
                                  options={areas?.filter(a => a?.Department?.DepartmentId === values?.department?.DepartmentId)}
                                  getOptionLabel={option => option.Name}
                                  value={values.area || []}
                                  sx={{ gridColumn: "span 2" }}
                                  onChange={(_, selectedOptions) => {
                                    setFieldValue('area', selectedOptions)
                                    setArea(selectedOptions);
                                  }}
                                  renderInput={params => (
                                    <TextField {...params} label={ department === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                                            onChange={handleChange} 
                                                            onBlur={handleBlur}
                                                            fullWidth
                                                            error={!!touched.area && !!errors.area}
                                                            helperText={touched.area && errors.area}
                                                            value={values.area || []}/>)}/>

                            {/*select vacancy */}
                            <Autocomplete onChange={(event, newValue) => {setFieldValue("vacancy", newValue)}}
                                          options={ filteredPositions}
                                          getOptionLabel={(option) => option.Name}
                                          sx={{ gridColumn: "span 4"}}
                                          renderInput={(params) => (
                                            <TextField label={ area === null ? ("Najpierw wybierz obszar") : ("Stanowisko")}
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
                                                        label={values?.department === null ? ("Najpierw wybierz dział") : ("Przełożony")}
                                                        value={values.supervisor}/>)}/>

                             {/* Login */}
                             <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Konto domenowe - te pole nie jest wymagane."
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.login}
                                       name="login"
                                       error={!!touched.login && !!errors.login}
                                       helperText={touched.login && errors.login}
                                       sx={{ gridColumn: "span 4" }}/>
                        </Box>
                        <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Dodaj pracownika
                                {postError !== null ? <Alerts severity="error" message="Pracownik NIE został stworzony!"/> : null}
                                {result !== null ? (result ? <Alerts severity="success" message="Pracownik został stworzony!"/> : <Alerts severity="error" message="Pracownik NIE został stworzony!"/> ) : (null)}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default Profile;
