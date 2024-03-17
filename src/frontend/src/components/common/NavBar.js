import React from "react";
import Logo from "../../images/sptc2.png";
import {
  openSearchAtom,
  mobileNumberAtom,
  patientNameAtom,
  refreshAtom,
} from "../../recoilState/RecoilState";
import { useHistory } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ConfirmationDialog from "../patientList/ConfirmationDialog";
import { PermIdentity } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { IconButton } from "office-ui-fabric-react";
import { useRecoilState } from "recoil";
import AuthenticationService from "../../service/AuthenticationService";
import { FormatListBulleted } from "@material-ui/icons";
import { useConst } from "@fluentui/react-hooks";
import {
  ContextualMenuItemType,
  IContextualMenuProps,
} from "@fluentui/react/lib/ContextualMenu";
import { Stack } from "@fluentui/react";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const [openSearch, setOpenSearch] = useRecoilState(openSearchAtom);
  const [mobileNumber, setMobileNumber] = useRecoilState(mobileNumberAtom);
  const [patientName, setpatientName] = useRecoilState(patientNameAtom);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [refresh, setRefresh] = useRecoilState(refreshAtom);
  const adminUser = AuthenticationService.getUserRole() === "ROLE_ADMIN";
  const open = Boolean(anchorEl);
  let history = useHistory();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const Logout = () => {
    AuthenticationService.logout();
    history.push("/login");
  };
  const cancelSearch = () => {
    setOpenSearch(false);
    setMobileNumber("");
    setpatientName("");
    setRefresh(!refresh);
  };

  const goTo = (props) => {
    history.push(props);
  };
  const iconStyles = {
    icon: {
      fontSize: 20,
      fontWeight: 600,
      paddingTop: 25,
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
              confirm={Logout}
              subtext={"Do you want to logout?"}
              title={"Logout"}
              iconName="SignOut"
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
      { key: "divider_2", itemType: ContextualMenuItemType.Divider },
      {
        key: "studylist",
        text: "Study List",
        iconProps: { iconName: "List" },
        onClick: () => goTo("/studylist"),
      },
      { key: "divider_4", itemType: ContextualMenuItemType.Divider },

      {
        key: "patientlist",
        text: "Patient List",
        iconProps: { iconName: "List" },
        onClick: () => goTo("/patientlist"),
      },
      { key: "divider_3", itemType: ContextualMenuItemType.Divider },

      {
        key: "usersList",
        text: "Users",
        iconProps: { iconName: "FabricUserFolder" },
        onClick: () => goTo("/users"),
        disabled: !adminUser,
      },
      { key: "divider_5", itemType: ContextualMenuItemType.Divider },

      {
        key: "changePassword",
        text: "Change Password",
        iconProps: { iconName: "Permissions" },
        onClick: () => goTo("/change-password"),
      },
      { key: "divider_1", itemType: ContextualMenuItemType.Divider },
    ],
  });

  return (
    <>
      {/* <Toolbar> */}
      <Stack horizontal horizontalAlign="space-between">
        <div className={classes.title}>
          <img
            src={Logo}
            className="logo-icon"
            alt="logo"
            height={60}
            width={90}
          />
        </div>
        <div>
          {!openSearch && (
            <IconButton
              styles={iconStyles}
              iconProps={{ iconName: "Search" }}
              onClick={() => setOpenSearch(true)}
            ></IconButton>
          )}
          {openSearch && (
            <IconButton
              styles={iconStyles}
              onClick={cancelSearch}
              iconProps={{ iconName: "Clear" }}
            ></IconButton>
          )}
          <IconButton
            styles={iconStyles}
            iconProps={{ iconName: "MoreVertical" }}
            menuProps={menuProps}
          >
            {/* <ExitToAppIcon onClick={Logout} /> */}
          </IconButton>
        </div>
      </Stack>
      {/* </Toolbar> */}
    </>
  );
};

export default NavBar;
