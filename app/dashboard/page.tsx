"use client";

import { useState } from "react";

const initialContracts = [
  { id: "HD-2026-012", customer: "Trần Văn Phúc", address: "Hoàn Kiếm, Hà Nội", amount: "120.000.000 ₫", duration: "12 tháng", rate: "10.5%", status: "Đang vay", date: "26/05/2026", expireDate: "26/05/2027" },
  { id: "HD-2026-011", customer: "Nguyễn Thị Hoa", address: "Cầu Giấy, Hà Nội", amount: "50.000.000 ₫", duration: "6 tháng", rate: "9.0%", status: "Chờ duyệt", date: "25/05/2026", expireDate: "Chưa giải ngân" },
  { id: "HD-2026-010", customer: "Lê Hoàng Minh", address: "Quận 1, TP.HCM", amount: "300.000.000 ₫", duration: "24 tháng", rate: "11.2%", status: "Quá hạn", date: "20/05/2024", expireDate: "20/05/2026" },
  { id: "HD-2026-009", customer: "Phạm Đại Nghĩa", address: "Hải Châu, Đà Nẵng", amount: "80.000.000 ₫", duration: "12 tháng", rate: "10.0%", status: "Đã tất toán", date: "15/05/2025", expireDate: "15/05/2026" },
  { id: "HD-2026-008", customer: "Đặng Thu Thảo", address: "Đống Đa, Hà Nội", amount: "150.000.000 ₫", duration: "12 tháng", rate: "10.5%", status: "Đang vay", date: "10/05/2026", expireDate: "10/05/2027" },
  { id: "HD-2026-007", customer: "Vũ Trọng Phụng", address: "Thanh Xuân, Hà Nội", amount: "200.000.000 ₫", duration: "36 tháng", rate: "12.0%", status: "Đang vay", date: "05/05/2026", expireDate: "05/05/2029" },
  { id: "HD-2026-006", customer: "Bùi Bích Phương", address: "Ba Đình, Hà Nội", amount: "45.000.000 ₫", duration: "6 tháng", rate: "9.5%", status: "Đã tất toán", date: "01/11/2025", expireDate: "01/05/2026" },
  { id: "HD-2026-005", customer: "Hoàng Thanh Tùng", address: "Quận 3, TP.HCM", amount: "500.000.000 ₫", duration: "24 tháng", rate: "11.0%", status: "Chờ duyệt", date: "28/04/2026", expireDate: "Chưa giải ngân" },
  { id: "HD-2026-004", customer: "Lý Hải", address: "Ninh Kiều, Cần Thơ", amount: "70.000.000 ₫", duration: "12 tháng", rate: "10.0%", status: "Quá hạn", date: "20/04/2025", expireDate: "20/04/2026" },
  { id: "HD-2026-003", customer: "Ngô Kiến Huy", address: "Bình Thạnh, TP.HCM", amount: "90.000.000 ₫", duration: "12 tháng", rate: "10.5%", status: "Đang vay", date: "15/04/2026", expireDate: "15/04/2027" },
  { id: "HD-2026-002", customer: "Hồ Ngọc Hà", address: "Quận 7, TP.HCM", amount: "250.000.000 ₫", duration: "24 tháng", rate: "11.5%", status: "Đã tất toán", date: "10/04/2024", expireDate: "10/04/2026" },
  { id: "HD-2026-001", customer: "Trấn Thành", address: "Gò Vấp, TP.HCM", amount: "800.000.000 ₫", duration: "36 tháng", rate: "10.8%", status: "Đang vay", date: "01/04/2026", expireDate: "01/04/2029" },
];

export default function AdminDashboardPage() {
  const [contracts, setContracts] = useState(initialContracts);
  
  // --- LỌC DANH SÁCH KHÁCH HÀNG CŨ DUY NHẤT ĐỂ ĐƯA VÀO DROPDOWN ---
  const uniqueCustomers = Array.from(new Set(contracts.map(c => c.customer)))
    .map(name => contracts.find(c => c.customer === name))
    .filter(Boolean);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const calculateExpireDate = (startDateStr: string, durationStr: string) => {
    const months = parseInt(durationStr.replace(/\D/g, ""));
    if (isNaN(months)) return "Chưa rõ";
    const parts = startDateStr.split("/");
    if (parts.length !== 3) return "Chưa rõ";
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const expireDate = new Date(year, month, day);
    expireDate.setMonth(expireDate.getMonth() + months);
    return expireDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setCurrentPage(1);
    }
  };

  const filteredContracts = contracts.filter((c) => {
    const matchSearch = !activeSearch || c.id.toLowerCase().includes(activeSearch.toLowerCase()) || c.customer.toLowerCase().includes(activeSearch.toLowerCase());
    const matchStatus = statusFilter === "Tất cả" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  const activeCount = contracts.filter(c => c.status === "Đang vay").length;
  const overdueCount = contracts.filter(c => c.status === "Quá hạn").length;
  const pendingCount = contracts.filter(c => c.status === "Chờ duyệt").length;
  const totalDebtValue = contracts
    .filter(c => c.status === "Đang vay" || c.status === "Quá hạn")
    .reduce((sum, c) => sum + parseInt(c.amount.replace(/\D/g, "")), 0);
  const formattedTotalDebt = totalDebtValue >= 1000000000 
    ? (totalDebtValue / 1000000000).toFixed(1) + " Tỷ ₫" 
    : (totalDebtValue / 1000000).toFixed(0) + " Triệu ₫";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Thêm State để chuyển đổi Tab "Khách Cũ" hay "Khách Mới"
  const [isNewCustomerType, setIsNewCustomerType] = useState(true);
  
  const [newCustomer, setNewCustomer] = useState("");
  const [newCCCD, setNewCCCD] = useState(""); 
  const [newPhone, setNewPhone] = useState(""); // STATE ĐIỆN THOẠI
  const [newEmail, setNewEmail] = useState(""); // STATE EMAIL
  const [newAddress, setNewAddress] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDuration, setNewDuration] = useState("12 tháng");
  const [newRate, setNewRate] = useState("10.5");
  
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDuration, setEditDuration] = useState("12 tháng");
  const [editRate, setEditRate] = useState("10.5");
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // --- XỬ LÝ LƯU HỢP ĐỒNG (MÔ PHỎNG BACKEND) ---
  const handleSaveContract = () => {
    // Ràng buộc nhập liệu chặt chẽ hơn cho khách mới
    if (!newCustomer || !newAmount || !newAddress || (isNewCustomerType && (!newCCCD || !newPhone))) {
      alert("Vui lòng nhập đầy đủ Tên, CCCD, Số điện thoại, Địa chỉ và Số tiền!");
      return;
    }
    setIsSaving(true);
    
    // Giả lập Backend xử lý Random CIC nếu là khách hàng mới
    if (isNewCustomerType) {
        const randomCIC = Math.floor(Math.random() * (850 - 500 + 1)) + 500;
        
        // Tạo object khách hàng mới lưu kèm SĐT và Email
        const newCustomerObj = {
          id: `KH-${Math.floor(Math.random() * 10000)}`,
          name: newCustomer,
          address: newAddress,
          phone: newPhone, 
          cccd: newCCCD, 
          email: newEmail || "Chưa có", // Nếu bỏ trống Email thì để "Chưa có"
          cicScore: randomCIC,
          debt: `${newAmount} ₫`,
          status: "Chờ duyệt", 
          date: new Date().toLocaleDateString('vi-VN')
        };

        const existingNewCustomers = JSON.parse(localStorage.getItem('mock_new_customers') || '[]');
        localStorage.setItem('mock_new_customers', JSON.stringify([newCustomerObj, ...existingNewCustomers]));
    }

    setTimeout(() => {
      const newContract = {
        id: `HD-2026-0${contracts.length + 1}`,
        customer: newCustomer,
        address: newAddress,
        amount: `${newAmount} ₫`,
        duration: newDuration,
        rate: `${newRate}%`,
        status: "Chờ duyệt",
        date: new Date().toLocaleDateString('vi-VN'),
        expireDate: "Chưa giải ngân"
      };
      setContracts([newContract, ...contracts]);
      setSearchInput(""); setActiveSearch(""); setStatusFilter("Tất cả"); setCurrentPage(1);
      setIsSaving(false); setIsDrawerOpen(false); 
      
      // Reset toàn bộ form
      setNewCustomer(""); setNewAddress(""); setNewAmount(""); 
      setNewCCCD(""); setNewPhone(""); setNewEmail("");
      setIsNewCustomerType(true); 
    }, 1000);
  };

  const handleSelectExistingCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setNewCustomer(selectedName);
    
    if (selectedName) {
      const found = uniqueCustomers.find(c => c?.customer === selectedName);
      if (found) setNewAddress(found.address || "");
    } else {
      setNewAddress("");
    }
  };

  const handleApproveContract = (id: string) => {
    const todayStr = new Date().toLocaleDateString('vi-VN');
    setContracts(contracts.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: "Đang vay",
          date: todayStr,
          expireDate: calculateExpireDate(todayStr, c.duration)
        };
      }
      return c;
    }));
  };

  const triggerEdit = (contract: any) => {
    setSelectedEditId(contract.id);
    setEditCustomer(contract.customer);
    setEditAddress(contract.address || "");
    setEditAmount(contract.amount.replace(" ₫", ""));
    setEditDuration(contract.duration);
    setEditRate(contract.rate.replace("%", ""));
    setIsEditDrawerOpen(true);
  };

  const executeUpdate = () => {
    if (!editCustomer || !editAmount || !editAddress) return;
    setIsUpdating(true);
    setTimeout(() => {
      setContracts(contracts.map(c => c.id === selectedEditId ? { 
        ...c, 
        customer: editCustomer, 
        address: editAddress,
        amount: `${editAmount} ₫`, 
        duration: editDuration, 
        rate: `${editRate}%`,
        expireDate: c.status !== "Chờ duyệt" ? calculateExpireDate(c.date, editDuration) : "Chưa giải ngân"
      } : c));
      setIsUpdating(false); setIsEditDrawerOpen(false);
    }, 1000);
  };

  const triggerDelete = (id: string) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (selectedDeleteId) {
      const updatedContracts = contracts.filter(c => c.id !== selectedDeleteId);
      setContracts(updatedContracts);
      setIsDeleteModalOpen(false); setSelectedDeleteId(null);
      const newTotalPages = Math.ceil(updatedContracts.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Đang vay": return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2563FF]/10 text-[#2563FF] text-[11px] font-bold border border-[#2563FF]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#2563FF]"></span>Đang vay</span>;
      case "Chờ duyệt": return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Chờ duyệt</span>;
      case "Quá hạn": return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 text-[11px] font-bold border border-rose-500/20"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Quá hạn</span>;
      case "Đã tất toán": return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 text-slate-600 text-[11px] font-bold border border-slate-500/20"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Đã tất toán</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#0B1F4D] relative overflow-hidden selection:bg-[#2563FF]/20 p-2">
      <div className="max-w-[1400px] mx-auto space-y-10 relative z-10 animate-[fadeIn_0.4s_ease-out]">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0B1F4D] tracking-tight">Hợp đồng vay vốn</h1>
            <p className="text-slate-500 font-medium mt-2">Quản lý, xét duyệt và theo dõi các khoản tín dụng hiện hành.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Cập nhật nút khởi tạo để xóa trắng mọi ô nhập khi mở form */}
            <button onClick={() => { setIsDrawerOpen(true); setIsNewCustomerType(true); setNewCustomer(""); setNewAddress(""); setNewAmount(""); setNewCCCD(""); setNewPhone(""); setNewEmail(""); }} className="h-11 px-6 bg-[#2563FF] hover:bg-[#1D4ED8] text-white rounded-xl font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
              Tạo hợp đồng
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_15px_40px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2563FF]/30 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng Dư Nợ</h3><div className="text-3xl font-black text-[#0B1F4D] mt-1 tracking-tight">{formattedTotalDebt}</div></div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#2563FF] to-[#1D4ED8] text-white rounded-[16px] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60"><span className="flex items-center px-2 py-1 bg-[#2563FF]/10 text-[#2563FF] rounded-md text-xs font-bold"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> Tự động</span><span className="text-xs font-medium text-slate-400">cập nhật theo bảng</span></div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_15px_40px_rgba(34,199,255,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22C7FF]/30 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang Vay</h3><div className="text-3xl font-black text-[#0B1F4D] mt-1 tracking-tight">{activeCount} <span className="text-lg text-slate-400 font-medium">HĐ</span></div></div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#22C7FF] to-[#0ea5e9] text-white rounded-[16px] flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60"><div className="flex-1 bg-slate-200/50 rounded-full h-1.5"><div className="bg-[#22C7FF] h-1.5 rounded-full w-[85%]"></div></div><span className="text-xs font-bold text-[#0B1F4D]">85% đúng hạn</span></div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_15px_40px_rgba(244,63,94,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nợ Quá Hạn</h3><div className="text-3xl font-black text-[#0B1F4D] mt-1 tracking-tight">{overdueCount} <span className="text-lg text-slate-400 font-medium">HĐ</span></div></div>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-[16px] flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60">
                 <span className="flex items-center px-2 py-1 bg-rose-500/10 text-rose-600 rounded-md text-xs font-bold"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg> Tăng nhẹ</span>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_15px_40px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chờ Duyệt</h3><div className="text-3xl font-black text-[#0B1F4D] mt-1 tracking-tight">{pendingCount} <span className="text-lg text-slate-400 font-medium">Hồ sơ</span></div></div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-[16px] flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/60">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white"></div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white"></div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-600">+3</div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Đang xử lý</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white/60 overflow-hidden flex flex-col relative z-10">
          <div className="p-6 md:p-8 border-b border-slate-200/50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-gradient-to-b from-white/50 to-transparent">
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-80">
                <input type="text" placeholder="Nhập mã HĐ, tên Khách hàng..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563FF]/10 focus:border-[#2563FF] focus:bg-white text-sm font-semibold transition-all shadow-sm" />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {searchInput && (
                  <button onClick={() => { setSearchInput(""); setActiveSearch(""); setCurrentPage(1); }} className="absolute right-3 top-3.5 text-slate-400 hover:text-rose-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              <div className="relative w-full sm:w-48">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full pl-4 pr-10 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2563FF]/10 focus:border-[#2563FF] focus:bg-white text-sm font-semibold transition-all shadow-sm appearance-none cursor-pointer">
                  <option value="Tất cả">Trạng thái: Tất cả</option>
                  <option value="Đang vay">Đang vay</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Quá hạn">Quá hạn</option>
                  <option value="Đã tất toán">Đã tất toán</option>
                </select>
                <svg className="w-4 h-4 absolute right-4 top-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[420px]">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-extrabold border-b border-slate-200/50">
                  <th className="py-5 px-8">Mã Hợp Đồng</th>
                  <th className="py-5 px-6">Thông Tin Khách Hàng</th>
                  <th className="py-5 px-6">Quy Mô Khoản Vay</th>
                  <th className="py-5 px-6">Điều Kiện</th>
                  <th className="py-5 px-6">Đáo Hạn</th>
                  <th className="py-5 px-6">Trạng Thái</th>
                  <th className="py-5 px-8 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {currentContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-[#2563FF]/[0.02] transition-colors duration-200 group">
                    <td className="py-5 px-8 font-extrabold text-[#0B1F4D] whitespace-nowrap">{contract.id}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200/60 shrink-0">
                          {contract.customer.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-[150px]">
                          <div className="text-sm font-bold text-[#0B1F4D] whitespace-nowrap">{contract.customer}</div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-[200px]" title={contract.address}>📍 {contract.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-black text-slate-700 whitespace-nowrap">{contract.amount}</td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#0B1F4D]">{contract.duration}</div>
                      <div className="text-[11px] font-semibold text-[#2563FF] bg-[#2563FF]/10 px-2 py-0.5 rounded inline-block mt-1">Lãi: {contract.rate}</div>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      {contract.status === 'Chờ duyệt' ? (
                        <span className="text-xs font-semibold text-slate-400 italic bg-slate-100 px-2 py-1 rounded">Chưa giải ngân</span>
                      ) : (
                        <span className="text-sm font-bold text-slate-700">{contract.expireDate}</span>
                      )}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">{renderStatusBadge(contract.status)}</td>
                    <td className="py-5 px-8">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {contract.status === "Chờ duyệt" && (
                          <button onClick={() => handleApproveContract(contract.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Phê duyệt giải ngân">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                          </button>
                        )}
                        <button onClick={() => triggerEdit(contract)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Chỉnh sửa">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => triggerDelete(contract.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Xóa">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentContracts.length === 0 && (
                  <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-medium bg-slate-50/20">Không tìm thấy dữ liệu phù hợp với bộ lọc.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 md:px-8 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-white/30">
            <span className="text-slate-500 font-semibold">Đang hiển thị <span className="text-[#0B1F4D] font-bold">{currentContracts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredContracts.length)}</span> trên tổng <span className="text-[#0B1F4D] font-bold">{filteredContracts.length}</span> hợp đồng</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${currentPage === page ? 'bg-[#2563FF] text-white border border-[#2563FF] shadow-[#2563FF]/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm">Tiếp</button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER TẠO MỚI (CHỨA ĐỦ CCCD, ĐIỆN THOẠI, EMAIL) */}
      {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsDrawerOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div><h2 className="text-xl font-bold text-slate-800">Khởi tạo Hợp đồng</h2><p className="text-xs text-slate-500 font-medium mt-1">Điền thông tin hồ sơ vay.</p></div>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => { setIsNewCustomerType(true); setNewCustomer(""); setNewAddress(""); setNewCCCD(""); setNewPhone(""); setNewEmail(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isNewCustomerType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Khách hàng mới</button>
            <button onClick={() => { setIsNewCustomerType(false); setNewCustomer(""); setNewAddress(""); setNewCCCD(""); setNewPhone(""); setNewEmail(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isNewCustomerType ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Khách cũ (Hệ thống)</button>
          </div>

          <div className="space-y-4">
            {isNewCustomerType ? (
              // FORM CHO KHÁCH HÀNG MỚI ĐẦY ĐỦ THÔNG TIN
              <>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700 ml-1">Tên Khách hàng <span className="text-rose-500">*</span></label><input type="text" placeholder="Nhập họ và tên..." value={newCustomer} onChange={(e) => setNewCustomer(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium shadow-sm" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Số CCCD <span className="text-rose-500">*</span></label>
                    <input type="text" placeholder="12 số..." value={newCCCD} onChange={(e) => setNewCCCD(e.target.value.replace(/\D/g, ''))} maxLength={12} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium font-mono shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Điện thoại <span className="text-rose-500">*</span></label>
                    <input type="text" placeholder="09xx..." value={newPhone} onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))} maxLength={11} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium shadow-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email <span className="text-xs text-slate-400 font-normal">(Tùy chọn)</span></label>
                  <input type="email" placeholder="example@gmail.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium shadow-sm" />
                </div>
                
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700 ml-1">Địa chỉ thường trú <span className="text-rose-500">*</span></label><input type="text" placeholder="Ví dụ: Hoàn Kiếm, Hà Nội" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium shadow-sm" /></div>
              </>
            ) : (
              // DROPDOWN CHO KHÁCH HÀNG CŨ
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Chọn Khách hàng có sẵn <span className="text-rose-500">*</span></label>
                  <select value={newCustomer} onChange={handleSelectExistingCustomer} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium shadow-sm cursor-pointer">
                    <option value="" disabled>-- Vui lòng chọn khách hàng --</option>
                    {uniqueCustomers.map((c, i) => (
                       <option key={i} value={c?.customer}>{c?.customer}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700 ml-1">Địa chỉ (Tự động điền)</label><input type="text" disabled value={newAddress} placeholder="Địa chỉ sẽ tự hiển thị" className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed" /></div>
              </>
            )}
          </div>

          <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 space-y-4">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Số tiền vay (VNĐ) <span className="text-rose-500">*</span></label><input type="text" value={newAmount} onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); setNewAmount(raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".")); }} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-blue-600 shadow-sm"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Kỳ hạn</label><select value={newDuration} onChange={(e) => setNewDuration(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold shadow-sm cursor-pointer"><option value="6 tháng">6 tháng</option><option value="12 tháng">12 tháng</option><option value="24 tháng">24 tháng</option><option value="36 tháng">36 tháng</option></select></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Lãi suất</label><input type="text" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold shadow-sm"/></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3"><button onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 shadow-sm">Hủy</button><button onClick={handleSaveContract} className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all">{isSaving ? 'Đang lưu...' : 'Lưu hợp đồng'}</button></div>
      </div>

      {/* DRAWER CHỈNH SỬA */}
      {isEditDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsEditDrawerOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isEditDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div><h2 className="text-xl font-bold text-slate-800">Sửa Hợp đồng</h2><p className="text-xs text-slate-500 font-medium mt-1">Mã: {selectedEditId}</p></div>
          <button onClick={() => setIsEditDrawerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-bold text-slate-700 ml-1">Tên Khách hàng <span className="text-rose-500">*</span></label><input type="text" disabled value={editCustomer} onChange={(e) => setEditCustomer(e.target.value)} className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium cursor-not-allowed text-slate-500" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-slate-700 ml-1">Địa chỉ thường trú <span className="text-rose-500">*</span></label><input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium shadow-sm" /></div>
          </div>
          <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50 space-y-4">
            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Số tiền vay (VNĐ) <span className="text-rose-500">*</span></label><input type="text" value={editAmount} onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); setEditAmount(raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".")); }} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-emerald-600 shadow-sm"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Kỳ hạn</label><select value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold shadow-sm cursor-pointer"><option value="6 tháng">6 tháng</option><option value="12 tháng">12 tháng</option><option value="24 tháng">24 tháng</option><option value="36 tháng">36 tháng</option></select></div>
              <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Lãi suất</label><input type="text" value={editRate} onChange={(e) => setEditRate(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold shadow-sm"/></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3"><button onClick={() => setIsEditDrawerOpen(false)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 shadow-sm">Hủy</button><button onClick={executeUpdate} className="flex-1 py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all">{isUpdating ? 'Đang lưu...' : 'Cập nhật'}</button></div>
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl text-center space-y-4 animate-[fadeIn_0.2s_auto]">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></div>
            <div><h3 className="text-lg font-bold text-slate-800">Xác nhận xóa?</h3><p className="text-xs text-slate-500 mt-1">Xóa hồ sơ <span className="font-bold">{selectedDeleteId}</span> không thể hoàn tác.</p></div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">Hủy</button>
              <button onClick={executeDelete} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all">Có, Xóa luôn</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}