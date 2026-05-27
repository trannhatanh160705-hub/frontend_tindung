"use client";

import { useState, useRef, useEffect } from "react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Trần Nhật Anh");
  const [phone, setPhone] = useState("0904.123.456");
  const [email, setEmail] = useState("admin.wayne@finpro.vn");
  const [avatarPreview, setAvatarPreview] = useState(
    "https://ui-avatars.com/api/?name=Wayne&background=2563eb&color=fff&size=128"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự động tải thông tin đã lưu từ localStorage lên khi mở trang
  useEffect(() => {
    const savedName = localStorage.getItem("profile_name");
    const savedPhone = localStorage.getItem("profile_phone");
    const savedEmail = localStorage.getItem("profile_email");
    const savedAvatar = localStorage.getItem("profile_avatar");

    if (savedName) setFullName(savedName);
    if (savedPhone) setPhone(savedPhone);
    if (savedEmail) setEmail(savedEmail);
    if (savedAvatar) setAvatarPreview(savedAvatar);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Hàm đọc file ảnh và chuyển thành chuỗi mã hóa Base64 để lưu được vào localStorage
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG).");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Dung lượng ảnh không được vượt quá 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String); // Hiển thị preview ảnh mới
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xử lý khi bấm nút "Lưu thay đổi"
  const handleSaveChanges = () => {
    localStorage.setItem("profile_name", fullName);
    localStorage.setItem("profile_phone", phone);
    localStorage.setItem("profile_email", email);
    localStorage.setItem("profile_avatar", avatarPreview);

    // Kích hoạt một sự kiện để thanh Topbar biết và cập nhật theo
    window.dispatchEvent(new Event("profileUpdated"));

    alert("🎉 Đã lưu thay đổi hồ sơ thành công!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hồ sơ cá nhân</h2>
        <p className="text-slate-500 font-medium mt-1">Quản lý thông tin tài khoản và thiết lập bảo mật.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT TRÁI: AVATAR */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center text-center">
            <div onClick={handleAvatarClick} className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full ring-4 ring-blue-50 overflow-hidden shadow-inner bg-slate-100">
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-bold text-slate-800 text-lg">{fullName}</h3>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">Super Admin</p>
            </div>

            <div className="w-full pt-6 mt-6 border-t border-slate-50 space-y-3">
              <button onClick={handleAvatarClick} className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-100 hover:text-blue-600 transition-all shadow-sm">
                Thay đổi ảnh
              </button>
              <p className="text-[11px] text-slate-400 px-2">Định dạng JPG, PNG. Tối đa 2MB.</p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Họ và tên</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mã nhân viên</label>
                <input type="text" value="ADMIN-0001" disabled className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-semibold cursor-not-allowed select-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email liên hệ</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Số điện thoại</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-4 items-start">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Thông tin này sẽ được sử dụng để xác thực các giao dịch tín dụng quan trọng trên hệ thống. Vui lòng đảm bảo thông tin liên lạc là chính xác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
              <button type="button" className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Hủy bỏ</button>
              <button type="button" onClick={handleSaveChanges} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}