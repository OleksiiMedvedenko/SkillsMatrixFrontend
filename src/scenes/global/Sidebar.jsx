import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { tokens } from "../../theme";
import Item from "../../components/Item";
import 'react-pro-sidebar/dist/css/styles.css';

import useMediaQuery from "@mui/material/useMediaQuery";

//icons
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import AddHomeWorkRoundedIcon from '@mui/icons-material/AddHomeWorkRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';

const Sidebar = () => {
    const isNonMobile = useMediaQuery("(min-width:1350px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed ] = useState(false);
    const [selected, setSelected] = useState("home");

    const user = JSON.parse(sessionStorage.getItem("user"));

    return(
        <Box sx={{
            "& .pro-sidebar-inner": {
                background: `${colors.primary[400]} !important`,
                borderRadius: "0px 22px 22px 0px",
                height: isNonMobile ? undefined : "143vh",
            },
            "& .pro-icon-wrapper": {
                background: "transparent !important",
            },
            "& .pro-inner-item": {
                padding: "5px 35px 5px 20px !important"
            },
            "& .pro-inner-item:hover":{
                color: "#868dfb !important"
            },
            "& .pro-menu-item.active":{
                color: "#6870fa !important",
            }
            }}>
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* Logo and menu item */}
                    <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuOpenRoundedIcon style={{ transform: "rotate(180deg)", fontSize: 28 }} /> : undefined}
                              style={{ margin: "10px 0px 20px 0px", color: colors.grey[100]}}>
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" marginLeft="15px">
                                <Typography variant="h3" color={colors.greenAccent[500]} style={{ fontWeight: "Semi Bold" }}>SSOFT</Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOpenRoundedIcon style={{ fontSize: 25 }} />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* display logged in user and home menu item */}
                    {!isCollapsed && (
                        <Box marginBottom="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img alt="profile-user"
                                     width="100px"
                                     height="100px"
                                     src={`../../assets/user.png`}
                                     style={{ cursor: "pointer", borderRadius: "50%" }}/>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h3" color={colors.grey[100]} style={{ fontWeight: "Semi Bold", marginTop: "10px"}}>{user?.Employee?.FullName}</Typography>
                                <Typography variant="h5" color={colors.greenAccent[600]} style={{ fontWeight: "Semi Bold"}}>{user?.Permission?.Name}</Typography>
                            </Box>
                        </Box>
                    )}
        
                    {/* items link menu */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item title="Strona Główna"
                              to="/"
                              icon={<HouseRoundedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                              variant="h4"/>
                        
                        <Typography color={colors.grey[300]} style={{ margin: "15px 0px 5px 10px" }}>Employees</Typography>
                        <Item title="Team"
                              to="/team"
                              icon={<PeopleOutlineRoundedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                              variant="h5"/>
                        <Item title="New Profile"
                              to="/form/profile"
                              icon={<PersonAddAltRoundedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                              variant="h5"/>
                        <Item title="Competence"
                              to="/form/competence"
                              icon={<LocalLibraryRoundedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                              variant="h5"/>
                        <Item title="Update Info"
                              to="/update-info"
                              icon={<DriveFileRenameOutlineRoundedIcon />}
                              selected={selected}
                              setSelected={setSelected}
                              variant="h5"/>

                        {/* department */}
                        <Typography color={colors.grey[300]} style={{ margin: "15px 0px 5px 10px" }}>Department</Typography>
                        <Item title="New Area"
                            to="/form/area"
                            icon={<AddHomeWorkRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            variant="h5"/>
                        <Item title="New Position"
                            to="/form/vacancy"
                            icon={<WorkRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            variant="h5"/>
                        <Item title="New Audit"
                            to="/form/new-audit"
                            icon={<MenuBookRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            variant="h5"/>
                        <Item title="Update Audit"
                            to="/form/update-audit"
                            icon={<AutoStoriesRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            variant="h5"/>

                        <Typography color={colors.grey[300]} style={{ margin: "15px 0px 5px 10px" }}>Reports</Typography>
                        <Item title="Audit dates"
                            to="/audit-dates"
                            icon={<QueryBuilderRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>
                        <Item title="Department Competence"
                            to="/department-competence"
                            icon={<Diversity3RoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>
                        <Item title="Personal Competencies"
                            to="/personal-competence"
                            icon={<EngineeringRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>
                        <Item title="Valuation"
                            to="/valuation-report"
                            icon={<StarHalfRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>
                        <Item title="! Demand For Employees"
                            to="/employee-demand"
                            icon={<EmojiPeopleRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>

                        <Typography color={colors.grey[300]} style={{ margin: "15px 0px 5px 10px" }}>Additionally</Typography>
                        <Item title="Calendar"
                            to="/calendar"
                            icon={<CalendarMonthRoundedIcon />}
                            selected={selected}
                            setSelected={setSelected}/>
                        
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
}

export default Sidebar;