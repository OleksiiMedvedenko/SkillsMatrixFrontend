import { Box, Typography, Button, TextField, useTheme, Autocomplete } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import DatesExportFile from "../../components/ExportXLSX/DatesExportFile";

const Dates = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [department, setDepartment] = React.useState('');
  const [area, setArea] = React.useState(null);

  useEffect(() => {
    const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
    setDepartment(saveDepartment);
  }, []);

  // function for count days 
  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date;
  }

  // data grid
  const { data: departments, error: departmentError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
  const { data: areas, error: areaError } = useFetch(REACT_APP_API_URL +  "area/getAreas");
  const { data: auditsInfo, loading, error: auditError } = useFetch(REACT_APP_API_URL + "audit/getFutureAreaAuditsDates/" + area?.AreaId);
  
  if(loading) return <Loading />
  if(departmentError?.length > 0 || areaError?.length > 0 || auditError?.length > 0) return <Error err={departmentError + '|' + areaError + '|' + auditError}/>

  console.log(auditsInfo)

  const employeeColumns = [
    { field: "FullName", headerName: "Imie", flex: 1, cellClassName: "name-column--cell", valueGetter: (e) => e?.row?.Employee?.FullName, width: 20, },
    { field: "PosName", headerName: "Stanowisko", flex: 1, valueGetter: (e) => e?.row?.Position?.Name, width: 20 },
    { field: "LastName", headerName: "Przelożony", flex: 1, valueGetter: (e) => e?.row?.Supervisor?.FirstName + " " + e?.row?.Supervisor?.LastName, width: 20 },
    ...(auditsInfo[0]?.AuditsInfo || []).map((audit, index) => ({
      field: `AuditsInfo[${index}].CurrentAuditInfo.Item1`,
      headerName: audit?.Name,
      valueGetter: (e) => e?.row?.AuditsInfo[index]?.CurrentAuditInfo?.Item1 === null 
                       || e?.row?.AuditsInfo[index]?.CurrentAuditInfo?.Item === 0 ? "-" : e?.row?.AuditsInfo[index]?.CurrentAuditInfo?.Item1,
      width: 150, align: 'center'
    })),
  ];
  
  return (
    <Box margin="20px">
      <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
        <Box display="flex" alignItems="center">
            <Box display="flex" justifyContent="space-between">
                <Box display="flex" justifyContent="space-between">
                    <Typography style={{color: colors.greenAccent[500] }} variant="h4">Daty Audytów { departments?.find(d => d?.DepartmentId === department)?.Name } </Typography>
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
            <DatesExportFile data={auditsInfo} />
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
        "& .MuiDataGrid-colCell": {
          textAlign: 'center',
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
        },
        '& .missed': {
          backgroundColor: colors.redAccent[600],
        },
        '& .weekly': {
            backgroundColor: colors.yellow[700],
        },
        '& .future': {
            backgroundColor: colors.greenAccent[700],
        },}}>
        <DataGrid rows={auditsInfo} 
                  columns={employeeColumns} 
                  components={{ Toolbar: GridToolbar }}
                  getCellClassName={(params) => {
                    
                    if(params.field === 'FullName' || params.field === 'PosName' || params.field === 'LastName')
                    {
                      return '';
                    }
                    else
                    {
                      if(params.value === '-')
                      {
                        return '';
                      }

                      const dateString = params.value;
                      const parts = dateString.split('-');
                      const jsFormatDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

                      if (jsFormatDate != null || jsFormatDate != '-') {
                          const currentDate = new Date();
                          const cellDate = new Date(jsFormatDate);

                          if (cellDate < currentDate) {
                            return 'missed'
                          } 
                          else 
                          {
                            const oneWeekFromNow = new Date();
                            oneWeekFromNow.setDate(currentDate.getDate() + 7);
                  
                            if (cellDate > currentDate && cellDate <= oneWeekFromNow) 
                            {
                              return 'weekly'
                            } 
                            else 
                            {
                              return 'future'
                            }
                          }
                      }
                    }
                  }}/>
        </Box>
      </Box>
    </Box>
  );
};

export default Dates;
