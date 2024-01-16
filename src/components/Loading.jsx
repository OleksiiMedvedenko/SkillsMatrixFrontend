import { Box } from "@mui/material";
import "./../style/spinner.css"

const Loading = () => {
    return (
        <Box sx={{ position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"}}>
            <Box className="spinner-container">
                <Box className="loading-spinner" />
            </Box>
        </Box>
      );
}

export default Loading;