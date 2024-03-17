import React, { useState, useEffect } from "react";
import AuthenticationService from "../../service/AuthenticationService";
import { Form, Button, Card, Modal } from "react-bootstrap";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
// import "../scss/App.scss";

const EditUserModal = (props) => {
  return (
    <Modal
      {...props}
      // size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <EditUserModalBody userData={props.userData} />
      </Modal.Body>
    </Modal>
  );
};

const EditUserModalBody = ({ userData }) => {
  const [clientId, setClientId] = useState(userData.clientId);

  const [username, setUsername] = useState(userData.username);

  const [email, setEmail] = useState(userData.email);

  const [role, setRole] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [enterAllData, setEnterAllData] = useState(false);
  const [selectProperly, setSelectProperly] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectRole, setSelectRole] = useState(false);

  useEffect(() => {
    let roles = [];

    userData.roles.map((role) => {
      if (role.id === 1) {
        roles.push("ris");
      }
      if (role.id === 2) {
        roles.push("gateway");
      }
      if (role.id === 3) {
        roles.push("admin");
      }
    });
    setRole(roles);
    console.log(role);
  }, []);

  const editUser = () => {
    if (username !== "" && email !== "" && clientId !== "") {
      setEnterAllData(false);

      if (role.length !== 0) {
        setSelectRole(false);
        console.log(role);

        Swal.fire({
          title: "Update user info?",
          showCancelButton: true,
          confirmButtonText: `Yes`,
        }).then((result) => {
          if (result.isConfirmed) {
            const signUpRequestBody = {
              username: username,
              email: email,
              role: role,
              clientId: clientId,
            };
            AuthenticationService.editUser(signUpRequestBody, userData.id)
              .then((response) => response.data)
              .then(
                (data) => {
                  if (data != null) {
                    setSuccessful(true);
                    Swal.fire({
                      icon: "success",
                      title: "Saved",
                      showConfirmButton: false,
                      timer: 2000,
                    });
                    setTimeout(() => window.location.reload(), 2000);
                  }
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  setMessage(resMessage);
                  setSuccessful(false);
                  console.log(resMessage);
                }
              );
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
      } else {
        setSelectRole(true);
      }
    } else {
      setEnterAllData(true);
    }
  };

  const checkBox = (event) => {
    if (event.target !== null || event.target !== undefined) {
      var array = [...role]; // make a separate copy of the array
      var index = array.indexOf(event.target.name);
      if (index !== -1) {
        array.splice(index, 1);
        setRole(array);
      } else {
        setRole((role) => [...role, event.target.name]);
        setSelectRole(false);
      }
    } else {
      setSelectProperly(true);
    }
  };
  return (
    <div
      style={{
        marginTop: "1%",
        maxWidth: 600,
        margin: "1%",
        marginBottom: "7%",
      }}
    >
      {enterAllData ? (
        <Card style={{ textAlign: "center" }} className="alert alert-danger">
          *Please fill all the fields
        </Card>
      ) : message ? (
        <Card style={{ textAlign: "center" }} className="alert alert-danger">
          {message}
        </Card>
      ) : selectRole ? (
        <Card style={{ textAlign: "center" }} className="alert alert-danger">
          *Please select the role
        </Card>
      ) : (
        <div style={{ height: 53 }} />
      )}

      <Card
        style={{ maxWidth: 400, padding: "8%", marginTop: "3%" }}
        className="risFormCard"
      >
        <Form>
          <Form.Group>
            <Form.Label className="requiredFormLabel">
              Client Id<div className="required">*</div>
            </Form.Label>
            <Form.Control
              style={{ maxWidth: 320 }}
              required
              // autoComplete="off"
              type="text"
              name="clientId"
              placeholder="Client Id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="requiredFormLabel">
              Username<div className="required">*</div>
            </Form.Label>
            <Form.Control
              style={{ maxWidth: 320 }}
              required
              autoComplete="off"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={username === "admin"}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="requiredFormLabel">
              Email Id<div className="required">*</div>
            </Form.Label>
            <Form.Control
              style={{ maxWidth: 320 }}
              required
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <div className="requiredFormLabel">
            Role<div className="required">*</div>{" "}
          </div>
          <FormControlLabel
            style={{
              marginBottom: 0,
              marginRight: 0,
              marginLeft: 0,
              pointerEvents: "none",
            }}
            control={
              <Checkbox
                onChange={checkBox}
                name="ris"
                color="primary"
                style={{ pointerEvents: "auto" }}
                checked={role.indexOf("ris") !== -1}
                disabled={username === "admin"}
              />
            }
            label="RIS"
          />
          <FormControlLabel
            style={{
              marginBottom: 0,
              marginRight: 0,
              marginLeft: 0,
              pointerEvents: "none",
            }}
            control={
              <Checkbox
                onChange={checkBox}
                name="gateway"
                color="primary"
                style={{ pointerEvents: "auto" }}
                checked={role.indexOf("gateway") !== -1}
                disabled={username === "admin"}
              />
            }
            label="Edge"
          />
          <FormControlLabel
            style={{
              marginBottom: 0,
              marginRight: 0,
              marginLeft: 0,
              pointerEvents: "none",
            }}
            control={
              <Checkbox
                onChange={checkBox}
                name="admin"
                color="primary"
                style={{ pointerEvents: "auto" }}
                checked={role.indexOf("admin") !== -1}
                disabled={username === "admin"}
              />
            }
            label="Admin"
          />

          {selectProperly && (
            <div className="text-danger">Click on checkbox only</div>
          )}
          <br />
          <Button
            variant="primary"
            style={{
              height: 38,
              textAlign: "center",
              marginTop: "3%",
              width: 100,
            }}
            onClick={editUser}
          >
            Update <FontAwesomeIcon icon={faSave} />
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditUserModal;
