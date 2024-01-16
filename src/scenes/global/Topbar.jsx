import { Box, IconButton, useTheme, Typography, InputLabel, Tooltip, Select, FormControl, MenuItem, Badge, TextField } from "@mui/material"
import React, { useContext, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import 'react-pro-sidebar/dist/css/styles.css';
//icons
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MailIcon from '@mui/icons-material/Mail';
//components
import TooltipNotification from "../../components/TooltipNotification";
//api
import useFetch from "../../service/getApi";
//endpoint 
import { REACT_APP_API_URL } from "../../env";

const Logout = () => {
    if( localStorage.getItem("loggedInUser") !== "" || localStorage.getItem("loggedInUser") !== null){
        localStorage.removeItem("loggedInUser");
        window.location.reload();
    }
}

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const [department, setDepartment] = React.useState('');
    
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    const { data: departments } = useFetch(REACT_APP_API_URL + "Depatment/getDepartments");
    const { data: soonAudits } = useFetch(REACT_APP_API_URL + "audit/GetSoonAudits/" + department); 

    useEffect(() => {
        if(user?.Permission?.Name !== "Admin")
        {
            sessionStorage.setItem("departmentId", JSON.stringify(user?.Department?.DepartmentId));
        }
        const saveDepartment = JSON.parse(sessionStorage.getItem("departmentId"));
        setDepartment(saveDepartment);
    }, []);
    
    const handleChange = (event) => {
        setDepartment(event.target.value);

        sessionStorage.setItem("departmentId", JSON.stringify(event.target.value));
        window.location.reload();
    };

    const handleOpenNotification = (event) => {
        window.location.replace("/notification");
    }
    const handleOpenSetting = (event) => {
        window.location.replace("/setting");
    }
    
    return(
        <Box display="flex" justifyContent="space-between" padding={2}>
            <Box display="flex">
            </Box>
            <Box dispay="flex" style={{display: "inline-table"}}>
                <Box display="flex" 
                    justifyContent="space-between"
                    borderRadius="5px" 
                    backgroundColor={theme.palette.mode === 'dark' ? (colors.primary[400]) : (`${colors.primary[400]} !important`)}
                    style={{cursor: "pointer", display: "table-cell"}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="10px" marginBottom="10px" >
                        {/* Logo */}
                        <Box ml="15px">
                            <Typography variant="h3" color={colors.greenAccent[500]} style={{fontWeight: "Bold"}}>CodeBase</Typography>
                        </Box>
                        {/* bar */}
                        <Box height="50px" marginLeft="15px" marginRight="15px" display="flex" backgroundColor={theme.palette.mode === 'dark' ? (colors.redAccent[400]) : (colors.white[0])} borderRadius="3px">
                            {user?.Permission?.Name !== "Admin" ? (
                                <TextField style={{ margin: "-2px 0px 0px 0px", width: "150px"}}
                                        id="outlined-read-only-input"
                                        label="Dział"
                                        defaultValue={ user?.Department?.Name } // error 
                                        InputProps={{
                                          readOnly: true }}/>
                            ) : (
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="demo-simple-select-helper-label">Dział</InputLabel>
                                <Select
                                    value={department === null ? "none" : department}
                                    onChange={handleChange}>
                                        {departments.map((option) => (
                                            <MenuItem key={option.DepartmentId} value={option.DepartmentId}>
                                            {option.Name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            )}
                        </Box>
                    </Box>
                </Box>
                {/* items menu */}
                <Box display="flex" marginLeft="10px" style={{ dispay: "table-cell"}}>
                    <IconButton onClick={colorMode.toggleColorMode}>
                        { localStorage.getItem("theme") === 'dark' ? (
                            <DarkModeOutlinedIcon />
                        ): (
                            <LightModeOutlinedIcon />
                        )}
                    </IconButton>
                    <Tooltip title={<TooltipNotification data={soonAudits}/>}>
                        <IconButton onClick={handleOpenNotification}>
                            { soonAudits.length === 0 ? (<MailOutlineRoundedIcon />) : ( 
                                <Badge color="secondary" badgeContent={soonAudits.length}>
                                    <MailIcon />
                                </Badge>
                            )}
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={handleOpenSetting}>
                        <SettingsOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={Logout}>
                        <PersonOutlinedIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default Topbar;