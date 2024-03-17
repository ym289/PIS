import axios from "axios";
import { instanceUrl } from "./InstanceProperties";
import authHeader from "./authHeader";

class DataService {
  AddNewPatient(dto) {
    return axios.post(instanceUrl + "add-new-patient", dto, {
      headers: authHeader(),
    });
  }
  AddExistingPatient(dto) {
    return axios.post(instanceUrl + "add-existing-patient", dto, {
      headers: authHeader(),
    });
  }

  getStudylist(dto, pageNumber, pageSize) {
    return axios.post(
      instanceUrl + "get-studylist/" + pageNumber + "/" + pageSize,
      dto,
      {
        headers: authHeader(),
      }
    );
  }

  deleteStudy(id) {
    return axios.get(instanceUrl + "delete-study/" + id, {
      headers: authHeader(),
    });
  }

  deletePatient(mobileNumber) {
    return axios.get(instanceUrl + "delete-patient/" + mobileNumber, {
      headers: authHeader(),
    });
  }

  getPatientList(dto, pageNumber, pageSize) {
    return axios.post(
      instanceUrl + "get-patient-list/" + pageNumber + "/" + pageSize,
      dto,
      {
        headers: authHeader(),
      }
    );
  }

  editPatient(dto) {
    return axios.post(instanceUrl + "edit-patient/", dto, {
      headers: authHeader(),
    });
  }

  editStudy(dto) {
    return axios.post(instanceUrl + "edit-study/", dto, {
      headers: authHeader(),
    });
  }

  getTotalAmount(dto) {
    return axios.post(instanceUrl + "get-total-amount/", dto, {
      headers: authHeader(),
    });
  }

  editBilling(dto) {
    return axios.post(instanceUrl + "edit-amount", dto, {
      headers: authHeader(),
    });
  }

  deleteBilling(dto) {
    return axios.post(instanceUrl + "delete-amount", dto, {
      headers: authHeader(),
    });
  }
}

export default new DataService();
