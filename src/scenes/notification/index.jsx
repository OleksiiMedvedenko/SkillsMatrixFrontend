import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import * as React from 'react';
//components
import StatBox from "../../components/StatBox";
//icons 
import ConnectWithoutContactRoundedIcon from '@mui/icons-material/ConnectWithoutContactRounded';
import InsertInvitationRoundedIcon from '@mui/icons-material/InsertInvitationRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
//Accordion library
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import useFetch from "../../data/ApiData";

import Error from "../../components/Error";
import Loading from "../../components/Loadig";
import { useEffect } from "react";
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from "../../env";


const handleClickCalendarButton = () =>{
    window.location.replace("/calendar");
}


const Notification = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [department, setDepartment] = React.useState('');

    useEffect(() => {
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);

    const { data: soonAudits, loading, error } = useFetch(REACT_APP_API_URL + "audit/GetSoonAudits/" + department); 

    if(loading) return <Loading />

    if(error.length > 0) return <Error err={error} />

    function readNotification(notifId) {
        try {
            const response = axios.put(REACT_APP_API_URL + `audit/readAuditNotification/${notifId}`);
            console.log(response.data);
            window.location.reload();
          } catch (error) {
            console.error(error); 
          }
    }
    console.log(soonAudits)
    return(
        <Box margin="20px">
            {/* Grid */}
            <Box display="grid" 
                 gridTemplateColumns="repeat(10, 1fr)"
                 gridAutoRows="95px"
                 gap="20px">

                <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" borderRadius="6px">
                    <StatBox  title={soonAudits.length + " employees"}
                              subtitle="they have an audit scheduled in a month!" 
                              icon={ <ConnectWithoutContactRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px"}}/>}/>
                </Box>

                <Box gridColumn="10" display="flex" justifyContent="space-between" alignItems="center">
                    <Button onClick={handleClickCalendarButton} sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 10px"}}>
                        <InsertInvitationRoundedIcon sx={{ mr: "10px"}}/>
                        Open Calendar
                    </Button>
                </Box>
            </Box>
            {/* display notification */}
            <Box backgroundColor={colors.primary[400]} overflow="auto" marginTop="10px" height="72vh"> 
                    <Box display="flex" justifyContent="space-between" alignItems="center" 
                        borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px">
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            <EmailRoundedIcon sx={{ marginRight: "8px", color: colors.greenAccent[500], width: "30px"}}/>
                            Notifications
                        </Typography>
                    </Box>
                    {soonAudits?.map((event, i) => (
                        <Box alignItems="center" m="20px" key={`${event.id}-${i}`}>
                            <Accordion >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                                sx={{ verticalAlign: 'middle' }}>
                                    <Typography color={colors.greenAccent[500]} variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                                        {event?.Employee?.FullName}
                                    </Typography>
                                    <Typography color={colors.grey[300]} variant="h5" sx={{ color: 'text.secondary'}}>
                                        {event?.Audit?.Name}
                                        </Typography>
                                    <Typography color={colors.white[0]} variant="h5" sx={{ color: 'text.secondary', margin: "0px 15px 0px 15px"}}>-</Typography>
                                    <Typography color={colors.grey[300]} variant="h5" sx={{ color: 'text.secondary'}}>
                                        {event?.Audit?.CurrentAuditInfo?.Item1}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                            Last audit level: {event?.Audit?.CurrentAuditInfo?.Item2}
                                    </Typography>
                                    <Box display="flex" justifyContent="end" mt="20px">
                                        <Button type="submit" color="secondary" variant="outlined" onClick={() => readNotification(event?.Id)}>
                                            Read
                                        </Button>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>))
                    }
            </Box>
        </Box>   
    );
}

export default Notification;