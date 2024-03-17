import React, { useEffect, useState } from "react";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react/lib/Dropdown";
import { Icon } from "@fluentui/react/lib/Icon";
import { ResponsiveMode } from "@fluentui/react";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: "70vw",
    display: "flex !important",
    padding: "0px 15px",
    // borderStyle: "hidden !important",
    borderRadius: 10,
    border: "0.5px solid #dfdfdf",
  },
  title: {
    display: "flex !important",
    padding: 0,
    // borderStyle: "hidden !important",
    border: "none",
  },
};
const iconStyles = { marginRight: "8px" };

const options: IDropdownOption[] = [
  {
    key: "Treatments",
    text: "Treatments",
    itemType: DropdownMenuItemType.Header,
  },

  { key: "chiroPractice", text: "Chiro practice" },
  { key: "osteopathy", text: "Osteopathy" },
  { key: "dryNeedling", text: "Dry needling" },
  { key: "tapping", text: "Tapping" },
  { key: "cupping", text: "Cupping" },
  { key: "mfr", text: "MFR" },
  { key: "tractionCX", text: "Traction CX" },
  { key: "tractionLX", text: "Traction LX" },
  { key: "ift", text: "IFT" },
  { key: "tens", text: "TENS" },
  { key: "ultrasound", text: "Ultrasound" },
  { key: "amalgesic", text: "Amalgesic" },
  { key: "swd", text: "SWD" },
  { key: "cpmShoulder", text: "CPM - Shoulder" },
  { key: "cpmKnee", text: "CPM - Knee" },
  { key: "cpmElbow", text: "CPM - Elbow" },
  { key: "electricalStimulator", text: "Electrical stimulator" },
  { key: "pwb", text: "PWB" },
  { key: "dvtPump", text: "DVT Pump" },
  { key: "shockwave", text: "Shock wave" },
  { key: "laser", text: "Laser" },
  { key: "matrixMachine", text: "Matrix machine" },
  { key: "exercisesOrtho ", text: "Exercises - Ortho " },
  { key: "exercisesNeuro", text: "Exercises - Neuro" },
];

const stackTokens: IStackTokens = { childrenGap: 20 };

const onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
  return (
    <div className="dropdownExample-placeholder">
      <Icon style={iconStyles} iconName={"CirclePlus"} aria-hidden="true" />
      {/* <span>{props.placeholder}</span> */}
    </div>
  );
};

const onRenderCaretDown = (): JSX.Element => {
  return <></>;
};

const onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
  return (
    <div className="dropdownExample-placeholder">
      <Icon style={iconStyles} iconName={"CirclePlus"} aria-hidden="true" />
      {/* <span>{props.placeholder}</span> */}
    </div>
  );
};
export const TreatmentDropdown = ({ selectedTreatments, setTreatmentList }) => {
  const [selectedKeys, setSelectedKeys] = useState(selectedTreatments);

  useEffect(() => {
    setTreatmentList(selectedKeys);
  }, [selectedKeys]);

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (item) {
      console.log(item);
      console.log("selectedKeys are :", selectedKeys);
      setSelectedKeys(
        item.selected
          ? [...selectedKeys, item.key]
          : selectedKeys.filter((key) => key !== item.key)
      );
      // setTreatment(item);
    }
  };
  return (
    <Stack tokens={stackTokens}>
      <Dropdown
        placeholder="Select treatments"
        multiSelect
        options={options}
        styles={dropdownStyles}
        // onRenderPlaceholder={onRenderPlaceholder}
        // onRenderCaretDown={onRenderCaretDown}
        // responsiveMode={ResponsiveMode.large}
        // onRenderTitle={onRenderTitle}
        onChange={onChange}
        selectedKeys={selectedKeys}
      />
    </Stack>
  );
};
