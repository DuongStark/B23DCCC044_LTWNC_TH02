import { NavLink, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LibraryPage from "./features/library/LibraryPage";
import { Icon } from "./components/Icon";
import { SessionBar } from "./features/session/SessionBar";
import { useTheme } from "./contexts/ThemeContext";

const SavedPage = lazy(() => import("./features/saved/SavedPage"));
const RoutinesPage = lazy(() => import("./features/routines/RoutinesPage"));
const RoutineDetailPage = lazy(() => import("./features/routines/RoutineDetailPage"));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand" aria-label="Nhịp Tập - Trang chủ">
            <span className="brand-mark">
              <Icon name="pulse" size={25} />
            </span>
            <span>
              nhịp<span className="brand-accent">tập</span>
              <small>CHUYỂN ĐỘNG MỖI NGÀY</small>
            </span>
          </NavLink>
          <nav aria-label="Điều hướng chính">
            <NavLink end to="/">
              Kho bài tập
            </NavLink>
            <NavLink to="/saved">Đã lưu</NavLink>
            <NavLink to="/routines">Giáo án</NavLink>
          </nav>
          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Giao diện tối" : "Giao diện sáng"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
            <span>{theme === "light" ? "Giao diện tối" : "Giao diện sáng"}</span>
          </button>
        </div>
      </header>
      <main className="main-content">
        <Suspense
          fallback={
            <p className="page-heading" role="status">
              Đang tải trang...
            </p>
          }
        >
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
            <Route
              path="*"
              element={
                <p>
                  Không tìm thấy trang. <NavLink to="/">Về kho bài tập</NavLink>
                </p>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <span>NHỊP TẬP © 2026</span>
        <span>Một chút nỗ lực hôm nay. Một phiên bản tốt hơn ngày mai.</span>
        <span>LTWNC · TH02</span>
      </footer>
      <SessionBar />
    </div>
  );
}
