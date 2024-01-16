import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
//components
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Alerts from "../../components/Alerts";
//colors
import { tokens } from "../../theme";
//endpoint
import { REACT_APP_API_URL } from "../../env";
//api
import useFetch from "../../service/getApi";
import usePost from "../../service/postApi";
//excel
import LevelDescriptionExportFile from "../../components/ExportXLSX/LevelDescriptionExportFile";

const Levels = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectAudit, setSelectAudit] = useState(null);
  const department = JSON.parse(sessionStorage.getItem("departmentId"));

  const { data: postResult, error: postError, postData: postData} = usePost();
  const { data: audits, loading, error } = useFetch( REACT_APP_API_URL + "audit/getAudits");
  const { data: auditInfo } = useFetch(REACT_APP_API_URL + "levelDescription/getLevelDescription/" + selectAudit?.AuditId);
  const { data: data } = useFetch(REACT_APP_API_URL + "levelDescription/GetDepartmentAuditLevelDescription/" + department);

  // Initialize descriptions state with empty strings
  const [descriptions, setDescriptions] = useState(["", "", ""]);

  useEffect(() => {
    // Update descriptions state when auditInfo data is available
    if (auditInfo) {
      const initialDescriptions = auditInfo.map((item) => item?.Description || "");
      setDescriptions(initialDescriptions);
    } 
  }, [auditInfo]);

  if (loading) return <Loading />;
  if (error?.length > 0) return <Error err={error} />;

  const handleUpdateDescription = () => {
    const updatedAuditInfo = auditInfo.map((item, index) => ({
      ...item,
      Description: descriptions[index],
    }));

    postData(REACT_APP_API_URL + 'LevelDescription/updateLevelDescriptionInfo', updatedAuditInfo); 
    //setTimeout(window.location.reload(), 300);
  };
  
  return (
    <Box m="20px">
      <Header
        title="Opis poziomu"
        subtitle="Co oznacza zerowy, pierwszy i drugi poziom wiedzy | Aktualizacja opisu poziomu"/>

      <Box
        flex="1 1 20%"
        backgroundColor={colors.primary[400]}
        p="15px"
        borderRadius="4px"
        alignItems="center">
          
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          onChange={(event, value) => {
            setSelectAudit(value);
          }}
          options={audits?.filter(
            (a) => a?.Area?.Department?.DepartmentId === department
          )}
          sx={{ width: "100%" }}
          getOptionLabel={(option) => option?.Name}
          renderInput={(params) => (
            <TextField
              label={
                department === null
                  ? "Najpierw wybierz dział"
                  : "Wyszykaj kompetencję"
              }
              {...params}
            />
          )}
        />

        {selectAudit && (
          <Box marginTop="33px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Aktualizuj
            </Typography>
            <Box alignItems="center" marginLeft="20px">
              {[0, 1, 2].map((index) => (
                <div key={index}>
                  <TextField
                    id={`outlined-helperText-${index}`}
                    value={descriptions[index] ?? ''}
                    onChange={(e) => {
                      const newDescriptions = [...descriptions];
                      newDescriptions[index] = e.target.value;
                      setDescriptions(newDescriptions);
                    }}
                    label={`Wpisz opis poziomu ${auditInfo[index]?.Level}`}
                    sx={{
                      width: "100%",
                      marginTop: "20px",
                      "& input": {
                        fontSize: "15px", // Font size for the text inside the TextField
                      },
                      "& label": {
                        fontSize: "15px", // Font size for the label
                      },
                    }}
                  />
                  <br />
                </div>
              ))}
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                onClick={handleUpdateDescription}
                type="submit"
                color="secondary"
                variant="contained"
              >
                Aktualizuj
              </Button>
              {postError !== null ? <Alerts severity="error" message="Opis NIE został zaktualizowany!"/> : null}
              {postResult !== null ? (postResult ? <Alerts severity="success" message="Opis został zaktualizowany!"/> : <Alerts severity="error" message="Opis NIE został zaktualizowany!"/> ) : (null)}
            </Box>
          </Box>
        )}
      </Box>
      <LevelDescriptionExportFile data={data}/>
    </Box>
  );
};

export default Levels;
