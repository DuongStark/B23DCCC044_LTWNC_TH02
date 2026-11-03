import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RoutinesPage from "./RoutinesPage";
import { renderWithProviders } from "../../test/renderWithProviders";
import { useToastStore } from "../feedback/useToastStore";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
});
describe("RoutinesPage", () => {
  it("bấm Tạo khi ô trống hiện lỗi bắt buộc", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.click(screen.getByRole("button", { name: "Tạo" }));
    expect(screen.getByText("Tên giáo án không được để trống")).toBeInTheDocument();
  });
  it("tạo tên hợp lệ, từ chối tên trùng khác hoa thường, xóa được giáo án", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.type(screen.getByLabelText("Tên giáo án"), "Ngày ngực");
    await user.click(screen.getByRole("button", { name: "Tạo" }));
    expect(screen.getByRole("link", { name: "Ngày ngực" })).toBeInTheDocument();
    expect(useToastStore.getState().toast?.text).toBe("Đã tạo giáo án “Ngày ngực”.");
    expect(screen.queryByText("Tên giáo án đã tồn tại")).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText("Tên giáo án"));
    await user.type(screen.getByLabelText("Tên giáo án"), "ngày NGỰC");
    await user.click(screen.getByRole("button", { name: "Tạo" }));
    expect(screen.getByText("Tên giáo án đã tồn tại")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Ngày ngực" })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Xóa Ngày ngực" }));
    expect(screen.queryByRole("link", { name: "Ngày ngực" })).not.toBeInTheDocument();
    expect(useToastStore.getState().toast?.text).toBe("Đã xóa giáo án “Ngày ngực”.");
  });
});
