"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Thêm dòng này để điều hướng
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter(); // Khởi tạo router
  const [showPassword, setShowPassword] = useState(false);
  
  // State lưu trữ giá trị người dùng nhập vào
  const [username, setUsername] = useState("ADMIN-0001");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý Đăng nhập và Phân quyền
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trang bị reload khi ấn submit
    setIsLoading(true);

    // Giả lập thời gian load của server (1 giây)
    setTimeout(() => {
      const accountId = username.toUpperCase();

      if (accountId.includes("ADMIN")) {
        // Nếu là tài khoản Admin
        router.push("/dashboard");
      } else if (accountId.includes("KH")) {
        // Nếu là tài khoản Khách hàng
        router.push("/portal");
      } else {
        // Báo lỗi nếu nhập sai định dạng
        alert("Tài khoản không hợp lệ. Vui lòng nhập mã bắt đầu bằng ADMIN hoặc KH.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-[90%] flex flex-col md:flex-row border border-slate-100 min-h-[85vh]">
        
        {/* ... (Phần Ảnh Bìa Nửa Trái Giữ Nguyên) ... */}
        <aside className="w-full md:w-3/5 relative min-h-[400px] md:min-h-0 bg-slate-100 hidden md:block"> 
          <Image
            src="/illustration.png" 
            alt="Hệ thống FinPro"
            fill
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent mix-blend-multiply"></div>
          
          <div className="absolute top-10 left-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              <div className="text-white">
                <span className="font-extrabold text-2xl tracking-tight">FinPro</span>
                <span className="block text-[10px] uppercase tracking-[3px] font-semibold opacity-80">Workspace</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="w-full md:w-2/5 p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full space-y-8">
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đăng nhập hệ thống</h1>
              <p className="text-slate-500 font-medium">Cổng thông tin quản lý tín dụng và dịch vụ khách hàng. Vui lòng đăng nhập để tiếp tục.</p>
            </div>

            {/* ĐỔI THÀNH THẺ FORM ĐỂ BẮT SỰ KIỆN SUBMIT */}
            <form onSubmit={handleLogin} className="space-y-5 animate-[fadeIn_0.4s_ease-out]">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mã NV / Mã Khách Hàng</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                  </span>
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ADMIN-0001 hoặc KH-012" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 font-bold transition-all uppercase"
                  />
                </div>
              </div>

              {/* ... (Khu vực nhập mật khẩu giữ nguyên như cũ) ... */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                  <Link href="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-all">Quên mật khẩu?</Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </span>
                  <input type={showPassword ? "text" : "password"} required defaultValue="password123" placeholder="••••••••" className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-slate-900 font-bold transition-all ${!showPassword ? 'tracking-widest' : 'tracking-normal'}`}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-blue-600 transition-colors">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* NÚT SUBMIT */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      Đăng nhập
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Thông báo bảo mật giữ nguyên */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 flex gap-4 items-start">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 mb-1">Kết nối an toàn (SSL/TLS)</h3>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">Mọi phiên giao dịch và đăng nhập đều được mã hóa đầu cuối. Hệ thống giám sát an ninh mạng 24/7 nhằm bảo vệ tuyệt đối thông tin và tài sản của bạn.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}