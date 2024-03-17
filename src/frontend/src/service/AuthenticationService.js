import axios from "axios";
import { instanceUrl } from "./InstanceProperties";
import authHeader from "./authHeader";
class AuthenticationService {
  login(username, password) {
    return axios
      .post(instanceUrl + "api/auth/signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isRememberMe");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getUserRole() {
    return JSON.parse(localStorage.getItem("user")).roles[0];
  }
  getUsers() {
    return axios.get(instanceUrl + "api/auth/getUsers", {
      headers: authHeader(),
    });
  }

  deleteUser(id) {
    return axios.get(instanceUrl + "api/auth/deleteUser/" + id, {
      headers: authHeader(),
    });
  }

  CheckUsername(username) {
    return axios.get(
      instanceUrl + "api/auth/check-username-available/" + username,
      {
        headers: authHeader(),
      }
    );
  }

  CheckEmail(email) {
    return axios.get(instanceUrl + "api/auth/check-email-available/" + email, {
      headers: authHeader(),
    });
  }

  registerUser(username, email, firstname, lastname, password, role) {
    let dto = {
      username: username,
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
      role: role,
    };

    return axios.post(
      instanceUrl + "api/auth/signup/",
      dto,

      {
        headers: authHeader(),
      }
    );
  }

  forgetPassword(username) {
    let dto = {
      username: username,
    };
    return axios.post(
      instanceUrl + "forgot-pwd",
      dto,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  changePassword(oldPassword, newPassword, confirmNewPassword) {
    let user = this.getCurrentUser();
    let username = user.username;

    let dto = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    return axios.post(
      instanceUrl + "api/auth/change-pwd",
      dto,

      {
        headers: authHeader(),
      }
    );
  }
}

export default new AuthenticationService();
