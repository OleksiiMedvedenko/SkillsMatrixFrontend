import React, { useState } from "react";
//material ui
import { Box, Typography, useTheme, Button } from "@mui/material";
//styles
import "./../../style/loginFormStyle.css";
//components
import SignUpForm from "./SignUp";
import SignInForm from "./SignIn";
//colors 
import { tokens } from "../../theme";

const LoginForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <Box display="flex" justifyContent="center" alignItems="center" marginTop="10%">
      <Box className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <Box className="overlay-container">
          <Box className="overlay">
            <Box className="overlay-panel overlay-left">
              <Typography variant="h1" color={colors.white[0]} style={{fontWeight: "Bold"}}>Witamy spowrotem!</Typography>
              <Typography variant="h5" color={colors.white[0]} padding="20px">
                Aby pozostać z nami w kontakcie, zaloguj się, podaj swoje dane osobowe
              </Typography>
              <Button id="signIn"
                onClick={() => handleOnClick("signIn")}
                variant="outlined"
                sx={{ borderRadius: "15px",
                      borderColor: "white"}}>
                  <Typography variant="h5" color={colors.white[0]} style={{fontWeight: "Semi Bold"}}>Zaloguj</Typography>
              </Button>
            </Box>
            <Box className="overlay-panel overlay-right">
              <Typography variant="h1" color={colors.white[0]} style={{fontWeight: "Bold"}}>Witamy!</Typography>
              <Typography variant="h5" color={colors.white[0]} padding="20px">Podaj swoje dane osobowe i rozpocznij z nami podróż</Typography>
              <Button id="signUp"
                      variant="outlined"
                      sx={{ borderRadius: "15px",
                            borderColor: "white"}}
                      onClick={() => handleOnClick("signUp")}>
                  <Typography variant="h5" color={colors.white[0]} style={{fontWeight: "Semi Bold"}}>Zarejestruj</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;