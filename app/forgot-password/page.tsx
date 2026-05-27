"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  
  // 1. Khởi tạo mảng 6 phần tử rỗng để lưu mã OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // 2. Dùng useRef để "bắt" các thẻ input, giúp ta điều khiển con trỏ chuột
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Hàm xử lý khi người dùng gõ số
  const handleOtpChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    // Cập nhật giá trị vào mảng state
    const newOtp = [...otp];
    // Lấy ký tự cuối cùng (phòng trường hợp người dùng gõ đè)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo nếu đã nhập và chưa phải ô cuối cùng
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Hàm xử lý khi người dùng bấm phím (đặc biệt là phím Xóa - Backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Nếu bấm nút Xóa (Backspace) và ô hiện tại đang trống -> Lùi con trỏ về ô trước đó
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Hàm xử lý khi dán (Paste) cả đoạn mã 6 số vào
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        newOtp[index] = char;
      });
      setOtp(newOtp);
      // Focus vào ô cuối cùng của đoạn mã vừa paste
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-[90%] flex flex-col md:flex-row border border-slate-100 min-h-[85vh]">
        
        <aside className="w-full md:w-3/5 relative min-h-[400px] md:min-h-0 bg-slate-100 hidden md:block"> 
          <Image
             src="/illustration.png" 
            alt="Bảo mật Hệ thống FinPro"
            fill
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply"></div>
        </aside>

        <section className="w-full md:w-2/5 p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Quay lại đăng nhập
          </Link>

          <div className="max-w-md mx-auto w-full space-y-8 mt-8">
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full border-4 border-white shadow-inner mb-2">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {step === 1 ? "Khôi phục mật khẩu" : step === 2 ? "Tạo mật khẩu mới" : "Đổi mật khẩu thành công!"}
              </h2>
              <p className="text-slate-500 text-sm font-medium px-4">
                {step === 1 
                  ? "Nhập email đã đăng ký của bạn. FinPro sẽ gửi một mã xác thực (OTP) để đặt lại mật khẩu." 
                  : step === 2 
                  ? "Vui lòng nhập mã OTP gồm 6 chữ số vừa được gửi đến email và thiết lập mật khẩu mới."
                  : "Mật khẩu của bạn đã được cập nhật an toàn. Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống."}
              </p>
            </div>

            {/* BƯỚC 1 */}
            {step === 1 && (
              <form className="space-y-6 animate-[fadeIn_0.4s_ease-out]" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email đăng ký</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                    </span>
                    <input type="email" required placeholder="ví dụ: admin.wayne@finpro.vn" className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium transition-all"/>
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all duration-300 text-base shadow-md flex justify-center items-center gap-2">
                  Gửi mã xác thực OTP
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </form>
            )}

            {/* BƯỚC 2: NHẬP OTP XỊN XÒ */}
            {step === 2 && (
              <form className="space-y-5 animate-[fadeIn_0.4s_ease-out]" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mã xác thực (OTP)</label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <input 
                        key={index} 
                        // Gán thẻ input này vào mảng inputRefs
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text" 
                        inputMode="numeric"
                        maxLength={1} 
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu mới</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </span>
                    <input type="password" required placeholder="Tối thiểu 8 ký tự" className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium transition-all"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </span>
                    <input type="password" required placeholder="Nhập lại mật khẩu mới" className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 font-medium transition-all"/>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 text-base mt-4">
                  Cập nhật mật khẩu
                </button>
              </form>
            )}

            {/* BƯỚC 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] flex flex-col items-center mt-8">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <Link href="/" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all duration-300 text-base text-center block">
                  Đăng nhập ngay
                </Link>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}