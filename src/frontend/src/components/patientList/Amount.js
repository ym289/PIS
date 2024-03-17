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
import { Input, Paper } from "@material-ui/core";
import { IconButton } from "@fluentui/react";
import DataService from "../../service/DataService";
import AuthenticationService from "../../service/AuthenticationService";

const Amount = ({ row, display, refresh }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(row.bill);
  const [newRow, setNewRow] = useState({
    studyId: row.id,
    description: "",
    amount: 0,
  });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";

  useEffect(() => {
    setData(row.bill);
  }, [row]);

  const handleClose = () => {
    // refresh();
    setOpen(false);
  };

  const handleEdit = (id) => {
    setEditing(id);
  };

  const handleDelete = (billId) => {
    DataService.deleteBilling({ id: billId })
      .then((response) => {
        if (response.data === true) {
          window.alert("Fees deleted successfully");
          refresh();
        } else {
          window.alert("Could not delete");
        }
      })
      .catch((error) => {
        console.error("Error deleting billing:", error);
        window.alert("An error occurred while deleting fees." + error.message);
      });
  };

  const handleSave = (id) => {
    setEditing(null);
    // Logic to save data to the backend can go here
    // Example: fetch(`/api/saveData/${id}`, { method: 'PUT', body: JSON.stringify(updatedRow) });
  };

  const handleCellEdit = (id, field, value) => {
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
      .then((response) => {
        if (response.data === true) {
          window.alert("Fees updated successfully");
          setAdding(false);
          setEditing(null);
          refresh();
        } else {
          window.alert("Could not update fees");
        }
      })
      .catch((error) => {
        console.error("Error editing billing:", error);
        window.alert("An error occurred while updating fees." + error.message);
      });
    setNewRow({ studyId: row.id, description: "", amount: 0 });
  };

  const addRow = () => {
    setAdding(true);
    setNewRow({ studyId: row.id, description: "", amount: 0 });
  };

  const openIfAdmin = () => {
    if (adminUser) {
      setOpen(true);
    }
  };
  return (
    <div>
      <div
        style={{ color: row.amountEdited ? "red" : "" }}
        onClick={() => openIfAdmin(true)}
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
            {row.firstName} {row.lastName} - ₹{display}
          </div>
          {adminUser && (
            <div style={{ float: "right" }}>
              {!adding ? (
                <IconButton iconProps={{ iconName: "Add" }} onClick={addRow} />
              ) : (
                <IconButton
                  iconProps={{ iconName: "Clear" }}
                  onClick={() => setAdding(false)}
                />
              )}
            </div>
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
                          {row.id && (
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
          <Button onClick={editDetails} color="primary">
            SAVE
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Amount;
