import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return(
        <Box width="90%" margin="0 22px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography variant="h5" sx={{ color: colors.greenAccent[500], marginTop: "6px"}}>
                        {subtitle}
                    </Typography>
                    <Typography variant="h4"
                                fontWeight="bold"
                                sx={{ color: colors.grey[100] }}>
                        {title}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" marginTop="2px">
                    <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                        {icon}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default StatBox;