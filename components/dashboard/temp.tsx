"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Check,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import api from "@/lib/api";

// Premium notification type definitions
interface NotificationItem {
  id: string;
  type: "alert" | "system" | "order";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  // State ledger for notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  async function fetchNotifications() {
    try {
      const res = await api.get("/dashboard/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Dynamic time greetings clock handler
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Close menus if clicked outside the target frames
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    );
  };

  const dateString = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
      {/* Brand Context Stack */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold tracking-wider uppercase text-slate-400/90">
            {mounted ? dateString : "Syncing Clock..."}
          </p>
          <span className="h-1 w-1 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-full border border-indigo-100/50">
            Live Console
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {greeting}, Manager{" "}
          <span className="inline-block animate-waving-hand">👋</span>
        </h1>

        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {settings?.businessName || "Business Manager"}
        </p>
      </div>

      {/* Control Actions Panel (Search, Notif, User Dropdowns) */}
      <div className="flex items-center gap-3 self-end md:self-auto relative">
        {/* NOTIFICATION HUB CONTROLLER */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(false);
              setIsNotifOpen(!isNotifOpen);
            }}
            aria-label="Toggle notifications menu"
            className={`relative group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 ${
              isNotifOpen
                ? "border-indigo-500 bg-indigo-50/30 text-indigo-600 shadow-xs"
                : "border-slate-200/80 bg-white text-slate-600 shadow-2xs hover:bg-slate-50"
            }`}
          >
            <Bell
              size={18}
              className={
                isNotifOpen ? "" : "transition-transform group-hover:rotate-12"
              }
            />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Premium Animated Dropdown Flyout Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl z-50 origin-top-right transition-all duration-200">
              {/* Dropdown Header Panel */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    You have {unreadCount} unread entries
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Loop Data Stream List Box */}
              <div className="max-h-72 overflow-y-auto space-y-1 my-1.5 pr-0.5">
                {notifications.map((notif) => {
                  return (
                    <div
                      key={notif.id}
                      onClick={() => toggleReadStatus(notif.id)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer relative ${
                        notif.isRead
                          ? "hover:bg-slate-50/60"
                          : "bg-indigo-50/20 hover:bg-indigo-50/40"
                      }`}
                    >
                      {/* Left Context Typography Channel Type Icon Marker */}
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          notif.type === "alert"
                            ? "bg-rose-50 text-rose-600"
                            : notif.type === "order"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {notif.type === "alert" && <ShieldAlert size={14} />}
                        {notif.type === "order" && <ShoppingBag size={14} />}
                        {notif.type === "system" && <Sparkles size={14} />}
                      </div>

                      {/* Messaging Text Payload Container Blocks */}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`block text-xs truncate ${notif.isRead ? "font-semibold text-slate-700" : "font-bold text-slate-900"}`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                          {notif.description}
                        </p>
                      </div>

                      {/* Read/Unread Interaction Toggle Dot Check Indicator */}
                      <div className="flex items-center justify-center self-center w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-0.5 rounded-md bg-white border border-slate-200 shadow-2xs hover:border-indigo-500 text-slate-400 hover:text-indigo-600">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      </div>

                      {/* Permanent Unread Glow Ring Indicator Tag */}
                      {!notif.isRead && (
                        <span className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsNotifOpen(false);
              setIsProfileOpen(!isProfileOpen);
            }}
            className="
      h-11 w-11 rounded-2xl
      bg-gradient-to-br
      from-indigo-500 to-cyan-500
      text-white font-bold
      shadow-lg transition-all
      hover:scale-105 active:scale-95
    "
          >
            RM
          </button>

          {isProfileOpen && (
            <div
              className="
        absolute right-0 mt-2 w-56
        rounded-2xl bg-white/90
        backdrop-blur-xl
        border border-slate-200
        shadow-xl p-2 z-50
      "
            >
              <button
                onClick={() => router.push("/profile")}
                className="
          w-full flex items-center gap-3
          px-3 py-2 text-left
          rounded-xl hover:bg-slate-100
          transition-colors
        "
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => router.push("/settings")}
                className="
          w-full flex items-center gap-3
          px-3 py-2 text-left
          rounded-xl hover:bg-slate-100
          transition-colors
        "
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="
          w-full flex items-center gap-3
          px-3 py-2 text-left
          rounded-xl text-red-600
          hover:bg-red-50
          transition-colors
        "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
