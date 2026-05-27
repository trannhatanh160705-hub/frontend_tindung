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
  creditScore: 780, // Điểm CIC để vẽ Progress Circle
  creditStatus: "Tốt",
};

const myLoans = [
  { id: "HD-2026-012", amount: "120.000.000 ₫", remaining: "80.000.000 ₫", rate: "10.5%", duration: "12 tháng", status: "Đang vay", date: "26/05/2026", nextPayment: "15/06/2026" },
  { id: "HD-2026-008", amount: "50.000.000 ₫", remaining: "50.000.000 ₫", rate: "9.0%", duration: "6 tháng", status: "Chờ duyệt", date: "20/05/2026", nextPayment: "--" },
  { id: "HD-2025-088", amount: "200.000.000 ₫", remaining: "0 ₫", rate: "11.0%", duration: "24 tháng", status: "Đã tất toán", date: "15/10/2024", nextPayment: "--" },
  { id: "HD-2025-042", amount: "30.000.000 ₫", remaining: "15.000.000 ₫", rate: "12.0%", duration: "12 tháng", status: "Quá hạn", date: "01/01/2025", nextPayment: "Đã quá hạn" },
];

const loginHistory = [
  { id: 1, device: "MacBook Pro - Safari", location: "Hà Nội, VN", time: "Vừa xong", status: "Đang hoạt động" },
  { id: 2, device: "iPhone 15 - FinPro App", location: "Hà Nội, VN", time: "Hôm qua, 14:30", status: "Đã đăng xuất" },
];

// Lịch thanh toán cho Drawer
const mockPaymentSchedule = [
  { period: "Kỳ 1", amount: "10.500.000 ₫", dueDate: "15/06/2026", status: "Chưa thanh toán" },
  { period: "Kỳ 2", amount: "10.500.000 ₫", dueDate: "15/07/2026", status: "Chưa thanh toán" },
];

export default function PremiumCustomerPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Trạng thái ngày giờ thực tế
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const date = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setCurrentDate(date);
  }, []);

  // Filter & Pagination cho Bảng
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Drawer State
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  // Tính toán KPI
  const activeLoans = myLoans.filter(l => l.status === "Đang vay");
  const totalDebt = activeLoans.reduce((sum, l) => sum + parseInt(l.remaining.replace(/\D/g, "")), 0);
  const formattedTotalDebt = (totalDebt / 1000000).toLocaleString("vi-VN") + " Triệu ₫";
  const nextPaymentDate = activeLoans.length > 0 ? activeLoans[0].nextPayment : "--";

  // Logic Lọc
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

  // Badge Style Tinh Tế (SaaS Style)
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-blue-200">
      
      {/* ========================================== */}
      {/* 1. SIDEBAR CAO CẤP (Dark Blue Premium) */}
      {/* ========================================== */}
      <aside className="w-[280px] bg-[#0A1128] text-slate-300 hidden lg:flex flex-col fixed h-full z-20 border-r border-white/5 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo */}
        <div className="h-24 flex items-center px-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-white/10">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white leading-none block">FinPro</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400/80">Premium Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 relative z-10 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Danh mục chính</p>
          
          <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "overview" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className={`w-5 h-5 transition-transform ${activeTab === "overview" ? "scale-110" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Tổng quan
          </button>
          
          <button onClick={() => setActiveTab("loans")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "loans" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className={`w-5 h-5 transition-transform ${activeTab === "loans" ? "scale-110" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Chi tiết khoản vay
          </button>

          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group ${activeTab === "profile" ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/10" : "hover:bg-white/5 hover:text-white"}`}>
            <svg className={`w-5 h-5 transition-transform ${activeTab === "profile" ? "scale-110" : "group-hover:scale-110"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Hồ sơ cá nhân
          </button>
        </nav>

        {/* Profile Card & Logout */}
        <div className="p-4 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0A1128] flex items-center justify-center text-white font-bold text-sm">
                  {customerInfo.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{customerInfo.name}</p>
                <p className="text-[10px] text-blue-300/80 font-mono mt-0.5">{customerInfo.id}</p>
              </div>
            </div>
            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-300 transition-all text-sm group">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Đăng xuất hệ thống
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. MAIN CONTENT */}
      {/* ========================================== */}
      <main className="flex-1 lg:ml-[280px] p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10 animate-[fadeIn_0.4s_ease-out]">
          
          {/* HEADER CHUNG */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-1">{currentDate}</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Xin chào, {customerInfo.name.split(" ").pop()} <span className="text-2xl animate-bounce origin-bottom-right">👋</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Chúc bạn quản lý tài chính hiệu quả hôm nay.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-11 h-11 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all relative">
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </button>
              <div className="h-11 px-4 bg-white rounded-full border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:shadow-md transition-all">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{customerInfo.name.charAt(0)}</div>
                <span className="text-sm font-bold text-slate-700">{customerInfo.id}</span>
              </div>
            </div>
          </header>

          {/* ========================================== */}
          {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
          {/* ========================================== */}
          {activeTab === "overview" && (
            <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Premium KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Tổng dư nợ */}
                <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all"><svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.17-1.92H8.01c.12 1.96 1.49 3.2 3.09 3.51V19h2.32v-1.64c1.78-.31 2.9-1.34 2.9-2.9 0-1.84-1.32-2.65-3.83-3.21z"/></svg></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng dư nợ</h3>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{formattedTotalDebt}</div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400">So với tháng trước</span>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">-5.2%</span>
                    </div>
                  </div>
                </div>

                {/* Khoản vay hoạt động */}
                <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Đang hoạt động</h3>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{activeLoans.length} <span className="text-lg text-slate-400 font-medium">HĐ</span></div>
                    {/* Mini Bar Chart */}
                    <div className="mt-6 flex items-end gap-1 h-8">
                      {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                         <div key={i} className="flex-1 bg-cyan-100 rounded-t-sm hover:bg-cyan-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kỳ thanh toán tiếp */}
                <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kỳ thanh toán tới</h3>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{nextPaymentDate.split('/')[0]}/{nextPaymentDate.split('/')[1]}</div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Số tiền:</span><span className="text-rose-600">10.500.000 ₫</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full w-[70%]"></div></div>
                    </div>
                  </div>
                </div>

                {/* Trạng thái tín dụng */}
                <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative z-10 flex justify-between h-full flex-col">
                    <div>
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
                      <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">Điểm tín dụng CIC</h3>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-3xl font-black text-emerald-500 tracking-tight">{customerInfo.creditScore}</div>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-1 inline-block">{customerInfo.creditStatus}</div>
                      </div>
                      {/* Circular Progress SVG */}
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

              {/* Bảng Mini (Khoản vay gần đây) */}
              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Khoản vay gần đây</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">3 giao dịch hợp đồng gần nhất.</p>
                  </div>
                  <button onClick={() => setActiveTab("loans")} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                    Xem tất cả &rarr;
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                        <th className="py-4 px-8">Mã hợp đồng</th>
                        <th className="py-4 px-6">Số tiền vay</th>
                        <th className="py-4 px-6">Kỳ hạn</th>
                        <th className="py-4 px-6">Trạng thái</th>
                        <th className="py-4 px-6 text-slate-400">Ngày tạo</th>
                        <th className="py-4 px-8 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myLoans.slice(0, 3).map((loan) => (
                        <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-5 px-8 font-bold text-slate-800">{loan.id}</td>
                          <td className="py-5 px-6 font-black text-slate-700">{loan.amount}</td>
                          <td className="py-5 px-6 text-sm text-slate-600 font-semibold">{loan.duration}</td>
                          <td className="py-5 px-6">{renderStatusBadge(loan.status)}</td>
                          <td className="py-5 px-6 text-sm text-slate-500 font-medium">{loan.date}</td>
                          <td className="py-5 px-8 text-right">
                            <button onClick={() => handleViewLoan(loan)} className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ring-1 ring-transparent hover:ring-blue-200" title="Xem chi tiết">
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

          {/* ========================================== */}
          {/* TAB 2: CHI TIẾT KHOẢN VAY (FULL TABLE) */}
          {/* ========================================== */}
          {activeTab === "loans" && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Chi tiết khoản vay</h1>
                <p className="text-slate-500 font-medium mt-1">Quản lý và tra cứu toàn bộ hợp đồng tín dụng của bạn.</p>
              </div>

              <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
                {/* SaaS Filters */}
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/30">
                  <div className="relative w-full max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Tra cứu mã hợp đồng..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-semibold transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-bold text-slate-500">Trạng thái:</span>
                    <select 
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 shadow-sm outline-none cursor-pointer"
                    >
                      <option value="Tất cả">Tất cả hợp đồng</option>
                      <option value="Đang vay">Đang vay</option>
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Quá hạn">Quá hạn</option>
                      <option value="Đã tất toán">Đã tất toán</option>
                    </select>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-50/80 sticky top-0 backdrop-blur-md text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 z-10">
                        <th className="py-5 px-8">Mã hợp đồng</th>
                        <th className="py-5 px-6">Số tiền vay</th>
                        <th className="py-5 px-6">Lãi suất</th>
                        <th className="py-5 px-6">Kỳ hạn</th>
                        <th className="py-5 px-6">Ngày tạo</th>
                        <th className="py-5 px-6">Trạng thái</th>
                        <th className="py-5 px-8 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {currentLoans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                          <td className="py-4 px-8 font-bold text-slate-800">{loan.id}</td>
                          <td className="py-4 px-6 font-black text-slate-700">{loan.amount}</td>
                          <td className="py-4 px-6 text-sm font-semibold text-slate-600">{loan.rate}</td>
                          <td className="py-4 px-6 text-sm text-slate-600 font-medium">{loan.duration}</td>
                          <td className="py-4 px-6 text-sm text-slate-500 font-medium">{loan.date}</td>
                          <td className="py-4 px-6">{renderStatusBadge(loan.status)}</td>
                          <td className="py-4 px-8 text-center">
                            <button onClick={() => handleViewLoan(loan)} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentLoans.length === 0 && (
                        <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-medium bg-slate-50/50">Không tìm thấy hợp đồng nào phù hợp.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Modern Pagination */}
                <div className="p-4 md:px-8 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/30">
                  <span className="text-slate-500 font-medium">Trang <span className="font-bold text-slate-800">{currentPage}</span> trên <span className="font-bold text-slate-800">{totalPages || 1}</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">Trước</button>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">Tiếp</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: HỒ SƠ CÁ NHÂN (2-Column Layout) */}
          {/* ========================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Cài đặt tài khoản</h1>
                <p className="text-slate-500 font-medium mt-1">Quản lý thông tin định danh và bảo mật cá nhân.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Cột Trái: Trạng thái & Định danh */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card Avatar */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                    <div className="w-28 h-28 rounded-full bg-white p-1.5 relative z-10 shadow-xl mb-4">
                      <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-black text-slate-400">
                        {customerInfo.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Đã xác thực KYC">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800">{customerInfo.name}</h3>
                    <p className="text-sm font-mono text-slate-500 mt-1">{customerInfo.id}</p>
                    <div className="mt-5 w-full pt-5 border-t border-slate-100">
                      <span className="inline-flex items-center justify-center w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                        Hồ sơ định danh hoàn tất (Mức 2)
                      </span>
                    </div>
                  </div>

                  {/* Lịch sử đăng nhập */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      Phiên đăng nhập gần đây
                    </h4>
                    <div className="space-y-4">
                      {loginHistory.map((log) => (
                        <div key={log.id} className="flex gap-3 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.status === 'Đang hoạt động' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{log.device}</p>
                            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{log.location} • {log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Form Thông Tin & Bảo Mật */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Form Cập Nhật */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800">Cập nhật thông tin</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">Thông tin dùng để liên hệ và đối chiếu hợp đồng.</p>
                    </div>
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Họ và Tên</label>
                        <input type="text" defaultValue={customerInfo.name} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                        <input type="text" defaultValue={customerInfo.phone} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" defaultValue={customerInfo.email} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số CCCD <span className="normal-case font-normal text-rose-400">(Không thể tự sửa)</span></label>
                        <input type="text" defaultValue={customerInfo.cccd} disabled className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-400 cursor-not-allowed select-none shadow-inner" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Địa chỉ thường trú</label>
                        <input type="text" defaultValue={customerInfo.address} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bảo Mật (Đổi MK) */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-8 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">Bảo mật tài khoản</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Nên thay đổi mật khẩu định kỳ 3 tháng/lần.</p>
                      </div>
                      <button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors shadow-sm text-sm">
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================== */}
      {/* DRAWER: XEM CHI TIẾT KHOẢN VAY */}
      {/* ========================================== */}
      {isViewDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsViewDrawerOpen(false)}></div>
          <div className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-slate-50 shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col`}>
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Thông tin Hợp đồng</h2>
              <button onClick={() => setIsViewDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            
            {selectedLoan && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Thẻ trạng thái */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã hợp đồng</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">{selectedLoan.id}</h3>
                  <div className="pt-4 flex justify-center">{renderStatusBadge(selectedLoan.status)}</div>
                </div>

                {/* Thông tin tài chính */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                  <h4 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Tài chính khoản vay
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Số tiền giải ngân</span>
                    <span className="text-base font-bold text-slate-800">{selectedLoan.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Dư nợ gốc hiện tại</span>
                    <span className="text-base font-black text-blue-600">{selectedLoan.remaining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Lãi suất / Kỳ hạn</span>
                    <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{selectedLoan.rate} / {selectedLoan.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Kỳ thanh toán tới</span>
                    <span className="text-sm font-bold text-rose-500">{selectedLoan.nextPayment}</span>
                  </div>
                </div>

                {/* Lịch thanh toán */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Lịch thanh toán dự kiến
                  </h4>
                  <div className="space-y-3">
                    {mockPaymentSchedule.map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{payment.period} • {payment.dueDate}</p>
                          <p className="text-base font-bold text-slate-800 mt-1">{payment.amount}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm">
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}