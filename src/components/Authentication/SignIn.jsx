import React from "react";
//material ui
import { Box, TextField, Typography, useTheme, Button } from "@mui/material";
//colors 
import { tokens } from "../../theme";
//endpoint
import { REACT_APP_API_URL } from "../../env";
import axios from "axios";

const hrefStyle = {    
  color: "#333",    
  border: "1px solid #dddddd",
  borderRadius: "50%",
  display: "inline",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 5px",
  height: "40px",
  width: "40px",
}

const formStyle = {
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 50px",
    height: "100%",
    textAlign: "center",
}

const inputStyle = {
  backgroundColor: "#eee",
  border: "none",
  padding: "12px 15px",
  margin: "8px 0",
  width: "100%"
}

function SignInForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { email, password } = state;

    try {
        const response = await axios.get(`${REACT_APP_API_URL}authorization/login/${email}/${password}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
  
        localStorage.setItem('loggedInUser',  JSON.stringify(response.data));

        window.location.replace("/");
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <Box className="form-container sign-in-container">
      <form style={formStyle} onSubmit={handleOnSubmit}>
        <Typography variant="h1" color={colors.grey[400]} style={{fontWeight: "Bold"}}>
          Zaloguj
        </Typography>
        <Box sx={{
            margin: "20px 0"
          }}>
          <a style={hrefStyle} href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a style={hrefStyle} href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a style={hrefStyle} href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </Box>
        <input style={inputStyle}
          type="" // email
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}/>
        <input style={inputStyle}
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}/>
        <a style={{
            color: "#333",
            fontSize: "14px",
            textDecoration: "none",
            margin: "15px 0",
          }} href="#">Zapomniałeś hasła?</a>
        <button >
          <Typography variant="h5" color={colors.white[0]} style={{fontWeight: "Semi Bold"}}>Zaloguj</Typography>
        </button>
      </form>
    </Box>
  );
}

export default SignInForm;
