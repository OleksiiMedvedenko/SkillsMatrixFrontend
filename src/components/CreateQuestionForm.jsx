import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import * as React from 'react';
//components
import Loading from "./Loading";
import Error from "./Error";
import Alerts from "./Alerts";
//api
import useFetch from "../service/getApi";
import usePost from "../service/postApi";
//endpoint 
import { REACT_APP_API_URL } from "../env";

const initialValues = {
    question: "",
    groupName: "",
}

const createSchema = yup.object().shape({
    question: yup.string().required("required"),
    groupName: yup.string().required("required"),
})

const CreateQuestionForm = () => {
    // post Data
    const { data: result, error: postError, postData: postData} = usePost();
    //fetch data 
    const { data: data, loading, error: error } = useFetch();

    if(loading) return <Loading />
    if(error?.length > 0 ){
        return <Error err={error}/>
    } 

    const handleFormSubmit = (values) => {
        const obj = {
            Topic: values.question,
            GroupName: values.groupName,
        }  

        postData(REACT_APP_API_URL + 'question/createQuestion', obj);

        values.question = "";
        values.groupName = "";
    }

    return(
        <Box margin="20px">
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={createSchema}>
                {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <Box gap="30px">
                            <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Pytanie"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       value={values.question}
                                       name="question"
                                       error={!!touched.question && !!errors.question}
                                       helperText={touched.question && errors.question}/>

                             <TextField fullWidth
                                       variant="filled"
                                       type="text"
                                       label="Grupa"
                                       onBlur={handleBlur}
                                       onChange={handleChange}
                                       sx={{marginTop: '15px'}}
                                       value={values.groupName}
                                       name="groupName"
                                       error={!!touched.groupName && !!errors.groupName}
                                       helperText={touched.groupName && errors.groupName}/>
                        </Box>
                        <Box display="flex" justifyContent="start" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Utwórz Pytanie
                                {postError !== null ? <Alerts severity="error" message="Pytanie NIE zostało utworzone!"/> : null}  
                                {result !== null ? (result ? <Alerts severity="success" message="Pytanie zostało utworzone!"/> : <Alerts severity="error" message="Pytanie NIE zostało utworzone!"/> ) : (null)}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default CreateQuestionForm;
