(function () {
  const HW = [['none', 'None'], ['amf', 'AMD AMF'], ['nvenc', 'Nvidia NVENC'], ['qsv', 'Intel QuickSync (QSV)'], ['vaapi', 'Video Acceleration API (VAAPI)'], ['rkmpp', 'Rockchip MPP (RKMPP)'], ['videotoolbox', 'Apple VideoToolbox'], ['v4l2m2m', 'Video4Linux2 (V4L2)']];
  const TONE = ['none', 'clip', 'linear', 'gamma', 'reinhard', 'hable', 'mobius', 'bt2390'].map((v) => [v, v === 'bt2390' ? 'BT.2390' : v.charAt(0).toUpperCase() + v.slice(1)]);
  const PRESET = ['auto', 'placebo', 'veryslow', 'slower', 'slow', 'medium', 'fast', 'faster', 'veryfast', 'superfast', 'ultrafast'].map((v) => [v, v.charAt(0).toUpperCase() + v.slice(1)]);
  const THREADS = [[0, 'Auto'], 1, 2, 4, 6, 8, 12, 16];
  const DEC = [['Decode H264', 'h264'], ['Decode HEVC', 'hevc'], ['Decode VP9', 'vp9'], ['Decode AV1', 'av1']];

  JA.page({
    path: '/dashboard/playback/transcoding',
    title: 'Transcoding',
    render(el) {
      const { run, sec, row, ibox, badge, tgl, inp, sel, rsec, relatedLink, note, poll, users, savePolicies, num, h, get } = window.PB;
      return run(el, {
        title: 'Transcoding',
        sub: 'Hardware acceleration, encoding quality and transcode paths',
        load: async () => ({ enc: await get('System/Configuration/encoding'), users: await users(), orig: {} }),
        save: async (d) => {
          await JA.post('System/Configuration/encoding', d.enc);
          await savePolicies(d.users, (u) => u._dirty);
        },
        view(d, ui) {
          const e = d.enc;
          e.HardwareDecodingCodecs = e.HardwareDecodingCodecs || [];
          const set = (k) => (v) => { e[k] = v; ui.refresh(); };
          const text = (k, w) => inp(e[k] || '', { w, cb: set(k) });
          const devKey = () => (e.HardwareAccelerationType === 'qsv' ? 'QsvDevice' : 'VaapiDevice');
          const dec = (code) => tgl(e.HardwareDecodingCodecs.includes(code), (on) => {
            const s = new Set(e.HardwareDecodingCodecs); on ? s.add(code) : s.delete(code); e.HardwareDecodingCodecs = [...s];
          });
          const hwLabel = () => (HW.find((x) => x[0] === e.HardwareAccelerationType) || [0, 'None'])[1];

          const live = h('div', { class: 'pb-rows' });
          const drawLive = async () => {
            let s = [];
            try { s = (await get('Sessions')).filter((x) => x.NowPlayingItem && x.TranscodingInfo && !(x.TranscodingInfo.IsVideoDirect && x.TranscodingInfo.IsAudioDirect)); } catch (err) { /* keep old */ }
            live.replaceChildren(...(s.length ? s.map((x) => {
              const t = x.TranscodingInfo;
              return [row(x.NowPlayingItem.Name, x.UserName + ' · ' + [t.VideoCodec, t.AudioCodec].filter(Boolean).join(' / ') + (t.TranscodeReasons && t.TranscodeReasons.length ? ' · ' + t.TranscodeReasons.join(', ') : ''),
                badge('Running', 'circle', 'info'), { py: 11, lead: ibox('video') })];
            }).flat() : [row('No active transcodes', 'Transcodes appear here while someone is watching', null, { py: 14, lead: window.JA.icon('circle-check', 16) })]));
          };
          poll(ui, drawLive, 5000);

          const userRow = (u) => {
            const p = u.Policy;
            const cur = () => (p.EnableVideoPlaybackTranscoding === false ? 'off' : 'default');
            return row(u.Name, p.IsAdministrator ? 'Administrator' : 'User',
              sel([['default', 'Use server default'], ['off', 'Transcoding disabled']], cur(), 190, (v) => {
                const on = v !== 'off';
                p.EnableVideoPlaybackTranscoding = on; p.EnableAudioPlaybackTranscoding = on; u._dirty = true;
              }), { py: 11, lead: ibox('user') });
          };

          return {
            a: [
              sec('cpu', 'Hardware acceleration', 'Offload work to your GPU', [
                row('Hardware acceleration', 'Method used for transcoding', sel(HW, e.HardwareAccelerationType || 'none', 220, (v) => { e.HardwareAccelerationType = v; ui.refresh(); })),
                row('Device path', 'Render device for VAAPI or QSV', inp(e[devKey()] || '', { w: 220, cb: (v) => { e[devKey()] = v; } })),
                ...DEC.map(([t, c]) => row(t, 'Hardware decoding', dec(c)))]),
              sec('folder', 'Paths and limits', 'Where transcodes are written', [
                row('Transcode path', 'Temporary transcode files', text('TranscodingTempPath', 260)),
                row('FFmpeg path', 'Location of the ffmpeg binary', inp(e.EncoderAppPathDisplay || e.EncoderAppPath || '', { w: 260, cb: (v) => { e.EncoderAppPath = v; e.EncoderAppPathDisplay = v; ui.refresh(); } })),
                row('Thread count', 'Threads used while encoding', sel(THREADS, e.EncodingThreadCount > 0 ? e.EncodingThreadCount : 0, 160, (v) => { e.EncodingThreadCount = num(v); })),
                row('Throttle transcodes', 'Pause when far ahead of playback', tgl(e.EnableThrottling, set('EnableThrottling'))),
                row('Delete segments', 'Remove segments after playback', tgl(e.EnableSegmentDeletion, set('EnableSegmentDeletion')))])
            ],
            b: [
              sec('video', 'Encoding', 'Quality and codecs', [
                row('Allow HEVC encoding', 'Smaller files, needs client support', tgl(e.AllowHevcEncoding, set('AllowHevcEncoding'))),
                row('Tone mapping', 'Convert HDR to SDR during transcodes', tgl(e.EnableTonemapping, set('EnableTonemapping'))),
                row('Tone mapping algorithm', 'How HDR is mapped', sel(TONE, e.TonemappingAlgorithm || 'bt2390', 160, set('TonemappingAlgorithm'))),
                row('Encoding preset', 'Trade speed for quality', sel(PRESET, e.EncoderPreset || 'auto', 160, set('EncoderPreset'))),
                row('H.264 CRF', 'Lower is better quality', inp(e.H264Crf, { num: true, cb: (v) => { e.H264Crf = num(v); } })),
                row('H.265 CRF', 'Lower is better quality', inp(e.H265Crf, { num: true, cb: (v) => { e.H265Crf = num(v); } }))]),
              sec('activity', 'Active transcodes', 'Running right now', [live]),
              sec('users', 'Per-user overrides', 'Limit transcoding per account', d.users.map(userRow))
            ],
            rail: [
              rsec('Summary', [
                ui.sum('Acceleration', hwLabel),
                ui.sum('HEVC encoding', () => (e.AllowHevcEncoding ? 'On' : 'Off')),
                ui.sum('Tone mapping', () => (e.EnableTonemapping ? 'On' : 'Off')),
                ui.sum('Transcode cache', () => e.TranscodingTempPath || '-'),
                ui.sum('FFmpeg', () => { const p = e.EncoderAppPathDisplay || e.EncoderAppPath || ''; return /jellyfin-ffmpeg/.test(p) ? 'jellyfin-ffmpeg' : (p.split(/[\\/]/).pop() || '-'); })]),
              rsec('Related', [
                relatedLink('wifi', 'Streaming', 'Bitrate limits and subtitles', '/dashboard/playback/streaming'),
                relatedLink('image', 'Trickplay', 'Scrubbing thumbnails', '/dashboard/playback/trickplay'),
                relatedLink('clock', 'Scheduled Tasks', 'Clean transcode directory', '/dashboard/tasks')]),
              rsec('Notes', [
                note('info', 'Hardware acceleration needs a render device passed into the container.'),
                note('alert', 'Enabling HEVC encoding can break playback on older clients.')])
            ]
          };
        }
      });
    }
  });
})();
