function renderAdminNav(active) {
  const host = document.querySelector('#admin-nav');
  if (!host) return;
  const items = [
    ['dashboard.html', 'dashboard', 'Overview'],
    ['items.html', 'items', 'Reports'],
    ['users.html', 'users', 'Users'],
    ['reports.html', 'reports', 'Flags'],
    ['statistics.html', 'statistics', 'Statistics'],
  ];
  host.innerHTML = items.map(([href, key, label]) => `<a class="btn ${key === active ? 'btn-primary' : 'btn-outline'} btn-sm" href="${href}">${label}</a>`).join('');
}
