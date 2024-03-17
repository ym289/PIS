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
import DataService from "../../service/DataService";
import ConfirmationDialog from "./ConfirmationDialog";
import { refreshAtom } from "../../recoilState/RecoilState";
import { useRecoilState } from "recoil";

const PatientActionsMenu = ({ confirmAction }) => {
  const history = useHistory();
  const [refresh, setRefresh] = useRecoilState(refreshAtom);

  const [showCallout, { setTrue: onShowCallout, setFalse: onHideCallout }] =
    useBoolean(false);

  const iconStyles = {
    icon: {
      fontSize: 16,
      fontWeight: 600,
      paddingTop: 5,
    },
  };

  const renderMenuList = React.useCallback(
    (
      menuListProps: IContextualMenuListProps,
      defaultRender: IRenderFunction<IContextualMenuListProps>
    ) => {
      return (
        <div>
          {defaultRender(menuListProps)}

          <div>
            <ConfirmationDialog
              confirm={confirmAction}
              subtext={"Do you want to delete this patient?"}
              title={"Delete Patient"}
              iconName="Delete"
            />
          </div>
        </div>
      );
    },
    []
  );
  const menuProps: IContextualMenuProps = useConst({
    shouldFocusOnMount: true,
    onRenderMenuList: renderMenuList,

    items: [
      // {
      //   key: "viewDetails",
      //   text: "View Details",
      //   name: "viewDetails",
      //   iconProps: { iconName: "Info" },
      //   onClick: viewStudyDetails,
      // },
      { key: "divider_1", itemType: ContextualMenuItemType.Divider },
      // {
      //   key: "viewHistory",
      //   text: "View History",
      //   name: "viewHistory",
      //   iconProps: { iconName: "History" },
      //   onClick: viewHistory,
      // },
    ],
  });

  return (
    <div>
      <IconButton
        iconProps={{ iconName: "More" }}
        menuProps={menuProps}
        className={classNames.icon}
        styles={iconStyles}
      />
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

export default PatientActionsMenu;
