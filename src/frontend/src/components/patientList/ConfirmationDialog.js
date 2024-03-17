import * as React from "react";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton,
  IconButton,
} from "@fluentui/react/lib/Button";
import { hiddenContentStyle, mergeStyles } from "@fluentui/react/lib/Styling";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { ContextualMenu } from "@fluentui/react/lib/ContextualMenu";
import { useId, useBoolean } from "@fluentui/react-hooks";
import { Label, Stack } from "@fluentui/react";
const dialogStyles = { main: { maxWidth: 450 } };
const dragOptions = {
  moveMenuItemText: "Move",
  closeMenuItemText: "Close",
  menu: ContextualMenu,
  keepInBounds: true,
};
const screenReaderOnly = mergeStyles(hiddenContentStyle);

const ConfirmationDialog: React.FunctionComponent = ({
  title,
  subtext,
  confirm,
  iconName,
}) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);
  const labelId: string = useId("dialogLabel");
  const subTextId: string = useId("subTextLabel");
  const dialogContentProps = {
    type: DialogType.normal,
    title: title,
    closeButtonAriaLabel: "Cancel",
    subText: subtext,
  };
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: isDraggable ? dragOptions : undefined,
    }),
    [isDraggable, labelId, subTextId]
  );

  const confirmAction = () => {
    confirm();
    toggleHideDialog();
  };
  const toggle = () => {
    // removeFocus();
    toggleHideDialog();
  };
  return (
    <>
      <Stack horizontal onClick={toggle}>
        <IconButton iconProps={{ iconName: iconName }} text={title} />
        <Label>{title}</Label>
      </Stack>
      <Dialog
        title="Confirm"
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmAction} text="Yes" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
