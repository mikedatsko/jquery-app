
function App() {
  window.parent.postMessage('FRAME_LOADED', (new URL(document.location.href)).searchParams.get('host_url') || 'http://jsmeasure.surge.sh');
  listTodos.getList();
}
