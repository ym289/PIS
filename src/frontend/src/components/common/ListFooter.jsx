import { Stack } from "@fluentui/react";
import { Dropdown, Label, ResponsiveMode } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import Pagination from "./Pagination";

const ListFooter = (props) => {
  const {
    selectedPageIndex,
    pageSize,
    totalRecords,
    onPageChange,
    pageCount,
    onPageSizeChange,
  } = props;
  useEffect(() => {}, [props, selectedPageIndex, totalRecords]);

  const rowsPerPageDropdownStyles = {
    root: {
      width: 60,
    },
    title: { border: "none" },
  };

  const rowsPerPageOptions = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 25, text: "25" },
    { key: 50, text: "50" },
  ];

  return (
    <div className="listFooter">
      <Stack horizontal>
        <Stack style={{ width: "50%" }} horizontal horizontalAlign="start">
          <Label className="listFooterRowsPerPage">Rows per page:</Label>

          <Dropdown
            defaultSelectedKey={pageSize}
            options={rowsPerPageOptions}
            disabled={false}
            styles={rowsPerPageDropdownStyles}
            onChange={onPageSizeChange}
            responsiveMode={ResponsiveMode.large}
          />
        </Stack>
        <Stack style={{ width: "50%" }} horizontal horizontalAlign="end">
          {/* <div className="listfooter_noofitems">
            <p>
              {start}-{end} of {total} items
            </p>
          </div> */}
          <Pagination
            key={pageCount}
            selectedPageIndex={selectedPageIndex}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            pageCount={pageCount}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default ListFooter;
