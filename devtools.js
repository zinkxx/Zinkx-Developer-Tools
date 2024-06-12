document.querySelectorAll('.popup-button').forEach(button => {
    button.addEventListener('click', () => {
      const popupId = button.getAttribute('data-popup');
      document.getElementById(popupId).style.display = 'block';
    });
  });
  
  document.querySelectorAll('.popup-close').forEach(button => {
    button.addEventListener('click', () => {
      button.parentElement.parentElement.style.display = 'none';
    });
  });
  
  // Dark Mode ve Assistant Mode için toggle işlevleri
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
  
  document.getElementById('assistantModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('assistant-mode');
  });
  
  // Kod Analizi ve Hata Ayıklama
  document.getElementById('analyzeCode').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const errors = [];
        const code = document.documentElement.outerHTML;
        if (!code.includes('<html')) errors.push('HTML Etiketi Eksik');
        if (!code.includes('<script')) errors.push('JavaScript Bulunamadı');
        return errors;
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('analysisResults').textContent = result.join('\\n');
      }
    });
  });
  
  // DOM Denetleyici
  const updateDOMViewer = () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const elements = [];
        document.querySelectorAll('*').forEach(el => {
          elements.push(el.tagName);
        });
        return elements.join('\\n');
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('domViewer').textContent = result;
      }
    });
  };
  updateDOMViewer();
  
  // Ağ İzleyici
  chrome.devtools.network.onRequestFinished.addListener(request => {
    const listItem = document.createElement('div');
    listItem.textContent = `${request.request.method} ${request.request.url}`;
    document.getElementById('networkRequests').appendChild(listItem);
  });
  
  // Kaynak Kullanımı
  const updateResourceUsage = () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        if (window.performance && window.performance.memory) {
          const memory = window.performance.memory;
          const usage = \`Heap Boyutu: \${memory.usedJSHeapSize} / \${memory.totalJSHeapSize}\`;
          return usage;
        } else {
          return 'Bellek kullanım bilgisi mevcut değil';
        }
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('resourceUsage').textContent = result;
      }
    });
  };
  updateResourceUsage();
  setInterval(updateResourceUsage, 5000);
  
  // Performans İzleme
  const updatePerformanceMetrics = () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        if (window.performance && window.performance.timing) {
          const metrics = window.performance.timing;
          const metricsData = \`Yükleme Süresi: \${metrics.loadEventEnd - metrics.navigationStart} ms\`;
          return metricsData;
        } else {
          return 'Performans bilgisi mevcut değil';
        }
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('performanceMetrics').textContent = result;
      }
    });
  };
  updatePerformanceMetrics();
  setInterval(updatePerformanceMetrics, 5000);
  
  // Kaynak Kod Düzenleyici
  document.getElementById('applyChanges').addEventListener('click', () => {
    const code = document.getElementById('codeEditor').value;
    chrome.devtools.inspectedWindow.eval(code, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        console.log('Değişiklikler uygulandı.');
      }
    });
  });
  
  // Duyarlı Tasarım Testi
  document.getElementById('deviceProfiles').addEventListener('change', () => {
    const device = document.getElementById('deviceProfiles').value;
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        if ('${device}' === 'mobile') {
          document.body.style.width = '375px';
        } else if ('${device}' === 'tablet') {
          document.body.style.width = '768px';
        } else {
          document.body.style.width = '100%';
        }
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    });
  });
  
  // JavaScript Profiler
  document.getElementById('startProfiler').addEventListener('click', () => {
    chrome.devtools.profiler.start();
  });
  document.getElementById('stopProfiler').addEventListener('click', () => {
    chrome.devtools.profiler.stop(profile => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('profilerResults').textContent = JSON.stringify(profile, null, 2);
      }
    });
  });
  
  // CSS ve JavaScript Minifier
  document.getElementById('minifyCSS').addEventListener('click', () => {
    const code = document.getElementById('minifierInput').value;
    const minified = code.replace(/\s+/g, ' ').replace(/\s*([{}:;])\s*/g, '$1');
    document.getElementById('minifierOutput').textContent = minified;
  });
  document.getElementById('minifyJS').addEventListener('click', () => {
    const code = document.getElementById('minifierInput').value;
    const minified = code.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1');
    document.getElementById('minifierOutput').textContent = minified;
  });
  
  // Yükleme Zamanı Analizi
  const updateLoadTimeAnalysis = () => {
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const analysis = \`
            DNS Araması: \${timing.domainLookupEnd - timing.domainLookupStart} ms
            TCP El Sıkışma: \${timing.connectEnd - timing.connectStart} ms
            Yanıt: \${timing.responseEnd - timing.responseStart} ms
            DOM Yüklendi: \${timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart} ms
            Sayfa Yükleme: \${timing.loadEventEnd - timing.navigationStart} ms
          \`;
          return analysis;
        } else {
          return 'Yükleme süresi bilgisi mevcut değil';
        }
      })()
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        document.getElementById('loadTimeAnalysis').textContent = result;
      }
    });
  };
  updateLoadTimeAnalysis();
  setInterval(updateLoadTimeAnalysis, 5000);
  
  // Önbellek Temizleyici
  document.getElementById('clearCache').addEventListener('click', () => {
    chrome.browsingData.removeCache({}, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        alert('Önbellek temizlendi!');
      }
    });
  });
  
  // Erişilebilirlik Denetleyici
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
        document.getElementById('accessibilityResults').textContent = result.join('\\n');
      }
    });
  });
  
  // SEO Denetleyici
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
        document.getElementById('seoResults').textContent = result.join('\\n');
      }
    });
  });
  
  // Renk Kontrastı Kontrolü
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
        document.getElementById('contrastResults').textContent = result.join('\\n');
      }
    });
  });
  
  // HTTP Başlıkları Görüntüleyici
  document.getElementById('viewHeaders').addEventListener('click', () => {
    chrome.devtools.network.getHAR(log => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else {
        const headers = log.entries[0].request.headers;
        document.getElementById('headersResults').textContent = JSON.stringify(headers, null, 2);
      }
    });
  });
  
  // İçerik Güvenlik Politikası Denetleyici
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
        document.getElementById('cspResults').textContent = result;
      }
    });
  });
  
  // Form Verisi Gönderici
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
        console.log(result);
      }
    });
  });
  
  // Hızlı Link Kontrolü
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
        document.getElementById('linksResults').textContent = result.join('\\n');
      }
    });
  });
  
  // Tarayıcı Konsol Erişimi
  document.getElementById('openConsole').addEventListener('click', () => {
    chrome.devtools.inspectedWindow.eval(`
      console.log('Konsol Zinkx Developer Tools tarafından açıldı');
    `, (result, isException) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    });
  });
  