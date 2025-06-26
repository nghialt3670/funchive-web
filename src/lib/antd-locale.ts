import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import viVN from "antd/locale/vi_VN";

// Custom locale overrides for English
const enLocaleOverride: Partial<Locale> = {
  ...enUS,
  Pagination: {
    ...enUS.Pagination,
    items_per_page: "/ page",
    jump_to: "Go to",
    jump_to_confirm: "confirm",
    page: "",
    prev_page: "Previous Page",
    next_page: "Next Page",
    prev_5: "Previous 5 Pages",
    next_5: "Next 5 Pages",
    prev_3: "Previous 3 Pages",
    next_3: "Next 3 Pages",
    page_size: "Page Size",
  },
};

// Custom locale overrides for Vietnamese
const viLocaleOverride: Partial<Locale> = {
  ...viVN,
  Pagination: {
    ...viVN.Pagination,
    items_per_page: "/ trang",
    jump_to: "Đến trang",
    jump_to_confirm: "xác nhận",
    page: "",
    prev_page: "Trang Trước",
    next_page: "Trang Sau",
    prev_5: "5 Trang Trước",
    next_5: "5 Trang Sau",
    prev_3: "3 Trang Trước",
    next_3: "3 Trang Sau",
    page_size: "Số mục trên trang",
  },
};

export const getAntdLocale = (language: string): Locale => {
  switch (language) {
    case "vi":
      return viLocaleOverride as Locale;
    case "en":
    default:
      return enLocaleOverride as Locale;
  }
};
