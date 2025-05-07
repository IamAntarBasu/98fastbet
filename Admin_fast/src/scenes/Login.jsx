

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Hardcoded login for testing (Replace this with actual API)
        if (email === "fastbet@gmail.com" && password === "fastbet@123") {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("email" ,email);
            setIsAuthenticated(true);
            navigate("/");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    padding: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: "#121212",
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
