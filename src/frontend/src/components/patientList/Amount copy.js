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
import { Input, Paper, TableHead } from "@material-ui/core";
import Amount2 from "./Amount copy";

const Amount = ({ row, display, isPatientList, refresh }) => {
  const [open, setOpen] = useState(false);
  const [lastName, setLastName] = useState(row.lastName);
  const [description, setDescription] = useState("");
  const [data, setData] = useState(row.bill);
  const [refreshModel, setRefreshModel] = useState(false);

  const [newRow, setNewRow] = useState({
    studyId: row.id,
    description: "",
    amount: 0,
  });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";
  const handleClose = () => {
    setEditMode(false);
    refresh();
    setOpen(false);
  };

  useEffect(() => {
    console.log("amount modal useeffect");
  }, [refreshModel]);

  useEffect(() => {
    console.log("row modal useeffect");
    setData(row.bill);
  }, [row]);

  const removeEditMode = () => {
    setEditMode(false);
    setAdding(false);
  };

  const handleEdit = (id) => {
    setEditing(id);
  };

  const handleDelete = (billId) => {
    console.log("delete");
    let dto = {
      id: billId,
    };
    DataService.deleteBilling(dto)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        if (data === true) {
          window.alert("Fees deleted successfully");
          setAdding(false);
          refresh();
          setRefreshModel(!refreshModel);
        } else {
          window.alert("Could not delete");
        }
        // setData(row.bill);

        // handleClose();
      })
      .catch((error) => {
        console.error("Error deleting fees:", error);
        alert("An error occurred while deleting fees." + error.message);
      });
  };

  const handleSave = (id) => {
    setEditing(null);
    // Your logic to save data to the backend can go here
    // Example: fetch(`/api/saveData/${id}`, { method: 'PUT', body: JSON.stringify(updatedRow) });
  };

  const handleCellEdit = (id, field, value) => {
    console.log(value);
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const editDetails = () => {
    let dto = null;
    if (newRow.amount != 0 || newRow.description != "") {
      setData((prevData) => [...prevData, { ...newRow }]);
      dto = [...data, { ...newRow }];
    } else {
      dto = [...data, { ...newRow }];
    }

    DataService.editBilling(dto)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        if (data === true) {
          window.alert("Fees added successfully");
        }
        setAdding(false);
        refresh();
        // setRefreshModel(!refreshModel);
      })
      .catch((error) => {
        console.error("Error adding existing patient:", error);
        alert(
          "An error occurred while adding existing patient." + error.message
        );
      });
    setNewRow({ studyId: row.id, description: "", amount: 0 });
  };

  const addRow = () => {
    setAdding(true);
    setNewRow({ studyId: row.id, description: "", amount: 0 });
  };

  const setOpenIfAdmin = () => {
    if (adminUser) {
      setOpen(true);
    }
  };
  return (
    <div>
      <div
        style={{ color: row.amountEdited === true ? "red" : "" }}
        onClick={() => setOpen(true)}
      >
        {display}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <div style={{ float: "left" }}>
            {row.firstName + " " + row.lastName} - ₹{display}
          </div>
          {adminUser && (
            <>
              {" "}
              <div style={{ float: "right" }}>
                {!adding && (
                  <IconButton
                    iconProps={{ iconName: "Add" }}
                    onClick={() => addRow()}
                  />
                )}
                {adding && (
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
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {editing === row.id ? (
                        <div>
                          <Input
                            value={row.description}
                            onChange={(e) =>
                              handleCellEdit(
                                row.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ) : (
                        <div>{row.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editing === row.id ? (
                        <div>
                          <Input
                            type="text"
                            value={row.amount}
                            onChange={(e) =>
                              handleCellEdit(row.id, "amount", e.target.value)
                            }
                          />

                          <IconButton
                            iconProps={{ iconName: "Save" }}
                            onClick={() => handleSave(row.id)}
                          />
                        </div>
                      ) : (
                        <div>
                          {row.amount}
                          <IconButton
                            iconProps={{ iconName: "Edit" }}
                            onClick={() => handleEdit(row.id)}
                          />
                          {row.id !== undefined && (
                            <IconButton
                              iconProps={{ iconName: "Delete" }}
                              onClick={() => handleDelete(row.id)}
                            />
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {adding && (
                  <TableRow>
                    <TableCell>
                      <Input
                        value={newRow.description}
                        onChange={(e) =>
                          setNewRow({ ...newRow, description: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={newRow.amount}
                        onChange={(e) =>
                          setNewRow({ ...newRow, amount: e.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
          {/* {editMode && ( */}
          <Button onClick={editDetails} color="primary">
            SAVE
          </Button>
          {/* )} */}
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Amount;
