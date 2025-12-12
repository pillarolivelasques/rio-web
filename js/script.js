// js/script.js
$(function () {
  // ===========================
  // MENU MOBILE
  // ===========================
  // debug: mostra se os elementos existem
  console.log('Menu debug:', 'nav-toggle count=', $('.nav-toggle').length, 'main-nav count=', $('.main-nav').length);

  $('.nav-toggle').on('click', function (e) {
    console.log('Menu debug: .nav-toggle clicked');
    $('.main-nav').toggleClass('open');
  });

  // fecha o menu quando clica em algum link (no mobile)
  $('.main-nav a').on('click', function () {
    console.log('Menu debug: main-nav link clicked');
    $('.main-nav').removeClass('open');
  });

  // ===========================
  // SCROLL SUAVE PARA ÂNCORAS
  // ===========================
  $('a[href^="#"]').on('click', function (e) {
    const destino = $(this).attr('href');

    if (destino.length > 1 && $(destino).length) {
      e.preventDefault();
      $('html, body').animate(
        {
          scrollTop: $(destino).offset().top - 80 // ajusta por causa do header fixo
        },
        500
      );
    }
  });

  // ===========================
  // GRÁFICO CLIMA (se existir)
  // ===========================
  const canvas = document.getElementById('climaChart');
  if (!canvas) {
    console.warn('Chart: canvas #climaChart não encontrado nesta página.');
  } else if (typeof Chart === 'undefined') {
    console.warn('Chart: Chart.js não está carregado (window.Chart é undefined).');
  } else {
    try {
      const ctx = canvas.getContext ? canvas.getContext('2d') : canvas;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
          datasets: [
            {
              type: 'line',
              label: 'Temperatura media (°C)',
              data: [28, 29, 28, 26, 24, 23, 22, 23, 24, 25, 26, 27],
              borderWidth: 2,
              tension: 0.3,
              borderColor: '#6b7e45',
              backgroundColor: 'rgba(107,126,69,0.12)',
              yAxisID: 'y'
            },
            {
              type: 'bar',
              label: 'Lluvia (mm)',
              data: [140, 130, 110, 90, 70, 60, 50, 50, 70, 90, 110, 130],
              borderWidth: 1,
              backgroundColor: 'rgba(107,126,69,0.25)',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { position: 'left', beginAtZero: false, title: { display: true, text: 'Temp (°C)' } },
            y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Lluvia (mm)' } }
          },
          plugins: {
            legend: { labels: { font: { family: 'EB Garamond' } } }
          }
        }
      });

      // pequena interação extra no texto de dica
      $('#clima-tip').on('mouseenter', function () {
        $(this).css('color', '#5f7242');
      }).on('mouseleave', function () {
        $(this).css('color', '#777');
      });
    } catch (err) {
      console.error('Chart: erro ao inicializar o gráfico:', err);
    }
  }

  // ===========================
  // CARROSSEL DE FOTOS
  // ===========================
  const $container = $('.carousel-container');
  const $track = $container.find('.carousel-track');
  const $slides = $track.find('img');

  if ($container.length && $track.length && $slides.length) {
    let index = 0;
    const total = $slides.length;

    // garante que cada imagem ocupe 100% do container
    $slides.css({ flex: '0 0 100%' });

    // cria indicadores (bolinhas)
    const $indicators = $('<div class="carousel-indicators" role="tablist"></div>');
    for (let i = 0; i < total; i++) {
      const $btn = $('<button class="carousel-indicator" type="button" role="tab"></button>')
        .attr('aria-label', 'Slide ' + (i + 1))
        .attr('data-index', i);
      if (i === 0) $btn.addClass('active').attr('aria-selected', 'true');
      else $btn.attr('aria-selected', 'false');
      $indicators.append($btn);
    }
    $container.append($indicators);

    function updateIndicators() {
      $indicators.find('.carousel-indicator').each(function (i, el) {
        const $b = $(el);
        if (i === index) {
          $b.addClass('active').attr('aria-selected', 'true');
        } else {
          $b.removeClass('active').attr('aria-selected', 'false');
        }
      });
    }

    function goToSlide(newIndex, userTriggered) {
      index = (newIndex + total) % total; // loop infinito
      const offset = -(index * 100) / total; // deslocamento relativo ao track
      $track.css('transform', 'translateX(' + offset + '%)');
      updateIndicators();
      if (userTriggered) restartAutoplay();
    }

    // eventos de botões
    $container.on('click', '.carousel-btn.next', function () {
      goToSlide(index + 1, true);
    });

    $container.on('click', '.carousel-btn.prev', function () {
      goToSlide(index - 1, true);
    });

    $indicators.on('click', '.carousel-indicator', function () {
      const i = parseInt($(this).attr('data-index'), 10);
      goToSlide(i, true);
    });

    // autoplay
    const autoplayDelay = 5000;
    let intervalId = null;

    function startAutoplay() {
      if (intervalId) return;
      intervalId = setInterval(function () {
        goToSlide(index + 1, false);
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // pausa ao passar o mouse
    $container.on('mouseenter', stopAutoplay).on('mouseleave', startAutoplay);

    // teclado: permite focar e navegar
    $container.attr('tabindex', '0').on('keydown', function (e) {
      if (e.key === 'ArrowLeft') goToSlide(index - 1, true);
      if (e.key === 'ArrowRight') goToSlide(index + 1, true);
    });

    // suporte a touch/swipe
    let startX = 0;
    let isDragging = false;
    let deltaX = 0;

    $track.on('touchstart mousedown', function (e) {
      isDragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      stopAutoplay();
    });

    $(document).on('touchmove mousemove', function (e) {
      if (!isDragging) return;
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      deltaX = currentX - startX;
    });

    $(document).on('touchend mouseup touchcancel', function () {
      if (!isDragging) return;
      isDragging = false;
      const threshold = 50;
      if (deltaX > threshold) goToSlide(index - 1, true);
      else if (deltaX < -threshold) goToSlide(index + 1, true);
      deltaX = 0;
      startAutoplay();
    });

    // pausa quando aba não está visível
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // inicializa
    goToSlide(0, false);
    startAutoplay();
  }
});