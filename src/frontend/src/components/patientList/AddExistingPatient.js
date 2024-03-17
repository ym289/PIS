import React, { useEffect, useState, useRef } from "react";
import NavBar from "../common/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Separator, TextField, Checkbox, Text } from "@fluentui/react";
import { Spinner } from "@fluentui/react/lib/Spinner";
import { PrimaryButton, Label } from "@fluentui/react";
import "../../scss/AddPatient.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DataService from "../../service/DataService";
import AuthenticationService from "../../service/AuthenticationService";
import { useHistory } from "react-router-dom";
import { IconButton, Stack } from "office-ui-fabric-react";
import { PageHeaderBreadCrumb } from "../common/PageHeaderBreadCrumb";
import { Button } from "@material-ui/core";

const AddExistingPatient = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [continueLastRecord, setContinueLastRecord] = useState(true);
  const [amount, setAmount] = useState(300);
  const inputRef = useRef(null);

  function _onChange(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) {
    setContinueLastRecord(isChecked);
    console.log(`The option has been changed to ${isChecked}.`);
  }
  const history = useHistory();

  const cancelAddPatient = () => {
    let user = AuthenticationService.getCurrentUser();
    if (user.roles.includes("ROLE_ADMIN")) {
      history.push("/studylist");
    } else {
      history.push("/studylist");
    }
  };
  const CallAddPatientApi = (mobileNumber, amount) => {
    let dto = {
      amount: amount,
      mobileNumber: mobileNumber,
      continueLastRecord: continueLastRecord,
    };
    DataService.AddExistingPatient(dto)
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          alert(data);
          history.push("/studylist");
        } else {
          alert("Could not add as existing patient.");
        }
      })
      .catch((error) => {
        console.error("Error adding existing patient:", error);
        if (error.response) {
          alert("ERROR : " + error.response.data);
        } else {
          alert("Error adding existing patient : ", error);
        }
      });
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <>
      <NavBar />
      <Stack horizontal horizontalAlign="space-between">
        <div style={{ width: "70vh" }}>
          <PageHeaderBreadCrumb
            header="Add Existing Patient"
            isPatientList={false}
            subtext={false}
          />
        </div>
        <Stack horizontal>
          <Button
            color="primary"
            onClick={() => history.push("/add-new-patient")}
          >
            New{" "}
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
            mobileNumber: mobileNumber,
            amount: amount,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            CallAddPatientApi(values.mobileNumber, values.amount);
          }}
          validationSchema={Yup.object().shape({
            mobileNumber: Yup.string()
              .required("This field cannot be left blank")
              .max(10, "Mobile Number cannot be greater than 10 characters.")
              .min(10, "Mobile Number cannot be lesser than 10 characters."),
            amount: Yup.string().required(),
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
                    value={300}
                    // placeholder="e.g. Pandharpur"
                    // errorMessage={touched.email && errors.email}
                    // required
                    type="text"
                    borderless
                    variant={"xLarge"}
                  >
                    ₹300
                  </Text>

                  <div>
                    <div className="textfield-label">
                      <Label required>Mobile Number</Label>
                    </div>
                    <TextField
                      // label="First Name"
                      autoComplete="off"
                      value={values.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="mobileNumber"
                      placeholder="e.g. 9999999999"
                      maxLength={10}
                      componentRef={inputRef}
                      inputProps={{ autoFocus: true }}
                      // errorMessage={touched.firstname && errors.firstname}
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
                  <div style={{ marginTop: 30 }}>
                    <Checkbox
                      label="Continue last record"
                      defaultChecked
                      onChange={_onChange}
                    />
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

export default AddExistingPatient;
