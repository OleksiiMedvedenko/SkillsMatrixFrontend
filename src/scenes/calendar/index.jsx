import * as React from 'react';
import { useState, useEffect } from "react";
import {formatDate} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"; 
import { Box, 
         List,
         ListItem,
         ListItemText,
         Typography,
         useTheme } from "@mui/material";
import { tokens } from "../../theme";
//components 
import Loading from "../../components/Loadig";
import Error from "../../components/Error";
//data 
import useFetch from "../../data/ApiData";
//api
import { REACT_APP_API_URL } from "../../env";

import allLocales from '@fullcalendar/core/locales-all';


const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const [currentEvents, setCurrentEvents] = useState([]);

    const [department, setDepartment] = React.useState('');

    useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: audits, loading, error } = useFetch(REACT_APP_API_URL + "audit/GetFutureAudits/" + department); 

    if(loading) return <Loading />
    if(error.length > 0) return <Error err={error} />
    
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

    return (
        <Box m="20px">
            {/* Top */}
            <Box display="flex" justifyContent="space-between">
                <Box flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px">
                    <Typography style={{color: colors.greenAccent[500]}} variant="h4">Dates of audits in the department { departments?.find(d => d?.DepartmentId === department)?.Name}</Typography>
                </Box>
            </Box>
            <Box marginTop="30px" display="flex" justifyContent="space-between">
                {/*Calendar side bar*/}
                <Box flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px" sx={{ overflow: "auto", maxHeight: "75vh" }}>
                    <Typography variant="h5">Audit</Typography>
                    <List>
                        {audits.map((event) => (
                            <ListItem key={event?.Id} sx={{backgroundColor: colors.greenAccent[500], margin: "10px 0", borderRadius: "2px", cursor: "pointer"}}>
                                <ListItemText primary={event?.Audit?.Name + " - " + event?.Employee?.LastName} 
                                              secondary={<Typography>{event?.Audit?.CurrentAuditInfo?.Item1}</Typography>} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {/*Calendar*/}
                <Box flex="1 1 100%" marginLeft="15px">
                    <FullCalendar locales={allLocales}
                                  locale='us' // pl
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