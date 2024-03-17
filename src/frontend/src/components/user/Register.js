import React, { useState, useEffect } from "react";
import AuthenticationService from "../../service/AuthenticationService";
import { Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "../common/NavBar";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import DataService from "../../service/DataService";
// import "../scss/App.scss";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EditUserModal from "./EditUserModal";
import { Link } from "react-router-dom";
import { IconButton, PrimaryButton } from "@fluentui/react";
import { MessageBar, MessageBarType } from "@fluentui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Label,
  TextField,
  Stack,
  ResponsiveMode,
  Separator,
} from "@fluentui/react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@fluentui/react/lib/Spinner";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ConfirmationDialog from "../patientList/ConfirmationDialog";
import { PageHeaderBreadCrumb } from "../common/PageHeaderBreadCrumb";

const Register = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory();
  const [justToReRender, setJustToReRender] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [licenseKey, setLicenseKey] = useState("");
  useEffect(() => {
    getUsers();
  }, [justToReRender]);

  const getUsers = () => {
    AuthenticationService.getUsers()
      .then((response) => response.data)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        // AuthenticationService.checkAndLogout(error);
      });
  };

  const rolesFormatter = (cell, row, rowIndex) => {
    return (
      <div>
        {row.roles.map((role) => (
          <div>
            {role.name === "ROLE_ADMIN"
              ? "Admin  "
              : role.name === "ROLE_HOSPITAL_USER"
              ? "User  "
              : ""}
          </div>
        ))}
      </div>
    );
  };

  const editFormatter = (cell, row, rowIndex) => {
    const openEditUserModal = () => {
      setUserData(row);
      setShowEditUserModal(true);
    };
    return (
      <>
        <Link onClick={openEditUserModal}>
          <FontAwesomeIcon icon={faPencilAlt} onClick={openEditUserModal} />
        </Link>
      </>
    );
  };

  const actionFormatter = (cell, row, rowIndex) => {
    const deleteUser = (row) => {
      AuthenticationService.deleteUser(row.id)
        .then((response) => response.data)
        .then(
          (data) => {
            if (data) {
              Swal.fire({
                icon: "success",
                title: "User deleted",
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => window.location.reload(), 1900);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error while deleting the user",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error while deleting the user",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        );
    };
    return (
      <>
        <ConfirmationDialog
          confirm={() => deleteUser(row)}
          subtext={"Do you want to delete this user?"}
          title={""}
          iconName="Delete"
        />
      </>
    );
  };
  const actionHeaderFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <IconButton iconProps={{ iconName: "Delete" }} />
      </>
    );
  };

  const columns = [
    {
      text: "User Name",
      dataField: "username",
      style: { width: "30vw" },
      headerStyle: { width: "30vw", fontWeight: 600 },
    },
    {
      text: "Email Id",
      dataField: "email",
      style: { width: "40vw" },
      headerStyle: { width: "40vw", fontWeight: 600 },
    },
    {
      text: "Role",
      dataField: "roles.name",
      formatter: rolesFormatter,
      style: { width: "20vw", textAlign: "center" },
      headerStyle: { width: "20vw", fontWeight: 600 },
    },
    {
      text: "Action",
      dataField: "action",
      isDummyField: true,
      formatter: actionFormatter,
      headerFormatter: actionHeaderFormatter,
      headerStyle: { width: "10vw", paddingLeft: 10, fontWeight: 600 },
      style: { paddingLeft: 10, width: "10vw" },
    },
  ];

  return (
    <>
      <div>
        <NavBar />
        <Stack horizontal horizontalAlign="space-between">
          <div style={{ width: "70vh" }}>
            <PageHeaderBreadCrumb
              // key={refresh}
              header="User Management"
              isPatientList={false}
              subtext={false}
            />
          </div>
          <Stack horizontal>
            <IconButton
              iconProps={{ iconName: "Add" }}
              onClick={() => setModalShow(true)}
            >
              Add New User
            </IconButton>
          </Stack>
        </Stack>
        <NewUserModal show={modalShow} onHide={() => setModalShow(false)} />
        <EditUserModal
          show={showEditUserModal}
          onHide={() => setShowEditUserModal(false)}
          userData={userData}
        />
        <Separator />
      </div>
      <div>
        <div>
          <BootstrapTable
            bootstrap4={true}
            keyField="id"
            headerClasses="header-class"
            bodyClasses="body-class"
            data={data}
            columns={columns}
            noDataIndication={"No users found"}
          ></BootstrapTable>
        </div>
      </div>
    </>
  );
};

const Delete = ({ row }) => {
  const DeleteUser = () => {
    Swal.fire({
      title: "Do you want to delete this user?",
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting user");
      }
    });
  };

  return (
    <div>
      <IconButton iconProps={{ iconName: "Delete" }} onClick={DeleteUser} />
    </div>
  );
};

const NewUserModal = ({ show, onHide }) => {
  return (
    <Dialog
      open={show}
      onClose={() => onHide(false)}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Add New User</DialogTitle>

      <DialogContent dividers={true}>
        <NewUserModalBody />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onHide(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NewUserModalBody = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [gmailAvailable, setGmailAvailable] = useState(true);

  const [notAvailableMessage, setNotAvailableMessage] = useState("");
  const [emailNotAvailableMessage, setEmailNotAvailableMessage] = useState("");
  const [gmailNotAvailableMessage, setGmailNotAvailableMessage] = useState("");

  const [registrationFailed, setRegistrationFailed] = useState(false);

  const textFieldStyles = {
    fieldGroup: {
      width: "60vw !important",
    },
  };
  const ValidateUsernameThenEmailAndSubmit = (
    username,
    email,
    firstname,
    lastname,
    password
  ) => {
    setUsernameAvailable(true);

    AuthenticationService.CheckUsername(username)
      .then((response) => response.data)
      .then(
        (data) => {
          if (data !== null) {
            if (data) {
              setUsernameAvailable(true);

              console.log("username is available");

              AuthenticationService.registerUser(
                username,
                email,
                firstname,
                lastname,
                password,
                ["hospital_user"]
              )
                .then((response) => response.data)
                .then(
                  (data) => {
                    if (data) {
                      Swal.fire({
                        icon: "success",
                        title: "User added successfully",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                      setTimeout(() => window.location.reload(), 1900);
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "Error while creating the user",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    }
                  },
                  (error) => {
                    console.log("error while deleting user :", error);
                    Swal.fire({
                      icon: "error",
                      title: "Error while creating the user",
                      showConfirmButton: false,
                      timer: 2000,
                    });
                  }
                );
            } else {
              setUsernameAvailable(false);

              setNotAvailableMessage("Username already exists");
              console.log("Username already exists");
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
          setUsernameAvailable(false);

          setNotAvailableMessage("Unable to check username");
          console.log(error.toString());
        }
      );
  };

  return (
    <>
      <div>
        <Formik
          initialValues={{
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            email: email,
            confirmPassword: confirmPassword,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            ValidateUsernameThenEmailAndSubmit(
              values.username,
              values.email,
              values.firstname,
              values.lastname,
              values.password
            );
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required("This field cannot be left blank")
              .matches(
                /^[a-zA-Z0-9]+$/,
                "Username cannot contain space or special character"
              )
              .max(40, "Username cannot be greater than 40 characters."),
            password: Yup.string()
              .required("This field cannot be left blank")
              .min(8, "Password too weak")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.)/,
                "Must Contain One Uppercase, One Lowercase and One Special Case Character"
              ),

            confirmPassword: Yup.string()
              .required("This field cannot be left blank")
              .oneOf(
                [Yup.ref("password"), null],
                "Both password need to be the same"
              ),
            firstname: Yup.string()
              .required("This field cannot be left blank")
              .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
              .max(40, "First name cannot be greater than 40 characters."),
            lastname: Yup.string()
              .required("This field cannot be left blank")
              .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
              .max(40, "Last name cannot be greater than 40 characters."),
            email: Yup.string()
              .email("Invalid email id")
              .required("This field cannot be left blank")
              .max(250, "Email id cannot be greater than 250 characters."),
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
                <div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="First Name"
                      autoComplete="off"
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="firstname"
                      placeholder="e.g. John"
                      // errorMessage={touched.firstname && errors.firstname}
                      required
                    />
                    {touched.firstname && errors.firstname && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.firstname}
                      </div>
                    )}
                  </div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="Last Name"
                      autoComplete="off"
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="lastname"
                      placeholder="e.g. Doe"
                      required
                    />
                    {touched.lastname && errors.lastname && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.lastname}
                      </div>
                    )}
                  </div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="Username"
                      autoComplete="off"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="username"
                      placeholder="e.g. johndoe12"
                      required
                    />
                    {touched.username && errors.username && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.username}
                      </div>
                    )}
                    {!errors.username && !usernameAvailable && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {notAvailableMessage}
                      </div>
                    )}
                  </div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="Email"
                      autoComplete="off"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="email"
                      placeholder="email@xyz.com"
                      required
                    />
                    {touched.email && errors.email && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.email}
                      </div>
                    )}
                    {!errors.email && !emailAvailable && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {emailNotAvailableMessage}
                      </div>
                    )}
                  </div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="Password"
                      autoComplete="off"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                      type="password"
                      placeholder=""
                      canRevealPassword
                      required
                    />
                    {touched.password && errors.password && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div>
                    <TextField
                      styles={textFieldStyles}
                      label="Confirm Password"
                      autoComplete="off"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="confirmPassword"
                      type="password"
                      placeholder=""
                      required
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <PrimaryButton style={{ marginTop: 15 }} type="submit">
                  Add user
                </PrimaryButton>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default Register;
