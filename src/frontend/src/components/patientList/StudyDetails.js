import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { TreatmentDropdown } from "./TreatmentDropdown";
import { TextField, Text } from "office-ui-fabric-react";
import { IconButton } from "@fluentui/react";
import DataService from "../../service/DataService";
import AuthenticationService from "../../service/AuthenticationService";

const StudyDetails = ({ row, display, isPatientList, refresh }) => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(row.firstName);
  const [lastName, setLastName] = useState(row.lastName);
  const [birthDate, setBirthDate] = useState(row.birthDate);
  const [mobileNumber, setMobileNumber] = useState(row.mobileNumber);
  const [gender, setGender] = useState(row.gender);
  const [city, setCity] = useState(row.city);
  const [dignosis, setDignosis] = useState(row.dignosis);
  const [treatmentList, setTreatmentList] = useState(row.treatmentList);
  const [treatmentDate, setTreatmentDate] = useState(row.treatmentDate);
  const [dayCount, setDayCount] = useState(row.dayCount);

  const [editMode, setEditMode] = useState(true);
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";
  const handleClose = () => {
    setEditMode(false);
    setOpen(false);
  };

  useEffect(() => {}, []);

  const handleChange = (e) => {
    if (editMode) {
      console.log(e.target.name);
      if (e.target.name === "firstName") {
        setFirstName(e.target.value);
      }
      if (e.target.name === "lastName") {
        setLastName(e.target.value);
      }
      if (e.target.name === "mobileNumber") {
        setMobileNumber(e.target.value);
      }
      if (e.target.name === "birthDate") {
        setBirthDate(e.target.value);
      }
      if (e.target.name === "gender") {
        setGender(e.target.value);
      }
      if (e.target.name === "dignosis") {
        setDignosis(e.target.value);
      }
      if (e.target.name === "treatmentList") {
        setTreatmentList(e.target.value);
      }
      if (e.target.name === "treatmentDate") {
        setTreatmentDate(e.target.value);
      }
      if (e.target.name === "dayCount") {
        setDayCount(e.target.value);
      }
      if (e.target.name === "city") {
        setCity(e.target.value);
      }
    }
  };

  const editDetails = () => {
    if (isPatientList) {
      let dto = {
        mobileNumber: mobileNumber,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        gender: gender,
        city: city,
      };
      DataService.editPatient(dto, row.mobileNumber)
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setEditMode(false);
          refresh();
          handleClose();
        })
        .catch((error) => {
          console.error("Error editing  patient:", error);
          alert("An error occurred while editing patient." + error.message);
        });
    } else {
      let dto = {
        id: row.id,
        dignosis: dignosis,
        treatmentList: treatmentList,
        treatmentDate: treatmentDate,
        dayCount: dayCount,
      };
      DataService.editStudy(dto, row.id)
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setEditMode(false);
          refresh();
          handleClose();
        })
        .catch((error) => {
          console.error("Error editing study:", error);
          alert(
            "An error occurred while editing patient study." + error.message
          );
        });
    }
  };

  const removeEditMode = () => {
    setMobileNumber(row.mobileNumber);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setBirthDate(row.birthDate);
    setGender(row.gender);
    setDignosis(row.dignosis);
    setTreatmentList(row.treatmentList);
    setTreatmentDate(row.treatmentDate);
    setDayCount(row.dayCount);
    setEditMode(false);
    setCity(row.city);
  };

  const textFieldStyles = {
    fieldGroup: {
      border: !editMode ? "none !important" : "",
      width: "37vw !important",
      // overflowWrap: "anywhere",
    },
  };

  const textFieldStylesName = {
    fieldGroup: {
      border: "none !important",
      width: "37vw !important",
      // overflowWrap: "anywhere",
    },
  };

  const textFieldStylesMobileNumber = {
    fieldGroup: {
      border: "none !important",
      width: "37vw !important",
      // overflowWrap: "anywhere",
    },
  };

  const setTreatmentArray = (treatmentList) => {
    setTreatmentList(treatmentList);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const openModal = () => {
    setOpen(true);
    setMobileNumber(row.mobileNumber);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setBirthDate(row.birthDate);
    setGender(row.gender);
    setDignosis(row.dignosis);
    setTreatmentList(row.treatmentList);
    setTreatmentDate(row.treatmentDate);
    setDayCount(row.dayCount);
    setCity(row.city);
  };
  return (
    <div>
      <div onClick={() => openModal()}>{display}</div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div style={{ float: "left" }}>
            {isPatientList ? "Patient Details" : "Study Details"}
          </div>
          {adminUser && (
            <>
              {" "}
              <div style={{ float: "right" }}>
                {!editMode && (
                  <IconButton
                    iconProps={{ iconName: "Edit" }}
                    onClick={() => setEditMode(true)}
                  />
                )}
                {editMode && (
                  <IconButton
                    iconProps={{ iconName: "Clear" }}
                    onClick={removeEditMode}
                  />
                )}
              </div>
            </>
          )}
        </DialogTitle>
        <DialogContent dividers={true}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Contact</TableCell>

                  <TableCell>
                    <TextField
                      name="mobileNumber"
                      value={mobileNumber}
                      borderless={true}
                      onChange={handleChange}
                      underlined={false}
                      readOnly={true}
                      styles={textFieldStylesMobileNumber}
                      minLength={10}
                      maxLength={10}
                    ></TextField>
                  </TableCell>
                </TableRow>
                {!isPatientList && (
                  <TableRow>
                    <TableCell>Name</TableCell>

                    <TableCell>
                      <TextField
                        name="firstNameLastName"
                        value={firstName + " " + lastName}
                        borderless={true}
                        onChange={handleChange}
                        // underlined={!isPatientList ? false : editMode}
                        readOnly={true}
                        styles={textFieldStylesName}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                )}
                {isPatientList && !editMode && (
                  <TableRow>
                    <TableCell>Name</TableCell>

                    <TableCell>
                      <TextField
                        name="firstNameLastName"
                        value={firstName + " " + lastName}
                        borderless={true}
                        onChange={handleChange}
                        // underlined={!isPatientList ? false : editMode}
                        readOnly={true}
                        styles={textFieldStyles}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                )}
                {isPatientList && editMode && (
                  <>
                    {" "}
                    <TableRow>
                      <TableCell>First Name</TableCell>

                      <TableCell>
                        <TextField
                          name="firstName"
                          value={firstName}
                          borderless={true}
                          onChange={handleChange}
                          // underlined={!isPatientList ? false : editMode}
                          readOnly={!isPatientList ? true : !editMode}
                          styles={textFieldStyles}
                          minLength={3}
                          maxLength={20}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Name</TableCell>

                      <TableCell>
                        <TextField
                          name="lastName"
                          value={lastName}
                          borderless={true}
                          onChange={handleChange}
                          // underlined={!isPatientList ? false : editMode}
                          readOnly={!isPatientList ? true : !editMode}
                          styles={textFieldStyles}
                          minLength={3}
                          maxLength={20}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {isPatientList && (
                  <>
                    <TableRow>
                      <TableCell>Gender</TableCell>

                      <TableCell>
                        <TextField
                          name="gender"
                          value={gender}
                          borderless={true}
                          onChange={handleChange}
                          // underlined={!isPatientList ? false : editMode}
                          readOnly={!isPatientList ? true : !editMode}
                          styles={textFieldStyles}
                          minLength={1}
                          maxLength={1}
                          placeholder="eg. M, F, O"
                        ></TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>BirthDate</TableCell>

                      <TableCell>
                        {" "}
                        <TextField
                          name="birthDate"
                          value={birthDate}
                          borderless={true}
                          onChange={handleChange}
                          type="date"
                          // underlined={!isPatientList ? false : editMode}
                          readOnly={!isPatientList ? true : !editMode}
                          styles={textFieldStyles}
                          minLength={1}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>City</TableCell>

                      <TableCell>
                        {" "}
                        <TextField
                          name="city"
                          value={city}
                          borderless={true}
                          onChange={handleChange}
                          type="text"
                          // underlined={!isPatientList ? false : editMode}
                          readOnly={!isPatientList ? true : !editMode}
                          styles={textFieldStyles}
                          minLength={1}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {!isPatientList && (
                  <>
                    {" "}
                    <TableRow>
                      <TableCell>Dignosis</TableCell>

                      <TableCell>
                        {" "}
                        <TextField
                          className="no-border"
                          name="dignosis"
                          value={dignosis}
                          borderless={true}
                          onChange={handleChange}
                          // underlined={editMode}
                          readOnly={!editMode}
                          // resizable={true}
                          multiline={editMode && dignosis !== ""}
                          styles={textFieldStyles}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Treatment</TableCell>

                      <TableCell className="study-details">
                        {!editMode && (
                          <Text
                            name="treatmentList"
                            value={treatmentList}
                            borderless={true}
                            // onChange={handleChange}
                            // underlined={editMode}
                            // readOnly={true}
                            styles={textFieldStyles}
                          >
                            {treatmentList
                              .map((item) => capitalizeFirstLetter(item))
                              .join(", ")}
                          </Text>
                        )}
                        {editMode && (
                          <TreatmentDropdown
                            selectedTreatments={treatmentList}
                            setTreatmentList={(treatments) =>
                              setTreatmentArray(treatments)
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Treatment Date</TableCell>

                      <TableCell>
                        {" "}
                        <TextField
                          name="treatmentDate"
                          value={treatmentDate}
                          borderless={true}
                          onChange={handleChange}
                          underlined={editMode}
                          readOnly={!editMode}
                          styles={textFieldStyles}
                          type="date"
                        ></TextField>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Day</TableCell>

                      <TableCell>
                        {" "}
                        <TextField
                          name="dayCount"
                          value={dayCount}
                          borderless={true}
                          onChange={handleChange}
                          underlined={editMode}
                          readOnly={!editMode}
                          styles={textFieldStyles}
                          minLength={1}
                        ></TextField>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
          {editMode && (
            <Button onClick={editDetails} color="primary">
              SAVE
            </Button>
          )}
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default StudyDetails;
