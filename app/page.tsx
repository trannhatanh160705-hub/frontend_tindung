"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const [username, setUsername] = useState("ADMIN-0001");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const accountId = username.toUpperCase();
      if (accountId.includes("ADMIN")) {
        router.push("/dashboard");
      } else if (accountId.includes("KH")) {
        router.push("/portal");
      } else {
        alert("Tài khoản không hợp lệ. Vui lòng nhập mã bắt đầu bằng ADMIN hoặc KH.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col font-sans text-slate-900 selection:bg-blue-200 overflow-hidden">
      
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUpFade {
          animation: slideUpFade 0.5s ease-out forwards;
        }
      `}</style>

      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ========================================== */}
      {/* 1. HEADER (Đã fix Logo trong suốt & Tăng size chữ) */}
      {/* ========================================== */}
      <header className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* KHUNG LOGO TRONG SUỐT BẢN TO */}
            {/* Đã xóa bg-white, border. Chỉnh kích thước w-12 h-12 và dùng object-contain */}
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              {/* Đổi src thành tên file logo của bạn, ví dụ: "/logo.png" */}
              <img src="/fintech.png" alt="FinPro Logo" className="w-full h-full object-contain scale-110 drop-shadow-sm" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none block">FinPro</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600">System</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group py-6 cursor-pointer">
              {/* Đổi từ text-sm sang text-base (chữ to hơn) */}
              <div className="flex items-center gap-1.5 font-bold text-base text-slate-600 group-hover:text-blue-600 transition-colors">
                Về chúng tôi
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-2.5 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="flex flex-col gap-1.5">
                  {/* Đổi từ text-sm sang text-base */}
                  <a href="#" className="px-4 py-3 hover:bg-blue-50 text-base font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-colors">Giới thiệu tổng quan</a>
                  <a href="#" className="px-4 py-3 hover:bg-blue-50 text-base font-semibold text-slate-700 hover:text-blue-600 rounded-xl transition-colors">Tính năng của web</a>
                </div>
              </div>
            </div>
            {/* Đổi từ text-sm sang text-base */}
            <button onClick={() => setIsContactModalOpen(true)} className="font-bold text-base text-slate-600 hover:text-blue-600 transition-colors py-6">
              Liên hệ
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. KHU VỰC ĐĂNG NHẬP CHÍNH */}
      {/* ========================================== */}
      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-10">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden w-full max-w-[90%] flex flex-col md:flex-row border border-slate-100 min-h-[90vh] relative z-10 animate-slideUpFade">
          
          <aside className="w-full md:w-3/5 relative min-h-[400px] md:min-h-0 bg-slate-100 hidden md:block"> 
            <Image
              src="/illustration.png" 
              alt="Hệ thống FinPro"
              fill
              className="object-cover"
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply pointer-events-none"></div>
          </aside>

          <section className="w-full md:w-2/5 p-10 lg:p-16 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full space-y-8">
              
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đăng nhập hệ thống</h1>
                <p className="text-slate-500 font-medium">Cổng thông tin quản lý tín dụng. Vui lòng đăng nhập để tiếp tục.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tên đăng nhập / CCCD</label>
                  <div className="relative group focus-within:text-blue-600 text-slate-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                    </span>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-bold transition-all shadow-sm uppercase placeholder:normal-case placeholder:font-medium placeholder:text-slate-400"
                      placeholder="Nhập mã định danh..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu</label>
                    <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all">Quên mật khẩu?</a>
                  </div>
                  <div className="relative group focus-within:text-blue-600 text-slate-400">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-bold transition-all shadow-sm ${!showPassword && password ? 'tracking-widest' : 'tracking-normal'} placeholder:font-medium placeholder:text-slate-400 placeholder:tracking-normal`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-blue-600 transition-colors">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Ghi nhớ đăng nhập</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 mt-2 bg-slate-900 text-white font-bold rounded-xl hover:-translate-y-[1px] hover:bg-blue-600 hover:shadow-[0_8px_25px_-6px_rgba(37,99,235,0.6)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-slate-900"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      Đăng nhập hệ thống
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-5 flex gap-4 items-start">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 mb-1">Kết nối mã hóa (SSL/TLS)</h3>
                    <p className="text-xs text-blue-700/80 font-medium leading-relaxed">Hệ thống FinPro áp dụng tiêu chuẩn bảo mật đa tầng. Mọi dữ liệu truyền tải đều được mã hóa theo tiêu chuẩn an toàn thông tin.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>

      {/* ========================================== */}
      {/* 3. MODAL HỖ TRỢ LIÊN HỆ */}
      {/* ========================================== */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100">
            
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hỗ trợ khách hàng</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Vui lòng liên hệ qua các kênh dưới đây.</p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="mt-1 text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trụ sở chính</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 leading-relaxed">Tòa nhà FinPro Tower<br/>Số 58 Lê Văn Thiêm, Thanh Xuân, Hà Nội</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 group hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hotline cá nhân</p>
                  <p className="text-lg font-black text-blue-700 mt-0.5">1900 8888</p>
                </div>
                <button className="text-xs font-bold bg-white text-blue-600 px-3 py-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all">Gọi ngay</button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 group hover:bg-emerald-50 transition-colors cursor-pointer">
                <div className="text-emerald-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Khách hàng Doanh nghiệp</p>
                  <p className="text-lg font-black text-emerald-700 mt-0.5">024 7300 9999</p>
                </div>
                <button className="text-xs font-bold bg-white text-emerald-600 px-3 py-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all">Gọi ngay</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}