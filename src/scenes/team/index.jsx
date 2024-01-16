import { Box, Typography, Toolbar, Button, useTheme } from "@mui/material"
import { DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { tokens } from "../../theme";
//components
import Loading from "../../components/Loading";
import Error from "../../components/Error";
//api
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";

const Team = () => { 
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [department, setDepartment] = React.useState('');

    const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: employees, loading, error } = useFetch(REACT_APP_API_URL + "employee/getEmployeeByDepartment/" + JSON.parse(sessionStorage.getItem("departmentId")));

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
        { field: "FullName", headerName: "Imie", flex: 1, cellClassName: "name-column--cell", valueGetter: (e) => e.row.Employee.FullName},
        { field: "Name", headerName: "Dział", flex: 1, valueGetter: (e) => e.row.Department.Name },
        { field: "PosName", headerName: "Stanowisko", flex: 1, valueGetter: (e) => e.row.Position.Name },
    ]

    return(
        <Box margin="20px">
            <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
                <Box display="flex">
                    <Typography style={{color: colors.greenAccent[500]}} variant="h4">Pracownicy działu {departments.find(d => d.DepartmentId === department)?.Name}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Button type="submit" color="secondary" variant="contained" onClick={handleButtonClick}>
                        Dodaj pracownika
                    </Button>
                </Box>
            </Box>

            <Box marginTop="30px">
                <Box margin="40px 0px 0px 0px" height="75vh" sx={{
                   "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    fontSize: '1rem',
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                    fontSize: '1.1rem'
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400]
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                    fontSize: '1rem',
                }}}>
                <DataGrid rows={employees} columns={columns} components={{ Toolbar: GridToolbar }} localeText={plPL.components.MuiDataGrid.defaultProps.localeText}/>
                </Box>
            </Box>
        </Box>
    );
}

export default Team;