import "./App.css";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./scenes/dashboard/gloabal/Sidebar";
import Topbar from "./scenes/dashboard/gloabal/Topbar";
import Dashboard from "./scenes/dashboard";
import Matka from "./scenes/Matka";
import Invoices from "./scenes/Invoices";
import Contact from "./scenes/Constact";
import Bar from "./scenes/Bar";
import Line from "./scenes/Line";
import Pie from "./scenes/Pie";
import Faq from "./scenes/Faq";
import Geography from "./scenes/Geography";
import Calendar from "./scenes/Calendar";
import Payment from "./scenes/Payment";
import CreateUser from "./scenes/CreateUser";
import Events from "./scenes/Events";
import Cricket from "./scenes/Cricket";
import Login from "./scenes/Login"; // Import the Login page
import Titli from "./scenes/Titli";
import Andhr from "./scenes/Andhr";
import Mines from "./scenes/Mines";
import LiveCricketMarket from './scenes/Matches'
// import CricketSession from "./scenes/CricketSession";
import Avaitor from "./scenes/Avaitor";
import TiltliSet from "./scenes/TiltliSet";
import ResultDeclaration from "./scenes/ResultDeclaration";
import T20 from "./scenes/T20";
import DeleteData from "./scenes/DeleteData";
import UserManagement from "./scenes/UserManagement";

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(loggedIn === "true");
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated ? (
            <>
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/matka" element={<Matka />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/form2" element={<CreateUser />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/event" element={<Events />} />
                  <Route path="/cricket" element={<Cricket />} />
                  <Route path="/titli" element={<Titli/>} />
                  <Route path="/andr" element={<Andhr/>} />
                  <Route path="/mines" element={<Mines/>} />
                  {/* <Route path="/cricket/market" element={<T20/>} /> */}
                  <Route path="/avaitor" element={<Avaitor/>} />
                  <Route path="/result-declaration" element={<ResultDeclaration />} />
                  <Route path="/titli2" element={<TiltliSet/>} />
                  <Route path="/cricket/market" element={<LiveCricketMarket/>} />
                  <Route path="/session/resultdeclaration" element={<T20 />} />
                  <Route path="/delete" element={<DeleteData />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </>
          ) : (
            <Routes>
              <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
