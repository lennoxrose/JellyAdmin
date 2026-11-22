using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JellyAdmin;

[ApiController]
[Route("JellyAdminApi")]
[Authorize(Policy = "RequiresElevation")]
public class AnalyticsController : ControllerBase
{
    private readonly PlayLog _log;
    private readonly Collector _collector;
    public AnalyticsController(PlayLog log, Collector collector) { _log = log; _collector = collector; }

    /// <summary>Finished playbacks that started at or after <paramref name="since"/> (unix ms), plus the ones still running.</summary>
    [HttpGet("Analytics")]
    public ActionResult<List<PlayRecord>> Get([FromQuery] long since = 0) {
        var list = _log.Read(since);
        list.AddRange(_collector.Running().Where(r => r.Start >= since));
        return list;
    }
}
