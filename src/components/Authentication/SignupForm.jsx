import React, { useState } from 'react';
import { Typography, useTheme, Box, Button, TextField, FormHelperText } from '@mui/material';
import { tokens } from '../../theme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from "yup";
import axios from "axios";
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from '../../env';

const initialValues = {
  email: "",
  password: ""
}

const loginSchema = yup.object().shape({
  email: yup.string().required("required"),
  password: yup.string().required("required")
})

const SignupForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLogingFailed, setLoginFailed] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}authorization/login/${values.email}/${values.password}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });

      localStorage.setItem('loggedInUser',  JSON.stringify(response.data));

      window.location.replace("/");
    } catch (error) {
      console.log(error);
      setLoginFailed(true);
    }
  };

  return (
    <Box
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
      }}
      backgroundColor={theme.palette.mode === 'dark'
        ? (colors.primary[400])
        : (`${colors.primary[400]} !important`)}
      minHeight="320px"
      minWidth="440px"
      borderRadius="10px"
      borderColor={colors.yellow[500]}
    >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={loginSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box justifyContent="center" alignItems="center" alignContent="center">
              <Box padding="30px 0px 0px 40px">
                <Typography variant="h3" color={colors.white[0]} style={{ fontWeight: "Semi Bold" }}>Sign In</Typography>
              </Box>

              <Box justifyContent="space-between" padding={5} gap="30px">
                <Field
                  fullWidth
                  as={TextField}
                  variant="filled"
                  type="text" // email
                  label="Login"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={touched.email && !!errors.email}
                  helperText={<ErrorMessage name="email" />}
                />
                <Field
                  fullWidth
                  as={TextField}
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={touched.password && !!errors.password}
                  helperText={<ErrorMessage name="password" />}
                />

                <Box display="flex">
                  <FormHelperText onClick={handleFormSubmit} style={{ color: colors.redAccent[500] }} variant="filled" id="email">
                    {isLogingFailed === true ? ("Login lub hasło są nieprawidłowe lub użytkownik nie jest zarejestrowany") : ("")}
                  </FormHelperText>
                </Box>

                <Box display="flex" justifyContent="left" mt="40px">
                  <Button type="submit" color="secondary" variant="contained">
                    Login
                  </Button>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default SignupForm;