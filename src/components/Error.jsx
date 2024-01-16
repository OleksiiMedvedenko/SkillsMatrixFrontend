import { Box } from "@mui/material";
import Header from "./Header";

const Error = ({err}) => {
    return (
        <Box margin="20px">
            <Header title="Wystąpił bląd" subtitle={err}/>
        </Box>
    );
}

export default Error;