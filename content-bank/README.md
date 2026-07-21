# content-bank/

Hạ tầng lưu trữ nội dung cho việc đăng bài tự động lên Facebook (Khách Sạn Hoa Đô).

## Cấu trúc

- `posted-log.json` — Mảng ghi lại các bài đã đăng lên Facebook (để script đăng bài tự động không đăng trùng). Ban đầu là mảng rỗng `[]`. Mỗi lần đăng bài thành công, thêm 1 object vào mảng, ví dụ:
  ```json
  { "post_id": "den-cui-ong-hoang-muoi", "posted_at": "2026-07-22T08:00:00+07:00", "fb_post_id": "..." }
  ```

- `images-manifest.json` — Danh mục toàn bộ 57 ảnh thật trong `../images/`, phân loại theo chủ đề để chọn ảnh phù hợp ghép vào từng bài viết. Cấu trúc:
  - `categories` — nhóm theo slug: `mat-tien` (mặt tiền/ngoại thất/bảng hiệu, 10 ảnh), `xung-quanh` (khuôn viên/lối vào/bãi xe, 3 ảnh), `noi-that-chung` (sảnh/lễ tân, 3 ảnh), `phong-nghi` (các loại phòng, 9 ảnh), `chua-phan-loai` (32 ảnh chưa xem chi tiết từng ảnh, cần rà lại khi cần ảnh cụ thể hơn).
  - `images` — danh sách phẳng từng ảnh: `file`, `path` (đường dẫn tương đối từ thư mục `hoa-do-hotel/`, dùng được luôn trên web), `label`, `category`, `reviewed` (true nếu đã xem trực tiếp nội dung ảnh, false nếu chỉ mới liệt kê tên file).

  **Lưu ý quan trọng:** toàn bộ 57 ảnh đều là ảnh khách sạn tự chụp (phòng, sảnh, mặt tiền...). Chưa có ảnh chụp thực tế các điểm đến (Đền Củi, khu mộ Nguyễn Du, biển Xuân Thành...). Khi ghép ảnh cho bài viết về điểm đến, dùng ảnh nhóm `mat-tien`/`phong-nghi` làm ảnh "ở tại Hoa Đô tiện di chuyển tới..." kèm bài, hoặc cần bổ sung ảnh điểm đến riêng (chụp mới / xin phép dùng ảnh nguồn khác có bản quyền hợp lệ).

- `posts/` *(sẽ tạo ở bước tiếp theo)* — nơi lưu nội dung 9 bài viết sẽ được gửi tới, mỗi bài 1 file JSON hoặc Markdown.

## Quy trình dự kiến

1. Nội dung bài viết được soạn sẵn → lưu vào `content-bank/posts/`.
2. Script đăng bài tự động đọc bài chưa có trong `posted-log.json`, chọn ảnh phù hợp từ `images-manifest.json` theo `category`, đăng lên Facebook Fanpage (dùng token trong `../facebook-config.json`), rồi ghi log vào `posted-log.json`.
