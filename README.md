# Nhịp Tập · LTWNC TH02

Ứng dụng **Bấm giờ tập luyện** — sinh viên **B23DCCC044**. Kho 10.000 bài tập, đồng hồ buổi tập tự chuyển bài, danh sách yêu thích và giáo án cá nhân.

## Chạy trên máy

Yêu cầu Node **24 LTS** (khuyến nghị) hoặc **22 LTS >= 22.12**. Project dùng npm, có lockfile; không cần backend hoặc biến môi trường.

```bash
nvm install
nvm use
npm ci
npm run dev
```

Mở địa chỉ Vite in ra trong terminal, mặc định `http://127.0.0.1:5173`.

```bash
npm run build       # Kiểm tra TypeScript và tạo dist/
npm run preview     # Xem bản production
npm test            # Vitest, jsdom và React Testing Library
npm run coverage    # Bảng coverage + báo cáo HTML trong coverage/
```

`.npmrc` tắt dependency install scripts. Vite, Vitest và build đã được kiểm tra với chính sách này; không cần bật toàn bộ scripts. Dùng `npm ci` để giữ đúng phiên bản từ lockfile.

## Kiểm thử trình duyệt và ảnh coverage

```bash
npx playwright install chromium
npm run test:e2e
npm run coverage
npm run coverage:screenshot
```

Nếu đã cài Google Chrome, có thể bỏ bước tải Chromium và dùng:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
PLAYWRIGHT_CHANNEL=chrome npm run coverage:screenshot
```

E2E tự build rồi mở preview ở port 4173, chạy trên bản production. Không chạy một preview khác trên port này đồng thời. Các test kiểm tra debounce đúng mốc, số dòng DOM, cuộn sâu, pause/resume/auto-next, snapshot queue, persistence sau F5, giáo án, lazy chunks, sáng/tối và khung mobile. Ảnh giao diện được lưu vào `artifacts/` và không đưa vào Git.

`coverage.png` là ảnh chụp trực tiếp báo cáo HTML do `npm run coverage` sinh ra, có trong repo để nộp bài. Muốn cập nhật ảnh, chạy lại coverage trước khi chụp; không sửa số trong ảnh.

## Các trang

| URL             | Chức năng                                                             |
| --------------- | --------------------------------------------------------------------- |
| `/`             | Kho bài tập: tìm tên/HLV, lọc nhóm cơ, sắp xếp, bắt đầu hoặc thêm bài |
| `/saved`        | Bài đã lưu, bỏ lưu, Tập tất cả                                        |
| `/routines`     | Tạo, liệt kê, xóa giáo án                                             |
| `/routines/:id` | Bỏ bài, xem tổng thời gian, Tập tất cả                                |

Thanh đồng hồ cố định ở đáy và tiếp tục chạy khi đổi trang. Không có video thật. Dữ liệu chỉ lưu trong trình duyệt này, không đồng bộ lên máy chủ.

## Chia state và hiệu năng

- `data/exercises.ts`: generator đúng đề; `EXERCISES` được tạo một lần ở module, có map tra cứu id riêng.
- `LibraryPage`: bộ lọc/form dùng state cục bộ; `useDebounce<T>` 300ms; selector lọc/sort gọi trong `useMemo`, không sort dữ liệu gốc. Tìm kiếm không phân biệt hoa thường, có dấu theo tên bài hoặc HLV.
- `react-window@1`: `FixedSizeList` cao 560px, dòng 56px, overscan 2, `itemKey` theo id. Chỉ khoảng 12–14 dòng được mount thay vì 10.000. Màn hình hẹp có thể cuộn ngang bảng.
- `ExerciseRow` dùng `React.memo`; adapter, `itemData` và callback ổn định. SaveButton subscribe boolean riêng của từng bài, nên lưu một bài không làm các dòng khác render lại.
- `useSessionStore`: Zustand với selector từng trường. Chỉ `CountdownBar` đọc `elapsed`; SessionBar sở hữu đúng một interval 1000ms và cleanup khi pause/unmount. Bắt đầu lấy bản chụp danh sách đang lọc/sort, không thay queue khi người dùng đổi bộ lọc.
- `useSavedStore`: Zustand + persist, key **`workout-saved`**, chỉ lưu ids.
- `RoutineProvider`: `useReducer(withLogger(routineReducer), ...)`, tách **RoutineStateContext** và **RoutineDispatchContext**. Form tạo chỉ đọc dispatch; thông báo lỗi là component riêng đọc state. Key **`workout-routines`** được khôi phục khi khởi động và lưu khi đổi.
- `withLogger`: log action cùng state trước/sau trong DEV; production không log. React StrictMode có thể lặp log ở môi trường phát triển.
- `ThemeContext`: độc lập, value `useMemo`, light/dark. Theme và session không persist vì đề không yêu cầu.
- Ba trang saved/routines/detail dùng `React.lazy` và default export. Có các chunk JS riêng; Provider và đồng hồ ở ngoài Suspense nên không bị remount khi đổi trang.

Test hiệu năng dùng React Profiler để xác nhận tick không tạo commit trong cây LibraryPage, đồng thời theo dõi formatter thật để phát hiện dòng render thừa khi gõ chưa hết debounce/lưu bài. Chưa đo hai con số Profiler khi bật/tắt virtualization của thử thách thêm; không đưa số ước lượng vào README.

## Quy ước cho tình huống biên

- `prev()`: quá 3 giây thì reset bài hiện tại; từ 0–3 giây thì lùi bài; bài đầu reset về 0.
- Bài cuối hết giờ thì dừng ở 0 giây còn lại; bấm Bắt đầu để tập lại bài cuối. Chuyển bài bằng nút khi paused vẫn giữ paused.
- Có thể thêm bài vào queue trước rồi bấm Bắt đầu trên thanh đồng hồ. Queue rỗng và startIndex sai không làm đồng hồ chạy.
- Thêm bài trùng vào session/giáo án bị bỏ qua. Tên giáo án được trim và chặn trùng không phân biệt hoa thường; reducer có đủ cả action rename.
- JSON giáo án hỏng được bỏ qua; dữ liệu khôi phục được kiểm tra cấu trúc và loại trùng. Id bài không tồn tại không làm hỏng trang saved/detail. Storage bị khóa không ngăn thao tác trong bộ nhớ.

## Dependency audit

Giữ **React Router v6** theo yêu cầu bắt buộc của đề. `npm audit` hiện báo moderate ở `react-router` và `react-router-dom` từ các advisory [open redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) và [SSR hydration](https://github.com/advisories/GHSA-337j-9hxr-rhxg); npm đề xuất nâng lên v7.

Ứng dụng là SPA, không dùng SSR/hydration; mọi Link là đường dẫn nội bộ cố định hoặc `/routines/` + id đã encode, không dùng URL do người dùng nhập. Vì vậy hai luồng được nêu trong audit không có đầu vào tương ứng trong ứng dụng hiện tại. Không tự nâng major vi phạm đề hoặc chạy `audit fix --force`. Cần đánh giá lại trước khi thêm URL chuyển hướng/SSR hoặc bỏ ràng buộc v6; mốc rà soát tiếp theo **2026-12-03**.

## Nộp bài

Repo: `B23DCCC044_LTWNC_TH02`. Bốn mốc commit là `Phan 1`, `Phan 2`, `Phan 3`, `Phan 4`.

Trước khi nộp: `npm run build`, `npm test`, `npm run coverage` đều thành công; Lines của cả `src/features` và `src/utils` đạt ít nhất 70%; có `coverage.png`. Các thử thách thời gian nghỉ, phím Space, Zustand devtools và so sánh Profiler không nằm trong phạm vi bắt buộc.
