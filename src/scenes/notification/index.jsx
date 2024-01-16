import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
//api
import usePut from "../../service/putApi";
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//icons 
import ConnectWithoutContactRoundedIcon from '@mui/icons-material/ConnectWithoutContactRounded';
import InsertInvitationRoundedIcon from '@mui/icons-material/InsertInvitationRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

const Notification = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [department, setDepartment] = React.useState('');
  const [template, setTemplate] = React.useState([]);

  const { putData } = usePut();
  const { fetchData } = useFetch();
  const { data: soonAudits, loading, error } = useFetch(REACT_APP_API_URL + "audit/GetSoonAudits/" + department);
  console.log(soonAudits)
  useEffect(() => {
    const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
    setDepartment(saveDepartment);
  }, []);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const templateData = await fetchData(/* ... */);
        setTemplate(templateData);
      } catch (err) {
        console.log('Error fetching template data');
      }
    }
    fetchTemplate();
  }, []);

  const readNotification = (notifId) => {
    putData(REACT_APP_API_URL + `audit/readAuditNotification`, notifId);
    window.location.reload();
  }

  const handleOpenAuditForm = (employeeId, auditId, auditHistoryId, date, level) => {
    fetchData(REACT_APP_API_URL + "Form/getTemplate/" + auditId);

    const obj = {
      auditedEmployeeId: employeeId,
      auditId: auditId,
      auditHistoryId: auditHistoryId,
      date: date,
      level: level
    };

    localStorage.setItem('auditDocumentData', JSON.stringify(obj));
  }


  return (
    <Box margin="20px">
      <Box display="grid"
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="95px"
        gap="20px">

        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" borderRadius="6px">
          <StatBox title={soonAudits.length === 1 ? (soonAudits.length + " pracownika") : (soonAudits.length + " pracowników")}
            subtitle="W ciągu miesiąca jest zaplanowany audyt!"
            icon={<ConnectWithoutContactRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />} />
        </Box>

        <Box gridColumn="10" display="flex" justifyContent="space-between" alignItems="center">
          <Button sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 10px" }}>
            <InsertInvitationRoundedIcon sx={{ mr: "10px" }}/>
            <Link to={"/calendar"}
                    style={{ color: `${colors.primary[100]}`, fontWeight: '600', textDecoration: 'none' }}>
                    Otwórz Kalendarz
            </Link>
          </Button>
        </Box>
      </Box>
      <Box backgroundColor={colors.primary[400]} overflow="auto" marginTop="10px" height="72vh">
        <Box display="flex" justifyContent="space-between" alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px">
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            <EmailRoundedIcon sx={{ marginRight: "8px", color: colors.greenAccent[500], width: "30px" }} />
            Powiadomienia
          </Typography>
        </Box>
        {loading ? (
          <Loading />
        ) : error.length > 0 ? (
          <Error err={error} />
        ) : (
          soonAudits?.map((event, i) => (
            <Box alignItems="center" m="20px" key={`${event.id}-${i}`}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{ verticalAlign: 'middle' }}>
                  <Typography color={colors.greenAccent[500]} variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                    {event?.Employee?.FullName}
                  </Typography>
                  <Typography color={colors.grey[300]} variant="h5" sx={{ color: 'text.secondary' }}>
                    {event?.Audit?.Name}
                  </Typography>
                  <Typography color={colors.white[0]} variant="h5" sx={{ color: 'text.secondary', margin: "0px 15px 0px 15px" }}>-</Typography>
                  <Typography color={colors.grey[300]} variant="h5" sx={{ color: 'text.secondary' }}>
                    {event?.Audit?.CurrentAuditInfo?.Item2 === 0 ? 'Pracownik posiada 0 poziom wiedzy na temat tego audytu' : event?.Audit?.CurrentAuditInfo?.Item1}
                    {/* {event?.Audit?.CurrentAuditInfo?.Item1} - {event?.Audit?.CurrentAuditInfo?.Item2 === 0 ? '1' : ' '} */}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Poziom ostatniego audytu: {event?.Audit?.CurrentAuditInfo?.Item2}
                  </Typography>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button onClick={() => handleOpenAuditForm(event?.Employee?.EmployeeId, event?.Audit?.AuditId, event?.id, event?.date, event?.Audit?.CurrentAuditInfo?.Item2)}
                      sx={{
                        marginRight: "20px",
                        color: new Date(event?.Audit?.CurrentAuditInfo?.Item1) >= new Date() ? "#ebeced" : "#00cc00",
                        fontWeight: '600'
                      }}
                      type="submit"
                      color="secondary"
                      variant="outlined"
                      disabled={event?.Audit?.CurrentAuditInfo?.Item2 === 0 ? false : new Date(event?.Audit?.CurrentAuditInfo?.Item1) >= new Date() }>
                      <Link to={template?.length === 0 ? null : "/audit-form/template"}
                        target={template?.length === 0 ? null : "_blank"}
                        style={{ color: `${new Date(event?.Audit?.CurrentAuditInfo?.Item2 === 0 ? "#ebeced" : event?.Audit?.CurrentAuditInfo?.Item1) >= new Date() ? "#ebeced" : "#00cc00"}`, fontWeight: '600', textDecoration: 'none' }}>
                        Rozpocznij Audyt
                      </Link>
                    </Button>
                    <Button type="submit" color="secondary" variant="outlined" onClick={() => readNotification(event?.Id)}>
                      Przeczytał/ła
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Notification;
