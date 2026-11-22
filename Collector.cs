using System.Collections.Concurrent;
using MediaBrowser.Controller.Entities.TV;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Session;
using Microsoft.Extensions.Hosting;

namespace JellyAdmin;

/// <summary>Listens to playback events and writes one PlayRecord per finished playback.</summary>
public sealed class Collector : IHostedService
{
    private const int MinSecs = 20;      // same cut-off as the Playback Reporting plugin: shorter plays are accidental starts
    private const double MaxGap = 30;    // progress reports arrive every ~10s; a longer gap means the client was gone

    private sealed class Live
    {
        public long Start; public long Last; public bool Paused; public double Secs;
        public int Method; public int Kbps; public string? Reasons;
    }

    private readonly ISessionManager _sessions;
    private readonly PlayLog _log;
    private readonly ConcurrentDictionary<string, Live> _live = new();

    public Collector(ISessionManager sessions, PlayLog log) { _sessions = sessions; _log = log; }

    public Task StartAsync(CancellationToken ct)
    {
        _sessions.PlaybackStart += OnStart;
        _sessions.PlaybackProgress += OnProgress;
        _sessions.PlaybackStopped += OnStop;
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken ct)
    {
        _sessions.PlaybackStart -= OnStart;
        _sessions.PlaybackProgress -= OnProgress;
        _sessions.PlaybackStopped -= OnStop;
        return Task.CompletedTask;
    }

    // Same key shape as Playback Reporting: device + first user + item.
    private static string Key(PlaybackProgressEventArgs e) => e.DeviceId + "|" + e.Users?.FirstOrDefault()?.Id.ToString("N") + "|" + e.Item?.Id.ToString("N");
    private static bool Trackable(PlaybackProgressEventArgs e) => e.Item != null && !e.Item.IsThemeMedia && e.Users is { Count: > 0 };
    private static long Now() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    private static void Snapshot(Live l, PlaybackProgressEventArgs e)
    {
        var s = e.Session;
        var method = s?.PlayState?.PlayMethod;
        if (method != null) l.Method = method == MediaBrowser.Model.Session.PlayMethod.Transcode ? 2 : method == MediaBrowser.Model.Session.PlayMethod.DirectStream ? 1 : 0;
        var t = s?.TranscodingInfo;
        var bps = t?.Bitrate ?? s?.NowPlayingItem?.MediaSources?.FirstOrDefault()?.Bitrate;
        if (bps > 0) l.Kbps = (int)(bps.Value / 1000);
        if (t != null && l.Method == 2) l.Reasons = t.TranscodeReasons.ToString();
    }

    private void OnStart(object? sender, PlaybackProgressEventArgs e)
    {
        if (!Trackable(e)) return;
        var now = Now();
        var l = new Live { Start = now, Last = now, Paused = e.IsPaused };
        Snapshot(l, e);
        // Same item started again on the same device: close out the earlier play first.
        if (_live.TryRemove(Key(e), out var old)) { Tick(old); Save(old, e); }
        _live[Key(e)] = l;
    }

    private void OnProgress(object? sender, PlaybackProgressEventArgs e)
    {
        if (!Trackable(e)) return;
        var l = _live.GetOrAdd(Key(e), _ => new Live { Start = Now(), Last = Now() });
        Tick(l);
        l.Paused = e.IsPaused;
        Snapshot(l, e);
    }

    private static void Tick(Live l)
    {
        var now = Now();
        if (!l.Paused) l.Secs += Math.Min((now - l.Last) / 1000.0, MaxGap);
        l.Last = now;
    }

    private void OnStop(object? sender, PlaybackStopEventArgs e)
    {
        if (!Trackable(e) || !_live.TryRemove(Key(e), out var l)) return;
        Tick(l);
        Save(l, e);
    }

    private void Save(Live l, PlaybackProgressEventArgs e)
    {
        if (l.Secs < MinSecs) return;
        _log.Append(new PlayRecord
        {
            Start = l.Start,
            User = e.Users.First().Id.ToString("N"),
            ItemId = e.Item!.Id.ToString("N"),
            Kind = e.Item.GetType().Name,
            Name = e.Item.Name ?? "",
            Series = (e.Item as Episode)?.SeriesName,
            Client = e.ClientName ?? "",
            Device = e.DeviceName ?? "",
            Method = l.Method,
            Secs = (int)l.Secs,
            Kbps = l.Kbps,
            Reasons = l.Reasons
        });
    }
}
