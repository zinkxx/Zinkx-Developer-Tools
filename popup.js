document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  
  document.getElementById('assistantModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('assistant-mode');
  });
  
  document.getElementById('clearCache').addEventListener('click', () => {
    chrome.browsingData.removeCache({}, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Önbellek temizlendi!');
      }
    });
  });
  
  // Diğer düğme olay dinleyicileri buraya eklenebilir, örneğin:
  document.getElementById('minifyCSS').addEventListener('click', () => {
    // Minify CSS işlevi
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const code = document.documentElement.outerHTML;
        const minified = code.replace(/\\s+/g, ' ').replace(/\\s*([{}:;])\\s*/g, '$1');
        return minified;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('CSS küçültüldü!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('minifyJS').addEventListener('click', () => {
    // Minify JS işlevi
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const code = document.documentElement.outerHTML;
        const minified = code.replace(/\\s+/g, ' ').replace(/\\s*([{}:;,])\\s*/g, '$1');
        return minified;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('JS küçültüldü!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('checkAccessibility').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const results = [];
        if (!document.querySelector('title')) results.push('Başlık etiketi eksik');
        if (!document.querySelector('meta[name="description"]')) results.push('Meta açıklama eksik');
        return results;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Erişilebilirlik kontrol edildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('checkSEO').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const results = [];
        if (!document.querySelector('title')) results.push('Başlık etiketi eksik');
        if (!document.querySelector('meta[name="description"]')) results.push('Meta açıklama eksik');
        if (document.images.length === 0) results.push('Resim bulunamadı');
        return results;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('SEO kontrol edildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('checkContrast').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const results = [];
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
          const style = getComputedStyle(el);
          const bgColor = style.backgroundColor;
          const color = style.color;
          if (bgColor && color) {
            const contrast = (parseInt(bgColor.slice(4, 7)) - parseInt(color.slice(4, 7))) * 0.299 +
                            (parseInt(bgColor.slice(8, 11)) - parseInt(color.slice(8, 11))) * 0.587 +
                            (parseInt(bgColor.slice(12, 15)) - parseInt(color.slice(12, 15))) * 0.114;
            if (contrast < 50) {
              results.push(\`Düşük kontrast: \${bgColor} ile \${color} arasında \${el.tagName} elemanında\`);
            }
          }
        });
        return results;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Renk kontrastı kontrol edildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('viewHeaders').addEventListener('click', () => {
    chrome.devtools.network.getHAR(log => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        const headers = log.entries[0].request.headers;
        alert('Başlıklar görüntülendi!');
        console.log(JSON.stringify(headers, null, 2));
      }
    });
  });
  
  document.getElementById('checkCSP').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return csp ? csp.content : 'CSP bulunamadı';
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('CSP kontrol edildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('submitFormData').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const form = document.querySelector('form');
        if (form) {
          const data = new FormData(form);
          const entries = {};
          for (const [key, value] of data.entries()) {
            entries[key] = value;
          }
          return JSON.stringify(entries);
        } else {
          return 'Form bulunamadı';
        }
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Form verisi gönderildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('checkLinks').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const results = [];
        document.querySelectorAll('a').forEach(link => {
          const href = link.getAttribute('href');
          if (!href || href === '#') {
            results.push(\`Geçersiz link: \${link.outerHTML}\`);
          }
        });
        return results;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Linkler kontrol edildi!');
        console.log(result);
      }
    });
  });
  
  document.getElementById('openConsole').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      console.log('Konsol Zinkx Developer Tools tarafından açıldı');
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Konsol açıldı!');
      }
    });
  });
  