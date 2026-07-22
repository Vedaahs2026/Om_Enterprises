"use client";

import React, { useEffect, useState, useRef } from "react";
import PaymentDetailsCard from "@/components/admin/PaymentDetailsCard";
import CancelOrderModal from "@/components/admin/CancelOrderModal";
import ShippingDimensionsModal from "@/components/admin/ShippingDimensionsModal";
import CancelShipmentModal from "@/components/admin/CancelShipmentModal";
import DowngradeConfirmationModal from "@/components/admin/DowngradeConfirmationModal";
import NdrActionModal from "@/components/admin/NdrActionModal";
import EditAddressModal from "@/components/admin/EditAddressModal";
import { 
  ShoppingBag, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  Package,
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2,
  Box,
  CheckSquare,
  XCircle,
  FileText,
  ChevronDown,
  Truck,
  Info,
  Download,
  AlertTriangle,
  Pencil,
  PhoneCall,
  Scissors
} from "lucide-react";

function getColorStyles(colorName: string) {
  const name = (colorName || "").toLowerCase().trim();
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: "#EF4444", text: "#FFFFFF", border: "#DC2626" },
    yellow: { bg: "#FBBF24", text: "#000000", border: "#D97706" },
    blue: { bg: "#2563EB", text: "#FFFFFF", border: "#1D4ED8" },
    green: { bg: "#10B981", text: "#FFFFFF", border: "#059669" },
    black: { bg: "#1F2937", text: "#FFFFFF", border: "#111827" },
    white: { bg: "#FFFFFF", text: "#1F2937", border: "#E5E7EB" },
    grey: { bg: "#9CA3AF", text: "#FFFFFF", border: "#7B808A" },
    gray: { bg: "#9CA3AF", text: "#FFFFFF", border: "#7B808A" },
    orange: { bg: "#F97316", text: "#FFFFFF", border: "#EA580C" },
    pink: { bg: "#EC4899", text: "#FFFFFF", border: "#DB2777" },
    purple: { bg: "#8B5CF6", text: "#FFFFFF", border: "#7C3AED" },
    brown: { bg: "#78350F", text: "#FFFFFF", border: "#451A03" },
  };
  return colorMap[name] || { bg: "#E5E7EB", text: "#374151", border: "#D1D5DB" };
}

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  customizations: any;
};

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  paymentMode?: string | null;
  paymentStatus?: string | null;
  amountPaid?: number | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paymentId?: string | null;
  orderStatus?: string | null;
  shippingStatus?: string | null;
  awbNumber?: string | null;
  shippingDetails?: string | null;
  cancelReason?: string | null;
};

interface ActionOption {
  id: string;
  label: string;
  tooltipText: string;
}

interface FulfillmentActionsPanelProps {
  order: Order;
  onStatusTransition: (
    orderId: number,
    payload: {
      orderStatus?: string;
      shippingStatus?: string;
      packageDetails?: any;
      cancelReason?: string;
    }
  ) => Promise<void>;
  setActiveCancelOrderId: (id: number | null) => void;
  setActiveAwbOrderId: (id: number | null) => void;
  setActiveCancelShipmentId: (id: number | null) => void;
  setActiveCancelShipmentAwb: (awb: string | null) => void;
}

const statusHierarchy = ['0_PLACED', '1_CONFIRMED', '3_AWB_GENERATED', 'CANCELLED'];

const getCurrentStatusKey = (o: Order): string => {
  if (o.orderStatus === "CANCELLED" || (o.status || "").toLowerCase() === "cancelled") {
    return "CANCELLED";
  }
  if (
    o.shippingStatus === "DELIVERED" || (o.status || "").toLowerCase() === "delivered" ||
    o.shippingStatus === "4_PICKUP_REQUESTED" || (o.shippingStatus || "").startsWith("4_") ||
    o.shippingStatus === "3_AWB_GENERATED" || (o.shippingStatus || "").startsWith("3_") || o.awbNumber
  ) {
    return "3_AWB_GENERATED";
  }
  if (o.orderStatus === "1_CONFIRMED" || o.orderStatus === "2_PROCESSING") {
    return "1_CONFIRMED";
  }
  return "0_PLACED";
};

function FulfillmentActionsPanel({
  order,
  onStatusTransition,
  setActiveCancelOrderId,
  setActiveAwbOrderId,
  setActiveCancelShipmentId,
  setActiveCancelShipmentAwb,
}: FulfillmentActionsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableActions: ActionOption[] = [
    {
      id: "0_PLACED",
      label: "Pending",
      tooltipText: "Set order status to Pending."
    },
    {
      id: "1_CONFIRMED",
      label: "Confirmed",
      tooltipText: "Confirm order and allocate stock."
    },
    {
      id: "3_AWB_GENERATED",
      label: "Shipped",
      tooltipText: "Generate airway bill (AWB) and dispatch package."
    },
    {
      id: "CANCELLED",
      label: "Cancelled",
      tooltipText: "Cancel order and release reserved stock."
    }
  ];

  const currentStatus = getCurrentStatusKey(order);

  useEffect(() => {
    setSelectedAction(currentStatus);
  }, [order.orderStatus, order.shippingStatus, order.status]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const executeTransition = async (target: string) => {
    switch (target) {
      case "0_PLACED":
        await onStatusTransition(order.id, { orderStatus: "0_PLACED", shippingStatus: "PENDING" });
        break;
      case "1_CONFIRMED":
        await onStatusTransition(order.id, { orderStatus: "1_CONFIRMED", shippingStatus: "PENDING" });
        break;
      case "2_PROCESSING":
        await onStatusTransition(order.id, { orderStatus: "2_PROCESSING", shippingStatus: "PENDING" });
        break;
      case "3_AWB_GENERATED":
        setActiveAwbOrderId(order.id);
        break;
      case "4_PICKUP_REQUESTED":
        await onStatusTransition(order.id, { shippingStatus: "4_PICKUP_REQUESTED" });
        break;
      case "DELIVERED":
        await onStatusTransition(order.id, { shippingStatus: "DELIVERED" });
        break;
      case "CANCELLED":
        setActiveCancelOrderId(order.id);
        break;
      default:
        break;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedAction || selectedAction === currentStatus) return;

    const currentIdx = statusHierarchy.indexOf(currentStatus);
    const targetIdx = statusHierarchy.indexOf(selectedAction);

    if (targetIdx !== -1 && currentIdx !== -1 && targetIdx < currentIdx) {
      setIsDowngradeModalOpen(true);
    } else {
      await executeTransition(selectedAction);
    }
  };

  const handleConfirmDowngrade = async () => {
    setIsDowngradeModalOpen(false);
    await executeTransition(selectedAction);
  };

  const selectedActionObj = availableActions.find((a) => a.id === selectedAction);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
      <div className="relative flex-1 min-w-[220px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between pl-4 pr-10 py-3 bg-white border border-brand/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800]/10 focus:border-[#FF9800] transition-all text-brand text-xs font-bold uppercase tracking-widest cursor-pointer text-left"
        >
          <span className="truncate">{selectedActionObj ? selectedActionObj.label : "Select Action"}</span>
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-brand/35 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            size={16}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-brand/10 rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-100 overflow-visible">
            {availableActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  setSelectedAction(action.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer hover:bg-brand/[0.03] ${
                  selectedAction === action.id ? "text-[#FF9800] bg-[#FF9800]/5" : "text-brand"
                }`}
              >
                <div className="relative group shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Info size={14} className="text-brand/40 hover:text-[#FF9800] transition-colors cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-[#0D47A1] text-white text-[10px] normal-case tracking-normal font-medium rounded-lg shadow-lg z-30 pointer-events-none text-center">
                    {action.tooltipText}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0D47A1] rotate-45 -translate-y-0.5"></div>
                  </div>
                </div>
                <span className="truncate">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!selectedAction || selectedAction === currentStatus}
        onClick={handleUpdateStatus}
        className="px-6 py-3 bg-[#0D47A1] hover:bg-brand disabled:bg-brand/10 disabled:text-brand/30 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center min-w-[140px]"
      >
        UPDATE STATUS
      </button>

      {isDowngradeModalOpen && (
        <DowngradeConfirmationModal
          isOpen={true}
          orderId={order.id}
          currentStatus={currentStatus}
          targetStatus={selectedAction}
          onClose={() => setIsDowngradeModalOpen(false)}
          onConfirm={handleConfirmDowngrade}
        />
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 20;

  // Modal tracking states
  const [activeCancelOrderId, setActiveCancelOrderId] = useState<number | null>(null);
  const [activeAwbOrderId, setActiveAwbOrderId] = useState<number | null>(null);
  const [activeCancelShipmentId, setActiveCancelShipmentId] = useState<number | null>(null);
  const [activeCancelShipmentAwb, setActiveCancelShipmentAwb] = useState<string | null>(null);
  const [ndrModalOpen, setNdrModalOpen] = useState(false);
  const [ndrAwb, setNdrAwb] = useState("");
  const [ndrRemarks, setNdrRemarks] = useState("");
  const [activeEditAddressOrderId, setActiveEditAddressOrderId] = useState<number | null>(null);
  const [activeEditAddressStr, setActiveEditAddressStr] = useState<string | null>(null);
  const [activeEditAddressPhone, setActiveEditAddressPhone] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, statusFilter]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusTransition = async (
    orderId: number,
    payload: {
      orderStatus?: string;
      shippingStatus?: string;
      packageDetails?: any;
      cancelReason?: string;
    },
    throwOnError = false
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prevOrders =>
          prevOrders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status: data.data.status !== undefined ? data.data.status : o.status,
                  orderStatus: data.data.orderStatus !== undefined ? data.data.orderStatus : o.orderStatus,
                  shippingStatus: data.data.shippingStatus !== undefined ? data.data.shippingStatus : o.shippingStatus,
                  awbNumber: data.data.awbNumber !== undefined ? data.data.awbNumber : o.awbNumber,
                  shippingDetails: data.data.shippingDetails !== undefined ? data.data.shippingDetails : o.shippingDetails
                }
              : o
          )
        );
      } else {
        if (throwOnError) {
          throw new Error(data.error || "Failed to update order status.");
        } else {
          alert(data.error || "Failed to update order status.");
        }
      }
    } catch (e: any) {
      console.error(e);
      if (throwOnError) {
        throw e;
      } else {
        alert("Failed to submit status transition.");
      }
    }
  };

  const getStatusCount = (status: string) => {
    return orders.filter(o => o.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "order placed" || s === "pending") return "bg-amber-50 border-amber-200 text-amber-600";
    if (s === "processing" || s === "confirmed") return "bg-indigo-50 border-indigo-200 text-indigo-600";
    if (s === "shipped") return "bg-blue-50 border-blue-200 text-blue-600";
    if (s === "in transit" || s === "on the way") return "bg-purple-50 border-purple-200 text-purple-600";
    if (s === "out for delivery") return "bg-pink-50 border-pink-200 text-pink-600";
    if (s === "delivered" || s === "completed") return "bg-emerald-50 border-emerald-200 text-emerald-600";
    if (s === "cancelled") return "bg-rose-50 border-rose-200 text-rose-600";
    return "bg-brand/5 border-brand/10 text-brand/60";
  };

  const getNormalizedStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "order placed" || s === "pending") return "Order Placed";
    if (s === "processing" || s === "confirmed") return "Processing";
    if (s === "shipped") return "Shipped";
    if (s === "in transit" || s === "on the way") return "In Transit";
    if (s === "out for delivery") return "Out for Delivery";
    if (s === "delivered" || s === "completed") return "Delivered";
    if (s === "cancelled") return "Cancelled";
    return status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = statusFilter === "all" || getNormalizedStatus(order.status).toLowerCase() === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (orderDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesDate && matchesStatusFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusCards = [
    { label: "PLACED", count: getStatusCount("Order Placed") + getStatusCount("pending"), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "PROCESSING", count: getStatusCount("Processing"), icon: Box, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "SHIPPED", count: getStatusCount("Shipped") + getStatusCount("In Transit") + getStatusCount("Out for Delivery"), icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "DELIVERED", count: getStatusCount("Delivered"), icon: CheckSquare, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "CANCELLED", count: getStatusCount("Cancelled"), icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#FF9800] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-playfair font-bold text-[#0D47A1] mb-1">Order Fulfillment</h1>
          <p className="text-[#FF9800] text-sm font-medium tracking-wide">
            Track and manage customer purchases and custom fits.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-3 py-3 bg-white border border-brand/10 rounded-xl shadow-sm focus:outline-none focus:border-[#FF9800] transition-all text-brand text-xs font-medium cursor-pointer"
              title="Start Date"
            />
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-3 py-3 bg-white border border-brand/10 rounded-xl shadow-sm focus:outline-none focus:border-[#FF9800] transition-all text-brand text-xs font-medium cursor-pointer"
              title="End Date"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-brand/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800]/10 focus:border-[#FF9800] transition-all text-brand text-xs font-bold uppercase tracking-widest cursor-pointer appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand/30 pointer-events-none" size={16} />
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30" size={18} />
            <input 
              type="text" 
              placeholder="Search order # or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-brand/10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800]/10 focus:border-[#FF9800] transition-all text-brand text-sm font-medium placeholder:text-brand/20"
            />
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statusCards.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.label} className="bg-white rounded-2xl p-4 border border-brand/5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[9px] font-black tracking-[0.15em] text-brand/30 group-hover:text-brand transition-colors uppercase">{status.label}</span>
                <div className={`p-2 rounded-lg ${status.bg} ${status.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-brand">{status.count}</span>
                <span className="text-[9px] font-bold text-brand/30 uppercase tracking-widest">Orders</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {paginatedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-brand/5 shadow-sm">
            <h2 className="text-xl font-playfair font-bold text-brand mb-2">No results found</h2>
            <p className="text-brand/40 text-sm font-medium">Try searching with a different term or date range.</p>
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-white rounded-2xl border border-brand/5 shadow-sm hover:shadow-md transition-all ${
                expandedOrder === order.id ? "relative z-10" : ""
              }`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer group"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#0D47A1]/5 p-3 rounded-xl group-hover:bg-[#FF9800] group-hover:text-white transition-colors">
                    <FileText size={20} className="text-[#FF9800] group-hover:text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-lg font-bold text-brand">Order <span className="text-brand/30 font-medium">#00{order.id}</span></h3>
                      <select
                        value={getCurrentStatusKey(order)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          const val = e.target.value;
                          if (val === "3_AWB_GENERATED") {
                            setActiveAwbOrderId(order.id);
                          } else if (val === "CANCELLED") {
                            setActiveCancelOrderId(order.id);
                          } else if (val === "0_PLACED") {
                            await handleStatusTransition(order.id, { orderStatus: "0_PLACED", shippingStatus: "PENDING" });
                          } else if (val === "1_CONFIRMED") {
                            await handleStatusTransition(order.id, { orderStatus: "1_CONFIRMED", shippingStatus: "PENDING" });
                          }
                        }}
                        className={`px-3 py-1 border text-[9px] font-black uppercase tracking-widest rounded-full cursor-pointer focus:outline-none appearance-none transition-colors pr-6 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:8px] bg-[right_6px_center] bg-no-repeat ${getStatusBadgeStyle(order.status)}`}
                      >
                        <option value="0_PLACED">Pending</option>
                        <option value="1_CONFIRMED">Confirmed</option>
                        <option value="3_AWB_GENERATED">Shipped</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {(() => {
                        const parsed = (() => {
                          if (!order.shippingDetails) return null;
                          try { return JSON.parse(order.shippingDetails); } catch { return null; }
                        })();
                        const isNdr = parsed?.isNdr || parsed?.ndrActive || order.shippingStatus === "NDR_ACTION_REQUIRED";
                        if (!isNdr) return null;
                        return (
                          <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 select-none">
                            <AlertTriangle size={10} className="shrink-0" />
                            NDR Alert
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs font-medium text-brand/40">
                      Placed on {new Date(order.createdAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-brand/20 uppercase tracking-widest mb-0.5">Amount</p>
                    <p className="text-xl font-bold text-brand font-sans">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className={`p-1.5 rounded-lg bg-brand/5 text-brand/30 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="px-6 pb-6 pt-1 border-t border-brand/5 bg-brand/[0.005] rounded-b-2xl">
                  {/* NDR Alert Banner */}
                  {(() => {
                    const parsed = (() => {
                      if (!order.shippingDetails) return null;
                      try { return JSON.parse(order.shippingDetails); } catch { return null; }
                    })();
                    const isNdrActive = parsed?.isNdr || parsed?.ndrActive || order.shippingStatus === "NDR_ACTION_REQUIRED";
                    const ndrReason = parsed?.ndrReason || parsed?.ndrRemarks || "Delivery failed. Action required.";

                    if (!isNdrActive) return null;

                    return (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                            <AlertTriangle size={18} className="animate-pulse" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">Non-Delivery Exception Alert</h5>
                            <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                              Courier Remark: <span className="italic">"{ndrReason}"</span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNdrAwb(order.awbNumber || "");
                            setNdrRemarks(ndrReason);
                            setNdrModalOpen(true);
                          }}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm cursor-pointer shrink-0 text-center"
                        >
                          Resolve NDR Exception
                        </button>
                      </div>
                    );
                  })()}

                  {/* Cancelled Alert Banner */}
                  {order.status?.toLowerCase() === "cancelled" && (
                    <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
                          <XCircle size={18} />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-0.5">Order Cancelled</h5>
                          <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                            {order.cancelReason && order.cancelReason !== "Cancelled by customer"
                              ? `Order Cancelled by Admin: "${order.cancelReason}"`
                              : `Order Cancelled: "${order.cancelReason || "No reason provided."}"`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simplifed Order Details Layout (Matching Image 2) */}
                  {(() => {
                    const str = order.shippingAddress || "";
                    const nameMatch = str.match(/Name:\s*([^,]+)/);
                    const contactMatch = str.match(/(?:Contact|Phone):\s*([^,]+)/);
                    const parsedAddress = {
                      name: nameMatch ? nameMatch[1].trim() : "N/A",
                      phone: contactMatch ? contactMatch[1].trim() : order.customerPhone || "N/A"
                    };

                    return (
                      <div className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left Column: Customer Details & Delivery Address */}
                          <div className="space-y-6">
                            {/* Customer Details */}
                            <div>
                              <h4 className="text-[10px] font-black text-brand/35 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <User size={12} className="text-[#FF9800]" />
                                Customer Details
                              </h4>
                              <div className="bg-white rounded-2xl border border-brand/5 p-4 shadow-sm space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-brand/40 font-bold uppercase tracking-wider">Name</span>
                                  <span className="text-brand font-black">{parsedAddress.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-brand/40 font-bold uppercase tracking-wider">Phone</span>
                                  <a href={`tel:${parsedAddress.phone}`} className="text-brand font-black flex items-center gap-1 hover:underline">
                                    <PhoneCall size={10} className="text-[#FF9800]" />
                                    {parsedAddress.phone}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-[10px] font-black text-brand/35 uppercase tracking-widest flex items-center gap-1.5">
                                  <MapPin size={12} className="text-[#FF9800]" />
                                  Delivery Address
                                </h4>
                                {(!order.awbNumber && 
                                  order.status?.toLowerCase() !== "cancelled" && 
                                  order.orderStatus !== "CANCELLED" && 
                                  (order.shippingStatus || "").toUpperCase() !== "3_AWB_GENERATED" && 
                                  (order.shippingStatus || "").toUpperCase() !== "4_PICKUP_REQUESTED" && 
                                  (order.shippingStatus || "").toUpperCase() !== "DELIVERED") && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveEditAddressOrderId(order.id);
                                      setActiveEditAddressStr(order.shippingAddress || "");
                                      setActiveEditAddressPhone(order.customerPhone || "");
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-[#FF9800]/20 bg-[#FF9800]/5 text-[#FF9800] hover:bg-[#FF9800] hover:text-white transition-all duration-200 cursor-pointer shadow-xs font-bold text-[8px] uppercase tracking-widest"
                                    title="Edit shipping address"
                                  >
                                    <Pencil size={8} className="shrink-0" />
                                    <span>Edit</span>
                                  </button>
                                )}
                              </div>
                              <div className="bg-white rounded-2xl border border-brand/5 p-4 shadow-sm">
                                <p className="text-xs text-brand font-medium leading-relaxed italic break-words">
                                  {order.shippingAddress}
                                </p>
                              </div>
                            </div>

                            {/* Shipping Details & Documents */}
                            {(() => {
                              let shippingDetails: any = null;
                              if (order.shippingDetails) {
                                try {
                                  shippingDetails = JSON.parse(order.shippingDetails);
                                } catch (e) {
                                  console.error("Failed to parse shipping details:", e);
                                }
                              }
                              const labelUrl = shippingDetails?.label || shippingDetails?.labelUrl;
                              const manifestUrl = shippingDetails?.manifestUrl;

                              if (!labelUrl && !manifestUrl && !order.awbNumber) return null;

                              return (
                                <div>
                                  <h4 className="text-[10px] font-black text-brand/35 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Truck size={12} className="text-[#FF9800]" />
                                    Shipping Documents
                                  </h4>
                                  <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl border border-brand/5 shadow-sm relative">
                                    {order.awbNumber && (
                                      <div className="text-xs font-bold text-brand w-full pb-2 border-b border-brand/5 flex justify-between">
                                        <span className="text-brand/40 uppercase tracking-wider">AWB Number</span>
                                        <a
                                          href={`https://www.xpressbees.com/track?awb=${order.awbNumber}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#FF9800] hover:underline"
                                        >
                                          {order.awbNumber} ↗
                                        </a>
                                      </div>
                                    )}
                                    
                                    <div className="flex gap-2 w-full pt-1">
                                      {labelUrl && (
                                        <a
                                          href={labelUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors shadow-sm cursor-pointer"
                                        >
                                          <Download size={14} /> Label
                                        </a>
                                      )}
                                      {manifestUrl && (
                                        <a
                                          href={manifestUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors shadow-sm cursor-pointer"
                                        >
                                          <Download size={14} /> Manifest
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Right Column: Customizations & Items & Order Summary */}
                          <div className="space-y-6">
                            {/* Items & Customizations */}
                            <div>
                              <h4 className="text-[10px] font-black text-brand/35 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Scissors size={12} className="text-[#FF9800]" />
                                Customizations & Items
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item) => {
                                  const parsedImages = (() => {
                                    try {
                                      return (item as any).productImages ? JSON.parse((item as any).productImages) : [];
                                    } catch {
                                      return [];
                                    }
                                  })();
                                  const imageUrl = parsedImages.length > 0 ? parsedImages[0] : null;

                                  const cust = typeof item.customizations === 'string' 
                                    ? (item.customizations ? JSON.parse(item.customizations) : null) 
                                    : item.customizations;

                                  const brandName = cust?.brandName || "";
                                  const modelName = cust?.modelName || "";
                                  const lengthInMeters = cust?.lengthInMeters || "";
                                  
                                  let displayTitle = item.productName || "";
                                  if (brandName || modelName) {
                                    displayTitle = `${brandName} ${modelName}`.trim();
                                    if (lengthInMeters) {
                                      displayTitle += ` (${lengthInMeters} MTR)`;
                                    }
                                  } else if (!displayTitle) {
                                    displayTitle = "Electrical Product";
                                  }

                                  const thicknessVal = item.size || cust?.thickness || "";
                                  const colorVal = (item as any).color || cust?.color || "";

                                  return (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand/5 shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center text-brand/30 overflow-hidden border border-brand/5 shrink-0">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={displayTitle}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <Package size={18} />
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-brand">{displayTitle}</p>
                                          <div className="flex flex-wrap items-center gap-2 mt-1">
                                            {thicknessVal && (
                                              <span className="text-[10px] font-bold text-brand/70 bg-brand/5 px-2 py-0.5 rounded border border-brand/5 uppercase">
                                                {thicknessVal}
                                              </span>
                                            )}
                                            {colorVal && (
                                              <span 
                                                style={{ 
                                                  backgroundColor: getColorStyles(colorVal).bg, 
                                                  color: getColorStyles(colorVal).text, 
                                                  borderColor: getColorStyles(colorVal).border 
                                                }} 
                                                className="text-[10px] font-black px-2 py-0.5 rounded border shadow-2xs uppercase tracking-wider"
                                              >
                                                Color: {colorVal}
                                              </span>
                                            )}
                                            <span className="text-[10px] font-bold text-gray-500">
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-xs font-black text-brand ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                              <div className="bg-white rounded-2xl border border-brand/5 p-4 shadow-sm space-y-3">
                                <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest border-b border-brand/5 pb-2">Order Summary</p>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-brand/40 font-bold uppercase tracking-wider">Actual Price (Subtotal)</span>
                                  <span className="text-brand font-black">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-brand/40 font-bold uppercase tracking-wider">Shipping</span>
                                  <span className="text-[#FF9800] font-black">Free</span>
                                </div>
                                <div className="border-t border-brand/5 pt-3 flex justify-between items-center text-sm font-black text-brand">
                                  <span>Grand Total</span>
                                  <span className="text-brand text-lg font-sans">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-brand/5 shadow-sm">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-xs font-bold text-brand uppercase tracking-widest hover:bg-brand/5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            Previous
          </button>
          <div className="text-xs font-black text-brand/50 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-xs font-bold text-brand uppercase tracking-widest hover:bg-brand/5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            Next
          </button>
        </div>
      )}
      {/* State Machine Action Modals */}
      {activeCancelOrderId !== null && (
        <CancelOrderModal
          isOpen={true}
          orderId={activeCancelOrderId}
          onClose={() => setActiveCancelOrderId(null)}
          onConfirm={async (reason) => {
            await handleStatusTransition(activeCancelOrderId, { orderStatus: "CANCELLED", cancelReason: reason });
          }}
        />
      )}

      {activeAwbOrderId !== null && (
        <ShippingDimensionsModal
          key={activeAwbOrderId}
          isOpen={true}
          orderId={activeAwbOrderId}
          order={orders.find(o => o.id === activeAwbOrderId)}
          onClose={() => setActiveAwbOrderId(null)}
          onConfirm={async (dimensions) => {
            await handleStatusTransition(activeAwbOrderId, { shippingStatus: "3_AWB_GENERATED", packageDetails: dimensions }, true);
          }}
        />
      )}

      {activeCancelShipmentId !== null && activeCancelShipmentAwb !== null && (
        <CancelShipmentModal
          isOpen={true}
          orderId={activeCancelShipmentId}
          awbNumber={activeCancelShipmentAwb}
          onClose={() => {
            setActiveCancelShipmentId(null);
            setActiveCancelShipmentAwb(null);
          }}
          onConfirm={async () => {
            const res = await fetch(`/api/orders/${activeCancelShipmentId}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cancelShipmentOnly: true
              })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data.error || "Failed to cancel shipment.");
            }
            await fetchOrders();
          }}
        />
      )}

      {ndrModalOpen && (
        <NdrActionModal
          isOpen={true}
          awbNumber={ndrAwb}
          courierRemarks={ndrRemarks}
          onClose={() => setNdrModalOpen(false)}
          onSuccess={async () => {
            await fetchOrders();
          }}
        />
      )}

      {activeEditAddressOrderId !== null && activeEditAddressStr !== null && activeEditAddressPhone !== null && (
        <EditAddressModal
          isOpen={true}
          orderId={activeEditAddressOrderId}
          existingAddress={activeEditAddressStr}
          customerPhone={activeEditAddressPhone}
          onClose={() => {
            setActiveEditAddressOrderId(null);
            setActiveEditAddressStr(null);
            setActiveEditAddressPhone(null);
          }}
          onSuccess={async () => {
            await fetchOrders();
          }}
        />
      )}
    </div>
  );
}


