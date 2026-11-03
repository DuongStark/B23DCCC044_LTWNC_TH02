import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import { Icon } from './components/Icon';
import { SessionBar } from './features/session/SessionBar';
import SavedPage from './features/saved/SavedPage';

export default function App() {
  return <div className="app">
    <header className="site-header"><div className="header-inner">
      <NavLink to="/" className="brand" aria-label="Nhịp Tập - Trang chủ"><span className="brand-mark"><Icon name="pulse" size={25} /></span><span>nhịp<span className="brand-accent">tập</span><small>CHUYỂN ĐỘNG MỖI NGÀY</small></span></NavLink>
      <nav aria-label="Điều hướng chính"><NavLink end to="/">Kho bài tập</NavLink><NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink></nav>
      <span className="header-label">TẬP CHO CHÍNH MÌNH.</span>
    </div></header>
    <main className="main-content"><Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/routines" element={<div className="page-heading"><h1>Giáo án của bạn</h1><p>Chức năng được triển khai ở Phần 3.</p></div>} />
      <Route path="/routines/:id" element={<p>Chi tiết giáo án được triển khai ở Phần 3.</p>} />
      <Route path="*" element={<p>Không tìm thấy trang. <NavLink to="/">Về kho bài tập</NavLink></p>} />
    </Routes></main>
    <footer className="site-footer"><span>NHỊP TẬP © 2026</span><span>Một chút nỗ lực hôm nay. Một phiên bản tốt hơn ngày mai.</span><span>LTWNC · TH02</span></footer>
    <SessionBar />
  </div>;
}
