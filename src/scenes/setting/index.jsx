import { Box, Button, Typography, useTheme, Accordion, AccordionSummary, AccordionDetails, Autocomplete, TextField } from "@mui/material";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
//icons 
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
//Accordion library
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//notification
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
//endpoint
import { REACT_APP_API_URL } from "../../env";
//api
import useFetch from "../../service/getApi";
//components
import CreateForm from "../../components/CreateForm";
import EditForm from "../../components/EditForm";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import CreateQuestionForm from "../../components/CreateQuestionForm";

const Setting = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectAudit, setSelectAudit] = React.useState(null);
    const [templateData, setTemplateData] = React.useState([]); 
    const department = JSON.parse(sessionStorage.getItem("departmentId"));
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const { data: audits, loading, error } = useFetch(REACT_APP_API_URL + "audit/getAudits");
    const { data: template } = useFetch(REACT_APP_API_URL + "Form/getTemplate/" + selectAudit?.AuditId);
    const { data: questions } = useFetch(REACT_APP_API_URL + "Question/getQuestions");

    const [invisible, setInvisible] = useState(() => {
        const isNotificationEnable = JSON.parse(localStorage.getItem('isVisibleNotification'));
        return isNotificationEnable !== null ? isNotificationEnable : false;
    });


      // Use useEffect to update localStorage when 'invisible' state changes.
    useEffect(() => {
        localStorage.setItem('isVisibleNotification', JSON.stringify(invisible));
    }, [invisible]);

    const handleBadgeVisibility = () => {
        setInvisible(!invisible);
    };

    if(loading) return <Loading />
    if(error?.length > 0) return <Error err={error} />

    return(
        <Box margin="20px">
            {/* display notification */}
            <Box backgroundColor={colors.primary[400]} overflow="auto" marginTop="10px" height="72vh"> 
                    <Box display="flex" justifyContent="space-between" alignItems="center" 
                        borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px">
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            <SettingsSuggestRoundedIcon sx={{ marginRight: "8px", color: colors.greenAccent[500], width: "30px"}}/>
                            Ustawienia
                        </Typography>
                    </Box>
                    <Box alignItems="center" m="20px">
                        <Accordion >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            sx={{ verticalAlign: 'middle' }}>
                                <Typography color={colors.greenAccent[500]} variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                                    Formularz
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Box>
                                    <Typography color={colors.grey[300]} variant="h5" sx={{ color: 'text.secondary'}}>
                                        Utworz/Edytuj istniejący formularz
                                    </Typography>
                                    <Box sx={{marginTop: "30px"}}>
                                        <Box display="flex" flexWrap="wrap" alignItems="center">
                                            <Autocomplete freeSolo
                                                        id="free-solo-2-demo"
                                                        disableClearable 
                                                        onChange={(event, value) => {setSelectAudit(value) }}
                                                        options={audits?.filter(a => a?.Area?.Department?.DepartmentId === department)}
                                                        sx={{ width: "30%" }}
                                                        getOptionLabel={(option) => option?.Name}
                                                        renderInput={(params) => (
                                                <TextField label={department === null ? ("Najpierw wybierz dział") : ("Wybierz audyt, dla którego chcesz zmienić/stworzyć formularz ")}
                                                        {...params}/>)}/>
                                            
                                            {template?.length === 0 && selectAudit !== null ? 
                                            <Typography sx={{color: (colors.redAccent[400])}} 
                                                        marginLeft="10px"  
                                                        textAlign="center">Formularz dla tego audytu nie istnieje.</Typography> : <Box></Box>}
                                        </Box>
                                        <Box marginTop="20px">
                                            {template?.length === 0 && selectAudit !== null ? 
                                                <Box>
                                                    {selectAudit === null ? null : <CreateForm auditId={selectAudit?.AuditId} authorId={user?.id}/> }
                                                </Box>
                                            :   <Box>
                                                    {selectAudit === null ? null : <EditForm template={template} auditId={selectAudit?.AuditId} authorId={user?.id}/> }
                                                </Box>}
                                        </Box>
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion sx={{marginTop: "22px"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            sx={{ verticalAlign: 'middle' }}>
                                <Typography color={colors.greenAccent[500]} variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                                    Dodaj pytania
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <CreateQuestionForm/>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* <Accordion sx={{marginTop: "22px"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            sx={{ verticalAlign: 'middle' }}>
                                <Typography color={colors.greenAccent[500]} variant="h4" sx={{ width: '33%', flexShrink: 0 }}>
                                    Powiadomienia
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <Badge color="secondary" variant="dot" invisible={invisible}>
                                        <MailIcon />
                                    </Badge>
                                    <FormControlLabel
                                        sx={{ color: 'text.primary', marginLeft: "15px" }}
                                        control={<Switch color="secondary" checked={!invisible} onChange={handleBadgeVisibility} />}
                                        label={invisible ? "Włącz odznakę powiadomień - w rozwoju." : "Wyłącz odznakę powiadomień - w rozwoju."}/>
                                </Box>
                            </AccordionDetails>
                        </Accordion> */}
                    </Box>
            </Box>
        </Box>   
    );
}

export default Setting;