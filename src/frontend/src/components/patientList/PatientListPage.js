import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar";
import { PrimaryButton, Stack } from "@fluentui/react";
import { useHistory } from "react-router-dom";
import DataService from "../../service/DataService";
import BootstrapTable from "react-bootstrap-table-next";
import {
  filterAtom,
  mobileNumberAtom,
  openSearchAtom,
  patientFilterAtom,
  patientNameAtom,
  refreshAtom,
} from "../../recoilState/RecoilState";
import StudyDetails from "./StudyDetails";

import { useRecoilState } from "recoil";

import { IconButton } from "office-ui-fabric-react";
import { Refresh } from "@material-ui/icons";
import { PageHeaderBreadCrumb } from "../common/PageHeaderBreadCrumb";
import SearchPanel from "../common/SearchPanel";
import NewPatient from "./NewPatient";
import { Separator } from "office-ui-fabric-react";
import ListFooter from "../common/ListFooter";
import moment from "moment";
import PatientActionsMenu from "./PatientActionsMenu";
import AuthenticationService from "../../service/AuthenticationService";

const PatientListPage = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useRecoilState(filterAtom);
  const [patientFilter, setPatientFilter] = useRecoilState(patientFilterAtom);

  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const history = useHistory();
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";

  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const iconStyles = {
    icon: {
      fontSize: 20,
      fontWeight: 600,
      paddingTop: 10,
    },
  };

  const onPageSizeChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setCurrentPage(1);
    setPageSize(item.key);
  };

  const onPageChange = (selectedPageIndex) => {
    setCurrentPage(selectedPageIndex);
  };

  useEffect(() => {
    document.title = "SPTC PIS";
    // clearStudyListFilter();
    DataService.getPatientList(patientFilter, currentPage, pageSize)
      .then((response) => response.data)
      .then((data) => {
        setData(data.data.content);
        setTotalRecords(data.data.totalElements);
        setTotalPages(data.data.totalPages);

        if (currentPage > data.totalPages) {
          setCurrentPage(1);
        } else {
          setCurrentPage(data.data.number + 1);
        }
      })
      .catch((error) => {
        console.error("Error in getting patient list:", error);
        alert("An error occurred while getting patient list." + error.message);
      });
  }, [refresh, currentPage, pageSize]);

  // useEffect(() => {
  //   setMobileNumber("");
  //   setOpenSearch(false);
  // }, []);

  const clearStudyListFilter = () => {
    let dto = {
      mobileNumber: "",
      firstName: "",
      lastName: "",
      treatmentList: [],
      treatmentDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    setFilter(dto);
  };

  const refreshList = () => {
    let dto = {
      mobileNumber: "",
      firstName: "",
      lastName: "",
    };
    setPatientFilter(dto);
    setRefresh(!refresh);
  };

  const goTo = (url) => {
    history.push(url);
  };

  const mobileNumberFormattor = (cell, row, rowIndex) => {
    return (
      <div onClick={() => getStudylist(row.mobileNumber)}>
        {row.mobileNumber}
      </div>
    );
  };
  const patientNameFormattor = (cell, row, rowIndex) => {
    return (
      <div>
        <StudyDetails
          row={row}
          display={row.firstName + " " + row.lastName}
          isPatientList={true}
          refresh={() => setRefresh(!refresh)}
        />
      </div>
    );
  };

  const getStudylist = (mobileNumber) => {
    setFilter((filter) => ({
      ...filter,
      ["mobileNumber"]: mobileNumber,
      ["treatmentDate"]: "",
    }));

    goTo("studylist");
  };
  const deletePatient = (row) => {
    // setDeleting(true)
    console.log("deleting study with id", row);
    DataService.deletePatient(row.mobileNumber)
      .then((response) => response.data)
      .then((data) => {
        // setDeleting(false)
        //setShowSuccessMessage(true)
        console.log(data);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);
        alert("An error occurred while deleting patient." + error.message);
      });
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <PatientActionsMenu
          key={refresh}
          confirmAction={() => deletePatient(row)}
        />
      </>
    );
  };
  const actionHeaderFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <IconButton
          iconProps={{ iconName: "ContextMenu" }}
          styles={iconStyles}
        />
      </>
    );
  };

  const columns = [
    {
      text: "Contact",
      dataField: "mobileNumber",
      isDummyField: true,
      formatter: mobileNumberFormattor,
      style: { width: "25%" },
      headerStyle: { width: "25%", fontWeight: 600 },
    },
    {
      text: "Name",
      dataField: "patientName",
      isDummyField: true,
      formatter: patientNameFormattor,
      headerStyle: { width: "65%", fontWeight: 600 },
      style: { width: "65%", paddingLeft: 15 },
    },
    {
      text: "Gender",
      dataField: "gender",
      headerStyle: { fontWeight: 600 },
      style: { width: "5%" },
    },
    {
      text: "Action",
      dataField: "action",
      isDummyField: true,
      formatter: actionFormatter,
      headerFormatter: actionHeaderFormatter,
      headerStyle: { width: "5%", paddingLeft: 10, fontWeight: 600 },
      style: { paddingLeft: 10 },
      hidden: !adminUser,
    },
  ];

  return (
    <>
      <NavBar />
      <SearchPanel isPatientList={true} />
      <Stack horizontal horizontalAlign="space-between">
        <div style={{ width: "70vh" }}>
          <PageHeaderBreadCrumb
            subtext={true}
            key={refresh}
            header="Patient List"
            isPatientList={true}
          />
        </div>
        <Stack horizontal>
          <NewPatient />
          <IconButton
            iconProps={{ iconName: "Refresh" }}
            onClick={refreshList}
            styles={iconStyles}
          ></IconButton>
        </Stack>
      </Stack>
      <Separator />
      <div>
        <BootstrapTable
          bootstrap4={true}
          keyField="patientId"
          headerClasses="header-class"
          bodyClasses="body-class"
          data={data}
          columns={columns}
          noDataIndication={"No data found"}
          striped={true}
          bordered={false}
          classes="table"
        ></BootstrapTable>
        <div style={{ marginTop: 20 }}>
          <ListFooter
            key={pageSize}
            selectedPageIndex={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            pageCount={totalPages}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>
    </>
  );
};

export default PatientListPage;
