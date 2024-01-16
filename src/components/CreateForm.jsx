import React, { useState, useEffect } from 'react';
import { TextField, Box, Grid, List, Card, CardHeader, ListItem, ListItemText, ListItemIcon, Checkbox, Button, Divider, MenuItem, Select, Typography, useTheme } from '@mui/material';
//api 
import useFetch from '../service/getApi';
import usePost from '../service/postApi';
//endpoint 
import { REACT_APP_API_URL, REACT_APP_API_HOST_URL } from '../env';
//components
import Loading from './Loading';
import Error from './Error';
import Alerts from './Alerts';
import AuditFormHeader from './AuditFormHeader';
//colors
import { tokens } from '../theme';

const CreateForm = ({auditId, authorId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [rightSelectedValues, setRightSelectedValues] = useState({});
  const [minLevel, setMinLevel] = React.useState();

  const [formData, setFormData] = React.useState({
    uniqueIdentifier: '',
    drafted: '',
    checked: '',
    approved: '',
    division: ''
  });

  const { data: createTemplateResult, error: createTemplateError, postData: createTemplatePost} = usePost();
  const { data: createHeaderResult, postData: createHeaderPost} = usePost();
  const { data: questions, loading, error } = useFetch(REACT_APP_API_URL + "Question/getQuestions");

  useEffect(() => {
    if (questions) {
      setLeft(questions.map(question => question.QuestionId));
    }
  }, [questions]);

  const leftChecked = checked.filter(value => left.includes(value));
  const rightChecked = checked.filter(value => right.includes(value));

  const handleToggle = (value) => () => {
    if (checked.includes(value)) {
      setChecked(checked.filter(item => item !== value));
    } else {
      setChecked([...checked, value]);
    }
  };

  useEffect(() => {
    if (right !== null && right.length > 0) {
      const result = {};
  
      for (const id of right) {
        result[id] = rightSelectedValues[id] || '1';
      }
  
      let sum = 0;
  
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          // Convert the value to a number using parseInt, assuming all values are integers
          const value = parseInt(result[key]);
          // Check if the conversion was successful (not NaN) before adding
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
  
      setMinLevel(sum); // Move this outside of the loop
    }
  }, [right, rightSelectedValues]);

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
  };

  const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
  };

  const union = (a, b) => {
    return [...a, ...not(b, a)];
  };

  const handleCheckedRight = () => {
    const newRightSelectedValues = {};
    leftChecked.forEach(value => {
      newRightSelectedValues[value] = '1'; // Default value
    });
  
    setRightSelectedValues({
      ...rightSelectedValues,
      ...newRightSelectedValues,
    });
  
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked([]);
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const filteredQuestions = questions.filter(question =>
    question.Topic.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handlerCreateTemplate = () => {

    if (
      formData.uniqueIdentifier.trim() === '' ||
      formData.drafted.trim() === '' ||
      formData.checked.trim() === '' ||
      formData.approved.trim() === '' || 
      formData.division === ''
    ) {
      window.alert('uzupelnij wszytkie pola')
      return; // Do not send data if validation fails
    }

    const result = {};

    for (const id of right) {
      result[id] = rightSelectedValues[id] || '1';
    }

    const template = [];

    for (const id of Object.keys(result)) {
      const createTemplateModel = {
        TemplateId: null,
        AuditId: auditId,
        QuestionId: id,
        MinValue: result[id],
        AuthorId: authorId,
      };
  
      template.push(createTemplateModel);
    }

    if(template.length > 0)
    {
      createTemplatePost(REACT_APP_API_URL + 'Form/createTemplate', template).then(() => {
        // Once the template is updated successfully, update the header
        createHeaderPost(REACT_APP_API_URL + 'Form/createHeader', formData);
      });;
    }
  }

  if(loading) return <Loading />
  if(error?.length > 0) return <Error err={error} />
  
  const customList = (title, items, isDisplaySelectBox = false) => (
    <Card variant="outlined" sx={{ border: "1px solid #ccc", borderRadius: "6px" }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Box>
            <Checkbox onClick={handleToggleAll(items)}
              color="secondary"
              checked={numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={
                numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
              }
              disabled={items.length === 0}
              inputProps={{
                'aria-label': 'all items selected',}}/>
          </Box>
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} wybrano`}>
      </CardHeader>
      <Divider />
      <List sx={{
          width: 570,
          height: 320,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list">

        {items.map(value => {
          const question = questions.find(q => q?.QuestionId === value);
          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  color='secondary'
                  inputProps={{
                    'aria-labelledby': `transfer-list-all-item-${value}-label`,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={`transfer-list-all-item-${value}-label`}
                primary={question ? question?.Topic : ''}/>
              {isDisplaySelectBox ?
                <ListItemIcon>
                  <Select value={rightSelectedValues[value] || '1'}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setRightSelectedValues({
                        ...rightSelectedValues,
                        [value]: newValue,
                      });
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select">
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                </ListItemIcon>
                : null}
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Box>
      <Box>
        <TextField label="Szukaj pytania"
                variant="outlined"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}/>
      </Box>
      <Box marginTop="15px">
          <Grid container spacing={2} display="flex" justifyContent="flex-start" alignItems="center">
          <Grid item>{customList('Wszystkie pytania', filteredQuestions.filter(obj => left.includes(obj.QuestionId)).map(obj => obj.QuestionId))}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked?.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                color="secondary"
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked?.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Wybrane pytania', right, true)}</Grid>
          <Box display="flex" flexDirection="column" padding={3}>
            <div>
              <Typography variant="h6" color={colors.redAccent[300]} fontWeight="bold" sx={{ mb: "5px"}}>Minimalna ilość punktów dla zaliczenia:  {minLevel}</Typography>
            </div>
            <br/>
            <div>
              <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold" sx={{ mb: "25px"}} >Maksymalna ilość punktów: {right.length * 2}</Typography>
            </div>
            <div>
            <Typography style={{ color: colors.greenAccent[600], display: 'inline' }} fontWeight="bold" variant="h6">
                Podaj maksymalną ilość dla poziom 1: 
              </Typography>
              <TextField id="standard-number"
                        type="number"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            division: e?.target?.value,
                          });
                        }}
                        sx={{
                          marginLeft: "10px",
                          marginTop: "-3px",
                          "& input": { // Style for the input field itself
                            fontSize: "14px",
                          },
                          "& label": {
                            fontSize: "17px", // Font size for the label
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="standard"/>
            </div>
          </Box>
        </Grid>
      </Box>
      <Box>
        <AuditFormHeader formData={formData} setFormData={setFormData} />
      </Box>
      <Button sx={{marginTop: "10px"}}
              color="secondary" 
              variant="contained" 
              onClick={() => {handlerCreateTemplate()}}>
              {createTemplateError !== null ? <Alerts severity="error" message="Szablon NIE został utworzony!"/> : null}   
              {createTemplateResult !== null ? (createTemplateResult ? <Alerts severity="success" message="Szablon został utworzony!"/> : <Alerts severity="error" message="Szablon NIE został utworzony!"/> ) : (null)}
        Utworz
      </Button>
    </Box>
   
  );
};

export default CreateForm;