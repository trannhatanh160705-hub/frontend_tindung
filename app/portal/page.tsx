"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ==========================================
// MOCK DATA
// ==========================================
const customerInfo = {
  id: "KH-012",
  name: "Trần Văn Phúc",
  email: "phuc.tran@gmail.com",
  phone: "0904.123.456",
  cccd: "001099123456",
  address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
  creditScore: 780, 
  creditStatus: "Tốt",
};

const myLoans = [
  { id: "HD-2026-012", amount: "120.000.000 ₫", remaining: "80.000.000 ₫", rate: "10.5%", duration: "12 tháng", status: "Đang vay", date: "26/05/2026", nextPayment: "15/06/2026" },
  { id: "HD-2026-008", amount: "50.000.000 ₫", remaining: "50.000.000 ₫", rate: "9.0%", duration: "6 tháng", status: "Chờ duyệt", date: "20/05/2026", nextPayment: "--" },
  { id: "HD-2025-088", amount: "200.000.000 ₫", remaining: "0 ₫", rate: "11.0%", duration: "24 tháng", status: "Đã tất toán", date: "15/10/2024", nextPayment: "--" },
  { id: "HD-2025-042", amount: "30.000.000 ₫", remaining: "15.000.000 ₫", rate: "12.0%", duration: "12 tháng", status: "Quá hạn", date: "01/01/2025", nextPayment: "Đã quá hạn" },
];

const mockNotifications = [
  { id: 1, text: "Khoản thanh toán kỳ 1 của hợp đồng HD-2026-012 sắp đến hạn vào ngày 15/06/2026.", time: "Vừa xong", isNew: true },
  { id: 2, text: "Hồ sơ vay vốn HD-2026-008 đã được tiếp nhận thành công và đang chuyển sang ban thẩm định duyệt.", time: "2 giờ trước", isNew: true },
  { id: 3, text: "Chào mừng bạn đã kích hoạt tài khoản thành công trên hệ thống quản lý tín dụng FinPro Portal.", time: "2 ngày trước", isNew: false }
];

export default function PremiumCustomerPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
  
  const [customerAvatar, setCustomerAvatar] = useState("https://ui-avatars.com/api/?name=Tran+Van+Phuc&background=2563eb&color=fff");
  const [tempAvatarInput, setTempAvatarInput] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    const savedAvatar = localStorage.getItem("customer_avatar");
    if (savedAvatar) {
      setCustomerAvatar(savedAvatar);
      setTempAvatarInput(savedAvatar);
    }
  }, []);

  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const date = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setCurrentDate(date);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const activeAndOverdueLoans = myLoans.filter(l => l.status === "Đang vay" || l.status === "Quá hạn");
  const totalDebt = activeAndOverdueLoans.reduce((sum, l) => sum + parseInt(l.remaining.replace(/\D/g, "")), 0);
  const formattedTotalDebt = totalDebt.toLocaleString("vi-VN") + " ₫";
  const nextPaymentDate = myLoans.find(l => l.status === "Đang vay")?.nextPayment || "--";

  const filteredLoans = myLoans.filter(l => {
    const matchSearch = l.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "Tất cả" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const currentLoans = filteredLoans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewLoan = (loan: any) => {
    setSelectedLoan(loan);
    setIsViewDrawerOpen(true);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      alert("Vui lòng điền đủ các trường mật khẩu!");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }
    alert("🔒 Đổi mật khẩu tài khoản Portal thành công!");
    setIsPasswordModalOpen(false);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (tempAvatarInput) {
      setCustomerAvatar(tempAvatarInput);
      localStorage.setItem("customer_avatar", tempAvatarInput);
      window.dispatchEvent(new Event("profileUpdated"));
    }
    alert("✨ Đã cập nhật hồ sơ cá nhân thành công!");
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true); 
    setTimeout(() => {
      alert(`✅ Giao dịch thanh toán cho hợp đồng ${selectedLoan?.id} thành công. Hệ thống đang ghi nhận!`);
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false); 
      setIsViewDrawerOpen(false);   
    }, 1500); 
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Đang vay": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/80 text-blue-700 text-xs font-bold shadow-sm ring-1 ring-inset ring-blue-600/20"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Đang vay</span>;
      case "Chờ duyệt": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/80 text-amber-700 text-xs font-bold shadow-sm ring-1 ring-inset ring-amber-600/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Chờ duyệt</span>;
      case "Quá hạn": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50/80 text-rose-700 text-xs font-bold shadow-sm ring-1 ring-inset ring-rose-600/20"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Quá hạn</span>;
      case "Đã tất toán": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/80 text-slate-600 text-xs font-bold shadow-sm ring-1 ring-inset ring-slate-500/20"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Đã tất toán</span>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-200">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#0A1128] text-slate-300 hidden lg:flex flex-col h-screen sticky top-0 z-50 border-r border-white/5 overflow-hidden shrink-0 shadow-2xl">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="h-24 flex items-center px-8 relative z-10 shrink-0 border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* LOGO TRONG SUỐT ĐÃ ĐƯỢC ĐỒNG BỘ */}
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src="/fintech.png" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white leading-none block">FinPro</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400/80">Premium Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 relative z-10 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Danh mục chính</p>
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "overview" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Tổng quan
          </button>
          <button onClick={() => setActiveTab("loans")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "loans" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Chi tiết khoản vay
          </button>
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "profile" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Hồ sơ cá nhân
          </button>

          <Link href="/" className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all mt-4 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Đăng xuất hệ thống
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOPBAR */}
        <header className="h-[90px] bg-white/60 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-12 z-40 sticky top-0 shadow-sm shadow-slate-100/50 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Xin chào, {customerInfo.name.split(" ").pop()} <span className="animate-bounce origin-bottom text-2xl">👋</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentDate} • Chúc bạn quản lý tài chính hiệu quả.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

            <div className="flex items-center gap-4 relative">
              {isNotificationOpen && <div className="fixed inset-0 z-30" onClick={() => setIsNotificationOpen(false)}></div>}
              
              <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="w-11 h-11 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md transition-all relative z-40">
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </button>

              <div className="flex items-center gap-3 group">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-800">{customerInfo.name}</p>
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Premium Member</p>
                </div>
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 bg-slate-100 cursor-pointer">
                  <img src={customerAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* BẢNG TRƯỢT THÔNG BÁO */}
              <div className={`absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-2 z-40 transition-all duration-300 origin-top-right ${isNotificationOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <div className="px-4 py-2 border-b border-slate-100 mb-1 flex justify-between items-center"><span className="font-extrabold text-sm text-slate-800">Thông báo mới</span><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Hệ thống</span></div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {mockNotifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl transition-colors text-xs flex flex-col gap-1 ${n.isNew ? 'bg-blue-50/50 font-medium text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                      <p className="leading-relaxed">{n.text}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG CUỘN Ở DƯỚI */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <div className="max-w-[1300px] mx-auto space-y-10">

            {/* TAB 1: TỔNG QUAN */}
            {activeTab === "overview" && (
              <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all"><svg className="w-22 h-22 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.17-1.92H8.01c.12 1.96 1.49 3.2 3.09 3.51V19h2.32v-1.64c1.78-.31 2.9-1.34 2.9-2.9 0-1.84-1.32-2.65-3.83-3.21z"/></svg></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                      <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng dư nợ gốc</h3>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">{formattedTotalDebt}</div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center"><span className="text-xs font-semibold text-slate-400">So với kỳ trước</span><span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">-5.2%</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                      <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kỳ thanh toán tới</h3>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">{nextPaymentDate}</div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Số tiền:</span><span className="text-rose-600">10.500.000 ₫</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full w-[70%]"></div></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="relative z-10 flex justify-between h-full flex-col">
                      <div>
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
                        <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Xếp hạng tín dụng CIC</h3>
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <div>
                          <div className="text-3xl font-black text-emerald-500 tracking-tight">{customerInfo.creditScore}</div>
                          <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-1 inline-block">{customerInfo.creditStatus}</div>
                        </div>
                        <div className="w-14 h-14 relative flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-emerald-500" strokeDasharray={`${(customerInfo.creditScore / 850) * 100}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">Khoản vay gần đây</h2>
                      <p className="text-sm text-slate-500 mt-1 font-medium">Danh sách các hợp đồng hiện hành.</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                          <th className="py-4 px-8">Mã hợp đồng</th>
                          <th className="py-4 px-6">Số tiền vay</th>
                          <th className="py-4 px-6">Dư nợ hiện tại</th>
                          <th className="py-4 px-6">Kỳ hạn</th>
                          <th className="py-4 px-6">Trạng thái</th>
                          <th className="py-4 px-8 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myLoans.map((loan) => (
                          <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-5 px-8 font-bold text-slate-800">{loan.id}</td>
                            <td className="py-5 px-6 font-black text-slate-700">{loan.amount}</td>
                            <td className="py-5 px-6 font-black text-blue-600">{loan.remaining}</td>
                            <td className="py-5 px-6 text-sm text-slate-600 font-semibold">{loan.duration}</td>
                            <td className="py-5 px-6">{renderStatusBadge(loan.status)}</td>
                            <td className="py-5 px-8 text-right">
                              <button onClick={() => handleViewLoan(loan)} className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ring-1 ring-transparent hover:ring-blue-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHI TIẾT KHOẢN VAY */}
            {activeTab === "loans" && (
              <div className="space-y-6 w-full animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Chi tiết khoản vay</h1>
                  <p className="text-slate-500 font-medium mt-1">Quản lý và tra cứu toàn bộ hợp đồng tín dụng cá nhân.</p>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col w-full">
                  <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30">
                    <div className="relative w-full md:w-96">
                      <input 
                        type="text" 
                        placeholder="Tra cứu nhanh mã hợp đồng..." 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-semibold transition-all shadow-sm"
                      />
                      <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <span className="text-sm font-bold text-slate-500">Trạng thái hồ sơ:</span>
                      <select 
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl block p-3 shadow-sm outline-none cursor-pointer"
                      >
                        <option value="Tất cả">Tất cả hợp đồng</option>
                        <option value="Đang vay">Đang vay</option>
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Quá hạn">Quá hạn</option>
                        <option value="Đã tất toán">Đã tất toán</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto min-h-[480px]">
                    <table className="w-full text-left border-collapse min-w-[1050px]">
                      <thead>
                        <tr className="bg-slate-50/80 sticky top-0 backdrop-blur-md text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100 z-10">
                          <th className="py-5 px-8">Mã hợp đồng</th>
                          <th className="py-5 px-6">Giá trị giải ngân</th>
                          <th className="py-5 px-6">Dư nợ còn lại</th>
                          <th className="py-5 px-6">Kỳ hạn vay</th>
                          <th className="py-5 px-6">Ngày khởi tạo</th>
                          <th className="py-5 px-6">Ngày đến hạn</th>
                          <th className="py-5 px-6">Trạng thái</th>
                          <th className="py-5 px-8 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {currentLoans.map((loan) => (
                          <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                            <td className="py-5 px-8 font-bold text-slate-800">{loan.id}</td>
                            <td className="py-5 px-6 font-black text-slate-700">{loan.amount}</td>
                            <td className="py-5 px-6 font-black text-blue-600">{loan.remaining}</td>
                            <td className="py-5 px-6 font-medium text-slate-600">{loan.duration}</td>
                            <td className="py-5 px-6 text-slate-500 font-medium">{loan.date}</td>
                            <td className="py-5 px-6 font-bold text-rose-500">{loan.nextPayment !== '--' ? loan.nextPayment : 'Không có'}</td>
                            <td className="py-5 px-6">{renderStatusBadge(loan.status)}</td>
                            <td className="py-5 px-8 text-center">
                              <button onClick={() => handleViewLoan(loan)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-5 md:px-8 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/30 mt-auto">
                    <span className="text-slate-500 font-semibold">Đang ở trang <span className="font-bold text-slate-800">{currentPage}</span> / {totalPages || 1}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">Trước</button>
                      <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">Kế tiếp</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HỒ SƠ CÁ NHÂN */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Thông tin tài khoản</h1>
                  <p className="text-slate-500 font-medium mt-1">Cập nhật hồ sơ và quản lý cấu hình cá nhân.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Profile Avatar Card */}
                  <div className="md:col-span-4 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-20 bg-[#0A1128]"></div>
                    <div className="w-24 h-24 rounded-full bg-white p-1 relative z-10 shadow-lg mb-4">
                      {/* Hiển thị Avatar Preview */}
                      <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                        <img src={tempAvatarInput || customerAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800">{customerInfo.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">ID khách hàng: {customerInfo.id}</p>
                  </div>

                  {/* Form thông tin định danh */}
                  <div className="md:col-span-8 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* TÍNH NĂNG UPLOAD ẢNH ĐẠI DIỆN TỪ MÁY */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ảnh đại diện</label>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100">
                            <img src={tempAvatarInput || customerAvatar} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <input 
                              type="file" 
                              id="avatar-upload" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAvatarUpload} 
                            />
                            <label htmlFor="avatar-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                              Tải ảnh từ thiết bị
                            </label>
                            <p className="text-[10px] text-slate-400 mt-2 ml-1">Hỗ trợ định dạng: JPG, PNG. Dung lượng tối đa 2MB.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2 mt-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                        <input type="text" defaultValue={customerInfo.name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                        <input type="text" defaultValue={customerInfo.phone} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email liên hệ</label>
                        <input type="email" defaultValue={customerInfo.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Số Căn cước công dân <span className="normal-case font-normal text-slate-400 font-sans ml-2">(Hệ thống khóa)</span></label>
                        <input type="text" defaultValue={customerInfo.cccd} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-400 cursor-not-allowed shadow-inner" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Địa chỉ cư trú</label>
                        <input type="text" defaultValue={customerInfo.address} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 justify-between items-center">
                      <button onClick={() => setIsPasswordModalOpen(true)} className="px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        Thay đổi mật khẩu đăng nhập
                      </button>
                      <button onClick={handleUpdateProfile} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-600/10">
                        Cập nhật tài khoản
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* MODAL ĐỔI MẬT KHẨU */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
          <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Cập nhật mật khẩu mới</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Bảo mật thông tin dư nợ và lịch trình giao dịch vay.</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Mật khẩu cũ</label>
                <input type="password" required value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Mật khẩu mới</label>
                <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" placeholder="Mật khẩu mới..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Nhập lại mật khẩu mới</label>
                <input type="password" required value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" placeholder="Xác nhận mật khẩu..." />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">Xác nhận</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL THANH TOÁN KHOẢN VAY VỚI HIỆU ỨNG LOADING */}
      {isPaymentModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isProcessingPayment && setIsPaymentModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 space-y-6">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              <h3 className="text-xl font-bold text-slate-800">Thanh toán khoản vay</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Hợp đồng: <span className="font-bold text-slate-700">{selectedLoan.id}</span></p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số tiền cần thanh toán</label>
                <input type="text" disabled value="10.500.000 ₫" className="w-full px-4 py-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-lg font-black text-emerald-600 outline-none cursor-not-allowed text-center" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phương thức thanh toán</label>
                <select disabled={isProcessingPayment} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer shadow-sm disabled:opacity-50">
                  <option value="mb">Ngân hàng MB Bank (Khuyên dùng)</option>
                  <option value="pvcom">Ngân hàng PVcomBank</option>
                  <option value="momo">Ví điện tử MoMo</option>
                  <option value="zalopay">Ví điện tử ZaloPay</option>
                  <option value="vnpay">Cổng thanh toán VNPAY</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsPaymentModalOpen(false)} 
                disabled={isProcessingPayment}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Hủy giao dịch
              </button>
              <button 
                onClick={handleProcessPayment} 
                disabled={isProcessingPayment}
                className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER CHI TIẾT */}
      {isViewDrawerOpen && selectedLoan && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsViewDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-slate-50 shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Thông tin Hợp đồng</h2>
              <button onClick={() => setIsViewDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã hợp đồng</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{selectedLoan.id}</h3>
                <div className="pt-4 flex justify-center">{renderStatusBadge(selectedLoan.status)}</div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                <h4 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">Tài chính khoản vay</h4>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Số tiền giải ngân</span><span className="text-base font-bold text-slate-800">{selectedLoan.amount}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Dư nợ gốc hiện tại</span><span className="text-base font-black text-blue-600">{selectedLoan.remaining}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Lãi suất / Kỳ hạn</span><span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{selectedLoan.rate} / {selectedLoan.duration}</span></div>
              </div>

              {(selectedLoan.status === "Đang vay" || selectedLoan.status === "Quá hạn") && (
                <div className="pt-4">
                  <button onClick={() => setIsPaymentModalOpen(true)} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    Thanh toán khoản vay
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}