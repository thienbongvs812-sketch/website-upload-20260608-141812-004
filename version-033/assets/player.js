(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  blocks.forEach(function (block) {
    var video = block.querySelector('video');
    var button = block.querySelector('[data-play-control]');
    if (!video || !button) {
      return;
    }

    var source = video.getAttribute('data-video');
    var hlsInstance = null;

    function prepare() {
      if (!source || video.getAttribute('data-ready') === '1') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      video.setAttribute('data-ready', '1');
    }

    function play() {
      prepare();
      block.classList.add('is-playing');
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          block.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', play);
    video.addEventListener('play', function () {
      block.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        block.classList.remove('is-playing');
      }
    });
    video.addEventListener('emptied', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  });
})();
