import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  filterAtom,
  mobileNumberAtom,
  openSearchAtom,
  patientFilterAtom,
  refreshAtom,
} from "../../recoilState/RecoilState";
import { useRecoilState } from "recoil";
import Collapse from "@material-ui/core/Collapse";
import { PrimaryButton, Text, TextField, Dropdown } from "@fluentui/react";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Label } from "@fluentui/react";
import "../../scss/AddPatient.css";
import moment from "moment";
import { TreatmentDropdown } from "../patientList/TreatmentDropdown";

const SearchPanel = ({ isPatientList }) => {
  const [filter, setFilter] = useRecoilState(filterAtom);
  const [patientFilter, setPatientFilter] = useRecoilState(patientFilterAtom);

  const [openSearch, setOpenSearch] = useRecoilState(openSearchAtom);
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const [selectedItem, setSelectedItem] = useState({});

  const handleClose = () => {
    setOpenSearch(false);
  };

  const applyTodayFilter = () => {
    let dto = {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      treatmentList: [],
      treatmentDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    setFilter(dto);
    setOpenSearch(false);
  };

  const applyFilter = (dto) => {
    setFilter(dto);
    console.log(dto);
    setOpenSearch(false);
  };

  const applyPatientFilter = (dto) => {
    setPatientFilter(dto);
    console.log(dto);
    setOpenSearch(false);
  };

  const clearFilter = () => {
    let dto = {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      treatmentDate: moment(new Date()).format("YYYY-MM-DD"),
      treatmentList: [],
    };
    applyFilterbasedOnStudyListOrPatientList(dto);
  };

  const applyFilterbasedOnStudyListOrPatientList = (dto) => {
    if (isPatientList) {
      applyPatientFilter(dto);
    } else {
      applyFilter(dto);
    }
    setRefresh(!refresh);
  };

  const treatmentOptions: IDropdownOption[] = [
    { key: "", text: " ", hidden: true },
  ];

  const setTreatmentArray = (treatmentList) => {
    console.log("setting treatmentList filter ", treatmentList);
    setFilter((filter) => ({
      ...filter,
      ["treatmentList"]: treatmentList,
    }));
  };
  return (
    <Dialog
      open={openSearch}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        <div style={{ float: "left" }}>Filters</div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Collapse in={openSearch} timeout="auto" unmountOnExit>
          <div className="search-bar">
            <Formik
              initialValues={{
                firstName: isPatientList
                  ? patientFilter.firstName
                  : filter.firstName,
                lastName: isPatientList
                  ? patientFilter.lastName
                  : filter.lastName,
                mobileNumber: isPatientList
                  ? patientFilter.mobileNumber
                  : filter.mobileNumber,
                treatmentDate: filter.treatmentDate,
              }}
              enableReinitialize={true}
              onSubmit={(values, { setSubmitting }) => {
                let dto = {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  mobileNumber: values.mobileNumber,
                  treatmentDate: values.treatmentDate,
                  treatmentList: filter.treatmentList,
                  // treatmentList: filter.treatmentList,
                };
                console.log(dto);
                applyFilterbasedOnStudyListOrPatientList(dto);
              }}
              validationSchema={Yup.object().shape({
                firstName: Yup.string()
                  // .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
                  .max(40, "First name cannot be greater than 40 characters."),
                lastName: Yup.string()
                  // .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
                  .max(40, "Last name cannot be greater than 40 characters."),

                mobileNumber: Yup.string().min(
                  10,
                  "Mobile number should have 10 digits."
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
                    <div>
                      <div>
                        {!isPatientList && (
                          <div>
                            <div className="textfield-label">
                              <Label>Treatment Date</Label>
                            </div>
                            <TextField
                              // label="Email"
                              autoComplete="off"
                              value={values.treatmentDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="treatmentDate"
                              placeholder={new Date()}
                              // errorMessage={touched.email && errors.email}
                              // required
                              type="date"
                            />
                            {touched.date && errors.date && (
                              <div className="error">
                                <FontAwesomeIcon
                                  icon={faExclamationCircle}
                                  style={{ marginRight: 4 }}
                                />
                                {errors.treatmentDate}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <div className="textfield-label">
                            <Label>Mobile Number</Label>
                          </div>
                          <TextField
                            // label="Username"
                            autoComplete="off"
                            value={values.mobileNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="mobileNumber"
                            placeholder="eg. 8888888888"
                            // errorMessage={touched.username && errors.username}
                            // required
                            maxLength={10}
                          />

                          {touched.mobileNumber && errors.mobileNumber && (
                            <div className="error">
                              <FontAwesomeIcon
                                icon={faExclamationCircle}
                                style={{ marginRight: 4 }}
                              />
                              {errors.mobileNumber}
                            </div>
                          )}
                        </div>

                        {!isPatientList && (
                          <div>
                            <div className="textfield-label">
                              <Label>Treatment</Label>
                            </div>
                            <TreatmentDropdown
                              selectedTreatments={filter.treatmentList}
                              setTreatmentList={(treatments) =>
                                setTreatmentArray(treatments)
                              }
                            />
                          </div>
                        )}
                        <div className="textfield-label">
                          <Label>First Name</Label>
                        </div>
                        <TextField
                          // label="First Name"
                          autoComplete="off"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="firstName"
                          placeholder="e.g. John"
                          // errorMessage={touched.firstName && errors.firstName}
                          // required
                        />
                        {touched.firstName && errors.firstName && (
                          <div className="error">
                            <FontAwesomeIcon
                              icon={faExclamationCircle}
                              style={{ marginRight: 4 }}
                            />
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="textfield-label">
                          <Label>Last Name</Label>
                        </div>
                        <TextField
                          // label="Last Name"
                          autoComplete="off"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="lastName"
                          placeholder="e.g. Doe"
                          // errorMessage={touched.lastName && errors.lastName}
                          // required
                        />
                        {touched.lastName && errors.lastName && (
                          <div className="error">
                            <FontAwesomeIcon
                              icon={faExclamationCircle}
                              style={{ marginRight: 4 }}
                            />
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 15 }}>
                      <div style={{ float: "left" }}>
                        <Text style={{ color: "blue" }} onClick={clearFilter}>
                          Clear
                        </Text>
                      </div>

                      <div style={{ float: "right" }}>
                        <PrimaryButton type="submit">Apply</PrimaryButton>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Collapse>
      </DialogContent>
      <DialogActions>
        {!isPatientList && (
          <Button onClick={applyTodayFilter} color="primary">
            Today
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchPanel;
