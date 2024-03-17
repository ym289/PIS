import { useEffect, useState } from "react";
import "../../scss/Login.css";
import { TextField, Text, Link, PrimaryButton, Stack } from "@fluentui/react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import AuthenticationService from "../../service/AuthenticationService";
import * as MessageBar from "../common/MessageBar";
import { Formik } from "formik";
import * as Yup from "yup";
import Navbar from "../common/NavBar";

// import { encrypt } from "../../helpers/encryption-utility";

const ChangePassword = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [showLoginLink, setShowLoginLink] = useState(false);
  const [message, setMessage] = useState("");
  let history = useHistory();

  const goTo = (path) => {
    history.push(path);
  };
  useEffect(() => {
    document.title = "Deeptek";
    // localStorage.removeItem("user");
    // localStorage.removeItem("isRememberMe");
  }, []);
  const stackTokens = { childrenGap: 20 };
  const currentUser = AuthenticationService.getCurrentUser();
  if (currentUser && localStorage.isRememberMe === true) {
    // return <Redirect to="/studylist" />;
  }

  const ShowStudyList = () => {
    // setLoginFailed(false)
    // setShowLoginLink(false)
    // setShowLogin(false)
    goTo("/studylist");
  };

  const goToLoginPage = () => {
    AuthenticationService.logout();
    goTo("/login");
  };

  const textFieldStyles = {
    fieldGroup: {
      border: "none !important",
    },
  };

  return (
    <>
      <Navbar />
      <Stack>
        <Stack.Item align="center">
          <h2>Change Password</h2>
        </Stack.Item>
      </Stack>
      <div className="changePwdDiv">
        <Formik
          initialValues={{
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setLoginFailed(false);
            AuthenticationService.changePassword(
              values.oldPassword,
              values.newPassword,
              values.confirmNewPassword
            )
              .then((response) => console.log(response.data))
              .then(
                (data) => {
                  if (data !== null) {
                    setShowLoginLink(true);
                    setSubmitting(false);
                  } else {
                    setShowLoginLink(false);
                    setSubmitting(false);
                  }
                },
                (error) => {
                  console.log(error.response);
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  if (error.response.status === 400) {
                    setMessage(error.response.data);
                  } else {
                    setMessage("Error while changing the password");
                  }
                  setLoginFailed(true);
                  setSubmitting(false);
                }
              );
          }}
          validationSchema={Yup.object().shape({
            oldPassword: Yup.string().required("Old Password is required"),
            newPassword: Yup.string()
              .required("New Password is required")
              .min(8, "Password too short")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.)/,
                "Must Contain One Uppercase, One Lowercase and One Special Case Character"
              ),
            confirmNewPassword: Yup.string()
              .required("Please re-enter new password")
              .oneOf(
                [Yup.ref("newPassword"), null],
                "Both password need to be the same"
              ),
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
                  {loginFailed ? (
                    <MessageBar.ErrorMessageBar text={message} />
                  ) : showLoginLink ? (
                    <MessageBar.Success
                      goToLoginPage={(e) => goToLoginPage(e)}
                      text="Password changed successfully."
                    />
                  ) : (
                    <div style={{ height: "32px" }} />
                  )}
                  <Stack tokens={stackTokens}>
                    <TextField
                      underlined={true}
                      autoComplete="off"
                      value={values.oldPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="password"
                      name="oldPassword"
                      placeholder="Old Password"
                      canRevealPassword
                      errorMessage={touched.oldPassword && errors.oldPassword}
                      styles={textFieldStyles}
                    />
                    {touched.oldPassword && errors.oldPassword ? null : (
                      <div style={{ height: "3px" }} />
                    )}
                    <TextField
                      underlined={true}
                      autoComplete="off"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="newPassword"
                      type="password"
                      placeholder="New Password"
                      canRevealPassword
                      errorMessage={touched.newPassword && errors.newPassword}
                      styles={textFieldStyles}
                    />
                    {touched.newPassword && errors.newPassword ? null : (
                      <div style={{ height: "3px" }} />
                    )}
                    <TextField
                      underlined={true}
                      autoComplete="off"
                      value={values.confirmNewPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="confirmNewPassword"
                      type="password"
                      placeholder="Confirm New Password"
                      canRevealPassword
                      errorMessage={
                        touched.confirmNewPassword && errors.confirmNewPassword
                      }
                      styles={textFieldStyles}
                    />
                    {touched.confirmNewPassword &&
                    errors.confirmNewPassword ? null : (
                      <div style={{ height: "3px" }} />
                    )}
                  </Stack>
                  <Stack horizontal horizontalAlign="space-between">
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
                      text="Change Password"
                    />
                  </Stack.Item>
                  {showLoginLink ? (
                    <Stack.Item align="center">
                      <Text>
                        <Link onClick={goToLoginPage}>Login</Link>
                      </Text>
                    </Stack.Item>
                  ) : (
                    <Stack.Item align="center">
                      <Text>
                        <Link onClick={ShowStudyList}>Study List</Link>
                      </Text>
                    </Stack.Item>
                  )}
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ChangePassword;
