using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace JellyAdmin;

/// <summary>Serves /JellyAdmin/style.css and adds a link to it in the web client's index.html.</summary>
public class CssMiddleware
{
    private const string Link = "<link rel=\"stylesheet\" href=\"/JellyAdmin/style.css\"></head>";
    private readonly RequestDelegate _next;

    public CssMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext ctx)
    {
        var path = ctx.Request.Path.Value ?? "";
        var enabled = Plugin.Instance?.Configuration.Enabled ?? false;

        if (enabled && path.Equals("/JellyAdmin/style.css", StringComparison.OrdinalIgnoreCase))
        {
            using var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("JellyAdmin.style.css")!;
            ctx.Response.ContentType = "text/css";
            ctx.Response.Headers.CacheControl = "no-cache";
            await s.CopyToAsync(ctx.Response.Body);
            return;
        }

        if (!enabled
            || (!path.EndsWith("/web/index.html", StringComparison.OrdinalIgnoreCase)
                && !path.TrimEnd('/').EndsWith("/web", StringComparison.OrdinalIgnoreCase)))
        {
            await _next(ctx);
            return;
        }

        // Need plain text to rewrite, so ask downstream not to compress.
        // Also drop conditional headers: a 304 has no body to rewrite and the browser would reuse its unpatched cached copy.
        ctx.Request.Headers.Remove("Accept-Encoding");
        ctx.Request.Headers.Remove("If-None-Match");
        ctx.Request.Headers.Remove("If-Modified-Since");
        ctx.Request.Headers.Remove("Range");
        var original = ctx.Response.Body;
        using var buffer = new MemoryStream();
        ctx.Response.Body = buffer;
        try { await _next(ctx); }
        finally { ctx.Response.Body = original; }

        buffer.Position = 0;
        var isHtml = ctx.Response.StatusCode == 200
            && (ctx.Response.ContentType?.Contains("text/html", StringComparison.OrdinalIgnoreCase) ?? false)
            && !ctx.Response.Headers.ContainsKey("Content-Encoding");
        if (!isHtml)
        {
            await buffer.CopyToAsync(original);
            return;
        }

        var html = new StreamReader(buffer, Encoding.UTF8).ReadToEnd().Replace("</head>", Link);
        var bytes = Encoding.UTF8.GetBytes(html);
        ctx.Response.ContentLength = bytes.Length;
        ctx.Response.Headers.ETag = default;
        ctx.Response.Headers.CacheControl = "no-cache";
        ctx.Response.Headers["X-JellyAdmin"] = "injected";
        await original.WriteAsync(bytes);
    }
}
