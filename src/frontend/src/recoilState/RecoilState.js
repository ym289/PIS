import { atom, selector } from "recoil";
import moment from "moment";

export const mobileNumberAtom = atom({
  key: "mobileNumber",
  default: "",
});

export const filterAtom = atom({
  key: "filter",
  default: {
    mobileNumber: "",
    firstName: "",
    lastName: "",
    treatmentList: [],
    treatmentDate: moment(new Date()).format("YYYY-MM-DD"),
  },
});

export const patientFilterAtom = atom({
  key: "patientFilterAtom",
  default: {
    mobileNumber: "",
    firstName: "",
    lastName: "",
  },
});

export const refreshAtom = atom({
  key: "refreshAtom",
  default: false,
});
export const patientNameAtom = atom({
  key: "patientNameAtom",
  default: "",
});

export const openSearchAtom = atom({
  key: "openSearchAtom",
  default: false,
});

export const openSearchSelector = selector({
  key: "openSearchSelector", // unique ID

  get: ({ get }) => {
    const openSearch = get(openSearchAtom);
    return openSearch;
  },
});
