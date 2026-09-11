function currentPageKey() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file.replace('.html', '') || 'index';
}

function navLink(href, label, activeKey, pageKey, badge = '') {
  const isActive = activeKey === pageKey;
  return `<a href="${href}"${isActive ? ' class="active" aria-current="page"' : ''}>${escapeHtml(label)}${badge}</a>`;
}

async function renderLayout() {
  const host = document.getElementById('site-header');
  if (!host) return;

  const inAdmin = location.pathname.includes('/admin/');
  const base = inAdmin ? '../' : '';
  const pageKey = currentPageKey();

  let session = { authenticated: false, user: null };
  try {
    session = (await apiRequest('/auth/session')).data;
  } catch (error) {
    /* API unreachable; render a signed-out header rather than blocking the page */
  }

  let unread = 0;
  if (session.authenticated) {
    try {
      unread = (await apiRequest('/notifications')).data.unread_count;
    } catch (error) {
      /* notifications are non-critical for the header */
    }
  }

  const links = [];
  if (session.authenticated) {
    links.push(navLink(`${base}dashboard.html`, 'Dashboard', pageKey, 'dashboard'));
    links.push(navLink(`${base}browse.html`, 'Browse', pageKey, 'browse'));
    links.push(navLink(`${base}messages.html`, 'Messages', pageKey, 'messages'));
    links.push(navLink(`${base}notifications.html`, 'Notifications', pageKey, 'notifications', unread ? `<span class="count">${unread}</span>` : ''));
    links.push(navLink(`${base}profile.html`, 'Profile', pageKey, 'profile'));
    if (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') {
      links.push(navLink(`${base}admin/dashboard.html`, 'Admin', pageKey, 'admin-dashboard'));
    }
    links.push(`<a href="#" id="logout-link">Sign out</a>`);
  } else {
    links.push(navLink(`${base}browse.html`, 'Browse', pageKey, 'browse'));
    links.push(navLink(`${base}about.html`, 'About', pageKey, 'about'));
    links.push(navLink(`${base}login.html`, 'Sign in', pageKey, 'login'));
    links.push(navLink(`${base}register.html`, 'Create account', pageKey, 'register'));
  }

  host.innerHTML = `
    <div class="bar">
      <a class="brand" href="${base}index.html">Campus Lost &amp; Found</a>
      <nav>${links.join('')}</nav>
    </div>
  `;

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } finally {
        window.location.href = `${base}index.html`;
      }
    });
  }

  return session;
}

const layoutReady = renderLayout();
