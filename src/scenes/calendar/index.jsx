import * as React from 'react';
import { useState, useEffect } from "react";
import {formatDate} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"; 
import { Box,
         Button, 
         List,
         ListItem,
         ListItemText,
         Typography,
         useTheme } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
//colors 
import { tokens } from "../../theme";
//components 
import Loading from "../../components/Loading";
import Error from "../../components/Error";
//api
import useFetch from "../../service/getApi";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//localization
import allLocales from '@fullcalendar/core/locales-all';
//redirect
import { Link } from 'react-router-dom';

function ConvertDate(dateString)
{
    var parts = dateString.split("-");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);

    var date = new Date(year, month, day);
    var formattedDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    return formattedDate;
}

function CompareDate (date)
 {
    const cur = new Date();
    const dateString = date;
    const parts = dateString.split("-");
    
    // Convert to YYYY-MM-DD format (ISO format) and create a Date object
    const jsDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

    if(jsDate <= cur)
        return false;
    else{
        return true;
    }
 }

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [department, setDepartment] = React.useState('');

    const { data: departments, error: depError } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: audits, loading, auditError } = useFetch(REACT_APP_API_URL + "audit/GetFutureAudits/" + department); 

    useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    if(loading) return <Loading />
    
    if(auditError?.length > 0 || depError?.length > 0) return <Error err={auditError + '|' + depError} />
    
    const handleOpenAuditForm = (e, employeeId, auditId, auditHistoryId, date, level) => {

        var dateParts = date.split('-');
        var day = parseInt(dateParts[0], 10);
        var month = parseInt(dateParts[1], 10);
        var year = parseInt(dateParts[2], 10);

        // Subtract one year
        year -= 1;

        // Construct a new date object with the updated values
        var newDate = new Date(year, month - 1, day);

        // Format the new date as 'dd-mm-yyyy'
        var formattedDate =
        newDate.getDate().toString().padStart(2, '0') + '-' +
        (newDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
        newDate.getFullYear();

        const obj = {
            auditedEmployeeId: employeeId,
            auditId: auditId,
            auditHistoryId: auditHistoryId,
            date: formattedDate,
            level: level
        };

        localStorage.setItem('auditDocumentData', JSON.stringify(obj));
    }

    return (
        <Box m="20px">
            {/* Top */}
            <Box display="flex" justifyContent="space-between">
                <Box flex="1 1 23%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px">
                    <Typography style={{color: colors.greenAccent[500]}} variant="h4">Terminy audytów w dziale { departments?.find(d => d?.DepartmentId === department)?.Name}</Typography>
                </Box>
            </Box>
            <Box marginTop="30px" display="flex" justifyContent="space-between">
                {/*Calendar side bar*/}
                <Box flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" sx={{ overflow: "auto", maxHeight: "75vh" }}>
                    <Typography variant="h5">Audyt</Typography>
                    <List>
                        {audits.map((event) => (
                            <Box>
                                <ListItem key={event?.Id} sx={{backgroundColor: colors.greenAccent[500], margin: "10px 0", borderRadius: "2px", cursor: "pointer"}}>
                                    <ListItemText primary={event?.Audit?.Name + " - " + event?.Employee?.LastName} 
                                                secondary={<Typography>{event?.Audit?.CurrentAuditInfo?.Item2 === 0 ? 'W dowolnym momencie' : event?.Audit?.CurrentAuditInfo?.Item1}</Typography>}/>
                                    <Button color="error" onClick={(e) => handleOpenAuditForm(e, event?.Employee?.EmployeeId, event?.Audit?.AuditId, event?.Id, event?.Audit?.CurrentAuditInfo?.Item1, event?.Audit?.CurrentAuditInfo?.Item2) }
                                            variant="outlined" 
                                            disabled={event?.Audit?.CurrentAuditInfo?.Item2 !== 0 && CompareDate(event?.Audit?.CurrentAuditInfo?.Item1)}>
                                            <Link to="/audit-form/template" target="_blank" style={{color: `${event?.Audit?.CurrentAuditInfo?.Item2 !== 0 && CompareDate(event?.Audit?.CurrentAuditInfo?.Item1) ? "#ebeced" : "#f26166"}`, fontWeight: '600', textDecoration: 'none'}}>
                                                Rozpocznij
                                            </Link>
                                    </Button>
                                </ListItem>
                                {CompareDate(event?.Audit?.CurrentAuditInfo?.Item1) && event?.Audit?.CurrentAuditInfo?.Item2 === 1 && 
                                    <Tooltip title="Pracownik ma poziom wiedzy 1, w dowolny moment możesz rozpoczynać audyt" placement="top-start">
                                        <Button color="success" onClick={(e) => handleOpenAuditForm(e, event?.Employee?.EmployeeId, event?.Audit?.AuditId, event?.Id, event?.Audit?.CurrentAuditInfo?.Item1, event?.Audit?.CurrentAuditInfo?.Item2) }
                                            fullWidth="100%">
                                            <Link to="/audit-form/template" target="_blank" style={{color: `${colors.greenAccent[200]}`, fontWeight: '100', textDecoration: 'none'}}>
                                                Aktualizuj
                                            </Link>
                                        </Button>
                                    </Tooltip>
                                }
                                <hr style={{borderColor: 'C4C1C1', height: '3px', }}/>
                            </Box>    
                        ))}
                    </List>
                </Box>
                {/*Calendar*/}
                <Box flex="1 1 100%" marginLeft="15px">
                    <FullCalendar locales={allLocales}
                                  locale='pl'
                                  height="75vh"
                                  plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                    listPlugin]}
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"}}
                                    initialView="dayGridMonth"
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    events={audits.map((event) => ({ 
                                        id: event.Id,
                                        title: event.title,
                                        start: new Date(ConvertDate(event?.Audit?.CurrentAuditInfo?.Item1)),
                                      }))}/>
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;