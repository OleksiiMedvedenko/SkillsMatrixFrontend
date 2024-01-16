import { Box, Typography, useTheme, TextField } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid, GridToolbar, plPL } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect } from "react";
//components 
import Loading from "../../components/Loading";
import Error from "../../components/Error";
//api 
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//report
import LevelsExportFile from "../../components/ExportXLSX/LevelsExportFile";

const Department = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [department, setDepartment] = React.useState('');
    const [area, setArea] = React.useState(null);

    useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    // data grid
    const { data: departments, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: areas, error: areasError } = useFetch(REACT_APP_API_URL +  "area/getAreas");
    const { data: auditsInfo, loading, auditsError } = useFetch(REACT_APP_API_URL + "audit/GetActualAreaAuditsLevel/" + area?.AreaId);
    
    if(loading) return <Loading />
    if(auditsError?.length > 0 || areasError?.length > 0 || auditsError?.length > 0) return <Error err={auditsError + '|' + areasError + '|' + auditsError} />

    const employeeColumns = [
        { field: "FullName", headerName: "Imie", flex: 1, cellClassName: "name-column--cell", valueGetter: (e) => e?.row?.Employee?.FullName, width: 20 },
        { field: "PosName", headerName: "Stanowisko", flex: 1, valueGetter: (e) => e?.row?.Position?.Name, width: 20 },
        { field: "LastName", headerName: "Przelożony", flex: 1, valueGetter: (e) => e?.row?.Supervisor?.FirstName + " " + e?.row?.Supervisor?.LastName, width: 20 },
        ...(auditsInfo[0]?.AuditsInfo || []).map((audit, index) => ({
            field: `AuditsInfo[${index}].CurrentAuditInfo.Item1`,
            headerName: audit?.Name,
            valueGetter: (e) => e?.row?.AuditsInfo[index]?.CurrentAuditInfo?.Item2 === null ? "-" : e?.row?.AuditsInfo[index]?.CurrentAuditInfo?.Item2, 
            width: 150, align: 'center'
        })),
    ];

    return (
        <Box margin="20px">
            <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Box display="flex" justifyContent="space-between">
                        <Box display="flex" justifyContent="space-between">
                            <Typography style={{color: colors.greenAccent[500] }} variant="h4">Daty audytów dla działu { departments?.find(d => d?.DepartmentId === department)?.Name }, obszar: </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-around">
                        <Box  marginLeft="15px">
                            <Autocomplete freeSolo
                                            id="free-solo-2-demo"
                                            disableClearable
                                            onChange={(event, value) => {setArea(value)}}
                                            options={areas?.filter(a => a?.Department?.DepartmentId === department)}
                                            sx={{ width: "250%" }}
                                            getOptionLabel={(option) => option.Name}
                                            renderInput={(params) => (
                                                <TextField label={department === null ? ("Najpierw wybierz dział") : ("Obszar")}
                                                {...params}/>)}/>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <LevelsExportFile data={auditsInfo} />
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
                        fontSize: '1rem'
                    },
                    '& .zero': {
                        backgroundColor: colors.grey[600],
                    },
                    '& .low': {
                        backgroundColor: colors.yellow[700],
                    },
                    '& .hight': {
                        backgroundColor: colors.greenAccent[700],
                    },
                }}>
                <DataGrid rows={auditsInfo}
                          columns={employeeColumns} 
                          components={{ Toolbar: GridToolbar }}
                          localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                          getCellClassName={(params) => {
                              if (params.field === 'fullName' || params.field === 'vacancy' || params.field === 'supervisor') {
                                  return '';
                              }
                              else if (params.value === 0)
                              {
                                  return 'zero'
                              }
                              else if (params.value === 1)
                              {
                                  return 'low'
                              }
                              else if (params.value === 2)
                              {
                                  return 'hight'
                              }
                          }}
                        />
                </Box>
            </Box>
        </Box>
    );
}

export default Department;