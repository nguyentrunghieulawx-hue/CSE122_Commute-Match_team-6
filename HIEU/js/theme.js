/**
 * Theme Manager - Quản lý Dark Mode cho CommuteMatch
 * Lưu trạng thái vào localStorage và áp dụng khi tải trang
 */

// ===== Áp dụng ngay khi load script (tránh hiện theme sai trước khi render) =====
(function applyThemeEarly() {
  try {
    var saved = localStorage.getItem('commutematch-theme-mode');
    var isDark = saved === 'dark';
    if (isDark) document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
  } catch (e) { /* localStorage có thể bị chặn */ }
})();

class ThemeManager {
  constructor() {
    this.storageKey = 'commutematch-theme-mode';
    this.darkModeClass = 'dark-mode';
    this.init();
  }

  init() {
    // Đọc cài đặt từ localStorage hoặc sử dụng hệ thống
    const savedTheme = localStorage.getItem(this.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme !== null ? savedTheme === 'dark' : prefersDark;

    if (isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }

    // Lắng nghe sự thay đổi hệ thống
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        if (e.matches) {
          this.enableDarkMode();
        } else {
          this.disableDarkMode();
        }
      }
    });
  }

  enableDarkMode() {
    document.documentElement.classList.add(this.darkModeClass);
    localStorage.setItem(this.storageKey, 'dark');
    this.updateToggleButtons(true);
  }

  disableDarkMode() {
    document.documentElement.classList.remove(this.darkModeClass);
    localStorage.setItem(this.storageKey, 'light');
    this.updateToggleButtons(false);
  }

  toggle() {
    if (document.documentElement.classList.contains(this.darkModeClass)) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  updateToggleButtons(isDark) {
    const toggles = document.querySelectorAll('[data-action="toggle-dark-mode"]');
    toggles.forEach(el => {
      if (el.tagName === 'INPUT') {
        // Checkbox trong trang cài đặt
        el.checked = isDark;
      } else {
        // Nút ở các thanh công cụ khác
        el.setAttribute('aria-pressed', isDark);
        el.classList.toggle('dark-mode-active', isDark);
      }
    });
  }

  isDarkMode() {
    return document.documentElement.classList.contains(this.darkModeClass);
  }
}

// Khởi tạo khi DOM sẵn sàng hoặc ngay lập tức
if (document.readyState !== 'loading') {
  window.themeManager = new ThemeManager();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
}

// Thêm event listener cho toggle:
// - Checkbox (trang cài đặt): lắng nghe 'change', áp theo trạng thái checked
// - Nút (các thanh công cụ): lắng nghe 'click', đảo trạng thái
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action="toggle-dark-mode"]');
  if (el && el.tagName === 'INPUT') {
    if (el.checked) window.themeManager?.enableDarkMode();
    else window.themeManager?.disableDarkMode();
  }
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action="toggle-dark-mode"]');
  if (el && el.tagName !== 'INPUT') {
    window.themeManager?.toggle();
  }
});
