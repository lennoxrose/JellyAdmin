using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JellyAdmin;

[ApiController]
[Route("JellyAdminApi")]
[Authorize(Policy = "RequiresElevation")]
public class AnalyticsController : ControllerBase
{
    private readonly PlayLog _log;
    public AnalyticsController(PlayLog log) => _log = log;

    /// <summary>Playbacks that started at or after <paramref name="since"/> (unix ms).</summary>
    [HttpGet("Analytics")]
    public ActionResult<List<PlayRecord>> Get([FromQuery] long since = 0) => _log.Read(since);
}
