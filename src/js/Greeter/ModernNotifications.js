/**
 * @license Shikai
 * ModernNotifications.js
 *
 * Modern toast notification system with Tailwind CSS
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const types = {
  Info: "info",
  Success: "success",
  Warning: "warning",
  Error: "error"
};

const typeStyles = {
  info: {
    bg: "bg-blue-500/20 border-blue-500/50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    text: "text-blue-100"
  },
  success: {
    bg: "bg-emerald-500/20 border-emerald-500/50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    text: "text-emerald-100"
  },
  warning: {
    bg: "bg-amber-500/20 border-amber-500/50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    text: "text-amber-100"
  },
  error: {
    bg: "bg-red-500/20 border-red-500/50",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`,
    text: "text-red-100"
  }
};

export function notify(msg, type = types.Info) {
  const root = document.getElementById("notificationroot");
  if (!root) return;

  const style = typeStyles[type] || typeStyles.info;

  const notification = document.createElement("div");
  notification.className = `
    flex items-center gap-3 px-4 py-3 rounded-xl
    backdrop-blur-xl border shadow-lg
    transform transition-all duration-300 ease-out
    translate-x-full opacity-0
    ${style.bg}
  `.replace(/\s+/g, ' ').trim();

  notification.innerHTML = `
    <div class="shrink-0">${style.icon}</div>
    <p class="text-sm font-medium ${style.text}">${msg}</p>
  `;

  root.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.remove("translate-x-full", "opacity-0");
    notification.classList.add("translate-x-0", "opacity-100");
  });

  // Animate out and remove
  setTimeout(() => {
    notification.classList.remove("translate-x-0", "opacity-100");
    notification.classList.add("translate-x-full", "opacity-0");

    setTimeout(() => {
      if (notification.parentNode === root) {
        root.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
