import { Box, Typography, useTheme, Button, TextField, Toolbar } from "@mui/material";
import * as React from 'react';
import { useEffect } from "react";
// theme color
import { tokens } from "../../theme";
//autocomplete component
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from "@mui/material/Autocomplete";
//data grid component
import { DataGrid, GridToolbar, GridCellParams, plPL } from "@mui/x-data-grid";
//components 
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//data 
import useFetch from "../../data/ApiData";
//api
import { REACT_APP_API_URL } from "../../env";

//design function for asyn selection employee
function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

const PersonalCompetition = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [department, setDepartment] = React.useState('');

    const [employee, setEmployee] = React.useState(null); 


    //async autocomplete select employee
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loadingAuto = open && options.length === 0;

    React.useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    React.useEffect(() => {
        let active = true;
    
        if (!loadingAuto) {
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
      }, [loadingAuto]);
    
    React.useEffect(() => {
        if (!open) {
          setOptions([]);
        }
      }, [open]);
    
    const { data: competence } = useFetch(REACT_APP_API_URL + "audit/getPersonalCompetence/" + `${employee?.id}/` + `${department}`);
    const { data: employees, loading, error } = useFetch(REACT_APP_API_URL + "employee/getEmployeeByDepartment/" + JSON.parse(sessionStorage.getItem("departmentId")));
    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />


    const columns = [
        { field: "Name", headerName: "Area", flex: 1, cellClassName: "name-column--cell",
            valueGetter: (e) => e?.row?.Area?.Name
        },
        { field: "headerName", headerName: "Audit", flex: 1, 
            valueGetter: (e) => e?.row?.Name
        },
        { field: "Item2", headerName: "Your level of competence", flex: 1,
            valueGetter: (e) => e?.row?.CurrentAuditInfo?.Item2
        },
        { field: "Item1", headerName: "Date of the next audit", flex: 1, 
            valueGetter: (e) => e?.row?.CurrentAuditInfo?.Item1 === null ? "-" : e?.row?.CurrentAuditInfo?.Item1,
            
        },
      ]; 




    return(
        <Box margin="20px">
            <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
                <Box display="flex">
                    <Box display="flex" justifyContent="space-between">
                        <Box display="flex" justifyContent="space-between">
                            <Typography style={{color: colors.greenAccent[500] }} variant="h4">Employee competencies: </Typography>
                        </Box>
                        <Box height="40px" marginLeft="15px" marginRight="15px" width="80%" display="flex" justifyContent="space-between">
                            <Autocomplete 
                                id="asynchronous-demo"
                                fullWidth
                                sx={{ width: "100%", marginBottom: "20px"}}
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
                                loading={loadingAuto}
                                renderInput={(params) => (
                                    <TextField
                                    fullWidth
                                    {...params}
                                    label="Select an employee"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <React.Fragment>
                                            {loadingAuto ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),}}/>)}/>
                        </Box>
                    </Box>
                </Box>
                    <Box display="flex" justifyContent="space-between">
                    <Button color="secondary" disabled={true}>Download Report</Button>
                </Box>
            </Box>
            <Box marginTop="30px">
                <Box margin="40px 0px 0px 0px" height="75vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    // alignItems: "center",
                    // display: "flex",
                    // justifyContent: "center"
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400]
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
                },
                }}>
                <DataGrid rows={competence}
                        //   localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                          columns={columns} 
                          components={{ Toolbar: GridToolbar }}
                        />
                </Box>
            </Box>
        </Box>
    );
}

export default PersonalCompetition;