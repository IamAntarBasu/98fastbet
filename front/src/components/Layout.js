import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
// import SportNavbar from './SportNavbar';
import SideNavbar from './SideNavbar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const SidebarWrapper = styled.div`
  flex: 0 0 250px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const Layout = () => {
  // const handleToggleSidebar = () => {
  //   // Your sidebar toggle logic here
  // };
  return (
    <LayoutContainer>
      <Header />
      <SideNavbar  />;
      {/* <SportNavbar /> */}
     
    
      <MainContent>
        {/* <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
         */}
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 