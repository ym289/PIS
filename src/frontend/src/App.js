import React from "react";
import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../src/components/user/Login";
import PatientListPage from "../src/components/patientList/PatientListPage";
import NewEntry from "../src/components/patientList/NewPatient";
import AddPatient from "./components/patientList/AddPatient";
import AuthenticatedRoute from "../src/components/common/AuthenticatedRoute";
import { RecoilRoot } from "recoil";
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import AddHistoryModal from "./components/AddHistoryModal";
// import ForgetPassword from "./components/ForgetPassword";
import ChangePassword from "./components/user/ChangePassword";
import { initializeIcons } from "@uifabric/icons";
import AddExistingPatient from "./components/patientList/AddExistingPatient";
import Studylist from "./components/patientList/Studylist";
import Register from "./components/user/Register";
import Invoice from "./components/print/Invoice";
function App() {
  let redirectToStudyList = JSON.parse(localStorage.getItem("isRememberMe"));

  initializeIcons();

  return (
    <Router>
      <RecoilRoot>
        <div>
          <Switch>
            <Route
              path="/"
              exact
              component={redirectToStudyList ? PatientListPage : Login}
            />
            <Route path="/login" exact component={Login} />
            {/* <Route path="/forget-password" exact component={ForgetPassword} /> */}
            {/* <Route path="/privacy-policy" exact component={PrivacyPolicy} /> */}
            <AuthenticatedRoute
              path="/patientlist"
              exact
              component={PatientListPage}
            />
            <AuthenticatedRoute path="/studylist" exact component={Studylist} />
            <AuthenticatedRoute
              path="/add-new-patient"
              exact
              component={AddPatient}
            />
            <AuthenticatedRoute
              path="/add-existing-patient"
              exact
              component={AddExistingPatient}
            />

            <AuthenticatedRoute
              path="/change-password"
              exact
              component={ChangePassword}
            />

            <AuthenticatedRoute path="/users" exact component={Register} />

            {/* <AuthenticatedRoute
              path="/history"
              exact
              component={AddHistoryModal}
            /> */}
          </Switch>
        </div>
      </RecoilRoot>
    </Router>
  );
}

export default App;
