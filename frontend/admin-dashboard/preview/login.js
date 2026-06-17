const pw = document.getElementById('password');
const togglePw = document.getElementById('togglePw');
const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = submitBtn?.querySelector('.form__submit-text');

togglePw?.addEventListener('click', () => {
  const show = pw.type === 'password';
  pw.type = show ? 'text' : 'password';
  togglePw.setAttribute(
    'aria-label',
    show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'
  );
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.classList.add('form__submit--loading');
  if (submitText) submitText.textContent = 'جاري التحقق...';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove('form__submit--loading');
    if (submitText) submitText.textContent = 'تهيئة الاتصال';
  }, 1400);
});

document.getElementById('langBtn')?.addEventListener('click', () => {
  const html = document.documentElement;
  const isAr = html.lang === 'ar';
  html.lang = isAr ? 'en' : 'ar';
  html.dir = isAr ? 'ltr' : 'rtl';
  document.querySelector('#langBtn span').textContent = isAr ? 'العربية' : 'English';
});
