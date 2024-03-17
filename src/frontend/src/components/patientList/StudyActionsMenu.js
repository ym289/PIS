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
import ReactToPrint from "react-to-print";
import Invoice from "../print/Invoice";
import { CommandBarButton } from "@fluentui/react/lib/Button";

const StudyActionsMenu = ({ confirmAction, bill }) => {
  const history = useHistory();
  const componentRef = React.useRef();

  const [refresh, setRefresh] = useRecoilState(refreshAtom);

  const goTo = (url) => {
    history.push(url);
  };

  const iconStyles = {
    icon: {
      fontSize: 16,
      fontWeight: 600,
      paddingTop: 5,
    },
    label: {
      fontSize: 14,
      fontWeight: 600,
    },
  };

  const print = () => {};

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
              subtext={
                "Do you want to delete this study? This will delete all fees and charges associated with this study."
              }
              title={"Delete"}
              iconName="Delete"
            />
          </div>
          <div>
            <ReactToPrint
              trigger={() => (
                // <Stack horizontal>
                <CommandBarButton
                  iconProps={{ iconName: "Print" }}
                  text="Print"
                  styles={iconStyles}
                />
              )}
              content={() => componentRef.current}
              documentTitle="bill.studyId"
            />
            <div style={{ display: "none" }}>
              {/* <Invoice invoiceData={sampleData} /> */}
              <Invoice invoiceData={bill} ref={componentRef} />
            </div>
            {/* <button onClick={handlePrint}>Print</button> */}
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
      // { key: "divider_1", itemType: ContextualMenuItemType.Divider },
      // {
      //   key: "print",
      //   text: "Print",
      //   name: "print",
      //   iconProps: { iconName: "Print" },
      //   onClick: print,
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
      {/* {showCallout && (
        <Callout setInitialFocus onDismiss={onHideCallout}>
          <DefaultButton onClick={onHideCallout} text="Hello Popup" />
        </Callout>
      )} */}
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

export default StudyActionsMenu;
