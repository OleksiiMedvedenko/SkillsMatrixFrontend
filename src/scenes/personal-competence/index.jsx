import { Box, Typography, useTheme, Button, TextField, CircularProgress, Autocomplete, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper } from "@mui/material";
import * as React from 'react';
// theme color
import { tokens } from "../../theme";
//components 
import Loading from "../../components/Loading";
import Error from "../../components/Error";
//api 
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//excel
import PersonalCompetenceExportFile from "../../components/ExportXLSX/PersonalCompetenceExportFile";

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

    const sortedData = {};

    // Iterate through the JSON data
    competence.forEach(item => {
        const areaName = item.Area.Name;
        const auditData = {
            Name: item.Name,
            CurrentAuditInfo: item.CurrentAuditInfo,
        };
    
        // Check if the area name already exists in the sorted data
        if (!sortedData[areaName]) {
            // If not, create a new array for the area
            sortedData[areaName] = [];
        }
    
        // Add the audit data object to the array for the current area
        sortedData[areaName].push(auditData);
    });

    const data = Object.entries(sortedData).map(([areaName, auditData]) => ({
        Area: areaName,
        Audits: auditData,
    }));

// start table styles
  const cellStyle = {
    border: '1px solid #000',
    fontSize: '18px',
    textAlign: 'center', 
  };

  const headerCellStyle = {
    border: '1px solid #000',
    fontSize: '18px',
    textAlign: 'center', 
    fontWeight: 'bold'
  };

  const headerFooterStyle = {
    backgroundColor: colors.blueAccent[600],
    fontWeight: 'bold',
    fontSize: '20px',
  };
  
  const tableStyle = {
    borderRadius: "10px",
    backgroundColor: colors.blueAccent[900],
  };
// end table styles

    return(
        <Box margin="20px">
            <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
                <Box display="flex">
                    <Box display="flex" justifyContent="space-between">
                        <Box display="flex" justifyContent="space-between">
                            <Typography style={{color: colors.greenAccent[500] }} variant="h4">Kompetencje Pracownika: </Typography>
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
                                    label="Wybierz pracownika"
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
                    <PersonalCompetenceExportFile data={data} employeeData={employee} />
                </Box>
            </Box>
            <Box marginTop="3%" paddingLeft="3%">
                <Box>
                    <Typography style={{ color: colors.greenAccent[600], display: 'inline' }} variant="h6">
                        Wydruk dla: {' '}
                    </Typography>
                    <Typography style={{ color: colors.grey[300], display: 'inline' }} variant="h6">
                        {employee?.Employee?.FullName}
                    </Typography>
                </Box>
                <Box>
                    <Typography style={{ color: colors.greenAccent[600], display: 'inline' }} variant="h6">
                        Stanowisko: {' '}
                    </Typography>
                    <Typography style={{ color: colors.grey[300], display: 'inline' }} variant="h6">
                        {employee?.Position?.Name}
                    </Typography>
                </Box>
                <Box>
                    <Typography style={{ color: colors.greenAccent[600], display: 'inline' }} variant="h6">
                        Przełożony: {' '}
                    </Typography>
                    <Typography style={{ color: colors.grey[300], display: 'inline' }} variant="h6">
                        {employee?.Supervisor?.FirstName === null ? '-' : employee?.Supervisor?.FullName}
                    </Typography>
                </Box>
            </Box>
            <Box marginTop="30px">
                <TableContainer component={Paper} sx={tableStyle}>
                    <Table>
                        <TableHead>
                            <TableRow style={headerFooterStyle}>
                                <TableCell style={cellStyle} colSpan={4}>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow >
                                <TableCell style={headerCellStyle} colSpan={1}>
                                    Obszar
                                </TableCell>
                                <TableCell style={headerCellStyle}>
                                    Nazwa stanowiska
                                </TableCell>
                                <TableCell style={headerCellStyle}>
                                    Posiadany poziom kompetencji
                                </TableCell>
                                <TableCell style={headerCellStyle}>
                                    Data następnego audyty (jesli wymagane)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {data.map((item, i) => (
                            <TableBody style={{ backgroundColor: i % 2 === 0 ? colors.blueAccent[800] : colors.blueAccent }} key={i}>
                                {item?.Audits?.map((audit, a) => (
                                <TableRow key={a}>
                                    {a === 0 && (
                                    <TableCell style={cellStyle} rowSpan={item?.Audits?.length}>
                                        {item?.Area}
                                    </TableCell>
                                    )}
                                    <TableCell style={cellStyle}>
                                    {audit?.Name}
                                    </TableCell>
                                    <TableCell style={cellStyle}>
                                    {audit?.CurrentAuditInfo?.Item2 ?? ''}
                                    </TableCell>
                                    <TableCell style={cellStyle}>
                                    {audit?.CurrentAuditInfo?.Item1 ?? '-'}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        ))}      
                        <TableFooter>
                        <TableRow style={headerFooterStyle}>
                            <TableCell style={cellStyle} colSpan={4}>
                            </TableCell>
                        </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default PersonalCompetition;