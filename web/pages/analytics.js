/* Analytics page (Figma 31:1047). Markup is a 1:1 conversion of the design at its 1656x1028 content size; figures are the design's sample data (no analytics API exists in Jellyfin core). */
(function () {
  const { h } = window.JA;
  const B = '/JellyAdmin/';
  const HTML = `
<p style="position:absolute;font-weight:700;line-height:normal;left:48px;color:#ededed;font-size:20px;top:24px;letter-spacing:-0.4px;white-space:nowrap">Analytics</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:48px;color:#7a7a7a;font-size:11px;top:52px;white-space:nowrap">Playback, bandwidth and library insights across all users and devices</p>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:32px;left:1296px;border-radius:6px;top:24px;width:244px"></div>
<p style="transform:translateX(-50%);position:absolute;font-weight:500;line-height:normal;left:1321px;color:#7a7a7a;font-size:11px;text-align:center;top:33px;width:46px">24h</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:500;line-height:normal;left:1369px;color:#7a7a7a;font-size:11px;text-align:center;top:33px;width:46px">7d</p>
<div style="position:absolute;background:#ededed;height:28px;left:1394px;border-radius:4px;top:26px;width:46px"></div>
<p style="transform:translateX(-50%);position:absolute;font-weight:500;line-height:normal;left:1417px;color:#0d0d0d;font-size:11px;text-align:center;top:33px;width:46px">30d</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:500;line-height:normal;left:1465px;color:#7a7a7a;font-size:11px;text-align:center;top:33px;width:46px">90d</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:500;line-height:normal;left:1513px;color:#7a7a7a;font-size:11px;text-align:center;top:33px;width:46px">1y</p>
<div style="position:absolute;background:#ededed;height:32px;left:1552px;border-radius:6px;top:24px;width:56px"></div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:1580px;color:#0d0d0d;font-size:11px;text-align:center;top:33px;width:56px">Export</p>
<div style="position:absolute;background:#1f1f1f;height:1px;left:48px;top:86px;width:1560px"></div>
<div style="position:absolute;background:#1f1f1f;height:1px;left:48px;top:196px;width:1560px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:48px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">PLAYS</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:48px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">48,291</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:48px;color:#4ade80;font-size:11px;top:160px;white-space:nowrap">+12.4%</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:98px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:23.552px;left:158px;top:109.45px;width:100px">
<div style="position:absolute;inset:-3.19% -0.75%">
<img alt="" src="__B__icons/an/spark.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#1f1f1f;height:111px;left:308px;top:86px;width:1px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:332px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">WATCH TIME</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:332px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">1,942 h</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:332px;color:#4ade80;font-size:11px;top:160px;white-space:nowrap">+8.1%</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:375px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:19.259px;left:442px;top:108.37px;width:100px">
<div style="position:absolute;inset:-3.9% -0.75%">
<img alt="" src="__B__icons/an/spark1.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#1f1f1f;height:111px;left:568px;top:86px;width:1px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:592px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">ACTIVE USERS</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:592px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">37</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:592px;color:#4ade80;font-size:11px;top:160px;white-space:nowrap">+3</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:614px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:20.913px;left:702px;top:108.63px;width:100px">
<div style="position:absolute;inset:-3.59% -0.75%">
<img alt="" src="__B__icons/an/spark2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#1f1f1f;height:111px;left:828px;top:86px;width:1px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:852px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">BANDWIDTH</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:852px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">2.84 TB</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:852px;color:#f5b942;font-size:11px;top:160px;white-space:nowrap">+21.6%</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:902px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:18.214px;left:962px;top:110.56px;width:100px">
<div style="position:absolute;inset:-4.12% -0.75%">
<img alt="" src="__B__icons/an/spark3.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#1f1f1f;height:111px;left:1088px;top:86px;width:1px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:1112px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">TRANSCODES</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:1112px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">6.2%</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:1112px;color:#4ade80;font-size:11px;top:160px;white-space:nowrap">-1.4%</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:1155px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:19.364px;left:1222px;top:109.89px;width:100px">
<div style="position:absolute;inset:-3.87% -0.75%">
<img alt="" src="__B__icons/an/spark4.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#1f1f1f;height:111px;left:1348px;top:86px;width:1px"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:1372px;color:#7a7a7a;font-size:10px;top:102px;letter-spacing:0.6px;white-space:nowrap">FAILED STREAMS</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:1372px;color:#ededed;font-size:26px;top:122px;letter-spacing:-0.8px;white-space:nowrap">0.7%</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:1372px;color:#f87171;font-size:11px;top:160px;white-space:nowrap">+0.2%</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:1415px;color:#7a7a7a;font-size:10px;top:160px;white-space:nowrap">vs prev. period</p>
<div style="position:absolute;height:19.699px;left:1482px;top:108.52px;width:100px">
<div style="position:absolute;inset:-3.81% -0.75%">
<img alt="" src="__B__icons/an/spark5.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:308px;left:48px;border-radius:8px;top:218px;width:1020px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Playback activity</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Plays per day · stacked by media type</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:1001px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">Last 30 days</p>
<div style="position:absolute;height:0;left:61px;top:69px;width:930px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:55px;color:#7a7a7a;font-size:9px;text-align:right;top:63px;width:34px">600</p>
<div style="position:absolute;height:0;left:61px;top:114px;width:930px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:55px;color:#7a7a7a;font-size:9px;text-align:right;top:108px;width:34px">450</p>
<div style="position:absolute;height:0;left:61px;top:159px;width:930px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:55px;color:#7a7a7a;font-size:9px;text-align:right;top:153px;width:34px">300</p>
<div style="position:absolute;height:0;left:61px;top:204px;width:930px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:55px;color:#7a7a7a;font-size:9px;text-align:right;top:198px;width:34px">150</p>
<div style="position:absolute;height:0;left:61px;top:249px;width:930px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid1.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:55px;color:#7a7a7a;font-size:9px;text-align:right;top:243px;width:34px">0</p>
<div style="position:absolute;height:73.005px;left:61px;top:104.99px;width:930px">
<div style="position:absolute;inset:-0.68% 0 -0.69% 0">
<img alt="" src="__B__icons/an/area.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:55.608px;left:61px;top:104.99px;width:930px">
<div style="position:absolute;inset:-1.8% -0.11%">
<img alt="" src="__B__icons/an/line.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:84.566px;left:61px;top:127.74px;width:930px">
<div style="position:absolute;inset:-0.59% 0 -0.61% 0">
<img alt="" src="__B__icons/an/area1.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:51.311px;left:61px;top:127.74px;width:930px">
<div style="position:absolute;inset:-1.95% -0.11%">
<img alt="" src="__B__icons/an/line1.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:75.633px;left:61px;top:173.37px;width:930px">
<div style="position:absolute;inset:-0.66% 0">
<img alt="" src="__B__icons/an/area2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:39.188px;left:61px;top:173.37px;width:930px">
<div style="position:absolute;inset:-2.55% -0.11%">
<img alt="" src="__B__icons/an/line2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:51px;color:#7a7a7a;font-size:9px;top:259px;white-space:nowrap">Oct 23</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:267.28px;color:#7a7a7a;font-size:9px;top:259px;white-space:nowrap">Oct 30</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:483.56px;color:#7a7a7a;font-size:9px;top:259px;white-space:nowrap">Nov 6</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:699.84px;color:#7a7a7a;font-size:9px;top:259px;white-space:nowrap">Nov 13</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:916.12px;color:#7a7a7a;font-size:9px;top:259px;white-space:nowrap">Nov 20</p>
<div style="position:absolute;left:17px;width:8px;height:8px;top:284px">
<img alt="" src="__B__icons/an/key.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:31px;color:#a8a8a8;font-size:10px;top:281px;white-space:nowrap">Movies</p>
<div style="position:absolute;left:88.8px;width:8px;height:8px;top:284px">
<img alt="" src="__B__icons/an/key1.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:102.8px;color:#a8a8a8;font-size:10px;top:281px;white-space:nowrap">Shows</p>
<div style="position:absolute;left:154.3px;width:8px;height:8px;top:284px">
<img alt="" src="__B__icons/an/key2.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:168.3px;color:#a8a8a8;font-size:10px;top:281px;white-space:nowrap">Live TV</p>
<div style="position:absolute;height:180px;left:606.17px;top:69px;width:0">
<div style="position:absolute;inset:0 -0.5px">
<img alt="" src="__B__icons/an/marker.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;left:602.17px;width:8px;height:8px;top:124.33px">
<img alt="" src="__B__icons/an/peak.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<div style="position:absolute;background:#141414;border:1px solid;border-color:#2a2a2a;height:40px;left:616.17px;border-radius:6px;top:75px;width:128px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:626.17px;color:#7a7a7a;font-size:9px;top:81px;white-space:nowrap">Nov 9</p>
<p style="position:absolute;font-weight:700;line-height:normal;left:626.17px;color:#ededed;font-size:11px;top:95px;white-space:nowrap">612 plays</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:308px;left:1092px;border-radius:8px;top:218px;width:516px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Playback method</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Direct vs. transcoded</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:497px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">Last 30 days</p>
<div style="position:absolute;left:39px;width:160px;height:160px;top:89px">
<div style="position:absolute;inset:0 0 0 27.68%">
<img alt="" src="__B__icons/an/segdirectplay.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;left:39px;width:160px;height:160px;top:89px">
<div style="position:absolute;inset:22.25% 67.82% 6.18% 0">
<img alt="" src="__B__icons/an/segdirectstream.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;left:39px;width:160px;height:160px;top:89px">
<div style="position:absolute;inset:0 51.48% 71.75% 9.55%">
<img alt="" src="__B__icons/an/segtranscode.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:119px;color:#ededed;font-size:22px;text-align:center;top:151px;letter-spacing:-0.5px;width:100px">48.3k</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:119px;color:#7a7a7a;font-size:10px;text-align:center;top:179px;width:100px">total plays</p>
<div style="position:absolute;left:259px;width:10px;height:10px;top:98px">
<img alt="" src="__B__icons/an/key3.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:500;line-height:normal;left:277px;color:#ededed;font-size:12px;top:95px;white-space:nowrap">Direct Play</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:700;line-height:normal;left:497px;font-size:12px;text-align:right;color:#fff;top:95px;width:78px">58%</p>
<div style="position:absolute;background:#1a1a1a;height:4px;left:277px;border-radius:2px;top:119px;width:220px"></div>
<div style="position:absolute;background:#4ade80;height:4px;left:277px;border-radius:2px;top:119px;width:127.6px"></div>
<div style="position:absolute;left:259px;width:10px;height:10px;top:156px">
<img alt="" src="__B__icons/an/key4.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:500;line-height:normal;left:277px;color:#ededed;font-size:12px;top:153px;white-space:nowrap">Direct Stream</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:700;line-height:normal;left:497px;font-size:12px;text-align:right;color:#fff;top:153px;width:78px">27%</p>
<div style="position:absolute;background:#1a1a1a;height:4px;left:277px;border-radius:2px;top:177px;width:220px"></div>
<div style="position:absolute;background:#00a4dc;height:4px;left:277px;border-radius:2px;top:177px;width:59.4px"></div>
<div style="position:absolute;left:259px;width:10px;height:10px;top:214px">
<img alt="" src="__B__icons/an/key5.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:500;line-height:normal;left:277px;color:#ededed;font-size:12px;top:211px;white-space:nowrap">Transcode</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:700;line-height:normal;left:497px;font-size:12px;text-align:right;color:#fff;top:211px;width:78px">15%</p>
<div style="position:absolute;background:#1a1a1a;height:4px;left:277px;border-radius:2px;top:235px;width:220px"></div>
<div style="position:absolute;background:#f5b942;height:4px;left:277px;border-radius:2px;top:235px;width:33px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:281px;white-space:nowrap">Transcode reasons: subtitles (41%), audio codec (33%), bitrate (26%)</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:244px;left:48px;border-radius:8px;top:548px;width:504px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Bandwidth</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Mbps · peak vs. average</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">Today</p>
<div style="position:absolute;height:0;left:55px;top:63px;width:420px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:49px;color:#7a7a7a;font-size:9px;text-align:right;top:57px;width:34px">120</p>
<div style="position:absolute;height:0;left:55px;top:103px;width:420px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:49px;color:#7a7a7a;font-size:9px;text-align:right;top:97px;width:34px">80</p>
<div style="position:absolute;height:0;left:55px;top:143px;width:420px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid2.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:49px;color:#7a7a7a;font-size:9px;text-align:right;top:137px;width:34px">40</p>
<div style="position:absolute;height:0;left:55px;top:183px;width:420px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/grid3.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:49px;color:#7a7a7a;font-size:9px;text-align:right;top:177px;width:34px">0</p>
<div style="position:absolute;height:107.059px;left:55px;top:75.94px;width:420px">
<div style="position:absolute;inset:-0.47% -0.12%">
<img alt="" src="__B__icons/an/area3.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:85.167px;left:55px;top:75.94px;width:420px">
<div style="position:absolute;inset:-1.17% -0.24%">
<img alt="" src="__B__icons/an/line3.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:58.883px;left:55px;top:124.12px;width:420px">
<div style="position:absolute;inset:-0.85% -0.12%">
<img alt="" src="__B__icons/an/area4.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<div style="position:absolute;height:46.842px;left:55px;top:124.12px;width:420px">
<div style="position:absolute;inset:-2.13% -0.24%">
<img alt="" src="__B__icons/an/line4.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:41px;color:#7a7a7a;font-size:9px;top:191px;white-space:nowrap">00:00</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:146px;color:#7a7a7a;font-size:9px;top:191px;white-space:nowrap">06:00</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:251px;color:#7a7a7a;font-size:9px;top:191px;white-space:nowrap">12:00</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:356px;color:#7a7a7a;font-size:9px;top:191px;white-space:nowrap">18:00</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:461px;color:#7a7a7a;font-size:9px;top:191px;white-space:nowrap">24:00</p>
<div style="position:absolute;left:17px;width:8px;height:8px;top:216px">
<img alt="" src="__B__icons/an/key6.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:31px;color:#a8a8a8;font-size:10px;top:213px;white-space:nowrap">Peak</p>
<div style="position:absolute;left:76.2px;width:8px;height:8px;top:216px">
<img alt="" src="__B__icons/an/key7.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:90.2px;color:#a8a8a8;font-size:10px;top:213px;white-space:nowrap">Average</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:244px;left:576px;border-radius:8px;top:548px;width:504px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Watch time heatmap</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Hour of day × weekday</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">Avg. hours</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:73px;white-space:nowrap">Mon</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#141414;left:220.4px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:239px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:257.6px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:276.2px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#c4a6ff;left:294.8px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#8b5cf6;left:313.4px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:332px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:350.6px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#8b5cf6;left:369.2px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:387.8px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:425px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#2b1b55;left:462.2px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:71px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:91.6px;white-space:nowrap">Tue</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#2b1b55;left:220.4px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:239px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:257.6px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:276.2px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:294.8px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:332px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:350.6px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#8b5cf6;left:369.2px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#8b5cf6;left:387.8px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:425px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#2b1b55;left:462.2px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:89.6px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:110.2px;white-space:nowrap">Wed</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#2b1b55;left:220.4px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#2b1b55;left:239px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#2b1b55;left:257.6px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#5b34b0;left:276.2px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#c4a6ff;left:294.8px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#c4a6ff;left:332px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#c4a6ff;left:350.6px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#c4a6ff;left:369.2px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#5b34b0;left:387.8px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#8b5cf6;left:425px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#2b1b55;left:443.6px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#5b34b0;left:462.2px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:108.2px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:128.8px;white-space:nowrap">Thu</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#2b1b55;left:220.4px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#2b1b55;left:239px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#2b1b55;left:257.6px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#5b34b0;left:276.2px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#5b34b0;left:294.8px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#c4a6ff;left:332px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#8b5cf6;left:350.6px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#c4a6ff;left:369.2px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#c4a6ff;left:387.8px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#5b34b0;left:425px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#2b1b55;left:462.2px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<div style="position:absolute;background:#141414;left:480.8px;border-radius:3px;width:14px;height:14px;top:126.8px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:147.4px;white-space:nowrap">Fri</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#141414;left:220.4px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#2b1b55;left:239px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#2b1b55;left:257.6px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#8b5cf6;left:276.2px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#8b5cf6;left:294.8px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#5b34b0;left:332px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#8b5cf6;left:350.6px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#c4a6ff;left:369.2px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#c4a6ff;left:387.8px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#8b5cf6;left:406.4px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#5b34b0;left:425px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#2b1b55;left:462.2px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:145.4px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:166px;white-space:nowrap">Sat</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#2b1b55;left:220.4px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:239px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:257.6px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:276.2px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:294.8px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:332px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:350.6px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:369.2px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:387.8px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#c4a6ff;left:425px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#5b34b0;left:462.2px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:164px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:9px;top:184.6px;white-space:nowrap">Sun</p>
<div style="position:absolute;background:#141414;left:53px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:71.6px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:90.2px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:108.8px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:127.4px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:146px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:164.6px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:183.2px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#141414;left:201.8px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#2b1b55;left:220.4px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#5b34b0;left:239px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#5b34b0;left:257.6px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#5b34b0;left:276.2px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#8b5cf6;left:294.8px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:313.4px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:332px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:350.6px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#c4a6ff;left:369.2px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#8b5cf6;left:387.8px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#5b34b0;left:406.4px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#8b5cf6;left:425px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#5b34b0;left:443.6px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#2b1b55;left:462.2px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<div style="position:absolute;background:#2b1b55;left:480.8px;border-radius:3px;width:14px;height:14px;top:182.6px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:52px;color:#7a7a7a;font-size:9px;top:207.2px;white-space:nowrap">00</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:163.6px;color:#7a7a7a;font-size:9px;top:207.2px;white-space:nowrap">06</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:275.2px;color:#7a7a7a;font-size:9px;top:207.2px;white-space:nowrap">12</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:386.8px;color:#7a7a7a;font-size:9px;top:207.2px;white-space:nowrap">18</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:479.8px;color:#7a7a7a;font-size:9px;top:207.2px;white-space:nowrap">23</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:379px;color:#7a7a7a;font-size:9px;top:37px;white-space:nowrap">Less</p>
<div style="position:absolute;background:#141414;left:403px;border-radius:2px;width:12px;height:12px;top:37px"></div>
<div style="position:absolute;background:#2b1b55;left:417px;border-radius:2px;width:12px;height:12px;top:37px"></div>
<div style="position:absolute;background:#5b34b0;left:431px;border-radius:2px;width:12px;height:12px;top:37px"></div>
<div style="position:absolute;background:#8b5cf6;left:445px;border-radius:2px;width:12px;height:12px;top:37px"></div>
<div style="position:absolute;background:#c4a6ff;left:459px;border-radius:2px;width:12px;height:12px;top:37px"></div>
<p style="position:absolute;font-weight:400;line-height:normal;left:475px;color:#7a7a7a;font-size:9px;top:37px;width:26px">More</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:244px;left:1104px;border-radius:8px;top:548px;width:504px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Top clients</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Plays by app</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">30 days</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:65px;white-space:nowrap">Jellyfin Web</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:67px;width:260px"></div>
<div style="position:absolute;background:#a970ff;height:10px;left:149px;border-radius:5px;top:67px;width:260px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:65px;width:66px">18420</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:93px;white-space:nowrap">Jellyfin Android</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:95px;width:260px"></div>
<div style="position:absolute;background:#00a4dc;height:10px;left:149px;border-radius:5px;top:95px;width:158.512px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:93px;width:66px">11230</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:121px;white-space:nowrap">Infuse</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:123px;width:260px"></div>
<div style="position:absolute;background:#f472b6;height:10px;left:149px;border-radius:5px;top:123px;width:110.662px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:121px;width:66px">7840</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:149px;white-space:nowrap">Swiftfin</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:151px;width:260px"></div>
<div style="position:absolute;background:#4ade80;height:10px;left:149px;border-radius:5px;top:151px;width:72.269px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:149px;width:66px">5120</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:177px;white-space:nowrap">Jellyfin TV</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:179px;width:260px"></div>
<div style="position:absolute;background:#f5b942;height:10px;left:149px;border-radius:5px;top:179px;width:47.144px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:177px;width:66px">3340</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:17px;color:#ededed;font-size:11px;top:205px;white-space:nowrap">Kodi</p>
<div style="position:absolute;background:#161616;height:10px;left:149px;border-radius:5px;top:207px;width:260px"></div>
<div style="position:absolute;background:#2dd4bf;height:10px;left:149px;border-radius:5px;top:207px;width:33.043px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:485px;color:#b5b5b5;font-size:11px;text-align:right;top:205px;width:66px">2341</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:188px;left:48px;border-radius:8px;top:816px;width:372px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Top users</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Hours watched</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">30d</p>
<div style="position:absolute;left:17px;width:16px;height:16px;top:61px">
<img alt="" src="__B__icons/an/avatar.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:25px;color:#0d0d0d;font-size:9px;text-align:center;top:64px;width:16px">L</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:41px;color:#ededed;font-size:11px;top:63px;white-space:nowrap">lennox</p>
<div style="position:absolute;background:#161616;height:6px;left:119px;border-radius:3px;top:66px;width:170px"></div>
<div style="position:absolute;background:#a970ff;height:6px;left:119px;border-radius:3px;top:66px;width:170px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:63px;width:58px">512h</p>
<div style="position:absolute;left:17px;width:16px;height:16px;top:85px">
<img alt="" src="__B__icons/an/avatar1.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:25px;color:#0d0d0d;font-size:9px;text-align:center;top:88px;width:16px">C</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:41px;color:#ededed;font-size:11px;top:87px;white-space:nowrap">crackyy</p>
<div style="position:absolute;background:#161616;height:6px;left:119px;border-radius:3px;top:90px;width:170px"></div>
<div style="position:absolute;background:#00a4dc;height:6px;left:119px;border-radius:3px;top:90px;width:128.828px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:87px;width:58px">388h</p>
<div style="position:absolute;left:17px;width:16px;height:16px;top:109px">
<img alt="" src="__B__icons/an/avatar2.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:25px;color:#0d0d0d;font-size:9px;text-align:center;top:112px;width:16px">G</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:41px;color:#ededed;font-size:11px;top:111px;white-space:nowrap">guest</p>
<div style="position:absolute;background:#161616;height:6px;left:119px;border-radius:3px;top:114px;width:170px"></div>
<div style="position:absolute;background:#f472b6;height:6px;left:119px;border-radius:3px;top:114px;width:71.055px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:111px;width:58px">214h</p>
<div style="position:absolute;left:17px;width:16px;height:16px;top:133px">
<img alt="" src="__B__icons/an/avatar3.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:25px;color:#0d0d0d;font-size:9px;text-align:center;top:136px;width:16px">M</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:41px;color:#ededed;font-size:11px;top:135px;white-space:nowrap">mum</p>
<div style="position:absolute;background:#161616;height:6px;left:119px;border-radius:3px;top:138px;width:170px"></div>
<div style="position:absolute;background:#4ade80;height:6px;left:119px;border-radius:3px;top:138px;width:47.148px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:135px;width:58px">142h</p>
<div style="position:absolute;left:17px;width:16px;height:16px;top:157px">
<img alt="" src="__B__icons/an/avatar4.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:700;line-height:normal;left:25px;color:#0d0d0d;font-size:9px;text-align:center;top:160px;width:16px">J</p>
<p style="position:absolute;font-weight:500;line-height:normal;left:41px;color:#ededed;font-size:11px;top:159px;white-space:nowrap">jonas</p>
<div style="position:absolute;background:#161616;height:6px;left:119px;border-radius:3px;top:162px;width:170px"></div>
<div style="position:absolute;background:#f5b942;height:6px;left:119px;border-radius:3px;top:162px;width:31.875px"></div>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:159px;width:58px">96h</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:188px;left:444px;border-radius:8px;top:816px;width:372px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Library growth</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">New items per month</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">2025–26</p>
<div style="position:absolute;height:26.563px;left:20px;border-radius:3px;top:132.44px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:40.625px;left:48px;border-radius:3px;top:118.38px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:32.031px;left:76px;border-radius:3px;top:126.97px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:54.688px;left:104px;border-radius:3px;top:104.31px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:49.219px;left:132px;border-radius:3px;top:109.78px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:68.75px;left:160px;border-radius:3px;top:90.25px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:58.594px;left:188px;border-radius:3px;top:100.41px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:75px;left:216px;border-radius:3px;top:84px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:64.063px;left:244px;border-radius:3px;top:94.94px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:85.938px;left:272px;border-radius:3px;top:73.06px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:73.438px;left:300px;border-radius:3px;top:85.56px;width:18px;background:linear-gradient(to bottom,#a970ff,rgba(169,112,255,0.45))"></div>
<div style="position:absolute;height:100px;left:328px;border-radius:3px;top:59px;width:18px;background:linear-gradient(to bottom,#00a4dc,rgba(0,164,220,0.45))"></div>
<div style="position:absolute;height:0;left:17px;top:159px;width:336px">
<div style="position:absolute;inset:-0.5px 0">
<img alt="" src="__B__icons/an/axis.svg" style="display:block;max-width:none;width:100%;height:100%">
</div>
</div>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:29px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">J</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:57px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">F</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:85px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">M</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:113px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">A</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:141px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">M</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:169px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">J</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:197px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">J</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:225px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">A</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:253px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">S</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:281px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">O</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:309px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">N</p>
<p style="transform:translateX(-50%);position:absolute;font-weight:400;line-height:normal;left:337px;color:#7a7a7a;font-size:9px;text-align:center;top:165px;width:18px">D</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:188px;left:840px;border-radius:8px;top:816px;width:372px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Resolution &amp; codec</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Share of library by stream</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">Now</p>
<div style="position:absolute;background:#a970ff;height:22px;left:17px;border-radius:4px;top:61px;width:71.92px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:21px;color:#0d0d0d;font-size:10px;top:66px;white-space:nowrap">22%</p>
<div style="position:absolute;background:#00a4dc;height:22px;left:90.92px;border-radius:4px;top:61px;width:169.36px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:94.92px;color:#0d0d0d;font-size:10px;top:66px;white-space:nowrap">51%</p>
<div style="position:absolute;background:#4ade80;height:22px;left:262.28px;border-radius:4px;top:61px;width:55.12px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:266.28px;color:#0d0d0d;font-size:10px;top:66px;white-space:nowrap">17%</p>
<div style="position:absolute;background:#f5b942;height:22px;left:319.4px;border-radius:4px;top:61px;width:31.6px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:323.4px;color:#0d0d0d;font-size:10px;top:66px;white-space:nowrap">10%</p>
<div style="position:absolute;left:17px;width:8px;height:8px;top:96px">
<img alt="" src="__B__icons/an/key.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:31px;color:#a8a8a8;font-size:10px;top:93px;white-space:nowrap">4K</p>
<div style="position:absolute;left:63.6px;width:8px;height:8px;top:96px">
<img alt="" src="__B__icons/an/key6.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:77.6px;color:#a8a8a8;font-size:10px;top:93px;white-space:nowrap">1080p</p>
<div style="position:absolute;left:129.1px;width:8px;height:8px;top:96px">
<img alt="" src="__B__icons/an/key8.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:143.1px;color:#a8a8a8;font-size:10px;top:93px;white-space:nowrap">720p</p>
<div style="position:absolute;left:188.3px;width:8px;height:8px;top:96px">
<img alt="" src="__B__icons/an/key7.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:202.3px;color:#a8a8a8;font-size:10px;top:93px;white-space:nowrap">SD</p>
<div style="position:absolute;background:#f472b6;height:22px;left:17px;border-radius:4px;top:127px;width:159.28px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:21px;color:#0d0d0d;font-size:10px;top:132px;white-space:nowrap">48%</p>
<div style="position:absolute;background:#2dd4bf;height:22px;left:178.28px;border-radius:4px;top:127px;width:129.04px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:182.28px;color:#0d0d0d;font-size:10px;top:132px;white-space:nowrap">39%</p>
<div style="position:absolute;background:#fb923c;height:22px;left:309.32px;border-radius:4px;top:127px;width:28.24px"></div>
<p style="position:absolute;font-weight:700;line-height:normal;left:313.32px;color:#0d0d0d;font-size:10px;top:132px;white-space:nowrap">9%</p>
<div style="position:absolute;background:#6b6b6b;height:22px;left:339.56px;border-radius:4px;top:127px;width:11.44px"></div>
<div style="position:absolute;left:17px;width:8px;height:8px;top:162px">
<img alt="" src="__B__icons/an/key1.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:31px;color:#a8a8a8;font-size:10px;top:159px;white-space:nowrap">HEVC</p>
<div style="position:absolute;left:76.2px;width:8px;height:8px;top:162px">
<img alt="" src="__B__icons/an/key2.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:90.2px;color:#a8a8a8;font-size:10px;top:159px;white-space:nowrap">H.264</p>
<div style="position:absolute;left:141.7px;width:8px;height:8px;top:162px">
<img alt="" src="__B__icons/an/key9.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:155.7px;color:#a8a8a8;font-size:10px;top:159px;white-space:nowrap">AV1</p>
<div style="position:absolute;left:194.6px;width:8px;height:8px;top:162px">
<img alt="" src="__B__icons/an/key10.svg" style="position:absolute;display:block;inset:0;max-width:none;width:100%;height:100%">
</div>
<p style="position:absolute;font-weight:400;line-height:normal;left:208.6px;color:#a8a8a8;font-size:10px;top:159px;white-space:nowrap">Other</p>
</div>
<div style="position:absolute;background:#000;border:1px solid;border-color:#1f1f1f;height:188px;left:1236px;border-radius:8px;top:816px;width:372px">
<p style="position:absolute;font-weight:700;line-height:normal;left:17px;color:#ededed;font-size:13px;top:15px;white-space:nowrap">Top content</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:10px;top:34px;white-space:nowrap">Most played</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#7a7a7a;font-size:10px;text-align:right;top:16px;width:200px">30d</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:11px;top:61px;white-space:nowrap">1</p>
<div style="position:absolute;left:37px;border-radius:4px;width:22px;height:22px;top:59px;background:linear-gradient(to bottom,rgba(0,164,220,0.9),rgba(0,164,220,0.4))"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:69px;color:#ededed;font-size:11px;top:63px;white-space:nowrap">Tenet</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:63px;width:104px">212 plays</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:11px;top:86px;white-space:nowrap">2</p>
<div style="position:absolute;left:37px;border-radius:4px;width:22px;height:22px;top:84px;background:linear-gradient(to bottom,rgba(169,112,255,0.9),rgba(169,112,255,0.4))"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:69px;color:#ededed;font-size:11px;top:88px;white-space:nowrap">One Piece</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:88px;width:104px">198 plays</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:11px;top:111px;white-space:nowrap">3</p>
<div style="position:absolute;left:37px;border-radius:4px;width:22px;height:22px;top:109px;background:linear-gradient(to bottom,rgba(74,222,128,0.9),rgba(74,222,128,0.4))"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:69px;color:#ededed;font-size:11px;top:113px;white-space:nowrap">The Leftovers</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:113px;width:104px">141 plays</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:11px;top:136px;white-space:nowrap">4</p>
<div style="position:absolute;left:37px;border-radius:4px;width:22px;height:22px;top:134px;background:linear-gradient(to bottom,rgba(244,114,182,0.9),rgba(244,114,182,0.4))"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:69px;color:#ededed;font-size:11px;top:138px;white-space:nowrap">Dark</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:138px;width:104px">97 plays</p>
<p style="position:absolute;font-weight:400;line-height:normal;left:17px;color:#7a7a7a;font-size:11px;top:161px;white-space:nowrap">5</p>
<div style="position:absolute;left:37px;border-radius:4px;width:22px;height:22px;top:159px;background:linear-gradient(to bottom,rgba(245,185,66,0.9),rgba(245,185,66,0.4))"></div>
<p style="position:absolute;font-weight:500;line-height:normal;left:69px;color:#ededed;font-size:11px;top:163px;white-space:nowrap">Dune</p>
<p style="transform:translateX(-100%);position:absolute;font-weight:400;line-height:normal;left:353px;color:#b5b5b5;font-size:11px;text-align:right;top:163px;width:104px">84 plays</p>
</div>
`;

  JA.page({ path: '/dashboard/analytics', title: 'Analytics', render(el) {
    const root = h('div', { class: 'an-root' });
    root.innerHTML = HTML.replaceAll('__B__', B);
    // Range selector: the pill and labels are absolutely placed, so move the active pill and recolour labels.
    const pill = root.querySelector('[style*="left:1394px"][style*="height:28px"]');
    const labels = [1321, 1369, 1417, 1465, 1513].map((x) => root.querySelector('p[style*="left:' + x + 'px"][style*="top:33px"]'));
    const pick = (i) => { pill.style.left = 1394 + (i - 2) * 48 + 'px'; labels.forEach((p, j) => { p.style.color = j === i ? '#0d0d0d' : '#7a7a7a'; }); };
    labels.forEach((p, i) => root.append(h('button', { class: 'an-range', type: 'button', style: 'left:' + (1298 + i * 48) + 'px', 'aria-label': p.textContent, onclick: () => pick(i) })));
    el.append(root);
  } });
})();
