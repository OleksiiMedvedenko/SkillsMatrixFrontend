import { Box, Typography, Toolbar, Button, useTheme } from "@mui/material"
import { DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
import useFetch from "../../data/ApiData";
import { useState, useEffect } from "react";
import * as React from 'react';

//api
import { REACT_APP_API_URL } from "../../env";

const Team = () => { 
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: employees, loading, error } = useFetch(REACT_APP_API_URL + "employee/getEmployeeByDepartment/" + JSON.parse(sessionStorage.getItem("departmentId")));

    const [department, setDepartment] = React.useState('');

    useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    if(loading) return <Loading />

    if(error.length > 0) return <Error err={error} />

    const handleButtonClick = () => {
        window.location.replace('/form/profile');
    };

    const columns = [
        { field: "FullName", headerName: "Name", flex: 1, cellClassName: "name-column--cell", valueGetter: (e) => e.row.Employee.FullName},
        { field: "Name", headerName: "Department", flex: 1, valueGetter: (e) => e.row.Department.Name },
        { field: "PosName", headerName: "Position", flex: 1, valueGetter: (e) => e.row.Position.Name },
    ]

    return(
        <Box margin="20px">
            <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
                <Box display="flex">
                    <Typography style={{color: colors.greenAccent[500]}} variant="h4">Department employees {departments.find(d => d.DepartmentId === department)?.Name}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Button type="submit" color="secondary" variant="contained" onClick={handleButtonClick}>
                        New Employee
                    </Button>
                </Box>
            </Box>

            <Box marginTop="30px">
                <Box margin="40px 0px 0px 0px" height="75vh" sx={{
                   "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none"
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
                }}}>
                <DataGrid rows={employees} columns={columns} components={{ Toolbar: GridToolbar }}/> {/* localeText={plPL.components.MuiDataGrid.defaultProps.localeText} */}
                </Box>
            </Box>
        </Box>
    );
}

export default Team;