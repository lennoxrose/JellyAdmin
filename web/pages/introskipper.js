/* Intro Skipper plugin config page. Needs jxlib.js/jxlib.css. */
(function () {
  const { h } = window.JA;
  // Config keys: Minimum/MaximumIntroDuration, AnalysisPercent, AutoSkip are real Intro Skipper keys; the rest are best guesses (see defaults).
  const DEF = { AnalyzeIntros: true, AnalyzeCredits: true, MinimumIntroDuration: 15, MaximumIntroDuration: 120, AnalysisPercent: 25,
    ShowSkipButton: true, AutoSkip: false, SkipButtonDuration: 10, RememberLastPosition: true };

  JA.page({
    path: '/dashboard/introskipper', title: 'Intro Skipper',
    render(el) {
      const X = window.JX;
      const T = 'Intro Skipper', S = 'Detect intros and credits so clients can skip them';
      el.replaceChildren(h('div', { class: 'jx-page' }, h('div', { class: 'jx-missing', text: 'Loading...' })));
      X.loadPlugin(/intro.?skipper/i).then((r) => {
        if (!r) return el.replaceChildren(X.missing(T, S, 'Intro Skipper'));
        const { plugin, cfg } = r;
        const c = { ...DEF, ...cfg };
        const bool = (k) => X.switchEl(c[k], (v) => { c[k] = v; });
        const n = (k) => X.numInput(c[k], (v) => { c[k] = v; });
        const save = () => X.saveCfg(plugin, { ...cfg, ...c }).then(() => X.toast('Saved')).catch((e) => X.toast(e.message, 'error'));
        const v = plugin.Version || '';
        el.replaceChildren(h('div', { class: 'jx-page' },
          X.head(T, S, [X.jbtn('Analyze now', 'play', false, () => window.JA.go('/dashboard/tasks')), X.jbtn('Save changes', 'save', true, save)]),
          h('div', { class: 'jx-cols' },
            h('div', { class: 'jx-main' },
              h('div', { class: 'jx-stats' },
                X.stat('film', 'Episodes analyzed', '-', 'all libraries', true), X.stat('stat-skip', 'Intros found', '-', ''),
                X.stat('stat-skip', 'Credits found', '-', ''), X.stat('clock', 'Last analysis', '-', '')),
              X.section('zap', 'Detection', 'Audio fingerprinting', [
                X.rowOf('Analyze intros', 'Find the opening sequence', bool('AnalyzeIntros')),
                X.rowOf('Analyze credits', 'Find the end credits', bool('AnalyzeCredits')),
                X.rowOf('Minimum intro length', 'Seconds', n('MinimumIntroDuration')),
                X.rowOf('Maximum intro length', 'Seconds', n('MaximumIntroDuration')),
                X.rowOf('Analysis percent', 'Share of episode scanned for intros', n('AnalysisPercent'))]),
              X.section('skip-fwd', 'Skip button', 'What viewers see', [
                X.rowOf('Show skip button', 'Display it while an intro plays', bool('ShowSkipButton')),
                X.rowOf('Auto skip intros', 'Skip without asking', bool('AutoSkip')),
                X.rowOf('Button duration', 'Seconds the button stays visible', n('SkipButtonDuration')),
                X.rowOf('Remember last position', 'Resume after skipping', bool('RememberLastPosition'))])),
            h('div', { class: 'jx-rail' },
              X.railSec('Summary', null, null, [X.kv('Version', v)]),
              X.railSec('Related', null, null, [
                X.link('plug', 'Plugins', 'Installed plugins', '/dashboard/plugins'),
                X.link('clock', 'Scheduled Tasks', 'Intro Skipper Analysis', '/dashboard/tasks'),
                X.link('library', 'Libraries', 'Select libraries', '/dashboard/libraries')]),
              X.railSec('Notes', null, null, [
                X.note('info', 'Analysis runs automatically after library scans.'),
                X.note('alert', 'Detection needs at least two episodes per season.')])))));
      }).catch((e) => el.replaceChildren(h('pre', { class: 'ja-error', text: e.message })));
    }
  });
})();
