import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AuthRoutes from "routes/AuthRoutes";
import ScrollToTop from "components/ScrollToTop";

import TripDashboard from "containers/TripDashboard";
import TripDetails from "containers/TripDetails";
import Dashboard from "containers/Dashboard";
import TripListing from "containers/TripListing";
import Login from "containers/Login";
import Finance from "containers/Finance";
import LeadDashboard from "containers/LeadDashboard";
// import TripListing from "containers/TripListing";
import PageNotFound from "components/PageNotFound";
import LeadListing from "containers/LeadListing";
import LeadDetails from "containers/LeadDetails";
import NoData from "containers/NoData";

// TODO
// import AddNewLead from "containers/AddNewLead";

import ProtectedRoutes from "routes/ProtectedRoutes";

import "styles/global.scss";

const App = () => {
  /**
   * An array of route objects that define the routes for the application.
   * Each route object contains the following properties:
   * - path: The URL path for the route.
   * - component: The component to render when the route is accessed.
   * - header: A boolean indicating whether to display the header for this route.
   * - sidebar: A boolean indicating whether to display the sidebar for this route.
   */
  const appRoutes = [
    {
      path: "/dashboard",
      component: <Dashboard />,
      header: true,
      sidebar: true
    },
    {
      path: "/trip-dashboard",
      component: <TripDashboard />,
      header: true,
      sidebar: true
    },
    {
      path: "/tripListing/:tripId",
      component: <TripDetails />,
      header: true,
      sidebar: true
    },
    {
      path: "/tripListing",
      component: <TripListing />,
      header: true,
      sidebar: true
    },
    {
      path: "/finance",
      component: <Finance />,
      header: true,
      sidebar: true
    },
    {
      path: "/*",
      component: <PageNotFound />,
      header: true
    },
    {
      path: "/marketing-lead-dashboard",
      component: <LeadDashboard />,
      header: true,
      sidebar: true
    },
    {
      path: "/marketing-lead-listing",
      component: <LeadListing />,
      header: true,
      sidebar: true
    },
    {
      path: "/marketing-lead-listing/lead/:record_id",
      component: <LeadDetails />,
      header: true,
      sidebar: true
    },
    {
      path: "/no-data",
      component: <NoData />,
      header: true,
      sidebar: true
    }

    // TODO
    // {
    //   path: "/marketing-lead-listing/lead",
    //   component: <AddNewLead />,
    //   header: true,
    //   sidebar: true
    // }
  ];
  return (
    <>
      {/* * Renders the main application routes using React Router.
       * @returns The JSX elements representing the application routes.*/}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            {appRoutes?.map((item, i) => (
              <Route
                exact
                path={item?.path}
                key={i}
                element={
                  <AuthRoutes sidebar={item.sidebar} header={item?.header}>
                    {item?.component}
                  </AuthRoutes>
                }
              />
            ))}
          </Route>

          <Route path={"/"} element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
