import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function RescheduleAppointmentModal({
  appointment,
  availableSlots = {},
  onClose,
  onConfirm,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (appointment?.datetime) {
      const d = new Date(appointment.datetime);
      setSelectedDate(d);
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [appointment]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(year, month, day));
    setSelectedTime(null);
  };

  const dateISO = selectedDate.toISOString().slice(0, 10);
  const times = availableSlots[dateISO] || [
    { time: "09:00", duration: "30 min", booked: false },
    { time: "10:00", duration: "60 min", booked: false },
    { time: "11:00", duration: "30 min", booked: true },
    { time: "14:00", duration: "30 min", booked: false },
    { time: "15:00", duration: "60 min", booked: false },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Reschedule Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Current Info + Calendar */}
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
              <p className="text-sm text-gray-500 font-medium">Current Appointment</p>
              <p className="text-gray-700 mt-1">
                Date:{" "}
                <span className="font-semibold">
                  {new Date(appointment?.datetime).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-700">
                Time:{" "}
                <span className="font-semibold">
                  {new Date(appointment?.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p className="text-gray-700">
                Purpose: <span className="font-semibold">{appointment?.title}</span>
              </p>
            </div>

            {/* Calendar */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={handlePrevMonth}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  ‹
                </button>
                <div className="text-sm font-medium text-gray-700">
                  {monthNames[month]} {year}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                {daysOfWeek.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`h-8 w-8 flex items-center justify-center rounded-full mx-auto ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Time slots */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Available Times -{" "}
              <span className="font-semibold">
                {selectedDate.toLocaleDateString()}
              </span>
            </h3>
            <div className="border rounded-lg p-3 h-80 overflow-y-auto space-y-2">
              {times.map((slot, idx) => (
                <button
                  key={idx}
                  disabled={slot.booked}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`flex justify-between items-center w-full text-left px-3 py-2 rounded border ${
                    slot.booked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedTime === slot.time
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span className="text-xs text-gray-500">
                    {slot.duration} •{" "}
                    {slot.booked ? "Booked" : "Available"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                id: appointment.id,
                newDate: selectedDate.toISOString(),
                newTime: selectedTime,
              })
            }
            disabled={!selectedTime}
            className={`px-4 py-2 rounded-md text-white transition ${
              selectedTime
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
