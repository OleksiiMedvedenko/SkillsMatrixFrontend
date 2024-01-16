import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
//divider
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
//icons
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';

const TooltipNotification = ({data}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return(
        <Box overflow="auto" height="25vh" justifyContent="space-between" color={colors.greenAccent[500]}>
            {data.map((event, i) => (
                <List key={i} 
                    sx={{ width: '100%', maxWidth: 360, minWidth: "230px", opacity: "0.85"}} 
                    component="nav" 
                    aria-label="mailbox folders">
                    <ListItem>
                        <ListItemAvatar>
                        <Avatar>
                            <CircleNotificationsRoundedIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <Typography component="div" variant="h5" sx={{ color: colors.greenAccent[500] }}>{event?.Employee?.FullName + " " } &nbsp;&nbsp;</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography component="div" variant="h6" sx={{ color: colors.white[0] }}>{`\n${event?.Audit?.Name} - ${event?.Audit?.CurrentAuditInfo?.Item1}`}</Typography>
                    </ListItem>
                <Divider light />
            </List>
            ))}
        </Box>
        
    );
}

export default TooltipNotification;