// Viewer adapter only: leave the vendored sfig runtime and its key bindings alone.
(function () {
  'use strict';
  if (!window.matchMedia) return;
  var mobile = window.matchMedia('(hover: none) and (pointer: coarse)');
  var gesture = null;
  var busy = false;
  var maxMovement = 12; // CSS pixels; any larger movement cancels the entire tap.

  function currentPresentation() {
    if (!mobile.matches || busy || !window.prez || !window.sfig_ ||
        !sfig_.keysEnabled || window.matchMedia('print').matches) return null;
    var params = new URLSearchParams(window.location.hash.slice(1));
    var mode = sfig_.getDisplayMode();
    // An absent #mode is undefined; sfig's default-mode constant is null.
    if (mode == null) mode = sfig_.DISPLAYMODE_DEFAULT;
    if (params.has('listen') || params.has('measure') ||
        (mode !== sfig_.DISPLAYMODE_DEFAULT &&
         mode !== sfig_.DISPLAYMODE_FULLSCREEN)) return null;
    var slide = prez.slides[prez.currSlideIndex];
    if (!prez.keyMap || !slide || !slide.elem || !slide.state ||
        !slide.state.svg || !prez.container.contains(slide.state.svg)) return null;
    return { presentation: prez, svg: slide.state.svg,
             index: prez.currSlideIndex, level: prez.currLevel };
  }

  function interactive(target, svg) {
    // sfig links may be SVG groups with onclick rather than HTML anchors.
    for (var node = target; node; node = node.parentNode) {
      if (node.nodeType === 1 &&
          (node.onclick || node.ondblclick || node.isContentEditable ||
           node.matches('a, button, input, select, textarea, summary, audio, video, ' +
                        '[role="button"], [role="link"], [contenteditable]'))) return true;
      if (node === svg) break;
    }
    return false;
  }

  function moved(touch, start) {
    return Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > maxMovement;
  }

  document.addEventListener('touchstart', function (event) {
    gesture = null;
    if (event.defaultPrevented || event.touches.length !== 1) return;
    var active = currentPresentation();
    if (!active || !active.svg.contains(event.target) ||
        interactive(event.target, active.svg)) return;
    var touch = event.touches[0];
    gesture = {
      active: active, id: touch.identifier,
      x: touch.clientX, y: touch.clientY, time: performance.now()
    };
  }, { passive: true });

  document.addEventListener('touchmove', function (event) {
    if (!gesture) return;
    if (event.touches.length !== 1 ||
        event.touches[0].identifier !== gesture.id ||
        moved(event.touches[0], gesture)) gesture = null;
  }, { passive: true });

  document.addEventListener('touchend', function (event) {
    var start = gesture;
    gesture = null;
    if (!start || event.defaultPrevented || !event.cancelable ||
        event.touches.length !== 0 || event.changedTouches.length !== 1 ||
        performance.now() - start.time > 350) return;
    var touch = event.changedTouches[0];
    if (touch.identifier !== start.id || moved(touch, start)) return;
    var selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    var active = currentPresentation();
    if (!active || active.presentation !== start.active.presentation ||
        active.svg !== start.active.svg || active.index !== start.active.index ||
        active.level !== start.active.level || interactive(event.target, active.svg)) return;
    var rect = active.svg.getBoundingClientRect();
    if (touch.clientX < rect.left || touch.clientX > rect.right ||
        touch.clientY < rect.top || touch.clientY > rect.bottom) return;

    // Suppress the compatibility click only for a recognized navigation tap.
    // Scrolls, pinches, long presses and interactive elements retain browser defaults.
    event.preventDefault();
    busy = true;
    try {
      active.presentation.processKey(
        touch.clientX < rect.left + rect.width / 2 ? 'left' : 'right',
        function () { busy = false; }
      );
    } catch (error) {
      busy = false;
      throw error;
    }
  }, { passive: false });

  document.addEventListener('touchcancel', function () { gesture = null; },
                            { passive: true });
  window.addEventListener('scroll', function () { gesture = null; }, true);
}());