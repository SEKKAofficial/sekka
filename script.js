/* =================================
   SEKKA - PWA INSTALL SYSTEM
   سِكّة | مشوارك أسهل
================================= */

const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;

// التحقق من تثبيت التطبيق
function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// تحديث شكل وحالة زر التثبيت
function updateInstallButton() {
  if (!installBtn) return;

  if (isAppInstalled()) {
    installBtn.textContent = "سِكّة مثبت على جهازك ✓";
    installBtn.disabled = true;
    installBtn.style.display = "inline-flex";
    installBtn.style.opacity = "0.7";
    installBtn.style.cursor = "default";
  }
}

// اكتشاف أجهزة Apple
function isAppleDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// تعليمات تثبيت أجهزة Apple
function showAppleInstallInstructions() {
  alert(
    "لتثبيت سِكّة على جهازك:\n\n" +
    "1- افتح الموقع من متصفح Safari.\n" +
    "2- اضغط على زر المشاركة.\n" +
    "3- اختر إضافة إلى الشاشة الرئيسية.\n" +
    "4- اضغط إضافة."
  );
}

// تهيئة الزر
if (installBtn) {
  installBtn.style.display = "none";
  updateInstallButton();
}

// استقبال طلب التثبيت من المتصفح
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  deferredPrompt = event;

  if (installBtn && !isAppInstalled()) {
    installBtn.style.display = "inline-flex";
    installBtn.disabled = false;
    installBtn.textContent = "ثبّت سِكّة الآن";
    installBtn.style.opacity = "1";
    installBtn.style.cursor = "pointer";
  }
});

// الضغط على زر التثبيت
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (isAppInstalled()) {
      updateInstallButton();
      return;
    }

    // أجهزة Apple
    if (isAppleDevice()) {
      showAppleInstallInstructions();
      return;
    }

    // المتصفحات التي تدعم التثبيت
    if (deferredPrompt) {
      const promptEvent = deferredPrompt;
      deferredPrompt = null;

      promptEvent.prompt();

      const result = await promptEvent.userChoice;

      if (result.outcome === "accepted") {
        installBtn.textContent = "جارٍ تثبيت سِكّة...";
      } else {
        installBtn.textContent = "حاول تثبيت سِكّة مرة أخرى";
      }

      return;
    }

    alert(
      "التثبيت غير متاح حاليًا.\n\n" +
      "جرّب فتح الموقع من متصفح Chrome أو Safari."
    );
  });
}

// متابعة اكتمال التثبيت
window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  updateInstallButton();
});

// متابعة وضع التطبيق
const displayMode = window.matchMedia("(display-mode: standalone)");

displayMode.addEventListener?.("change", updateInstallButton);

// التحقق عند فتح الصفحة
window.addEventListener("pageshow", updateInstallButton);
