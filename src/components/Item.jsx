import { MenuItem } from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import { useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import 'react-pro-sidebar/dist/css/styles.css';


const Item = ({title, to, icon, selected, setSelected, variant="h", target=null}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return( 
        <MenuItem active={selected === title} style={{color: colors.grey[100]}} onClick={() => setSelected(title)} icon={icon}>
            <Typography variant={variant}>{title}</Typography>
            {target === null ? (<Link to={to}/>) : (<Link to={to} target={target} rel="noopener noreferrer"/>) }

        </MenuItem>
    );
}

export default Item;