
export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">Chính Sách Cửa Hàng – Sợi Nhớ</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Chính sách đổi/trả hàng</h2>
        <p className="text-gray-700 text-justify">
          Chúng tôi hỗ trợ đổi/trả sản phẩm trong vòng <strong>7 ngày kể từ ngày nhận hàng</strong> đối với các trường hợp:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
          <li>Sản phẩm bị lỗi từ nhà sản xuất hoặc giao nhầm sản phẩm.</li>
          <li>Len bị rối, mục, đứt hoặc biến dạng nghiêm trọng.</li>
          <li>Khách hàng cung cấp đầy đủ bằng chứng (ảnh, video) xác thực lỗi sản phẩm.</li>
        </ul>
        <p className="mt-2 text-gray-700">
          Lưu ý: Sản phẩm phải còn nguyên tem, chưa qua sử dụng. Chi phí vận chuyển đổi/trả sẽ do Sợi Nhớ chịu nếu lỗi thuộc về chúng tôi.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Chính sách giao hàng</h2>
        <p className="text-gray-700 text-justify">
          Sợi Nhớ giao hàng toàn quốc thông qua các đối tác vận chuyển như Giao Hàng Nhanh, Viettel Post,... Thời gian giao hàng:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
          <li><strong>Nội thành TP.HCM:</strong> 1–2 ngày làm việc</li>
          <li><strong>Các tỉnh thành khác:</strong> 2–5 ngày làm việc</li>
        </ul>
        <p className="mt-2 text-gray-700">
          Miễn phí giao hàng cho đơn hàng từ <strong>300.000đ</strong>. Với đơn dưới mức này, phí vận chuyển sẽ được tính theo đơn vị giao hàng.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Chính sách thanh toán</h2>
        <p className="text-gray-700">
          Chúng tôi hỗ trợ các hình thức thanh toán sau:
        </p>
        <ul className="list-disc list-inside text-gray-700 ml-4 mt-2">
          <li>Thanh toán khi nhận hàng (COD)</li>
          <li>Chuyển khoản ngân hàng</li>
          <li>Thanh toán qua ví điện tử (Momo, ZaloPay... – đang cập nhật)</li>
        </ul>
        <p className="mt-2 text-gray-700">
          Thông tin tài khoản sẽ được hiển thị tại trang thanh toán hoặc gửi kèm trong email xác nhận đơn hàng.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Chính sách bảo mật thông tin</h2>
        <p className="text-gray-700 text-justify">
          Sợi Nhớ cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Mọi dữ liệu như tên, địa chỉ, số điện thoại, email... 
          chỉ được sử dụng cho mục đích xử lý đơn hàng và chăm sóc khách hàng, tuyệt đối không chia sẻ cho bên thứ ba.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Liên hệ hỗ trợ</h2>
        <p className="text-gray-700">
          Nếu bạn có bất kỳ thắc mắc hay yêu cầu hỗ trợ, vui lòng liên hệ:
        </p>
        <ul className="list-none mt-2 text-gray-700">
          <li>Email: <a href="mailto:soinho.shop@gmail.com" className="text-pink-600">soinho.shop@gmail.com</a></li>
          <li>Hotline/Zalo: <strong>0901 234 567</strong></li>
          <li>Facebook: <a href="https://facebook.com/soinho" target="_blank" className="text-pink-600">fb.com/soinho</a></li>
        </ul>
      </section>
    </div>
  );
}
