/* Strix 部署教程 · 站点脚本
   负责：生成侧栏导航 / 高亮当前页 / 代码块复制 / 主题切换 / 移动端菜单
   纯原生 JS，无任何外部依赖 */

(function () {
  'use strict';

  var NAV = [
    { group: '开始', items: [
      { href: 'index.html',    title: '项目概览',     ico: '🏠' },
      { href: 'choose.html',   title: '部署方式选型', ico: '🧭' },
      { href: 'download.html', title: '产物与架构',   ico: '🧱' },
      { href: 'agent.html',    title: '接入采集端',   ico: '📡' }
    ]},
    { group: '按平台部署监控端', items: [
      { href: 'linux.html',    title: 'Linux 服务器', ico: '🐧' },
      { href: 'windows.html',  title: 'Windows',      ico: '🖥' },
      { href: 'macos.html',    title: 'macOS',        ico: '🍎' },
      { href: 'docker.html',   title: 'Docker',       ico: '🐳' }
    ]},
    { group: '参考', items: [
      { href: 'config.html',       title: '配置项清单', ico: '⚙️' },
      { href: 'troubleshoot.html', title: '排障手册',   ico: '🛠' },
      { href: 'publish.html',      title: '发布与托管', ico: '📤' }
    ]}
  ];

  function currentPage() {
    var p = location.pathname.split('/').pop();
    return (!p || p === '') ? 'index.html' : p;
  }

  function buildSidebar() {
    var host = document.getElementById('sidebar');
    if (!host) return;
    var cur = currentPage();
    var html = '';
    html += '<div class="brand">' +
              '<div class="logo">SX</div>' +
              '<div class="name">Strix<small>部署教程</small></div>' +
            '</div>';
    NAV.forEach(function (g) {
      html += '<div class="nav-group"><div class="g-title">' + g.group + '</div>';
      g.items.forEach(function (it) {
        var active = (it.href === cur) ? ' active' : '';
        html += '<a class="nav-item' + active + '" href="' + it.href + '">' +
                  '<span class="ico">' + it.ico + '</span>' + it.title + '</a>';
      });
      html += '</div>';
    });
    html += '<div class="side-foot">' +
              '版本 1.2.3 · Apache-2.0<br>' +
              '<a href="index.html">教程首页</a> · ' +
              '<a href="https://github.com/sangxi/Strix" target="_blank" rel="noreferrer">GitHub 仓库</a>' +
            '</div>';
    host.innerHTML = html;
  }

  function buildTopbar() {
    var title = document.body.getAttribute('data-title') || '';
    var host = document.getElementById('crumb');
    if (host) host.innerHTML = '部署教程 <b>/ ' + title + '</b>';
  }

  function addCopyButtons() {
    var blocks = document.querySelectorAll('pre');
    Array.prototype.forEach.call(blocks, function (pre) {
      if (pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        var done = function () {
          btn.textContent = '已复制';
          btn.classList.add('done');
          setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('done'); }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
        } else {
          fallback(text, done);
        }
      });
      pre.appendChild(btn);
    });
  }

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('opsm-theme'); } catch (e) {}
    var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('opsm-theme', next); } catch (e) {}
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initMenu() {
    var btn = document.getElementById('menu-toggle');
    var sb = document.getElementById('sidebar');
    if (!btn || !sb) return;
    btn.addEventListener('click', function () { sb.classList.toggle('open'); });
    sb.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') sb.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSidebar();
    buildTopbar();
    addCopyButtons();
    initTheme();
    initMenu();
  });
})();
