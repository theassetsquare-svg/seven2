/* 대전세븐나이트 W.T 원숭이 — 인터랙션 + 자연체류 보조 */

(function () {
  'use strict';

  // === 1. 클릭 트래킹 (어떤 CTA가 잘 먹히는지 콘솔/GA로 확인) ===
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-track');
      if (window.gtag) window.gtag('event', 'click', { 'event_label': name });
      if (window.console) console.log('[track]', name);
    });
  });

  // === 2. 스크롤 시 통화바 살짝 작아짐 (시야 확보 + 항상 노출) ===
  var callbar = document.querySelector('.callbar');
  if (callbar) {
    var lastY = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 200 && y > lastY) {
        callbar.style.transform = 'translateY(-2px)';
        callbar.style.opacity = '.96';
      } else {
        callbar.style.transform = 'translateY(0)';
        callbar.style.opacity = '1';
      }
      lastY = y;
    }, { passive: true });
  }

  // === 3. 섹션 페이드인 (체류 자연 유도) ===
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section, .finalcta').forEach(function (s) {
      s.style.opacity = '0';
      s.style.transform = 'translateY(20px)';
      s.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(s);
    });
  }

  // === 4. 페이지 떠나려 할 때 마지막 안내 (모바일 제외) ===
  // 데스크톱에서 탭 닫으려 할 때 한 번 더 자연스럽게 어필
  var bounced = false;
  document.addEventListener('mouseleave', function (e) {
    if (bounced) return;
    if (e.clientY < 0) {
      bounced = true;
      var box = document.createElement('div');
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', '예약 안내');
      box.style.cssText = [
        'position:fixed','inset:0','background:rgba(0,0,0,.85)',
        'display:flex','align-items:center','justify-content:center',
        'z-index:9999','padding:20px','animation:fade .2s'
      ].join(';');
      box.innerHTML =
        '<div style="background:#1a0810;border:2px solid #ffd84d;border-radius:16px;max-width:420px;padding:30px;text-align:center;color:#fff">' +
          '<h3 style="margin:0 0 10px;color:#ffd84d;font-size:24px">잠깐!</h3>' +
          '<p style="margin:0 0 20px">대전세븐나이트 자리, 지금 비어있습니다.<br>전화 한 통이면 끝.</p>' +
          '<a href="tel:01032421504" style="display:block;background:linear-gradient(90deg,#ff2d55,#ff6b00);color:#fff;padding:16px;border-radius:12px;font-weight:900;text-decoration:none;font-size:18px">☎ 010-3242-1504 통화</a>' +
          '<button id="seven-close" style="margin-top:14px;background:transparent;color:#999;border:0;cursor:pointer;font-size:14px">닫기</button>' +
        '</div>';
      document.body.appendChild(box);
      box.addEventListener('click', function (ev) {
        if (ev.target === box || ev.target.id === 'seven-close') {
          box.remove();
        }
      });
    }
  });

  // === 5. 통화 즉시 연결 안전장치 (iOS Safari 일부 차단 방지) ===
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      // 사용자 의도 확정 — 새 탭 방지, 즉시 다이얼러 호출
      // (브라우저 기본 동작에 맡기고 별도 처리 X)
    });
  });

  // === 6. 페이지 로드 후 가벼운 페이지뷰 신호 (GA가 있으면) ===
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: '대전세븐나이트 원숭이',
      page_path: location.pathname
    });
  }
})();
