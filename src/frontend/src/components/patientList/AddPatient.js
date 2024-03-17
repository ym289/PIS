import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import {
  TextField,
  Stack,
  ResponsiveMode,
  IconButton,
  Separator,
  Text,
} from "@fluentui/react";
import { Spinner } from "@fluentui/react/lib/Spinner";
import { PrimaryButton, Label, DatePicker } from "@fluentui/react";
import "../../scss/AddPatient.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DataService from "../../service/DataService";
import AuthenticationService from "../../service/AuthenticationService";
import { useHistory } from "react-router-dom";
import { Dropdown } from "@fluentui/react/lib/Dropdown";

import moment from "moment";
import { PageHeaderBreadCrumb } from "../common/PageHeaderBreadCrumb";
import { Button } from "@material-ui/core";

const AddPatient = () => {
  const [patientId, setPatientId] = useState(
    moment(new Date()).format("YYMMDDHHmmSS")
  );
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const [amount, setAmount] = useState(500);

  const [selectedBirthDate, setSelectedBirthDate] = useState();
  const [selectedGender, setSelectedGender] = React.useState();

  const history = useHistory();
  const goToOtherPage = () => {
    let user = AuthenticationService.getCurrentUser();
    if (user.roles.includes("ROLE_ADMIN")) {
      history.push("/studylist");
    } else {
      history.push("/studylist");
    }
  };
  const cancelAddPatient = () => {
    goToOtherPage();
  };
  const CallAddPatientApi = (dto) => {
    console.log(dto);
    DataService.AddNewPatient(dto)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        if (data) {
          alert(data);
          goToOtherPage();
        } else {
          alert("Error while adding patient");
          setPatientId(moment(new Date()).format("YYMMDDHHmmSS"));
        }
      })
      .catch((error) => {
        console.error("Error adding patient:", error);
        if (error.response) {
          alert("ERROR : " + error.response.data);
        } else {
          alert("Error adding existing patient : ", error);
        }
      });
  };
  const genderOptions = [
    { key: "M", text: "Male" },
    { key: "F", text: "Female" },
    { key: "O", text: "Other" },
  ];

  const changeGender = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedGender(item);
    setGender(item.key);
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "70vw", borderRadius: "10px !important" },
    callout: { maxHeight: "100px !important" },
  };
  return (
    <>
      <NavBar />
      <Stack horizontal horizontalAlign="space-between">
        <div style={{ width: "70vh" }}>
          <PageHeaderBreadCrumb
            header="Add New Patient"
            isPatientList={false}
            subtext={false}
          />
        </div>
        <Stack horizontal>
          <Button
            color="primary"
            onClick={() => history.push("/add-existing-patient")}
          >
            Existing
          </Button>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={cancelAddPatient}
          />
        </Stack>
      </Stack>
      <Separator />
      <div className="form-2">
        <Formik
          initialValues={{
            firstname: firstname,
            lastname: lastname,
            birthDate: birthDate,
            mobileNumber: mobileNumber,
            gender: gender,
            city: city,
            amount: amount,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            let dto = {
              firstName: values.firstname,
              lastName: values.lastname,
              birthDate: values.birthDate,
              mobileNumber: values.mobileNumber,
              gender: values.gender,
              addToStudyList: true,
              city: values.city,
              amount: values.amount,
            };
            console.log(dto);
            CallAddPatientApi(dto);
          }}
          validationSchema={Yup.object().shape({
            firstname: Yup.string()
              .required("This field cannot be left blank")
              // .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
              .max(20, "First name cannot be greater than 40 characters."),
            lastname: Yup.string()
              .required("This field cannot be left blank")
              // .matches(/^[aA-zZ\s]+$/, "Please enter valid name")
              .max(20, "Last name cannot be greater than 40 characters."),
            // birthDate: Yup.string().required("This field cannot be left blank"),
            city: Yup.string()
              .required("This field cannot be left blank")
              // .matches(/^[aA-zZ\s]+$/, "Please enter valid city")
              .max(20, "City cannot be greater than 40 characters."),
            mobileNumber: Yup.string()
              .required("This field cannot be left blank")
              .max(10, "Mobile number cannot be greater than 10 digits.")
              .min(10, "Mobile number cannot be lesser than 10 digits."),

            gender: Yup.string()
              .required("This field cannot be left blank")
              .max(1, "Enter M-Male,F-Female,O-Others")
              .oneOf(["M", "F", "O", "m", "f", "o"]),

            amount: Yup.string().required("Amount can not be empty"),
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
                <div style={{ textAlign: "right" }}>
                  <Text
                    // label="Email"
                    autoComplete="off"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="amount"
                    value={500}
                    // placeholder="e.g. Pandharpur"
                    // errorMessage={touched.email && errors.email}
                    // required
                    type="text"
                    borderless
                    variant={"xLarge"}
                  >
                    ₹500
                  </Text>
                  <div>
                    <div className="textfield-label">
                      <Label required>Mobile Number</Label>
                    </div>
                    <TextField
                      // label="Username"
                      autoComplete="off"
                      value={values.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mobileNumber"
                      placeholder="eg. 8888888888"
                      maxLength={10}
                      // errorMessage={touched.username && errors.username}
                      // required
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
                  <div>
                    <div className="textfield-label">
                      <Label required>First Name</Label>
                    </div>
                    <TextField
                      // label="First Name"
                      autoComplete="off"
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="firstname"
                      placeholder="e.g. John"
                      // errorMessage={touched.firstname && errors.firstname}
                      // required
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
                    <div className="textfield-label">
                      <Label required>Last Name</Label>
                    </div>
                    <TextField
                      // label="Last Name"
                      autoComplete="off"
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="lastname"
                      placeholder="e.g. Doe"
                      // errorMessage={touched.lastname && errors.lastname}
                      // required
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

                  {/* <div>
                    <div className="textfield-label">
                      <Label required>BirthDate</Label>
                    </div>
                    <TextField
                      // label="Email"
                      autoComplete="off"
                      value={values.birthDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="birthDate"
                      placeholder="28/09/1998"
                      // errorMessage={touched.email && errors.email}
                      // required
                      type="date"
                    />
                    {touched.birthDate && errors.birthDate && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.birthDate}
                      </div>
                    )}
                  </div> */}

                  <div>
                    <div className="textfield-label">
                      <Label required>Gender</Label>
                    </div>
                    <TextField
                      // label="Email"
                      autoComplete="off"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="gender"
                      placeholder="eg. M, F, O"
                      // errorMessage={touched.email && errors.email}
                      // required
                      type="text"
                    />
                    {/* <Dropdown
                      placeholder="Select gender"
                      // defaultSelectedKey={"male"}
                      responsiveMode={ResponsiveMode.large}
                      options={genderOptions}
                      styles={dropdownStyles}
                      onChange={changeGender}
                      selectedKey={
                        selectedGender ? selectedGender.key : undefined
                      }
                    /> */}
                    {touched.gender && errors.gender && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.gender}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="textfield-label">
                      <Label required>City</Label>
                    </div>
                    <TextField
                      // label="Email"
                      autoComplete="off"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="city"
                      placeholder="e.g. Pandharpur"
                      // errorMessage={touched.email && errors.email}
                      // required
                      type="text"
                    />
                    {/* <Dropdown
                      placeholder="Select gender"
                      // defaultSelectedKey={"male"}
                      responsiveMode={ResponsiveMode.large}
                      options={genderOptions}
                      styles={dropdownStyles}
                      onChange={changeGender}
                      selectedKey={
                        selectedGender ? selectedGender.key : undefined
                      }
                    /> */}
                    {touched.city && errors.city && (
                      <div className="error">
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          style={{ marginRight: 4 }}
                        />
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>
                <div className="go-back-or-continue sticky-footer-for-big-form">
                  {/* <div className="go-back" onClick={Goback}>
                    <FontAwesomeIcon
                      icon={faChevronCircleLeft}
                      style={{ marginRight: 3 }}
                    />
                    Go Back
                  </div> */}
                  <div>
                    <PrimaryButton className="class" type="submit">
                      Add
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default AddPatient;
