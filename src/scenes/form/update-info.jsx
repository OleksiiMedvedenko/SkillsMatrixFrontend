import { Box, Button, TextField, useMediaQuery, Autocomplete, CircularProgress } from "@mui/material";
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
import usePut from "../../service/putApi";
//endpoint 
import { REACT_APP_API_HOST_URL, REACT_APP_API_URL } from "../../env";

const updateSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    department: yup.object().required("required"),
    area: yup.array().required("required"),
    vacancy: yup.object().required("required"),
    supervisor: yup.object().required("required")
})

function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

const UpdateInfo = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const [selectedEmployee, setEmployee] = React.useState(null); 
    const [selectedDepartment, setSelectedDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);

    //async autocomplete select employee
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loadingBox = open && options.length === 0;

    const [department, setDepartment] = React.useState(null);

    React.useEffect(() => {
        let active = true;
    
        if (!loadingBox) {
          return undefined;
        }
    
        (async () => {
          await sleep(1e3);
    
          if (active) {
            setOptions([...employees]);
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loadingBox]);
    
      React.useEffect(() => {
        if (!open) {
          setOptions([]);
        }
      }, [open]);

      React.useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
      }, []);

      const { data: activateResult, error: activatePostError, putData: activatePutData} = usePut();
      const { data: deactivateResult, error: deactivatePostError, putData: deactivatePutData} = usePut();

      const { data: result, error: postUpdateInfoError, postData: postData} = usePost();
      const { data: departments, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
      const { data: employee, error: empError } = useFetch(REACT_APP_API_URL + "employee/GetEmployee/" + selectedEmployee?.id);
      const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL +  "area/getAreas");
      const { data: employees, error: emError } = useFetch(REACT_APP_API_URL +  "employee/getEmployeeByDepartment/" + department);
      const { data: permissions, error: permissionError } = useFetch(REACT_APP_API_URL +  "permission/getPermissions");
      const { data: vacancys, loading, error: vacError} = useFetch(REACT_APP_API_URL +  "Position/getPositions");
      
      if(loading) return <Loading />
      if(depError?.length > 0 ||empError?.length > 0 ||areaError?.length > 0 ||permissionError?.length > 0 || vacError?.length > 0 ) 
      {
        return <Error err={depError + '|' + empError + '|' + areaError + '|' + permissionError + '|' + vacError}/>
      }

      const handleFormSubmit = (values) => {
        const areasID = values.area.map((obj) => obj.AreaId);
        const obj = {
          Id: values.id,
          FirstName: values.firstName,
          LastName: values.lastName,
          Login: values.login,
          DepartmentId: values.department.DepartmentId,
          AreasId: areasID,
          SupervisorId: values?.supervisor?.SupervisorId,
          PositionId: values.vacancy.PositionId,
          PositionName: values.vacancy.Name,
          PermissionId: values?.permission?.PermissionId
        }

        console.log(values)

        postData(REACT_APP_API_URL + 'employee/updateEmployee', obj); // !!!!!!!!!change to real api 

        console.log(obj)
        // setTimeout(window.location.reload(), 300);
      }
  
      const handleActivateOrInactivateEmployee = () => {

        const employeeId = employee?.id;
        if(employee?.Employee?.IsActive === true)
        {
          activatePutData(REACT_APP_API_URL +  `employee/deactivateEmployee`, employeeId)
        }
        else if(employee?.Employee?.IsActive === false) {
          deactivatePutData(REACT_APP_API_URL + `employee/activateEmployee` ,employeeId)
        }

        window.location.reload();
      }

    return(
        <Box margin="20px">
            <Header title="Aktualizacja danych pracownika" subtitle="Aktualizuj lub usuń profil pracownika."/>

            <Box display="flex" justifyContent="space-between">
              <Autocomplete id="asynchronous-demo"
                          fullWidth
                          sx={{ width: "70%", marginBottom: "20px"}}
                          open={open}
                          onOpen={() => {
                              setOpen(true);
                          }}
                          onClose={() => {
                              setOpen(false);
                          }}
                          isOptionEqualToValue={(option, value) => option === value}
                          getOptionLabel={(option) => option?.Employee?.FullName}
                          onChange={(event, newValue) => {setEmployee(newValue)}}
                          options={options}
                          loading={loadingBox}
                          renderInput={(params) => (
                              <TextField
                              fullWidth
                              {...params}
                              label="Wybierz pracownika"
                              InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                  <React.Fragment>
                                      {loadingBox ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                  </React.Fragment>
                                  ),}}/>)}/>

              <Box display="flex" justifyContent="space-between" mb="20px">
                  {/* diaog box for add employee to area */}
                  <Button sx={{ marginLeft: "20px"}} type="submit" color={employee?.Employee?.IsActive ? "error" : "secondary"} variant="outlined" disabled={employee.length === 0 ? true : false} onClick={handleActivateOrInactivateEmployee}>
                    { employee.length === 0 ? ("Aktywować/Dezaktywować") 
                      : (employee?.Employee?.IsActive ? ("Dezaktywować") : ("Aktywować")) }
                  </Button>
              </Box>
            </Box>
            <Header subtitle="Dane pracownika"/>

            <Formik onSubmit={handleFormSubmit} 
                    enableReinitialize={true}
                    validationSchema={updateSchema}
                    initialValues={{
                      id: employee === null ? "" : employee?.id,
                      login: employee === null ? "" : (employee?.Employee?.Login === null ? null : employee?.Employee?.Login), // null => "Konto domeny nie zostało wprowadzone"
                      firstName: employee === null ? "" : employee?.Employee?.FirstName,
                      lastName: employee === null ? "" : employee?.Employee?.LastName,
                      department: employee === null ? "" : employee?.Department,
                      area: employee === null ? "" : employee?.Areas,
                      vacancy: employee === null ? "" : employee?.Position,
                      supervisor: employee === null ? null : employee?.Supervisor,
                      permission: employee === null ? "" : employee?.Permission,
                      isActive: employee === null ? false : employee?.Employee?.IsActive,
                    }}>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="grid"
                             gap="30px"
                             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                             sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>

                            {/* employee name */}
                          <TextField id="outlined-helperText"
                                    label={employee === null ? "Naipierw wybierz pracownika" : "Imię"}
                                    fullWidth
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName || ''}
                                    name="firstName"
                                    error={!!touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}/>

                          {/* LastName */}
                          <TextField id="outlined-helperText"
                                      label={employee === null ? "Naipierw wybierz pracownika" : "Nazwisko"}
                                      fullWidth
                                      type="text"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.lastName || ''}
                                      name="lastName"
                                      error={!!touched.lastName && !!errors.lastName}
                                      helperText={touched.lastName && errors.lastName}
                                      sx={{ gridColumn: "span 2" }}/>

                          {/* department */}
                          <Autocomplete 
                                options={ user?.Permission?.Name === "Admin" ? (departments) : (departments?.filter(d => d.DepartmentId === user?.Department?.DepartmentId))}
                                sx={{ gridColumn: "span 2" }}
                                onChange={(event, newValue) => {setFieldValue("department", newValue)
                                                                setSelectedDepartment(newValue)}}
                                getOptionLabel={(option) => option?.Name}
                                value={values?.department || null}
                                renderInput={(params) => (
                                <TextField label={ employee === null || employee === undefined ? ("Najpierw wybierz pracownika") : ("Dział")} 
                                            {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                            value={values.department || null}/>)}/>  

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
                          <Autocomplete onChange={(event, newValue) => {
                                          setFieldValue('vacancy', newValue);
                                        }}
                                        options={vacancys.filter(v => v?.AreaId === (values?.area?.[0]?.AreaId ?? null))}
                                        value={values?.vacancy || null}
                                        getOptionLabel={option => option.Name}
                                        sx={{ gridColumn: 'span 4' }}
                                        renderInput={params => (
                                          <TextField
                                            label={area === null ? 'Najpierw wybierz obszar' : 'Stanowisko'}
                                            {...params}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.vacancy && !!errors.vacancy}
                                            helperText={touched.vacancy && errors.vacancy}
                                            value={values?.vacancy || null}
                                          />
                                        )}
                                      />
                          {/* Supervisor */}
                          <Autocomplete sx={{ gridColumn: "span 4" }}
                                          options={ employees } 
                                          onChange={(event, value) => {
                                            console.log("Selected Supervisor:", value); // Add this line
                                            setFieldValue("supervisor", value);
                                          }}
                                          value={values?.supervisor || null}
                                          getOptionLabel={(option) => option?.FullName ?? option?.Employee?.FullName}
                                          renderInput={(params) => (
                                            <TextField {...params} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!touched.supervisor && !!errors.supervisor}
                                                        helperText={touched.supervisor && errors.supervisor}
                                                        label={values?.department === null ? ("Najpierw wybierz dział") : ("Przełożony")}
                                                        value={values?.supervisor || null}/>)}/>
                          
                          {/* employee login */}
                          <TextField id="outlined-helperText"
                                  label={employee === null ? "Naipierw wybierz pracownika" : "Konto domenowe"}
                                  fullWidth
                                  type="text"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.login || ''}
                                  name="login"
                                  error={!!touched.login && !!errors.login}
                                  helperText={touched.login && errors.login}
                                  sx={{ gridColumn: "span 4" }}/>
                                              
                          {/* Permission */}
                          { user?.Permission?.Name === "Admin" && (
                              <Autocomplete sx={{ gridColumn: "span 4" }}
                              options={ permissions } 
                              onChange={(event, value) => {setFieldValue("permission", value)}}
                              value={values?.permission || null }
                              getOptionLabel={(option) => option?.Name }
                              renderInput={(params) => (
                                <TextField {...params} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            fullWidth
                                            error={!!touched.permission && !!errors.permission}
                                            helperText={touched.permission && errors.permission}
                                            label={values?.department === null ? ("Najpierw wybierz pracownika") : ("Uprawnienia")}
                                            value={values?.permission || null}/>)}/>
                          )}
                          
                          
                      </Box>
                      <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Aktualizuj Informacje
                                {postUpdateInfoError !== null ? <Alerts severity="error" message="Informacje o pracowniku NIE została zaktualizowana!"/> : null}
                                {result !== null ? (result ? <Alerts severity="success" message="Informacje o pracowniku została zaktualizowana!"/> : <Alerts severity="error" message="Informacje o pracowniku NIE została zaktualizowana!"/> ) : (null)}
                            </Button>
                        </Box>
                    </form>
              )}
            </Formik>
      </Box>
    );
}

export default UpdateInfo;