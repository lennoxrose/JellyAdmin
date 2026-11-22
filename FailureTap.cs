using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;

namespace JellyAdmin;

/// <summary>Jellyfin's stop event has no failure flag, but clients report it in the stop request body, so read it from there.</summary>
public sealed class FailureTap
{
    private readonly RequestDelegate _next;
    private readonly PlayLog _log;

    public FailureTap(RequestDelegate next, PlayLog log) { _next = next; _log = log; }

    public async Task InvokeAsync(HttpContext ctx)
    {
        if (HttpMethods.IsPost(ctx.Request.Method)
            && (ctx.Request.Path.Value ?? "").EndsWith("/Sessions/Playing/Stopped", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Request.EnableBuffering();
            try
            {
                using var doc = await JsonDocument.ParseAsync(ctx.Request.Body);
                if (doc.RootElement.TryGetProperty("Failed", out var f) && f.ValueKind == JsonValueKind.True)
                {
                    var auth = ctx.Request.Headers.Authorization.ToString() + ctx.Request.Headers["X-Emby-Authorization"];
                    var client = Regex.Match(auth, "Client=\"([^\"]*)\"");
                    _log.Append(new PlayRecord
                    {
                        Start = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        Failed = true,
                        ItemId = doc.RootElement.TryGetProperty("ItemId", out var i) ? i.ToString().Replace("-", "") : "",
                        Client = client.Success ? client.Groups[1].Value : ""
                    });
                }
            }
            catch (JsonException) { /* not a JSON body: nothing to record */ }
            finally { ctx.Request.Body.Position = 0; }
        }
        await _next(ctx);
    }
}
