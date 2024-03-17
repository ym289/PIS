import * as React from "react";
import { useConst, useBoolean } from "@fluentui/react-hooks";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Callout } from "@fluentui/react/lib/Callout";
import {
  ContextualMenuItemType,
  IContextualMenuProps,
} from "@fluentui/react/lib/ContextualMenu";
import { mergeStyleSets, getTheme } from "@fluentui/react/lib/Styling";
import { IconButton } from "office-ui-fabric-react";
import { useHistory } from "react-router-dom";

const NewPatient = () => {
  const history = useHistory();

  const [showCallout, { setTrue: onShowCallout, setFalse: onHideCallout }] =
    useBoolean(false);

  const addNewPatient = (e) => {
    goTo("/add-new-patient");
  };

  const addExisitingPatient = (e) => {
    goTo("/add-existing-patient");
  };

  const goTo = (url) => {
    history.push(url);
  };

  const iconStyles = {
    icon: {
      fontSize: 20,
      fontWeight: 500,
      paddingTop: 10,
    },
    flexContainer: {
      paddingRight: 5,
    },
  };
  const menuProps: IContextualMenuProps = useConst({
    shouldFocusOnMount: true,

    items: [
      {
        key: "addNewPatient",
        text: "Add New Patient",
        name: "addNewPatient",
        iconProps: { iconName: "Add" },
        onClick: addNewPatient,
      },
      { key: "divider_1", itemType: ContextualMenuItemType.Divider },
      {
        key: "addExisitingPatient",
        text: "Add Existing Patient",
        iconProps: { iconName: "Add" },
        onClick: addExisitingPatient,
      },
    ],
  });

  return (
    <div>
      <IconButton
        iconProps={{ iconName: "AddFriend" }}
        menuProps={menuProps}
        className={classNames.icon}
        styles={iconStyles}
      />
      {showCallout && (
        <Callout setInitialFocus onDismiss={onHideCallout}>
          <DefaultButton onClick={onHideCallout} text="Hello Popup" />
        </Callout>
      )}
    </div>
  );
};

const theme = getTheme();
const classNames = mergeStyleSets({
  iconContainer: {
    position: "relative",
    margin: "0 4px",
    height: 18,
    width: 18,
  },
  logoIcon: {
    position: "absolute",
    left: 0,
    right: 0,
    color: theme.palette.themeDarkAlt,
  },
  logoFillIcon: {
    position: "absolute",
    left: 0,
    right: 0,
    color: theme.palette.white,
  },
  icon: {
    fontSize: 32,
  },
});

export default NewPatient;
