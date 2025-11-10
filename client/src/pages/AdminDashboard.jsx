import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  CalendarDays,
  Users,
  LogOut,
  Eye,
  Check,
  X,
  Filter,
  Calendar,
  BarChart3,
  Plus,
} from "lucide-react";

import CancelAppointmentModal from "../components/CancelAppointmentModal";
import RescheduleAppointmentModal from "../components/RescheduleAppointmentModal";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  const [showCancelModal, setShowCancelModal] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(null);

  // ✅ Calendar time slot state
  const [timeSlots, setTimeSlots] = useState([
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: false },
    { time: "4:00 PM", available: true },
  ]);

  const toggleAvailability = (index) => {
    const updated = [...timeSlots];
    updated[index].available = !updated[index].available;
    setTimeSlots(updated);
  };

  const stats = [
    { title: "Pending Requests", value: 8, change: "+3 today", icon: <Clock className="text-orange-500" /> },
    { title: "Today's Appointments", value: 4, change: "2 remaining", icon: <CalendarDays className="text-blue-500" /> },
    { title: "Approved This Week", value: 24, change: "+12%", icon: <CheckCircle className="text-green-500" /> },
    { title: "Total Users", value: 156, change: "+8 new", icon: <Users className="text-purple-500" /> },
  ];

  const requests = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "External Visitor",
      topic: "Industry Collaboration Discussion",
      requested: "Dec 28, 2024 at 2:00 PM",
      submitted: "2 hours ago",
    },
    {
      id: 2,
      name: "Dr. Priya Nair",
      email: "priya@company.com",
      role: "External Visitor",
      topic: "Research Partnership Proposal",
      requested: "Dec 30, 2024 at 10:30 AM",
      submitted: "5 hours ago",
    },
    {
      id: 3,
      name: "Ankit Kumar",
      email: "ankit.staff@nitc.ac.in",
      role: "Staff",
      topic: "Budget Discussion",
      requested: "Jan 2, 2025 at 11:00 AM",
      submitted: "1 day ago",
    },
  ];

  const todayAppointments = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      topic: "Thesis Defense Approval",
      time: "3:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      role: "Staff",
      topic: "Department Meeting",
      time: "10:00 AM",
      status: "confirmed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow-sm px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-600">
            SchedulEase <span className="text-green-600">Admin</span>
          </h1>
          <p className="text-sm text-gray-500">Director's Office Administration</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 border rounded-full px-3 py-1">
            Administrator
          </span>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 px-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
              <p className="text-xs text-green-500">{item.change}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex justify-start border-b border-gray-200 mt-8 px-8">
        {["pending", "today", "calendar", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-sky-500 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "pending" && "Pending Requests"}
            {tab === "today" && "Today's Schedule"}
            {tab === "calendar" && "Director's Calendar"}
            {tab === "analytics" && "Analytics"}
          </button>
        ))}
      </div>

      {/* === Pending Requests === */}
      {activeTab === "pending" && (
        <>
          <div className="flex justify-between items-center mt-6 px-8">
            <h2 className="text-lg font-semibold text-gray-700">Appointment Requests</h2>
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
                <option>Filter by type</option>
                <option>External Visitor</option>
                <option>Staff</option>
              </select>
              <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          <div className="mt-4 px-8 space-y-4 pb-10">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-800">{req.name}</h3>
                  <p className="text-sm text-gray-500">{req.email}</p>
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full w-fit mt-1">
                    {req.role}
                  </span>
                </div>

                <div className="flex-1 sm:ml-10 mt-3 sm:mt-0">
                  <p className="font-medium text-gray-700">{req.topic}</p>
                  <p className="text-sm text-gray-500">Requested: {req.requested}</p>
                  <p className="text-xs text-gray-400">Submitted: {req.submitted}</p>
                </div>

                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
                    <Eye size={16} /> View
                  </button>
                  <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600">
                    <Check size={16} /> Approve
                  </button>
                  <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === Today's Schedule === */}
      {activeTab === "today" && (
        <div className="px-8 mt-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Today's Appointments</h2>

          {todayAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{appt.name}</h3>
                <p className="text-sm text-gray-500">{appt.topic}</p>
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full w-fit mt-1">
                  {appt.role}
                </span>
              </div>

              <div className="text-right mt-3 sm:mt-0">
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-sm font-medium text-gray-700">{appt.time}</p>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => setShowRescheduleModal(appt)}
                  className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  <Calendar size={16} /> Reschedule
                </button>

                <button
                  onClick={() => setShowCancelModal(appt)}
                  className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Director's Calendar === */}
      {activeTab === "calendar" && (
        <div className="px-8 mt-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Director's Schedule Management
          </h2>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-700 font-medium text-base">
                Available Time Slots
              </h3>
              <button className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-700 transition">
                <Plus size={16} /> Block Time Slot
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Manage the Director's availability for appointments
            </p>

            {/* Time Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50"
                >
                  <span className="text-gray-700 font-medium text-sm">{slot.time}</span>
                  <button
                    onClick={() => toggleAvailability(index)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slot.available
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {slot.available ? "Available" : "Block"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === Analytics === */}
      {activeTab === "analytics" && (
        <div className="px-8 mt-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Monthly Appointments</h3>
              <p className="text-3xl font-bold text-sky-600">84</p>
              <p className="text-xs text-green-500 mt-1">↑ 15% from last month</p>
            </div>
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Approval Rate</h3>
              <p className="text-3xl font-bold text-green-600">92%</p>
              <p className="text-xs text-gray-500 mt-1">Consistent this week</p>
            </div>
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-2">Cancellations</h3>
              <p className="text-3xl font-bold text-rose-600">6</p>
              <p className="text-xs text-gray-500 mt-1">Mostly by external visitors</p>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <BarChart3 size={16} /> Summary
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center justify-between">
                <span>Total Users</span> <span className="font-medium">156</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Appointments This Week</span> <span className="font-medium">24</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Pending Requests</span> <span className="font-medium">8</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCancelModal && (
        <CancelAppointmentModal
          appointment={showCancelModal}
          onClose={() => setShowCancelModal(null)}
          onConfirm={(id, reason) => {
            console.log("Cancelled:", id, reason);
            setShowCancelModal(null);
          }}
        />
      )}

      {showRescheduleModal && (
        <RescheduleAppointmentModal
          appointment={showRescheduleModal}
          onClose={() => setShowRescheduleModal(null)}
          onConfirm={({ id, datetime }) => {
            console.log("Rescheduled:", id, datetime);
            setShowRescheduleModal(null);
          }}
        />
      )}
    </div>
  );
}
