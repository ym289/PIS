import React from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import {
  hiddenContentStyle,
  mergeStyles,
} from "office-ui-fabric-react/lib/Styling";
import { ContextualMenu } from "office-ui-fabric-react/lib/ContextualMenu";
import { useId, useBoolean } from "@uifabric/react-hooks";

import { IconButton } from "office-ui-fabric-react";
import { ExitToApp } from "@material-ui/icons";
const dialogStyles = { main: { maxWidth: 450 } };
const dragOptions = {
  moveMenuItemText: "Move",
  closeMenuItemText: "Close",
  menu: ContextualMenu,
  keepInBounds: true,
};
const screenReaderOnly = mergeStyles(hiddenContentStyle);

export const ConfirmationDialog = (props) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const labelId = useId("dialogLabel");
  const subTextId = useId("subTextLabel");
  const deleteIcon = { iconName: "Delete" };

  const dialogContentProps = {
    type: DialogType.normal,
    title: "Confirm",
    closeButtonAriaLabel: "Close",
    subText: props.message,
  };
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: undefined,
    }),
    [labelId, subTextId]
  );

  const confirmed = () => {
    props.confirmAction();
    toggleHideDialog();
  };
  return (
    <div>
      {/* <DefaultButton
        secondaryText="Opens the Sample Dialog"
        onClick={toggleHideDialog}
        text="Open Dialog"
      /> */}

      {props.button === "delete" && (
        // <IconButton aria-label="delete" onClick={toggleHideDialog}>
        //   <DeleteIcon />
        // </IconButton>
        <IconButton onClick={toggleHideDialog} iconProps={deleteIcon} />
      )}
      {props.button === "logout" && (
        <div
          onClick={toggleHideDialog}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <ExitToApp></ExitToApp>
          <div>Logout </div>
        </div>
      )}
      <label id={labelId} className={screenReaderOnly}>
        My sample label
      </label>
      <label id={subTextId} className={screenReaderOnly}>
        My sample description
      </label>

      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmed} text="Confirm" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
export default ConfirmationDialog;
