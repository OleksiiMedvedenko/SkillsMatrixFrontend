import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from 'react';
//components 
import Header from "../../components/Header";
//autocomplete lib 
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
//
import axios from "axios";
//pages
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//data
import useFetch from "../../data/ApiData";
//api 
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from "../../env";

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
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [selectedEmployee, setEmployee] = React.useState(null); 
    const [selectedDepartment, setSelectedDepartment] = React.useState(null);
    const [area, setArea] = React.useState(null);
    
    const handleFormSubmit = (values) => {
      const areasID = values.area.map((obj) => obj.AreaId);
      const obj = {
        Id: values.id,
        FirstName: values.firstName === "The domain account has not been entered" ? null : values.firstName,
        LastName: values.lastName,
        Login: values.login,
        DepartmentId: values.department.DepartmentId,
        AreasId: areasID,
        SupervisorId: values.supervisor.SupervisorId,
        PositionId: values.vacancy.PositionId,
        PositionName: values.vacancy.Name,
        PermissionId: values.permission.PermissionId
      }

      console.log(obj)

      axios.post(REACT_APP_API_URL + 'employee/updateEmployee' , obj)
             .then(response => {
             window.confirm(`Employee information has been updated!`);
             })
             .catch(error => {
              window.confirm(error);
             console.error(error); 
       });
    }

    const handleActivateOrInactivateEmployee = () => {

      const employeeId = employee?.id;
      if(employee?.Employee?.IsActive === true)
      {
        axios.put(REACT_APP_API_URL +  `employee/deactivateEmployee/${employeeId}`)
          .then(response => {
          window.confirm(`The employee has been deactivated!`);
          window.location.reload();
        })
        .catch(error => {
          window.confirm(error);
          console.error(error); 
        });
      }
      else if(employee?.Employee?.IsActive === false) {
        axios.put(REACT_APP_API_URL + `employee/activateEmployee/${employeeId}`)
          .then(response => {
          window.confirm(`The employee has been activated!`);
          window.location.reload();
        })
        .catch(error => {
          window.confirm(error);
          console.error(error); 
        });
      }
     
    }

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

      const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
      const { data: employee } = useFetch(REACT_APP_API_URL + "employee/GetEmployee/" + selectedEmployee?.id);
      const { data: areas } = useFetch(REACT_APP_API_URL +  "area/getAreas");
      const { data: employees } = useFetch(REACT_APP_API_URL +  "employee/getEmployeeByDepartment/" + department);
      const { data: permissions } = useFetch(REACT_APP_API_URL +  "permission/getPermissions");
      const { data: vacancys, loading, error} = useFetch(REACT_APP_API_URL +  "Position/getPositions");
      
      if(loading) return <Loading />
      if(error.length > 0) return <Error err={error} />
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
                              label="Select an employee"
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
                  <Button sx={{ marginLeft: "20px"}} type="submit" color="error" variant="outlined" disabled={employee.length === 0 ? true : false} onClick={handleActivateOrInactivateEmployee}>
                    { employee.length === 0 ? ("Activate/Deactivate") : (employee?.Employee?.IsActive === true ? "Deactivate" : "Activate") }
                  </Button>
              </Box>
            </Box>
            <Header subtitle="Employee data"/>

            <Formik onSubmit={handleFormSubmit} 
                    enableReinitialize={true}
                    validationSchema={updateSchema}
                    initialValues={{
                      id: employee === null ? "" : employee?.id,
                      login: employee === null ? "" : (employee?.Employee?.Login === null ? "The domain account has not been entered" : employee?.Employee?.Login),
                      firstName: employee === null ? "" : employee?.Employee?.FirstName,
                      lastName: employee === null ? "" : employee?.Employee?.LastName,
                      department: employee === null ? "" : employee?.Department,
                      area: employee === null ? "" : employee?.Areas,
                      vacancy: employee === null ? "" : employee?.Position,
                      supervisor: employee === null ? "" : employee?.Supervisor,
                      permission: employee === null ? "" : employee?.Permission,
                      isActive: employee === null ? false : employee?.Employee?.IsActive,
                    }}>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="grid"
                             gap="30px"
                             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                             sx={{"& > div": {gridColumn: isNonMobile ? undefined : "span 4"}}}>
                            
                          {/* employee login */}
                          <TextField id="outlined-helperText"
                                    label={employee === null ? "First select an employee" : "Domain account"}
                                    fullWidth
                                    type="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.login || ''}
                                    name="login"
                                    error={!!touched.login && !!errors.login}
                                    helperText={touched.login && errors.login}
                                    sx={{ gridColumn: "span 4" }}/>

                            {/* employee name */}
                          <TextField id="outlined-helperText"
                                    label={employee === null ? "First select an employee" : "Name"}
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
                                      label={employee === null ? "First select an employee" : "Last name"}
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
                                <TextField label={ employee === null || employee === undefined ? ("First select an employee") : ("Department")} 
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
                                    <TextField {...params} label={ department === null ? ("First select an department") : ("Area")}
                                                            onChange={handleChange} 
                                                            onBlur={handleBlur}
                                                            fullWidth
                                                            error={!!touched.area && !!errors.area}
                                                            helperText={touched.area && errors.area}
                                                            value={values.area || []}/>
                                  )}
                                />

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
                                            label={area === null ? 'First select an area' : 'Position'}
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
                                          onChange={(event, value) => {setFieldValue("supervisor", value)}}
                                          value={values?.supervisor || null}
                                          getOptionLabel={(option) => option?.FullName}
                                          renderInput={(params) => (
                                            <TextField {...params} 
                                                        onChange={handleChange} 
                                                        onBlur={handleBlur}
                                                        fullWidth
                                                        error={!!touched.supervisor && !!errors.supervisor}
                                                        helperText={touched.supervisor && errors.supervisor}
                                                        label={values?.department === null ? ("First select an department") : ("Supervisor")}
                                                        value={values?.supervisor || null}/>)}/>
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
                                            label={values?.department === null ? ("First select an employee") : ("Permission")}
                                            value={values?.permission || null}/>)}/>
                          )}
                          
                          
                      </Box>
                      <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Update Info
                            </Button>
                        </Box>
                    </form>
              )}
            </Formik>
      </Box>
    );
}

export default UpdateInfo;