import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

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

function App() {
  const [theme, colorMode] = useMode();
  
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          {( user !== "" && user !== null ) ? (
            <div className="app">
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path='/' element={<Calendar />}/>
                  <Route path='/team' element={<Team />}/>
                  <Route path='/form/profile' element={<Profile />}/>
                  <Route path='/form/competence' element={<Competence />}/>
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
                  <Route path='/setting' element={<Setting />}/>
                  <Route path='./features/authentication/components/SignupForm' element={<SignupForm />}/>
                </Routes>
              </main>
            </div>
            ) : (
              <SignupForm />
            )}
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
