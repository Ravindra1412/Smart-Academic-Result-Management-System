// Imperative toast notifications (rendered outside React tree, into #toast-root)
function showToast(msg, color = '#4d8dff') {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderLeftColor = color;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add('exit');
    setTimeout(() => el.remove(), 350);
  }, 3200);
}


export { showToast };
