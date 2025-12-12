$(function () {

  /* MENU MOBILE */
  const $nav = $(".main-nav");
  const $toggle = $(".nav-toggle");

  $toggle.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $nav.toggleClass("open");
  });

  $nav.find("a").on("click", function () {
    $nav.removeClass("open");
  });

  $(document).on("click", function (e) {
    if ($(e.target).closest(".main-header").length === 0) {
      $nav.removeClass("open");
    }
  });

  /* GRÁFICO CLIMA */
  const canvas = document.getElementById("climaChart");
  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
      datasets: [
        {
          label: "Temperatura media (°C)",
          type: "line",
          data: [28,29,28,27,25,24,23,24,25,26,27,28],
          borderColor: "#6b7e45",
          backgroundColor: "rgba(107,126,69,0.25)",
          borderWidth: 2,
          tension: 0.35,
          yAxisID: "y"
        },
        {
          label: "Lluvia (mm)",
          type: "bar",
          data: [137,130,130,100,90,70,60,70,90,100,110,130],
          backgroundColor: "rgba(160,170,120,0.6)",
          borderRadius: 6,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          position: "left",
          title: { display: true, text: "Temperatura (°C)" }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Lluvia (mm)" }
        }
      }
    }
  });

});