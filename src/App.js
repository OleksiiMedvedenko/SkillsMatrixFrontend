import { ColorModeContext, useMode, useLightMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
//global 
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import SignupForm from './components/Authentication/SignupForm';
//pages
import Team from './scenes/team';
import Profile from './scenes/form/profile';
import Competence from './scenes/form/competence';
import Area from './scenes/form/area';
import Dates from './scenes/audit-dates';
import Department from './scenes/department-competence';
import PersonalCompetition from './scenes/personal-competence';
import Demand from './scenes/employee-demand';
import Calendar from './scenes/calendar';
import Notification from './scenes/notification';
import Setting from './scenes/setting';
import UpdateInfo from './scenes/form/update-info';
import CreateVacancy from './scenes/form/vacancy';
import CreateAudit from './scenes/form/new-audit';
import UpdateAudit from './scenes/form/update-audit';
import Valuation from './scenes/valuation-report';
import AuditForm from './scenes/audit-form';
import Levels from './scenes/levels';
import EditCompetence from './scenes/form/edit-competence';
import UpdatePersonalPurpose from './scenes/form/update-purpose';
//login pages 
import LoginForm from './components/Authentication/Login';
import SignUpForm from './components/Authentication/SignUp';
import SignInForm from './components/Authentication/SignIn';
//theme, colors
import { themeSettings } from './theme';
import { createTheme } from "@mui/material/styles";


function App() {
  const [defTheme, colorMode] = useMode();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const location = useLocation();
  const [currentTheme, setTheme] = React.useState(defTheme);

  const isAuditFormPage = location.pathname.startsWith('/audit-form');

  const storedTheme = JSON.parse(localStorage.getItem('currentTheme')) ?? defTheme;

  const isCheckNotification = JSON.parse(localStorage.getItem('isVisibleNotification'));
  if(isCheckNotification === null)
  {
    localStorage.setItem('isVisibleNotification', JSON.stringify(true));
  }

  useEffect(() => {
    // Check if the current route is the AuditForm page
    if (isAuditFormPage) {
      setTheme(createTheme(themeSettings("light")))
      localStorage.setItem('currentTheme', JSON.stringify(defTheme));
    } else {
      localStorage.removeItem('currentTheme')
      // Retrieve the previous theme from local storage
      if (storedTheme.palette.mode === 'dark') {
        setTheme(createTheme(themeSettings("dark")));
      }
      else if(storedTheme.palette.mode === 'light'){
        setTheme(createTheme(themeSettings("light")));
      }
    }
  }, [location.pathname, defTheme]);
  
  const mainContent = (
    <Routes>
      <Route path='/' element={<Calendar />}/>
      <Route path='/team' element={<Team />}/>
      <Route path='/form/profile' element={<Profile />}/>
      <Route path='/form/competence' element={<Competence />}/>
      <Route path='/form/edit-competence' element={<EditCompetence />}/>
      <Route path='/update-info' element={<UpdateInfo />}/>
      <Route path='/form/area' element={<Area />}/>
      <Route path='/form/vacancy' element={<CreateVacancy />} />
      <Route path='/form/new-audit' element={<CreateAudit />} />
      <Route path='/form/update-audit' element={<UpdateAudit />} />
      <Route path='/audit-dates' element={<Dates />}/>
      <Route path='/department-competence' element={<Department />}/>
      <Route path='/personal-competence' element={<PersonalCompetition />}/>
      <Route path='/employee-demand' element={<Demand />}/>
      <Route path='/valuation-report' element={<Valuation />}/>
      <Route path='/calendar' element={<Calendar />}/>
      <Route path='/notification' element={<Notification />}/>
      <Route path='/levels' element={<Levels />}/>
      <Route path='/setting' element={<Setting />}/>
      <Route path='/form/update-purpose' element={<UpdatePersonalPurpose/>}/>
      {/* login pages */}
      <Route path='./components/authentication/Login' element={<LoginForm />}/>
      <Route path='./components/authentication/SignUp' element={<SignUpForm />}/>
      <Route path='./components/authentication/SignIn' element={<SignInForm />}/>
      {/* Separate page */}
      <Route path='/audit-form/:param' element={<AuditForm />}/>
    </Routes>
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={currentTheme ?? defTheme}>
        <CssBaseline />
        {loggedInUser !== "" && loggedInUser !== null ? (
          <div className="app">
             {!isAuditFormPage && <Sidebar />}
            <main className="content">
              {!isAuditFormPage && <Topbar />}
                {isAuditFormPage ? (
                  <AuditForm />
                ) : (
                mainContent
              )}
            </main>
          </div>
        ) : (
          <ThemeProvider theme={createTheme(themeSettings("dark"))}>
            <LoginForm />
          </ThemeProvider>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
