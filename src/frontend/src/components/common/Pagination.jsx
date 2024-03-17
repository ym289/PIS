import React, { Component } from "react";
import PropTypes from "prop-types";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import { IconButton, DefaultButton } from "office-ui-fabric-react";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pager: {
        pageCount: 0,
        selectedPageIndex: 0,
        startPage: 0,
        endPage: 0,
      },
    };
  }

  componentDidMount() {
    this.setPage(this.props.selectedPageIndex);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pageCount !== this.state.pager.pageCount) {
      this.setPage(this.props.selectedPageIndex);
    } else if (
      prevProps.selectedPageIndex !== this.state.pager.selectedPageIndex
    ) {
      this.setPage(this.props.selectedPageIndex);
    }
  }
  setPage = (selectedPageIndex) => {
    let pageCount = this.props.pageCount;
    var pager = this.state.pager;

    if (selectedPageIndex < 1 || selectedPageIndex > pager.totalPages) return;

    if (pageCount < 0) return;
    // get new pager object for specified page
    pager = this.getPager(pageCount, selectedPageIndex);

    // update state
    this.setState({ pager: pager });
    // call change page function in parent component
    this.props.onPageChange(selectedPageIndex);
  };

  calculateNoOfPages(totalRecords, pageSize) {
    return totalRecords / pageSize;
  }

  getPager(pageCount, selectedPageIndex) {
    // default to first page
    selectedPageIndex = selectedPageIndex || 1;
    let startPage, endPage;
    if (pageCount <= 3) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = pageCount === 0 ? 1 : pageCount;
    } else {
      if (selectedPageIndex === 1) {
        startPage = 1;
        endPage = selectedPageIndex + 2;
      } else {
        startPage = selectedPageIndex - 1;
        if (selectedPageIndex === pageCount) endPage = pageCount;
        else endPage = selectedPageIndex + 1;
      }
    }

    // return object with all pager properties required by the view
    return {
      pageCount: pageCount,
      selectedPageIndex: selectedPageIndex,
      startPage: startPage,
      endPage: endPage,
    };
  }

  render() {
    const { t } = this.props;
    let pager = this.state.pager;
    const stackTokens = { childrenGap: 10 };
    const leftIcon = { iconName: "ChevronLeft" };
    const rightIcon = { iconName: "ChevronRight" };
    let pageButtonStyles = {
      root: {
        minWidth: "20px",
        padding: "0 0px",
        borderRadius: "2px",
        height: "20px",
      },
    };
    let activePageButtonStyles = {
      root: {
        minWidth: "20px",
        padding: "0 0px",
        borderRadius: "2px",
        height: "20px",
        backgroundColor: "#2F80ED",
      },
    };

    const range = (start, stop) =>
      Array.from({ length: stop - start + 1 }, (_, i) => {
        return start + i;
      });

    let pageButtons = range(pager.startPage, pager.endPage);
    return (
      <Stack horizontal tokens={stackTokens}>
        <TooltipHost content="first">
          <IconButton
            iconProps={leftIcon}
            disabled={pager.selectedPageIndex === 1 ? true : false}
            onClick={() => this.setPage(1)}
            styles={pageButtonStyles}
          />
        </TooltipHost>
        {pageButtons.map((val) => (
          <DefaultButton
            styles={
              pager.selectedPageIndex === val
                ? activePageButtonStyles
                : pageButtonStyles
            }
            key={val}
            text={val}
            onClick={() => this.setPage(val)}
            allowDisabledFocus
            disabled={false}
          />
        ))}
        <TooltipHost content="last">
          <IconButton
            iconProps={rightIcon}
            disabled={
              pager.pageCount === 0 ||
              pager.selectedPageIndex === pager.pageCount
                ? true
                : false
            }
            onClick={() => this.setPage(pager.pageCount)}
            styles={pageButtonStyles}
          />
        </TooltipHost>
      </Stack>
    );
  }
}

Pagination.propTypes = {
  selectedPageIndex: PropTypes.number,
  pageCount: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
