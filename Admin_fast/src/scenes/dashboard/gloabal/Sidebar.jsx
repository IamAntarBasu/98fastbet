import React from "react";
import { Sidebar as MySidebar, Menu, MenuItem } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { useState } from "react";
import { Link } from "react-router-dom";
import userImage from "../../../assets/images/user3.avif";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import EventIcon from '@mui/icons-material/Event';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

function Sidebar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");

  return (
    <div className="sidebar">
      <Box
        sx={{
          "& .pro-sidebar": {
            backgroundColor: "black !important",
          },
          "& .pro-sidebar-inner": {
            backgroundColor: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            // padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            // color: `${colors.grey[700]} !important`,
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
          "& .ps-menuitem-root:hover": {
            color: "yellow !important",
          },
        }}
      >
        <MySidebar
          // className="sidebar"
          collapsed={isCollapsed}
          backgroundColor={colors.primary[400]}
          height="100vh"
        // overflowY="scroll"
        // position="fixed"
        >
          <Menu
            iconShape="square"
            menuItemStyles={{
              button: {
                // the active class will be added automatically by react router
                // so we can use it to style the active menu item
                [`&:hover`]: {
                  backgroundColor: colors.blueAccent[300],
                  // color: "#b6c8d9",
                },
                [`&.active`]: {
                  backgroundColor: "#fff",
                  color: "#b6c8d9",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => setCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0px 20px 0px",
                color: colors.grey[700],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMINIS
                  </Typography>
                  <IconButton onClick={() => setCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    src={userImage}
                    alt="user-profile"
                    width="100px"
                    height="100px"
                    style={{
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {localStorage.getItem("email")}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="400"
                    color={colors.greenAccent[500]}
                  >
                    Admin
                  </Typography>
                </Box>
              </Box>
            )}




            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0px 5px 20px" }}
              >
                Admin Accese
              </Typography>
              <Item
                title="Home"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                {/* <Item
                title="Live Session Cricket"
                to="/cricket2"
                icon={<EventIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Live Market"
                to="/event"
                icon={<EventIcon />}
                selected={selected}
                setSelected={setSelected}
              />*/}

              <Item
                title="Matka"
                to="/matka"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> 
                 <Item
                title="Avaitor"
                to="/avaitor"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Cricket"
                to="/cricket"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                <Item
                title="Result Declaration"
                to="/result-declaration"
                icon={<EmojiEventsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Titli Par"
                to="/titli"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                <Item
                title="Titli Control"
                to="/titli2"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
                <Item
                title="Andhar Bhar"
                to="/andr"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               <Item
                title="Mines"
                to="/mines"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="All Users"
                to="/contact"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Cricke Market"
                to="/cricket/market"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              {/* <Item
                title="Admin form"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              <Item
                title="Create User"
                to="/form2"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Payment"
                to="/payment"
                icon={<PaymentOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />



                  <Item
                title="Data Delete"
                to="/delete"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Invoices Balances"
                to="/invoices"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Pie Chart"
                to="/pie"
                icon={<PieChartOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="User Management"
                to="/users"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            </Box>
          </Menu>
        </MySidebar>
      </Box>
    </div>
  );
}

export default Sidebar;
