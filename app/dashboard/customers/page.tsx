"use client";

import { useState, useEffect } from "react";

const initialCustomers = [
  { id: "KH-012", name: "Trần Văn Phúc", phone: "0904.123.456", cccd: "001099123456", email: "phuc.tran@gmail.com", address: "Hoàn Kiếm, Hà Nội", status: "Đang vay", date: "26/05/2026", cicScore: 720 },
  { id: "KH-011", name: "Nguyễn Thị Hoa", phone: "0988.765.432", cccd: "034188654321", email: "hoanguyen88@yahoo.com", address: "Cầu Giấy, Hà Nội", status: "Chờ duyệt", date: "25/05/2026", cicScore: 680 },
  { id: "KH-010", name: "Lê Hoàng Minh", phone: "0912.345.678", cccd: "001085789123", email: "minhle.tech@company.vn", address: "Quận 1, TP.HCM", status: "Nợ xấu", date: "20/05/2026", cicScore: 450 },
  { id: "KH-009", name: "Phạm Đại Nghĩa", phone: "0933.999.888", cccd: "022177333444", email: "nghiapham@gmail.com", address: "Hải Châu, Đà Nẵng", status: "Đủ điều kiện", date: "15/05/2026", cicScore: 750 },
  { id: "KH-008", name: "Đặng Thu Thảo", phone: "0977.111.222", cccd: "030195222333", email: "thaodang@gmail.com", address: "Đống Đa, Hà Nội", status: "Đang vay", date: "10/05/2026", cicScore: 690 },
  { id: "KH-007", name: "Vũ Trọng Phụng", phone: "0888.444.555", cccd: "001090555666", email: "phungvt@outlook.com", address: "Thanh Xuân, Hà Nội", status: "Đang vay", date: "05/05/2026", cicScore: 610 },
  { id: "KH-006", name: "Bùi Bích Phương", phone: "0909.112.233", cccd: "034189666777", email: "bichphuong.bui@gmail.com", address: "Ba Đình, Hà Nội", status: "Đủ điều kiện", date: "01/05/2026", cicScore: 780 },
  { id: "KH-005", name: "Hoàng Thanh Tùng", phone: "0934.567.890", cccd: "001080999000", email: "tunght@gmail.com", address: "Quận 3, TP.HCM", status: "Chờ duyệt", date: "28/04/2026", cicScore: 710 },
  { id: "KH-004", name: "Lý Hải", phone: "0911.222.333", cccd: "012345678901", email: "lyhai.prod@gmail.com", address: "Ninh Kiều, Cần Thơ", status: "Nợ xấu", date: "20/04/2026", cicScore: 320 },
  { id: "KH-003", name: "Ngô Kiến Huy", phone: "0944.555.666", cccd: "098765432109", email: "huyngo@yahoo.com", address: "Bình Thạnh, TP.HCM", status: "Đang vay", date: "15/04/2026", cicScore: 650 },
  { id: "KH-002", name: "Hồ Ngọc Hà", phone: "0977.888.999", cccd: "011223344556", email: "hongocha@company.vn", address: "Quận 7, TP.HCM", status: "Đủ điều kiện", date: "10/04/2026", cicScore: 810 },
  { id: "KH-001", name: "Trấn Thành", phone: "0999.000.111", cccd: "055443322110", email: "thanh.tran@gmail.com", address: "Gò Vấp, TP.HCM", status: "Đang vay", date: "01/04/2026", cicScore: 740 },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);

  // --- HỨNG DỮ LIỆU TỪ TRANG HỢP ĐỒNG SANG ---
  useEffect(() => {
    const savedNewCustomers = localStorage.getItem('mock_new_customers');
    if (savedNewCustomers) {
      const parsedNewCustomers = JSON.parse(savedNewCustomers);
      setCustomers([...parsedNewCustomers, ...initialCustomers]);
    }
  }, []);
  
  // --- TÍNH TOÁN KPI ---
  const countTotal = customers.length;
  const countActive = customers.filter(c => c.status === "Đang vay").length;
  const countBadDebt = customers.filter(c => c.status === "Nợ xấu").length;
  const countPending = customers.filter(c => c.status === "Chờ duyệt").length;

  // --- STATE TÌM KIẾM BẰNG ENTER ---
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearch(searchInput);
      setCurrentPage(1);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!activeSearch) return true;
    const lowerSearch = activeSearch.toLowerCase();
    return (
      c.id.toLowerCase().includes(lowerSearch) ||
      c.name.toLowerCase().includes(lowerSearch) ||
      c.phone.includes(lowerSearch) ||
      (c.cccd && c.cccd.includes(lowerSearch))
    );
  });

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // --- STATE 1: XÓA ĐỒNG BỘ LOCALSTORAGE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const triggerDelete = (id: string) => {
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (selectedDeleteId) {
      const updatedCustomers = customers.filter(c => c.id !== selectedDeleteId);
      setCustomers(updatedCustomers);
      
      const savedNewCustomers = localStorage.getItem('mock_new_customers');
      if (savedNewCustomers) {
        const parsedNewCustomers = JSON.parse(savedNewCustomers);
        const remainingNewCustomers = parsedNewCustomers.filter((c: any) => c.id !== selectedDeleteId);
        localStorage.setItem('mock_new_customers', JSON.stringify(remainingNewCustomers));
      }

      setIsDeleteModalOpen(false);
      setSelectedDeleteId(null);
      
      const newTotalPages = Math.ceil(updatedCustomers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
    }
  };

  // --- STATE 2: SỬA THÔNG TIN ĐỒNG BỘ LOCALSTORAGE ---
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCCCD, setEditCCCD] = useState("");

  const triggerEdit = (customer: any) => {
    setSelectedEditId(customer.id);
    setEditName(customer.name);
    setEditPhone(customer.phone);
    setEditEmail(customer.email);
    setEditCCCD(customer.cccd || "Chưa cập nhật");
    setIsEditDrawerOpen(true);
  };

  const executeUpdate = () => {
    if (!editName || !editPhone) return;
    setIsUpdating(true);
    setTimeout(() => {
      
      const updatedList = customers.map(c => c.id === selectedEditId ? {
        ...c, name: editName, phone: editPhone, email: editEmail
      } : c);
      setCustomers(updatedList);

      const savedNewCustomers = localStorage.getItem('mock_new_customers');
      if (savedNewCustomers) {
        let parsedNewCustomers = JSON.parse(savedNewCustomers);
        parsedNewCustomers = parsedNewCustomers.map((c: any) => c.id === selectedEditId ? {
          ...c, name: editName, phone: editPhone, email: editEmail
        } : c);
        localStorage.setItem('mock_new_customers', JSON.stringify(parsedNewCustomers));
      }

      setIsUpdating(false);
      setIsEditDrawerOpen(false);
    }, 1000);
  };

  // --- STATE 3: XEM CHI TIẾT ---
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const triggerView = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewDrawerOpen(true);
  };

  const getCicEvaluation = (score: number) => {
    if (score >= 700) return { label: "Tốt (Ít rủi ro)", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score >= 500) return { label: "Trung bình", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { label: "Cảnh báo (Nợ xấu)", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto relative p-2">
      
      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="bg-white/80 backdrop-blur p-6 rounded-[20px] shadow-sm border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Tổng Khách Hàng</h3><div className="text-3xl font-black text-slate-800 mt-1">{countTotal}</div></div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur p-6 rounded-[20px] shadow-sm border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Đang Có Khoản Vay</h3><div className="text-3xl font-black text-slate-800 mt-1">{countActive}</div></div>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur p-6 rounded-[20px] shadow-sm border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Khách Nợ Xấu</h3><div className="text-3xl font-black text-rose-600 mt-1">{countBadDebt}</div></div>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur p-6 rounded-[20px] shadow-sm border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Hồ Sơ Chờ Duyệt</h3><div className="text-3xl font-black text-amber-500 mt-1">{countPending}</div></div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          </div>
        </div>
      </div>

      {/* 2. BẢNG DỮ LIỆU */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Hồ sơ Khách hàng</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {activeSearch ? <span>Đang lọc theo: <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">"{activeSearch}"</span></span> : "Quản lý dữ liệu thông tin định danh khách hàng."}
            </p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <input type="text" placeholder="Nhập mã KH, Tên, CCCD, SĐT..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm font-medium transition-all focus:bg-white" />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setActiveSearch(""); setCurrentPage(1); }} className="absolute right-3 top-3 text-slate-400 hover:text-rose-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-slate-50/80 sticky top-0 backdrop-blur text-slate-500 text-xs uppercase tracking-[0.1em] font-bold border-y border-slate-100">
                <th className="py-5 px-6 whitespace-nowrap">Mã KH</th>
                <th className="py-5 px-6 whitespace-nowrap">Họ và Tên</th>
                <th className="py-5 px-6 whitespace-nowrap">Liên hệ (SĐT / Email)</th>
                {/* ĐÃ THÊM CỘT CCCD VÀO ĐÂY */}
                <th className="py-5 px-6 whitespace-nowrap">Số CCCD</th>
                <th className="py-5 px-6 whitespace-nowrap">Trạng thái</th>
                <th className="py-5 px-6 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              
              {currentCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                      <p className="font-bold text-slate-600">Không tìm thấy khách hàng nào</p>
                    </div>
                  </td>
                </tr>
              )}

              {currentCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors duration-200 group animate-[fadeIn_0.3s_ease-out]">
                  <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{customer.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-200/50">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-slate-800 font-bold whitespace-nowrap">{customer.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 max-w-[200px] truncate" title={customer.address}>📍 {customer.address || "Chưa cập nhật"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-slate-700 font-bold">{customer.phone}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{customer.email || "Không có Email"}</div>
                  </td>
                  
                  {/* HIỂN THỊ DỮ LIỆU CCCD VÀO CỘT */}
                  <td className="py-4 px-6 text-slate-600 font-semibold whitespace-nowrap font-mono">{customer.cccd || "Chưa cập nhật"}</td>
                  
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${
                      customer.status === 'Đang vay' ? 'bg-blue-50 text-blue-600 border border-blue-200/50' : 
                      customer.status === 'Nợ xấu' ? 'bg-rose-50 text-rose-600 border border-rose-200/50' : 
                      customer.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                    }`}>
                      {customer.status === 'Nợ xấu' && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2 animate-pulse"></span>}
                      {customer.status === 'Chờ duyệt' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse"></span>}
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* NÚT XEM CHI TIẾT */}
                      <button onClick={() => triggerView(customer)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết & CIC">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      {/* NÚT SỬA */}
                      <button onClick={() => triggerEdit(customer)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Sửa thông tin liên hệ">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      {/* NÚT XÓA */}
                      <button onClick={() => triggerDelete(customer.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa hồ sơ">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">
            {filteredCustomers.length > 0 ? `Hiển thị ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredCustomers.length)} trên ${filteredCustomers.length} KH` : ''}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || filteredCustomers.length === 0} className={`px-3 py-1.5 border border-slate-200 rounded-lg font-medium transition-colors ${currentPage === 1 || filteredCustomers.length === 0 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}>Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || filteredCustomers.length === 0} className={`px-3 py-1.5 border border-slate-200 rounded-lg font-medium transition-colors ${currentPage === totalPages || filteredCustomers.length === 0 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}>Tiếp</button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DRAWER: SỬA THÔNG TIN KHÁCH HÀNG */}
      {/* ========================================== */}
      {isEditDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsEditDrawerOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isEditDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div><h2 className="text-xl font-bold text-slate-800">Cập nhật Liên hệ</h2><p className="text-xs text-slate-500 font-medium mt-1">Mã KH: {selectedEditId}</p></div>
          <button onClick={() => setIsEditDrawerOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Họ và Tên</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-800" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Số CCCD <span className="text-xs text-slate-400 font-normal ml-2">(Định danh gốc)</span></label>
            <input type="text" value={editCCCD} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-medium font-mono text-slate-400 cursor-not-allowed select-none" />
          </div>
          <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50 space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Thông hiện liên lạc</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Số điện thoại</label>
              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold text-slate-800"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold text-slate-800"/>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={() => setIsEditDrawerOpen(false)} className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Hủy</button>
          <button onClick={executeUpdate} disabled={isUpdating} className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all">{isUpdating ? 'Đang lưu...' : 'Lưu thông tin'}</button>
        </div>
      </div>

      {/* ========================================== */}
      {/* DRAWER: XEM CHI TIẾT & ĐIỂM CIC */}
      {/* ========================================== */}
      {isViewDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" onClick={() => setIsViewDrawerOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[500px] bg-slate-50 shadow-2xl z-[70] transform transition-transform duration-500 flex flex-col ${isViewDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Hồ sơ định danh KH</h2>
          <button onClick={() => setIsViewDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        {selectedCustomer && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/30">{selectedCustomer.name.charAt(0).toUpperCase()}</div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{selectedCustomer.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Mã KH: {selectedCustomer.id}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600"><svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>Gia nhập: {selectedCustomer.date || new Date().toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
            {(() => {
              const evalCic = getCicEvaluation(selectedCustomer.cicScore);
              return (
                <div className={`p-6 rounded-3xl border shadow-sm ${evalCic.bg} ${evalCic.border} relative overflow-hidden`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Điểm Tín Dụng CIC</h4>
                      <div className={`text-4xl font-black tracking-tight ${evalCic.color}`}>{selectedCustomer.cicScore} <span className="text-sm font-semibold text-slate-400">/ 850</span></div>
                      <div className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white/60 ${evalCic.color}`}>{evalCic.label}</div>
                    </div>
                    <div className="w-20 h-20 relative flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/50" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={evalCic.color} strokeDasharray={`${(selectedCustomer.cicScore / 850) * 100}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
              <h4 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Thông tin liên lạc & Định danh</h4>
              <div className="grid grid-cols-1 gap-5">
                <div><p className="text-xs font-bold text-slate-400 uppercase">Căn cước công dân</p><p className="text-base font-semibold text-slate-800 mt-1 font-mono tracking-wider">{selectedCustomer.cccd || "Chưa cập nhật"}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</p><p className="text-sm font-semibold text-slate-800 mt-1">{selectedCustomer.phone}</p></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Tình trạng HĐ</p><p className="text-sm font-bold text-slate-800 mt-1">{selectedCustomer.status}</p></div>
                </div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Địa chỉ Email</p><p className="text-sm font-semibold text-blue-600 mt-1">{selectedCustomer.email || "Không có Email"}</p></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Địa chỉ thường trú</p><p className="text-sm font-semibold text-slate-800 mt-1">{selectedCustomer.address || "Chưa cập nhật"}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL XÓA */}
      {/* ========================================== */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl text-center space-y-4 animate-[fadeIn_0.2s_auto]">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></div>
            <div><h3 className="text-lg font-bold text-slate-800">Cảnh báo hệ thống</h3>
            <p className="text-xs text-slate-500 mt-1">Xóa hồ sơ <span className="font-bold">{selectedDeleteId}</span> sẽ xóa luôn toàn bộ lịch sử hợp đồng liên quan. Vẫn tiếp tục?</p></div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Hủy bỏ</button>
              <button onClick={executeDelete} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-sm">Chấp nhận Xóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}