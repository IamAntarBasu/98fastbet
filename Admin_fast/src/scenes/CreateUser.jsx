import React, { useState } from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../components/Header";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hardcoded backend URL to fix connection issues
const BACKEND_URL = "https://api.umkk.life";

const initialValues = {
  contact: "",
  balance: "",
  email: "",
  password: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Contact is required"),
  balance: yup.string().required("Balance is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Form() {
  const [activePage, setActivePage] = useState("Id");
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/signup`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`User created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit2 = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/signupmatka`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`Matka user created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };


  const handleFormSubmit3 = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/aarpaarparchpagelogin`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`Aar Paar user created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };


  const handleFormSubmit4 = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/avaitorpagesignup`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`Avaitor user created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit5 = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/cricketpagesignup`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`Cricket Market user created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit6 = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/titlipagesignup`,
        {
          username: values.contact,
          email: values.email,
          password: values.password,
          balance: parseFloat(values.balance),
        }
      );

      toast.success(`Titli user created successfully with balance: ₹${response.data.user.balance}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#4caf50',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
      resetForm();
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#f44336',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '8px'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Id":
        return <Page1 handleFormSubmit={handleFormSubmit} />;
      case "Matka":
        return <Page2 handleFormSubmit2={handleFormSubmit2}/>;
      case "Payment":
        return <Page3 handleFormSubmit3={handleFormSubmit3}/>;
      case "Avaitor":
        return <Page4 handleFormSubmit4={handleFormSubmit4}/>;
      case "Cricket Market":
        return <Page5 handleFormSubmit5={handleFormSubmit5}/>;
      case "Tittli":
        return <Page6 handleFormSubmit6={handleFormSubmit6}/>;
      default:
        return <Page1 handleFormSubmit={handleFormSubmit} />;
    }
  };

  return (
    <Box m="0.5rem 1rem">
      <Header title="MULTIPLE FORMS" subtitle="Switch Between Forms Using Buttons" />
      
      <Box mb={2} display="flex" justifyContent="space-between">
        {["Id", "Matka","Cricket Market","Tittli","Payment", "Avaitor"].map((page, index) => (
          <Button
            key={page}
            variant="contained"
            color={activePage === page ? "primary" : "secondary"}
            onClick={() => setActivePage(page)}
          >
            Client {page}
          </Button>
        ))}
      </Box>

      {renderPage()}
      
      {/* Toast container - contained within this component only */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
      />
    </Box>
  );
}

function Page1({ handleFormSubmit }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
      <Header title="CREATE NEW USER" subtitle="Create New User Profile" />
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function Page2({ handleFormSubmit2 }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
      <Header title="CREATE NEW MATKA SUBADMIN" subtitle="Create New Matka Profile" />
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit2}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function Page3({ handleFormSubmit3 }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
      <Header title="CREATE NEW AAAR PAAR PARCHI SUBADMIN" subtitle="Create New Aaar Parr parchi Profile" />
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit3}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function Page4({ handleFormSubmit4 }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
      <Header title="CREATE NEW AVAITOR SUBADMIN" subtitle="Create New AVAITOR Profile" />
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit4}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function Page5({ handleFormSubmit5 }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
    <Header title="CREATE NEW CRICKET Market SUBADMIN" subtitle="Create New Cricket Market Profile" />
     
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit5}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function Page6({ handleFormSubmit6 }) {
  const isNonMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="0.5rem 1rem">
      <Header title="CREATE NEW TITTLI SUBADMIN" subtitle="Create New Tittli Profile" />
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleFormSubmit6}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns={isNonMobile ? undefined : "repeat(12, 1fr)"}
            >
              {["contact", "balance", "email", "password"].map((field, index) => (
                <TextField
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  variant="filled"
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={values[field]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched[field] && Boolean(errors[field])}
                  helperText={touched[field] && errors[field]}
                  sx={{ gridColumn: isNonMobile ? undefined : (field === "balance" ? "span 6" : "span 12") }}
                  InputLabelProps={{ style: { color: colors.grey[100] } }}
                  disabled={isSubmitting}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="0.4rem">
              <Button 
                type="submit" 
                color="secondary" 
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create New User"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
export default Form;
