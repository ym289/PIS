import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar";
import { Separator } from "@fluentui/react";
import { useHistory } from "react-router-dom";
import DataService from "../../service/DataService";
import BootstrapTable from "react-bootstrap-table-next";
import {
  filterAtom,
  patientFilterAtom,
  refreshAtom,
} from "../../recoilState/RecoilState";
import { useRecoilState } from "recoil";
import StudyDetails from "./StudyDetails";
import { Stack } from "@fluentui/react";
import { PageHeaderBreadCrumb } from "../common/PageHeaderBreadCrumb";
import SearchPanel from "../common/SearchPanel";
import ListFooter from "../common/ListFooter";
import NewPatient from "./NewPatient";
import moment from "moment";
import { IconButton, Text, Toggle } from "office-ui-fabric-react";
import StudyActionsMenu from "./StudyActionsMenu";
import AuthenticationService from "../../service/AuthenticationService";
import Invoice from "../print/Invoice";
import Amount from "./Amount";

const Studylist = () => {
  const [filter, setFilter] = useRecoilState(filterAtom);
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showAmount, setShowAmount] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const [patientFilter, setPatientFilter] = useRecoilState(patientFilterAtom);
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";

  const iconStyles = {
    icon: {
      fontSize: 20,
      fontWeight: 600,
      paddingTop: 10,
    },
  };

  const refreshIconStyles = {
    icon: {
      fontSize: 20,
      fontWeight: 600,
      paddingTop: 10,
    },
    flexContainer: {
      paddingRight: 10,
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

  const history = useHistory();
  useEffect(() => {
    document.title = "SPTC PIS";
    // clearPatientFilter();
    getStudylist();
    if (filter.treatmentDate !== "") {
      getTotalAmount();
    } else {
      setTotalAmount("");
    }
    console.log("studylist useeffect");
  }, [refresh, currentPage, pageSize]);

  const getStudylist = () => {
    DataService.getStudylist(filter, currentPage, pageSize)
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
        console.error("Error getting study list:", error);
        alert("An error occurred while getting study list." + error.message);
      });
  };

  const getTotalAmount = () => {
    if (!adminUser) {
      return;
    }
    DataService.getTotalAmount(filter)
      .then((response) => response.data)
      .then((data) => {
        setTotalAmount(data);
      })
      .catch((error) => {
        console.error("Error getting total amount", error);
        alert("An error occurred while getting total amount." + error.message);
      });
  };
  const goTo = (url) => {
    history.push(url);
  };

  const clearPatientFilter = () => {
    let dto = {
      mobileNumber: "",
      firstName: "",
      lastName: "",
    };
    setPatientFilter(dto);
  };

  const refreshList = () => {
    let dto = {
      mobileNumber: "",
      firstName: "",
      lastName: "",
      treatmentList: [],
      treatmentDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    setFilter(dto);
    setRefresh(!refresh);
  };

  const patientIdFormattor = (cell, row, rowIndex) => {
    return (
      <div onClick={() => filterByMobileNumber(row.mobileNumber)}>
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
          isPatientList={false}
          refresh={() => setRefresh(!refresh)}
        />
      </div>
    );
  };

  const filterByMobileNumber = (mobileNumber) => {
    setFilter((filter) => ({
      ...filter,
      ["mobileNumber"]: mobileNumber,
      ["treatmentDate"]: "",
    }));
    setRefresh(!refresh);
  };

  const deleteStudy = (row) => {
    // setDeleting(true)
    console.log("deleting study with id", row);
    DataService.deleteStudy(row.id)
      .then((response) => response.data)
      .then((data) => {
        // setDeleting(false)
        //setShowSuccessMessage(true)
        console.log(data);
        setRefresh(!refresh);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error deleting study:", error);
        alert("An error occurred while deleting study." + error.message);
      });
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <StudyActionsMenu
          key={refresh}
          confirmAction={() => deleteStudy(row)}
          bill={row.bill}
        />
      </>
    );
  };

  const amountFormattor = (cell, row, rowIndex) => {
    const totalAmount = row.bill.reduce((sum, item) => sum + item.amount, 0);

    return (
      <>
        <Amount
          row={row}
          display={totalAmount}
          isPatientList={false}
          refresh={() => setRefresh(!refresh)}
          key={row}
        ></Amount>
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
      formatter: patientIdFormattor,
      style: { width: "25%" },
      headerStyle: { width: "25%", fontWeight: 600 },
    },
    {
      text: "Name",
      dataField: "name ",
      isDummyField: true,
      formatter: patientNameFormattor,
      headerStyle: { width: "65%", fontWeight: 600 },
      style: { width: "65%", paddingLeft: 15 },
    },
    {
      text: "Day",
      dataField: "dayCount",
      headerStyle: { width: "5%", fontWeight: 600 },
      style: { paddingLeft: 7 },
    },
    {
      text: "Amount",
      dataField: "amount",
      isDummyField: true,
      formatter: amountFormattor,
      headerStyle: { width: "25%", fontWeight: 600, paddingLeft: 15 },
      style: { width: "25%", paddingLeft: 25 },
      hidden: !showAmount,
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

  const saveData = (oldValue, newValue, row, column) => {
    console.log(oldValue, newValue, row, column);
    if (column.dataField === "dignosis") {
      let dto = {
        mobileNumber: row.mobileNumber,
        dignosis: newValue,
        treatmentDate: row.treatementDate,
      };
      DataService.saveDignosis(dto)
        .then((response) => response.data)
        .then((data) => {
          if (data) {
            alert("Dignosis updated successfully");
          } else {
            alert("Failed to save dignosis data");
          }
        })
        .catch((error) => {
          console.error("Error saving dignosis:", error);
          alert("An error occurred while saving." + error.message);
        });
    }
  };

  function _onChange(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
    setShowAmount(checked);
  }
  const sampleData = [
    { description: "Item 1", charges: "$50.00" },
    { description: "Item 2", charges: "$30.00" },
    // Add more items as needed
  ];
  return (
    <>
      <NavBar />
      <SearchPanel isPatientList={false} />
      <Stack horizontal horizontalAlign="space-between">
        <div style={{ width: "70vh" }}>
          <PageHeaderBreadCrumb
            key={refresh}
            header="Study List"
            isPatientList={false}
            subtext={true}
          />
        </div>
        <Stack horizontal>
          {adminUser && (
            <div
              style={{
                paddingTop: 10,
                paddingRight: 7,
              }}
            >
              <Toggle onChange={_onChange} role="checkbox" />
            </div>
          )}
          <NewPatient />
          <IconButton
            iconProps={{ iconName: "Refresh" }}
            onClick={refreshList}
            styles={refreshIconStyles}
          ></IconButton>
        </Stack>
      </Stack>
      <Separator />
      {showAmount && adminUser && (
        <div style={{ textAlign: "end", paddingBottom: 15, paddingRight: 10 }}>
          <Text variant="xLarge">₹{totalAmount}</Text>
        </div>
      )}
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

export default Studylist;
