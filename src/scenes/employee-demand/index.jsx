import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Box,
  useTheme,
  Typography
} from '@mui/material';
//import colors
import { tokens } from "../../theme";
//endpoint
import { REACT_APP_API_URL } from '../../env';
//api
import useFetch from '../../service/getApi';
//components
import Error from '../../components/Error';
import Loading from '../../components/Loading';
//excel 
import PersonalPurposeExportFile from '../../components/ExportXLSX/PersonalPurposeExportFile';

const Demand = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [department, setDepartment] = React.useState('');

  useEffect(() => {
    const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
    setDepartment(saveDepartment);
  }, []);

  //api data
  const { data: departments, error: departmentError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
  const { data: auditsWithPurpose, error: auditsWithPurposeError } = useFetch(REACT_APP_API_URL + "PersonalPurpose/getDepartmentAuditsWithPurpose/" + department);
  const { data: personalPurpose, loading, error: personalPurposeError } = useFetch(REACT_APP_API_URL + "PersonalPurpose/getDepartmentPersonalPurpose/" + department);

  if(loading) return <Loading />
  if(personalPurposeError?.length > 0) return <Error err={personalPurposeError}/>

  const uniqueSupervisors = {};

  personalPurpose.forEach((item) => {
    const supervisorId = item.Supervisor.SupervisorId;
    const audit = {
      AuditId: item.Audit.AuditId,
      Name: item.Audit.Name,
      Purpose: item.Purpose,
      EmployeesWithLevelTwo: item.EmployeesWithLevelTwo,
      Difference: item.Difference,
    };

    if (!uniqueSupervisors[supervisorId]) {
      uniqueSupervisors[supervisorId] = {
        Supervisor: item.Supervisor,
        Audits: [audit],
      };
    } else {
      uniqueSupervisors[supervisorId].Audits.push(audit);
    }
  });

  Object.values(uniqueSupervisors).forEach((supervisorData) => {
    const supervisorAudits = supervisorData.Audits;
    for (const audit of auditsWithPurpose) {
      if (!supervisorAudits.some((a) => a.AuditId === audit.Audit.AuditId)) {
        supervisorAudits.push({
          AuditId: audit.Audit.AuditId,
          Name: audit.Audit.Name,
          Purpose: audit.Purpose, 
          EmployeesWithLevelTwo: audit.EmployeesWithLevelTwo ?? 0,
          Difference: audit.EmployeesWithLevelTwo - audit.Purpose,
        });
      }
    }
  });

  Object.values(uniqueSupervisors).forEach((supervisorData) => {
    supervisorData.Audits.sort((a, b) => a.AuditId - b.AuditId);
  });

  const data = Object.values(uniqueSupervisors);

// start table styles
  const cellStyle = {
    border: '1px solid #000',
    fontSize: '18px',
    textAlign: 'center', 
  };

  const purposeCellsStyle = {
    backgroundColor: colors.yellow[700],
    border: '1px solid #000',
    fontWeight: 'bold',
    fontSize: '18px',
    textAlign: 'center', 
  }

  const positiveDifferenceCellStyle = {
    backgroundColor: colors.greenAccent[700],
    border: '1px solid #000',
    fontSize: '18px',
    textAlign: 'center', 
  }

  const negativeDifferenceCellStyle = {
    backgroundColor: colors.redAccent[700],
    border: '1px solid #000',
    fontSize: '18px',
    textAlign: 'center', 
  }
  
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

  return (
    <Box margin="20px">
      <Box display="flex" justifyContent="space-between" flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" alignItems="center">
        <Typography style={{color: colors.greenAccent[500] }} variant="h4">Zapotrzebowanie na ilość pracowników działu { departments?.find(d => d?.DepartmentId === department)?.Name } </Typography>
        <PersonalPurposeExportFile data={data} />
      </Box>
      <Box sx={{ paddingTop: "50px" }}>
        <TableContainer component={Paper} sx={tableStyle}>
          <Table>
            <TableHead>
              <TableRow style={headerFooterStyle}>
                <TableCell style={cellStyle} colSpan={data[0]?.Audits.length + 2}>
                  {/* Empty Cell for additional styling */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow >
                <TableCell style={cellStyle} colSpan={2}>
                  Przelozony
                </TableCell>
                { data[0]?.Audits.map((item, i) => (
                  <TableCell style={cellStyle}>
                    {item?.Name}
                  </TableCell>
					      ))}
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} style={purposeCellsStyle}>
                  Cel osobowy
                </TableCell>
                { data[0]?.Audits.map((item, i) => (
                  <TableCell style={purposeCellsStyle}>
                    {item?.Purpose}
                  </TableCell>
					      ))}
              </TableRow>
            </TableHead>
            {data.map((item, i) => (
              <TableBody>
                <TableRow>
                  <TableCell rowSpan={2} style={cellStyle}>
                    {item?.Supervisor?.FullName}
                  </TableCell>
                  <TableCell style={cellStyle}>Liczba osób z kompetencją 2</TableCell>
                  {item?.Audits.map((audit, a) => (
                    <TableCell style={cellStyle}>{audit?.EmployeesWithLevelTwo}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell style={cellStyle}>Różnica</TableCell>
                  {item?.Audits.map((audit, a) => (
                    <TableCell style={audit?.Difference >= 0 ? positiveDifferenceCellStyle : negativeDifferenceCellStyle}>{audit?.Difference}</TableCell>
                  ))}
                </TableRow>
                {i !== data.length - 1 && 
                  <TableRow>
                    <TableCell style={{backgroundColor: `${colors.blueAccent[900]}`, border: '1px solid #000'}} colSpan={item?.Audits.length + 2}>
                    </TableCell>
                  </TableRow>    
                }
              </TableBody>
            ))}    
            <TableFooter>
              <TableRow style={headerFooterStyle}>
                <TableCell style={cellStyle} colSpan={data[0]?.Audits.length + 2}>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Demand;
