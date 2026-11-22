(function () {
  JA.page({
    path: '/dashboard/playback/resume',
    title: 'Resume',
    render(el) {
      const { run, sec, row, ibox, badge, tgl, inp, sel, rsec, relatedLink, note, users, num, get, h } = window.PB;
      const icoFor = (t) => (t === 'tvshows' ? 'tv' : t === 'movies' ? 'film' : 'folder');
      return run(el, {
        title: 'Resume',
        sub: 'When a title is offered for resuming',
        load: async () => {
          const uid = window.ApiClient && ApiClient.getCurrentUserId();
          const [cfg, us, libs, resume] = await Promise.all([
            get('System/Configuration'), users(), get('Library/VirtualFolders').catch(() => []),
            uid ? get('Users/' + uid + '/Items/Resume?Limit=20&MediaTypes=Video&EnableTotalRecordCount=true').catch(() => ({ Items: [], TotalRecordCount: 0 })) : { Items: [], TotalRecordCount: 0 }]);
          return { cfg, users: us, libs, resume };
        },
        save: (d) => JA.post('System/Configuration', d.cfg),
        view(d, ui) {
          const c = d.cfg;
          const setN = (k, f) => (v) => { c[k] = f ? f(num(v)) : num(v); ui.refresh(); };
          const num_ = (k, f) => inp(f ? c[k] / 60 : c[k], { num: true, cb: setN(k, f ? (x) => Math.round(x * 60) : null) });
          // Server config has no store for these; they only live in the page until reload.
          const local = (on) => tgl(on, () => {});
          const resumeRows = d.resume.Items.length ? d.resume.Items.map((i) => row(
            (i.SeriesName ? i.SeriesName + ' · ' : '') + i.Name,
            (i.UserData && i.UserData.LastPlayedDate ? 'stopped ' + JA.ago(i.UserData.LastPlayedDate) : 'in progress'),
            badge('Resumable', 'info', 'info'), { py: 11, lead: ibox(i.Type === 'Episode' ? 'tv' : 'film') }))
            : [row('No resume points', 'Nothing is currently in progress', badge('None', 'circle', 'mute'), { py: 11, lead: ibox('film') })];
          return {
            a: [
              sec('history', 'Resume behavior', 'Thresholds for videos', [
                row('Minimum resume percentage', 'Stopped before this point restarts from the beginning', num_('MinResumePct')),
                row('Maximum resume percentage', 'Stopped after this point counts as watched', num_('MaxResumePct')),
                row('Minimum resume duration', 'Shortest runtime in minutes that can be resumed', num_('MinResumeDurationSeconds', true))]),
              sec('activity', 'Tracking', 'How progress is stored', [
                row('Mark as watched at the end', 'Set watched when playback finishes', local(true)),
                row('Track play position', 'Save position every few seconds', local(true)),
                row('Clear resume point on watched', 'Remove from Continue Watching', local(true)),
                row('Sync progress between devices', 'Share the position across clients', local(true))]),
              sec('users', 'Per-user overrides', 'Custom thresholds per account', d.users.map((u) => row(u.Name,
                u.Policy.IsAdministrator ? 'Administrator' : 'User', sel(['Use server default'], 'Use server default', 190), { py: 11, lead: ibox('user') })))
            ],
            b: [
              sec('play', 'Audiobooks and music', 'Thresholds for audio', [
                row('Minimum audiobook resume', 'Minutes before a resume point is saved', num_('MinAudiobookResume')),
                row('Maximum audiobook resume', 'Minutes left that count as finished', num_('MaxAudiobookResume')),
                row('Remember music position', 'Resume long tracks and mixes', local(false))]),
              sec('history', 'Recently resumed', 'Latest resume points', resumeRows),
              sec('library', 'Per library', 'Enable resuming', d.libs.map((l) => row(l.Name, (l.Locations || [])[0] || '', local(true), { py: 11, lead: ibox(icoFor(l.CollectionType)) })))
            ],
            rail: [
              rsec('Summary', [
                ui.sum('Minimum', () => c.MinResumePct + ' %'),
                ui.sum('Maximum', () => c.MaxResumePct + ' %'),
                ui.sum('Minimum duration', () => Math.round(c.MinResumeDurationSeconds / 60) + ' min'),
                ui.sum('Resumable titles', () => String(d.resume.TotalRecordCount ?? d.resume.Items.length))]),
              rsec('Related', [
                relatedLink('wifi', 'Streaming', 'Bitrate limits and subtitles', '/dashboard/playback/streaming'),
                relatedLink('activity', 'Activity', 'Playback events', '/dashboard/activity'),
                relatedLink('users', 'Users', 'Per-user playback settings', '/dashboard/users')]),
              rsec('Notes', [note('info', 'Resume points are stored per user and per device.')])
            ]
          };
        }
      });
    }
  });
})();
