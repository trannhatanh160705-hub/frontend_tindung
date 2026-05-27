"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State lưu tên và ảnh trên thanh Topbar
  const [adminName, setAdminName] = useState("Wayne");
  const [adminAvatar, setAdminAvatar] = useState(
    "https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff"
  );

  // Hàm tải dữ liệu mới nhất từ localStorage lên thanh điều hướng
  const loadProfileData = () => {
    const savedName = localStorage.getItem("profile_name");
    const savedAvatar = localStorage.getItem("profile_avatar");
    if (savedName) setAdminName(savedName);
    if (savedAvatar) setAdminAvatar(savedAvatar);
  };

  useEffect(() => {
    loadProfileData(); // Chạy lần đầu khi mở web

    // Lắng nghe sự kiện "profileUpdated" khi nhấn Lưu ở trang Hồ sơ để cập nhật Topbar ngay lập tức
    window.addEventListener("profileUpdated", loadProfileData);
    return () => {
      window.removeEventListener("profileUpdated", loadProfileData);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50 to-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar (Giữ nguyên phần code cũ của bạn) */}
      <aside className="w-[260px] hidden md:flex bg-[#0F172A] text-slate-300 flex-col shadow-2xl z-20">
        {/* ... giữ nguyên toàn bộ nội dung cụm Sidebar cũ ... */}
        <div className="h-28 flex flex-col justify-center items-center gap-2 px-6 border-b border-slate-800/60">
          <div className="w-11 h-11 bg-gradient-to-br from-[#2563EB] to-[#38BDF8] rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <div className="text-center">
            <span className="font-extrabold text-xl tracking-tight text-white">Fin<span className="text-blue-400">Pro</span></span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-[3px] font-semibold -mt-1">SYSTEM</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Quản lý nghiệp vụ</div>
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-3 rounded-xl relative group transition-all duration-300 ${isActive('/dashboard') ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}>
            {isActive('/dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span className="font-medium">Hợp đồng vay</span>
          </Link>
          <Link href="/dashboard/customers" className={`flex items-center gap-3 px-3 py-3 rounded-xl relative group transition-all duration-300 ${isActive('/dashboard/customers') ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}>
            {isActive('/dashboard/customers') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span className="font-medium">Khách hàng</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-slate-800/60">
          <Link href="/" className="flex items-center gap-3 w-full text-slate-400 hover:text-rose-400 transition-colors group">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span className="font-medium">Đăng xuất</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-[90px] bg-white/60 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm shadow-slate-100/50">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Xin chào Admin <span className="animate-bounce origin-bottom text-2xl">👋</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Thứ Hai, 25/05/2026 • Chào mừng bạn quay trở lại làm việc.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-px h-8 bg-slate-200"></div>

            {/* AVATAR DROPDOWN */}
            <div className="relative">
              {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}

              {/* Thay đổi src ảnh và tên hiển thị động theo State */}
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full transition-all duration-300 relative z-50 ${isProfileOpen ? 'bg-white shadow-md' : 'hover:bg-white hover:shadow-md'}`}>
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden ring-2 ring-white">
                  <img src={adminAvatar} alt="Avatar" className="w-full h-full object-cover"/>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-800">{adminName}</p>
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Super Admin</p>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ml-1 ${isProfileOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>

              {/* Menu trượt (Giữ nguyên cấu trúc cũ của bạn) */}
              <div className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-50 transition-all duration-300 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-800">{adminName}</p>
                  <p className="text-xs text-slate-500 font-medium">admin.wayne@finpro.vn</p>
                </div>
                <div className="space-y-1">
                  <Link href="/dashboard/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Hồ sơ cá nhân
                  </Link>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Đổi mật khẩu
                  </a>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Đăng xuất
                </Link>
              </div>
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}   