import { useEffect, useState } from "react";
import "../../scss/Login.css";
import Logo from "../../images/logo.png";
import {
  Checkbox,
  TextField,
  Text,
  Link,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import AuthenticationService from "../../service/AuthenticationService";
import * as MessageBar from "../common/MessageBar";
import { Formik } from "formik";
import * as Yup from "yup";
// import { encrypt } from "../../helpers/encryption-utility";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [showLoginLink, setShowLoginLink] = useState(false);
  let history = useHistory();

  const goTo = (path) => {
    history.push(path);
  };
  useEffect(() => {
    document.title = "SPTC PIS";

    // localStorage.removeItem("user");
    // localStorage.removeItem("isRememberMe");
    // if (currentUser && localStorage.isRememberMe === true) {
    //   return <Redirect to="/studylist" />;
    // }
  }, []);
  const stackTokens = { childrenGap: 20 };

  const ShowLogin = () => {
    // setLoginFailed(false)
    // setShowLoginLink(false)
    // setShowLogin(true)
    goTo("/login");
  };

  const ShowForgetPwd = () => {
    // setLoginFailed(false)
    // setShowLoginLink(false)
    // setShowLogin(false)
    goTo("/forget-password");
  };

  const textFieldStyles = {
    fieldGroup: {
      border: "none !important",
    },
  };

  return (
    <div className="loginDiv">
      <Formik
        initialValues={{
          username: username,
          password: password,
        }}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          if (showLogin) {
            AuthenticationService.login(values.username, values.password).then(
              () => {
                let user = AuthenticationService.getCurrentUser();
                if (user) {
                  localStorage.setItem("isRememberMe", isRememberMe);
                  if (user.roles.includes("ROLE_ADMIN")) {
                    goTo("/studylist");
                  } else {
                    goTo("/studylist");
                  }
                }
              },
              (error) => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                console.log(resMessage);
                setLoginFailed(true);
                setSubmitting(false);
              }
            );
          } else if (!showLogin) {
            AuthenticationService.forgetPassword(values.username)
              .then((response) => response.data)
              .then(
                (data) => {
                  if (data !== null) {
                    setShowLoginLink(true);
                  } else {
                    setShowLoginLink(false);
                  }
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  console.log(resMessage);
                  setLoginFailed(true);
                  setSubmitting(false);
                }
              );
          }
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <Form onSubmit={handleSubmit}>
              <Stack tokens={stackTokens}>
                <Stack.Item align="center">
                  <img className="loginLogo" src={Logo} alt=""></img>
                </Stack.Item>
                {loginFailed ? (
                  <MessageBar.ErrorMessageBar text="Invalid credentials" />
                ) : showLoginLink ? (
                  <MessageBar.ErrorMessageBar text="Invalid credentials" />
                ) : (
                  <div style={{ height: "32px" }} />
                )}
                <Stack tokens={stackTokens}>
                  <TextField
                    className="no-border"
                    underlined={true}
                    autoComplete="off"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="username"
                    placeholder="Username"
                    errorMessage={touched.username && errors.username}
                    styles={textFieldStyles}
                  />
                  {touched.username && errors.username ? null : (
                    <div style={{ height: "3px" }} />
                  )}
                  {showLogin && (
                    <TextField
                      underlined={true}
                      autoComplete="off"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                      type="password"
                      placeholder="Password"
                      canRevealPassword
                      errorMessage={touched.password && errors.password}
                      styles={textFieldStyles}
                    />
                  )}
                  {touched.password && errors.password ? null : (
                    <div style={{ height: "3px" }} />
                  )}
                </Stack>
                {showLogin && (
                  <>
                    <Stack horizontal horizontalAlign="space-between">
                      {/* <Checkbox
                        label="Remember me"
                        checked={isRememberMe}
                        onChange={(e) => setIsRememberMe(e.target.checked)}
                      /> */}
                      {/* <Text>
                        <Link onClick={ShowForgetPwd}>Forgot Password?</Link>
                      </Text> */}
                      {/* <Stack.Item align="center">
                    <PrimaryButton
                      type="submit"
                      disabled={isSubmitting}
                      text="Sign In"
                    />
                  </Stack.Item> */}
                    </Stack>
                    <Stack.Item align="center">
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        text="Sign In"
                      />
                    </Stack.Item>
                  </>
                )}

                {!showLogin && (
                  <>
                    <Stack horizontal horizontalAlign="space-between">
                      <Text>
                        <Link onClick={ShowLogin}>Login</Link>
                      </Text>
                    </Stack>
                    <Stack.Item align="center">
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        text="Reset Password"
                      />
                    </Stack.Item>
                  </>
                )}
                {/* <Stack.Item align="center">
                  <Text>
                    <Link onClick={() => goTo("/privacy-policy")}>
                      Privacy Policy
                    </Link>
                  </Text>
                </Stack.Item> */}
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;
