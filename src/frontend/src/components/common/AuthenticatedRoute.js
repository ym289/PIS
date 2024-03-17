import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthenticationService from "../../service/AuthenticationService";

class AuthenticatedRoute extends Component {
  render() {
    let user = AuthenticationService.getCurrentUser();
    if (user) {
      return <Route {...this.props} />;
    } else {
      return <Redirect to="/login" />;
    }
  }
}

export default AuthenticatedRoute;
