import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import Todos from "./components/Todos";
import ColorModeContainer from "./components/ColorModeContainer";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Footer from "./components/Footer";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import "./App.css";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    history.push("/login");
  }
  return (
    !isAuthenticating && (
      <>
        <>
          <ColorModeContainer>
            <div className="App container py-3">
              <Navbar collapseOnSelect bg="light" expand="md" id="nav-bar" className="mb-3 rounded">
                <LinkContainer to="/">
                  <Navbar.Brand className="font-weight-bold text-muted">Home</Navbar.Brand>
                </LinkContainer>
                <LinkContainer to="/todos">
                  <Navbar.Brand className="font-weight-bold text-muted">ToDos</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Nav activeKey={window.location.pathname}>
                    {isAuthenticated ? (
                      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    ) : (
                      <>
                        <LinkContainer to="/signup">
                          <Nav.Link>Signup</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/login">
                          <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                <Routes />
              </AppContext.Provider>
              {/*<h1 className="text-center">ToDos App</h1>*/}
              <Todos />
            </div>
          </ColorModeContainer>
        </>
        <Footer />
      </>
    )
  );
}

export default App;
