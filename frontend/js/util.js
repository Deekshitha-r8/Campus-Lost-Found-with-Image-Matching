const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function imageUrl(imagePath) {
  return `${API_BASE_URL}/items/images/${encodeURIComponent(imagePath)}`;
}

function renderEmptyState(container, text) {
  container.innerHTML = `<div class="empty-state"><p>${escapeHtml(text)}</p></div>`;
}

function renderErrorState(container, message) {
  container.innerHTML = `<div class="error-state"><p>${escapeHtml(message)}</p></div>`;
}

function renderLoadingState(container, text = 'Loading…') {
  container.innerHTML = `<div class="loading-state"><p>${escapeHtml(text)}</p></div>`;
}

function typeBadge(type) {
  const cls = type === 'LOST' ? 'badge-lost' : 'badge-found';
  return `<span class="badge ${cls}">${escapeHtml(type)}</span>`;
}

function statusBadge(status) {
  const map = { ACTIVE: 'badge-neutral', MATCHED: 'badge-warning', RETURNED: 'badge-found', CLOSED: 'badge-neutral', REMOVED: 'badge-neutral' };
  return `<span class="badge ${map[status] || 'badge-neutral'}">${escapeHtml(status)}</span>`;
}
