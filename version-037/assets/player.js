(function () {
  window.initMoviePlayer = function (videoId, overlayId, src) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hls = null;
    var started = false;

    if (!video || !src) return;

    function attach() {
      if (started) {
        video.play().catch(function () {});
        return;
      }

      started = true;

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }

      video.play().catch(function () {});
    }

    if (overlay) {
      overlay.addEventListener('click', attach);
    }

    video.addEventListener('click', function () {
      if (!started) attach();
    });

    window.addEventListener('pagehide', function () {
      if (hls) hls.destroy();
    });
  };
})();
