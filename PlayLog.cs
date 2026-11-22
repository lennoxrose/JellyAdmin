using System.Text.Json;
using System.Text.Json.Serialization;
using MediaBrowser.Common.Configuration;

namespace JellyAdmin;

/// <summary>One finished playback, as stored in the log and sent to the Analytics page.</summary>
public sealed class PlayRecord
{
    [JsonPropertyName("t")] public long Start { get; set; }          // unix ms
    [JsonPropertyName("u")] public string User { get; set; } = "";
    [JsonPropertyName("i")] public string ItemId { get; set; } = "";
    [JsonPropertyName("k")] public string Kind { get; set; } = "";   // Movie, Episode, TvChannel...
    [JsonPropertyName("n")] public string Name { get; set; } = "";
    [JsonPropertyName("s")] public string? Series { get; set; }
    [JsonPropertyName("c")] public string Client { get; set; } = "";
    [JsonPropertyName("d")] public string Device { get; set; } = "";
    [JsonPropertyName("m")] public int Method { get; set; }          // 0 direct play, 1 direct stream, 2 transcode
    [JsonPropertyName("secs")] public int Secs { get; set; }         // time actually watched
    [JsonPropertyName("kbps")] public int Kbps { get; set; }         // stream bitrate
    [JsonPropertyName("r")] public string? Reasons { get; set; }     // transcode reasons
    [JsonPropertyName("f")] public bool Failed { get; set; }         // client reported the playback as failed (no watched time)
}

/// <summary>Append-only JSON-lines file in the server data folder.</summary>
public sealed class PlayLog
{
    private readonly string _path;
    private readonly object _gate = new();

    public PlayLog(IApplicationPaths paths) => _path = Path.Combine(paths.DataPath, "jellyadmin-playback.jsonl");

    public void Append(PlayRecord r)
    {
        var line = JsonSerializer.Serialize(r) + "\n";
        lock (_gate) File.AppendAllText(_path, line);
    }

    public List<PlayRecord> Read(long since)
    {
        var list = new List<PlayRecord>();
        lock (_gate)
        {
            if (!File.Exists(_path)) return list;
            foreach (var line in File.ReadLines(_path))
            {
                try
                {
                    var r = JsonSerializer.Deserialize<PlayRecord>(line);
                    if (r != null && r.Start >= since) list.Add(r);
                }
                catch (JsonException) { /* skip a torn or corrupt line */ }
            }
        }
        return list;
    }
}
