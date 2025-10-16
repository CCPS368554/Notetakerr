// Detects user typing in textareas and inputs
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
let lastText = '';
const processText = debounce((text) => {
  if (text && text !== lastText) {
    lastText = text;
    chrome.runtime.sendMessage({type: 'processText', text}, (response) => {
      if (response && !response.error) {
        console.log('Processed:', response);
      } else if (response && response.error) {
        console.error('Error:', response.error);
      }
    });
  }
}, 1000);
function attachListeners() {
  document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
    el.addEventListener('input', (e) => {
      processText(e.target.value);
    });
  });
}
document.addEventListener('DOMContentLoaded', attachListeners);
attachListeners();
