/**
 * topbar seat: a compact transport pinned to the window title bar.
 *
 * The sidebar entry keeps its note icon; its hover controls are hidden by CSS
 * (see `.mp-side-extras` in 90-theme.js) because on some DSH builds the host
 * row is not positioned and they escape to the far right edge of the window.
 */

var TOP_BANDS = [0, 2, 4, 8, 14, 24, 40, 64, 96]

function TopBarPlayer() {
  var snap = usePlayerSnapshot()
  var track = snap.queue[snap.index] || null
  var levelPair = useState([0, 0, 0, 0, 0, 0, 0, 0])
  var levels = levelPair[0]
  var setLevels = levelPair[1]

  useEffect(
    function () {
      if (snap.playing !== true || snap.queue.length === 0) {
        setLevels([0, 0, 0, 0, 0, 0, 0, 0])
        return undefined
      }
      var frame = 0
      var last = 0
      function tick(now) {
        if (now - last >= 80) {
          last = now
          var data = player.getWave()
          if (data !== null) {
            var next = []
            for (var band = 0; band < TOP_BANDS.length - 1; band += 1) {
              var start = TOP_BANDS[band]
              var end = Math.min(TOP_BANDS[band + 1], data.length)
              var sum = 0
              for (var i = start; i < end; i += 1) sum += data[i]
              var avg = end > start ? sum / (end - start) : 0
              next.push(Math.min(0.96, Math.pow(Math.max(0, (avg - 2) / 255), 1.55)))
            }
            setLevels(next)
          }
        }
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      return function () {
        cancelAnimationFrame(frame)
      }
    },
    [snap.playing, snap.queue.length],
  )

  if (track === null) return null

  function control(key, name, title, run) {
    return h(
      'button',
      {
        key: key,
        type: 'button',
        className: 'mp-tp-btn',
        title: title,
        'aria-label': title,
        onClick: function (event) {
          event.preventDefault()
          event.stopPropagation()
          run()
        },
      },
      icon(name, 13),
    )
  }

  return h(
    'div',
    { className: 'mp-tp', 'data-mp-topbar': 'true' },
    h(
      'span',
      { className: 'mp-tp-wave', 'aria-hidden': 'true' },
      levels.map(function (level, index) {
        return h('i', { key: index, style: { height: Math.round(3 + level * 15) + 'px' } })
      }),
    ),
    control('prev', 'prev', t('page.prev'), function () {
      player.prev()
    }),
    control('toggle', snap.playing ? 'pause' : 'play', snap.playing ? t('page.pause') : t('page.play'), function () {
      player.toggle()
    }),
    control('next', 'next', t('page.next'), function () {
      player.next()
    }),
    h('span', { className: 'mp-tp-title' }, trackTitleOf(track)),
  )
}
