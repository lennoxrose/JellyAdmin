using MediaBrowser.Model.Plugins;

namespace JellyAdmin;

public class PluginConfiguration : BasePluginConfiguration
{
    public bool Enabled { get; set; } = true;
}
