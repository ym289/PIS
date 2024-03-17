import * as React from "react";
import { Breadcrumb, IBreadcrumbStyles } from "@fluentui/react/lib/Breadcrumb";
import { useRecoilState } from "recoil";
import {
  filterAtom,
  openSearchAtom,
  patientFilterAtom,
  refreshAtom,
} from "../../recoilState/RecoilState";
import moment from "moment";

export const PageHeaderBreadCrumb: React.FunctionComponent = ({
  header,
  isPatientList,
  subtext,
}) => {
  const [filter, setFilter] = useRecoilState(filterAtom);
  const [patientFilter, setPatientFilter] = useRecoilState(patientFilterAtom);

  const [opeanSearch, setOpenSearch] = useRecoilState(openSearchAtom);
  const [refresh, setRefresh] = useRecoilState(refreshAtom);

  const showDate = (date) => {
    if (date === moment(new Date()).format("YYYY-MM-DD")) {
      return "Today";
    } else {
      return date;
    }
  };

  const breadCrumbValueForStudyList =
    filter.treatmentDate !== ""
      ? showDate(filter.treatmentDate)
      : filter.mobileNumber !== ""
      ? filter.mobileNumber
      : filter.firstName !== ""
      ? filter.firstName
      : filter.lastName !== ""
      ? filter.lastName
      : "";

  const breadCrumbValueForPatientList =
    patientFilter.mobileNumber !== ""
      ? patientFilter.mobileNumber
      : patientFilter.firstName !== ""
      ? patientFilter.firstName
      : patientFilter.lastName !== ""
      ? patientFilter.lastName
      : "";

  const breadCrumbValue = !isPatientList
    ? breadCrumbValueForStudyList
    : breadCrumbValueForPatientList;

  const items: IBreadcrumbItem[] = [
    {
      text: header,
      key: "header",
      onClick: _onBreadcrumbItemClicked,
      as: "h4",
      isCurrentItem: true,
    },
    {
      text: subtext ? breadCrumbValue : "",
      key: "d2",
      isCurrentItem: true,
      as: "h4",
    },
  ];

  function _onBreadcrumbItemClicked(
    ev: React.MouseEvent<HTMLElement>,
    item: IBreadcrumbItem
  ): void {
    setFilter((filter) => ({
      ...filter,
      ["mobileNumber"]: "",
    }));
    setOpenSearch(false);
    setRefresh(!refresh);
  }
  const breadCrumbStyles: Partial<IBreadcrumbStyles> = {
    list: { maxHeight: 5, paddingTop: 12 },
  };
  return (
    <div>
      <Breadcrumb
        styles={breadCrumbStyles}
        items={items}
        ariaLabel="With last item rendered as heading"
        overflowAriaLabel="More links"
      />
    </div>
  );
};
