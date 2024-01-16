import React from "react";
//material ui
import { Box, Typography, useTheme } from "@mui/material";
//colors 
import { tokens } from "../../theme";

function SignUpForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [state, setState] = React.useState({
    name: "",
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

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { name, email, password } = state;
    alert(
      `You are sign up with name: ${name} email: ${email} and password: ${password}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };
  
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

  return (
    <Box className="form-container sign-up-container">
      <form style={formStyle} onSubmit={handleOnSubmit}>
        <Typography variant="h1" color={colors.grey[400]} style={{fontWeight: "Bold"}}>
          Utwórz konto
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
        <span>or use your email for registration</span>
        <input style={inputStyle}
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input style={inputStyle}
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input style={inputStyle}
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
      </form>
    </Box>
  );
}

export default SignUpForm;
