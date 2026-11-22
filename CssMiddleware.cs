using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace JellyAdmin;

/// <summary>Serves embedded files under /JellyAdmin/ and links them into the web client's index.html.</summary>
public class CssMiddleware
{
    private const string Prefix = "/JellyAdmin/";
    private static readonly Assembly Asm = Assembly.GetExecutingAssembly();
    // MSBuild writes RecursiveDir with backslashes on Windows, so key by the slash-normalised name.
    private static readonly Dictionary<string, string> Resources =
        Asm.GetManifestResourceNames().ToDictionary(n => n.Replace('\\', '/'), n => n, StringComparer.OrdinalIgnoreCase);
    private static readonly Lazy<string> Tags = new(BuildTags);
    private readonly RequestDelegate _next;

    public CssMiddleware(RequestDelegate next) => _next = next;

    // Core first, then every page module. Files dropped into web/pages are picked up automatically.
    private static string BuildTags()
    {
        var names = Resources.Keys.Where(n => n.StartsWith("web/", StringComparison.OrdinalIgnoreCase)).OrderBy(n => n).ToList();
        var sb = new StringBuilder();
        foreach (var n in names.Where(n => n == "web/style.css" || n == "web/core.css" || n == "web/stock.css" || (n.StartsWith("web/pages/") && n.EndsWith(".css"))))
            sb.Append($"<link rel=\"stylesheet\" href=\"{Prefix}{n[4..]}\">");
        foreach (var n in names.Where(n => n == "web/core.js"))
            sb.Append($"<script src=\"{Prefix}{n[4..]}\"></script>");
        foreach (var n in names.Where(n => n.StartsWith("web/pages/") && n.EndsWith(".js")))
            sb.Append($"<script src=\"{Prefix}{n[4..]}\"></script>");
        return sb + "</head>";
    }

    private static string ContentType(string name) => Path.GetExtension(name).ToLowerInvariant() switch
    {
        ".css" => "text/css",
        ".js" => "application/javascript",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".woff2" => "font/woff2",
        _ => "application/octet-stream"
    };

    public async Task InvokeAsync(HttpContext ctx)
    {
        var path = ctx.Request.Path.Value ?? "";
        var enabled = Plugin.Instance?.Configuration.Enabled ?? false;

        if (enabled && path.StartsWith(Prefix, StringComparison.OrdinalIgnoreCase))
        {
            var name = "web/" + path[Prefix.Length..];
            if (Resources.TryGetValue(name, out var match))
            {
                using var s = Asm.GetManifestResourceStream(match)!;
                ctx.Response.ContentType = ContentType(name);
                ctx.Response.Headers.CacheControl = "no-cache";
                await s.CopyToAsync(ctx.Response.Body);
                return;
            }
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

        var html = new StreamReader(buffer, Encoding.UTF8).ReadToEnd().Replace("</head>", Tags.Value);
        var bytes = Encoding.UTF8.GetBytes(html);
        ctx.Response.ContentLength = bytes.Length;
        ctx.Response.Headers.ETag = default;
        ctx.Response.Headers.CacheControl = "no-cache";
        ctx.Response.Headers["X-JellyAdmin"] = "injected";
        await original.WriteAsync(bytes);
    }
}
