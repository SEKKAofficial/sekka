/* ==============================
   SEKKA - Install System
================================ */

const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;

// اكتشاف إذا كان التطبيق مثبتًا بالفعل
function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone === true;
}

// تحديث الزر
function updateInstallButton() {
  if (!installBtn) return;

  if (isAppInstalled()) {
    installBtn.innerHTML = "سِكّة مثبت على جهازك ✓";
    installBtn.disabled = true;
    installBtn.style.opacity = "0.7";
    installBtn.style.cursor = "default";
  }
}

updateInstallButton();

// استقبال حدث التثبيت من المتصفح
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  if (installBtn && !isAppInstalled()) {
    installBtn.style.display = "inline-flex";
  }
});

// الضغط على زر التثبيت
if (installBtn) {
  installBtn.addEventListener("click", async () => {

    if (isAppInstalled()) {
      alert("تطبيق سِكّة مثبت بالفعل على جهازك.");
      return;
    }

    // المتصفحات التي تدعم نافذة التثبيت
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const result = await deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        installBtn.innerHTML = "تم طلب تثبيت سِكّة ✓";
      }

      deferredPrompt = null;
      return;
    }

    // تعليمات iPhone و iPad
    const isAppleDevice =
      /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isAppleDevice) {
      alert(
        "لتثبيت سِكّة على جهازك:\n\n" +
        "1- افتح الموقع من متصفح Safari.\n" +
        "2- اضغط على زر المشاركة أسفل الشاشة.\n" +
        "3- اختر إضافة إلى الشاشة الرئيسية.\n" +
        "4- اضغط إضافة."
      );
      return;
    }

    // المتصفح لا يدعم التثبيت حاليًا
    alert(
      "التثبيت غير متاح حاليًا من هذا المتصفح.\n" +
      "افتح الموقع من متصفح يدعم تثبيت التطبيقات."
    );
  });
}

// متابعة حالة التثبيت
window.addEventListener("appinstalled", () => {
  if (installBtn) {
    installBtn.innerHTML = "سِكّة مثبت على جهازك ✓";
    installBtn.disabled = true;
  }
});
