// Selección local orientativa. Los cobros permanecen desactivados.
'use strict';
const form = document.querySelector('.cafe-form');
form?.addEventListener('submit', event => event.preventDefault());
form?.addEventListener('change', event => {
  if (event.target.name !== 'coffees') return;
  const count = Number(event.target.value);
  if (![1, 3, 5, 10, 25].includes(count)) return;
  document.querySelector('#cafe-total').textContent = `${count} ${count === 1 ? 'café' : 'cafés'} · ${count * 2} €`;
});
