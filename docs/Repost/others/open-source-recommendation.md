> 原文地址 [kirikira.moe](https://kirikira.moe/post/48/)

> 这篇文章主要是记录一下我在 2023 年新用上的开源灵车，作为开源爱好者，光是找到能用的开源项目就已经是一大乐事，如果本来能用就行的开源灵车还好用并且活跃开发，那就乐不可支了。

一转眼 2023 年又过去了，而我也在写前篇文章时想要重启的博客更新计划又因为感情上的挫折、工作上的焦虑而一度暂且搁置。本来想完整记录一下我的 NAS 部署历程，但又想这年头还有几个人用这样的灵车 NAS，还是有空再说吧。

这篇文章主要是记录一下我在 2023 年新用上的开源灵车，作为开源爱好者，光是找到能用的开源项目就已经是一大乐事，如果本来能用就行的开源灵车还好用并且活跃开发，那就乐不可支了。

本文中出现的开源项目很多并不是 2023 年的新项目，甚至可以说是小有年头了，在此记录的只是我在这一年里 “新用上” 并且 “好用” 的软件，一些曾经知道但没怎么用的好东西也会写一写，像是 KDE Connect 这种我已经用了好几年了的就不提了。

#### Android

对于 Android 来说 2023 年开源 app 可以说是大丰收，得益于 UI 等技术的进步、手机性能的大跃进，能称的上好用又好看的开源 app 相比往年多了一箩筐，使得我更加难以离开 Android 的生态环境了。

##### [Nekobox4Android](https://github.com/MatsuriDayo/NekoBoxForAndroid)

基于 sing-box 的代理软件，SagerNet 的 Fork，从 shadowsocks 时代开始一脉相承的简洁简陋 UI，切换到了 sing-box 之后得到了广泛的新协议支持和不错的性能，功能设置也更加细节，基本上该有的功能全都有了。值得一提的是，还能支持 Cloudflare Warp+ 的一键配置，配合 Warp 优选 IP 脚本手动换一个 ipv6 节点就可以免费满足轻度用户的翻墙需求了。

![](https://s2.loli.net/2024/02/15/B2PLgManuVzTsrm.jpg)

另外，如果你对这些复杂的功能没有兴趣只想要个更好看的 UI 的话，还可以关注下 [Hiddify](https://github.com/hiddify/hiddify-next).

![](https://s2.loli.net/2024/02/15/aphPqnM1zNYU8Qb.jpg)

##### [Symphony](https://github.com/zyrouge/symphony)

十几年以来我一直是坚定的本地音乐主义——早期是因为流媒体不发达、在线音质差，流媒体时代发展后我的口味又变得更杂、更脱离主流，例如从中学开始听的东方曲、Future Bass 之类的小众歌曲指望正版平台全收录是不现实的，而到了现在的大 DRM 时代我对在线平台的不信任程度更甚，哪天一首喜欢听的歌可能就悄悄消失在曲库了。所以到现在我仍然保留着用流媒体平台找歌、喜欢的就下载、更喜欢的就买专辑支持的习惯。

在此之前我用的 Android 本地播放器是 Phonograph 以及后续分支 Phonograph Plus, Vinyl，但某天开始 Vinyl 突然识别不出我新加入的歌了，于是我又切换到了 [Nyx](https://play.google.com/store/apps/details?id=com.awedea.nyx&hl=en_US) 这个还算好看的替代品，其实除了不开源以外用着也还算满意，但说到底本地播放器除了 UI 以外也没有什么功能需求，为什么不选个开源的呢？

某天我在 F-Droid 上闲逛时发现如今已经有了一大堆的本地播放器项目，这个领域因为门槛比较低已经变成一众开发者的 UI 练手地了。而在一大票播放器里，Symphony 在我的审美里脱颖而出：清爽的 UI，足够的功能，以及扫描媒体库时的效率足够的高。我估计这又是一个很长时间里我不会更换的 app 了。

![](https://s2.loli.net/2024/02/15/Dr4elNavnZXWBH2.jpg)![](https://s2.loli.net/2024/02/15/QsXGKcOqLwfJAlg.jpg)

##### [Spotube](https://github.com/KRTirtho/spotube)

不过嘛，即使平时用本地播放器听歌也总还是需要一点流媒体的推荐的。曾经有一段时间我跟群友一起用着 Spotify，但在家庭车解散后不满意昂贵的月租就没有再自己续了。但是这个神奇的 App 却采用了一种另辟蹊径的神奇做法——他用着 Spotify 的推荐，却在 Youtube Music 上找源。这个曲线救国的做法匹配率却出乎意料的高，一定程度上它确实可以让我不必再续费 Spotify 也能享受 Spotify 的推荐算法了。

如果没有在年底发现 Spotube 的话，我可能会在这里推荐 [BlackHole](https://github.com/Sangwan5688/BlackHole) 这种 YT Music 的第三方客户端。

##### [Mihon](https://mihon.app/) 和 [Kotatsu](https://github.com/KotatsuApp/Kotatsu)

本来看漫画 app 毋庸置疑首推 Tachiyomi，超全面的功能、最大数量的漫画源、活跃的开发、流畅的体验，让 Tachiyomi 甚至单独成为了我用 Android 的一大理由，甚至让我为了配合 Tachiyomi 看漫画而换上了折叠屏。然而在 Tachiyomi 被来自韩国的版权大炮轰的停更后（即使 Tachiyomi 本体并不提供漫画源，漫画源由插件提供），我们不得不留个后手了。

Mihon 算是目前呼声最高的 Tachiyomi 接班人，直接 Fork 自 Tachiyomi，当然该有的都有了备份也能直接迁移过来。旧版 Tachiyomi 虽然在接下来不短的时间里依然可以继续用，但有维护有更新总是好的。顺便列几个官方 repo 挂掉后的插件仓库以防有的朋友找不到：

```
- https://raw.githubusercontent.com/Tachiyomiorg/extensions/repo/index.min.json
- https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.min.json
- https://beerpiss.github.io/Tachiyomi-unofficial-extensions/index.min.json
- https://stevenyomi.github.io/copymanga/index.min.json
```

Kotatsu 则是风头被 Tachiyomi 盖过但也很优秀的 App，两者功能差不多，可惜 Kotatsu 的中文源相比之下少得可怜，而且不像 Mihon/Tachiyomi 一样可以直接把自建的 Tachidesk 作为源导入，因此在我这边还只能做备用。不过随着原本 Tachiyomi 的贡献者失去了聚集地，有些人会转投 Kotatsu 也说不定呢。

##### [Droid-ify](https://github.com/Droid-ify/client)

知名开源应用商店 F-Droid 的又一个客户端，Fork 自 Foxy-Droid 但有更好的 UI，也内置了更多的好用仓库源（包括彼得的个人仓库），闲来无事找点开源灵车玩更方便了。

![](https://s2.loli.net/2024/02/15/3FlL4RejYtBhw1C.jpg)

##### [Obtainium](https://github.com/ImranR98/Obtainium)

有些没上 F-Droid 的 app 只能去 GitHub 上 下载 Release，之后更新就得通过应用自带的检查更新或者自己手动去下载安装包了，有没有更好的办法呢？有，这就是 Obtainium 干的，帮你从 GitHub Release 之类的地方去抓 apk，帮你检查更新和一键安装。

![](https://s2.loli.net/2024/02/15/IZi5hjPQorefyzw.jpg)

##### [Nullgram](https://github.com/qwq233/Nullgram)

Telegram 的第三方客户端总是因为追不上官方的更新而缺失 feature，最后跟不上时代被弃用，所以推荐 Nullgram 说不上有什么特别的理由，最大的原因是它的作者还在活跃维护、还能跟得上官方新版罢了。当然还是有些细节小功能我比较喜欢的，比如自动 Pangu，在你发出一句话时自动给中文和英文之间加空格。

##### [Fcitx5-Android](https://github.com/fcitx5-android/fcitx5-android)

Fcitx5 是 Linux 中文社区人尽皆知的优秀输入法框架了，我在多年前也写过一篇文章记录[在 Linux Destop 上使用 Fcitx5+Rime](https://kirikira.moe/post/20/)，让我意想不到的是作者将它带到了 Android 上来。UI 类似 Google Pinyin/Gboard，简洁美观，确实是开源爱好者的好选择。不幸的是体验不久之后我就换了折叠屏手机，而 Fcitx5-Android 暂时也不支持 Gboard / 三星输入法 那样的左右手拆分键盘，所以我又换回 Gboard 去了。

##### [Findroid](https://github.com/jarnedemeulemeester/findroid)

知名 self-host media center Jellyfin 的第三方客户端，相比于功能全面但古老的官方客户端，Findroid 的 UI 好看不少，同时内置播放器改为了新版 MPV，看视频更舒服了。

##### [ReVanced](https://revanced.app/)

这个是来自群友推荐的神奇项目，半自动本地拆解 apk，打上 patch 再重新打包，相当于帮你破解 app 了。适用范围包括许多国外大厂 app，如 Youtube, Twitter, Instagram，达到用着官方 App 但又能去广告和解锁一些会员功能的目的，例如下载 Twitter 视频和 Youtube 后台播放。

##### [移除跟踪](https://github.com/zhanghai/Untracker)

有隐私意识的朋友都知道，许多 app 在分享时会在 url 里插入一大堆不必要的追踪参数，可能还会再用短链接把真正的分享链接包装一次，导致你的人际关系通过分享的方式被这些大厂窥探。以前用 Xposed 有不少这类去跟踪的插件，现在不 root 可以用这个 app 作为分享的中转站来去除跟踪。

##### [GKD](https://github.com/gkd-kit/gkd)

一直以来，国内用户都深受各类流氓软件无底线的广告之害。去年国内 Android 圈子的另一大热点应该是李跳跳等知名跳过广告应用的作者被抓导致相关应用停更的新闻了，不过这类软件本来就以小作者闭源开发为主，我也一直没有用过，毕竟需要给无障碍或者 root 权限还是挺高的。在出事之后反而出现了几个开源的跳过广告项目，GKD 就是其中一个比较早亮相在 V2EX 的，后续也得到了不少更新。按他的实现方式，只要有人维护规则列表就能继续使用。

##### [Pilipala](https://github.com/guozhigq/pilipala)

Pilipala 是一个开源的第三方 Bilibili 客户端，是我 2024 年第一个赞助支持的开源项目了，也是我第一个觉得说得上很好用的 Flutter app。其实到了这个时代，有鉴于微博已经逼停了数代的第三方客户端，国外大厂软件的第三方客户端也越来越少，我已经不指望能有好用的第三方国内大厂客户端了，像 [Pipepipe](https://github.com/InfinityLoop1308/PipePipe) 这样实现了有限功能的第三方已经不错了。但 Pilipala 实在是出乎我的意料，清爽的 UI，没有广告但依然能享受到推荐算法（虽然官方算法也说不上好），默认使用更优质的 CDN 线路都让我不想再用回官方客户端。而最重要的是，在我跟作者群内的贡献者连夜沟通需求后，他们非常快地为我的 ZFold 5 实现了折叠屏适配，这下真的是吊打还需要操作系统来适配的官方了。看下效果：

![](https://s2.loli.net/2024/02/15/agvFB6LyHVoMS4R.jpg)![](https://s2.loli.net/2024/02/15/zirxtMfQhq3TeFd.jpg)

叔叔你的良心真的不会痛吗！！这么多年了不管多宽的屏幕还是只能显示两列，这么大块屏幕首页只能看到一个真正的视频还显示不全（虽然换 play 版没有最上面的大版头会稍微好一点），所谓的平板模式分到了多年不更新的所谓 HD 版里但就算要在折叠屏上用也会强制横屏，而 Pilipala 现在实现了根据屏幕宽度显示列数，折叠屏合上使用外屏时正常两列显示展开时显示更多列数。更棒的是，根据预设的长宽比判断，Pilipala 现在可以在外屏全屏时显示为正常横屏，而展开全屏时则使用竖屏全屏，与 Youtube 的行为一致，省得长宽比接近 1 的折叠屏还需要反复横竖。这两个 Feature 的 PR 在官方分支里还没有合并（[#464](https://github.com/guozhigq/pilipala/pull/463), [#461](https://github.com/guozhigq/pilipala/pull/461)），如果跟我一样心急的可以先用这个贡献者的[测试分支](https://github.com/orz12/pilipala).

当然 Pilipala 依然还有很多功能没有实现完的，例如发送私信、直播间弹幕更不用说直播间礼物，但是对我这种轻度用户只看看视频的完完全全够用了。

再顺带一提，Android TV 上还有一个 [BBLL](https://github.com/xiaye13579/BBLL)，不过这货虽然发布在 GitHub 上但其实是闭源的，同样吊打官方的 TV 客户端。

##### [VVEX](https://github.com/guozhigq/flutter_v2ex)

同样是 Pilipala 作者的 Flutter 项目，这个是 v2ex 的第三方客户端。没啥好说的，看图。

![](https://s2.loli.net/2024/02/15/Mmg4QnjtRSDbp8J.jpg)

##### [质感文件](https://github.com/zhanghai/MaterialFiles)

又一个文件管理器，没啥好说的，基本功能够了 UI 好看，但细节功能还是比 MixPlorer 差挺多，作为 Mix 的备用了。

![](https://s2.loli.net/2024/02/15/lriJubwKMUZQI6F.jpg)

##### [Hydrogen](https://myhydrogen.gitee.io/) 和 [c001apk](https://github.com/bggRGjQaUbCoE/c001apk)

还活着的知乎和酷安的第三方 app，UI 也不错，但这俩平台现在应该基本上没人用了吧，仅做记录，有兴趣的自取。

##### [ServerBox](https://github.com/lollipopkit/flutter_server_box)

又一个 Flutter app，通过 ssh 监控多个机器的基本状态不需要服务端部署探针，并且提供直接的 SSH 终端和 SFTP 文件管理，总的来说还不错。

#### Web and Cross-Platform

##### [Bitwarden](https://github.com/bitwarden)

在 2018 年时我用 300 块钱买了 5 年的腾讯云学生机用来存放 keepass 的密码数据库，而在 2023 年这台机器终于到期，我也就顺势从 keepass 换到了同样开源的 Bitwarden。好在 Bitwarden 可以直接导入 keepass 的数据库而不需要我做额外处理或手动录入，与 keepass 相比它的优势在于更完善的全平台客户端支持，Android/iOS/Windows/MacOS 一应俱全还有不依赖额外客户端的浏览器插件，比 keepass 方便许多。如果对官方的服务器不信任，也可以选择自建，这是我选 Bitwarden 的最大原因。

##### [immich](https://immich.app/)

Immich 是近来评价相当好的 Google Photos 的开源替代，只需要部署一个服务端，然后所有设备都可以备份照片到自己的服务器上，之后本地删除了也可以下载回来，手机不在身边也能用 web 访问。另外，类似如今各大厂相册必备的功能，自带的机器学习让我可以用模糊的 tag 来搜索具体的图片，我很喜欢，例如：

![](https://s2.loli.net/2024/02/15/guQeCAjotcOIHSN.jpg)

##### [Tachidesk](https://github.com/Suwayomi/Suwayomi-Server) 和 [Sorayomi](https://github.com/Suwayomi/Tachidesk-Sorayomi)

Tachidesk 原本是 Tachiyomi 仅支持 Android 不方便在 Windows 等平台使用的曲线救国项目，但随着发展完善之后现在成为了很不错的自建漫画仓库方案，你可以来我的仓库 [manga.openkiri.zip](https://manga.openkiri.zip/) 体验一下。而我的仓库所使用的 WebUI 就是 Sorayomi，没错，又一个 Flutter 跨平台项目。下面放一张 Android 版客户端的截图：

![](https://s2.loli.net/2024/02/15/j4wrupBQb7t3DSi.jpg)

嘛，不过虽然外表不错但 tachidesk 还是无法替代 Tachiyomi 的，光是 Flutter 的 bug 导致移动端缩放不便就要扣分了。在移动端上更正确的做法是把自建的仓库用 Tachiyomi/Mihon 的 Suwayomi 插件导入为漫画源，在此安利看到这里的读者们都将 https://manga.openkiri.zip 加入你们的漫画源，一定不会失望的。

##### [Tailscale](https://github.com/tailscale/tailscale) 和 [Headscale](https://github.com/juanfont/headscale)

Tailscale 是类似 zerotier 的 Mesh VPN，基于 wireguard，用于异地组网打洞能力非常强，说白话就是让你可以在外面直连回家里使用你的 nas 的全部功能以及访问其他设备。例如这个春节我就全靠 tailscale 从浙江远程连回在上海的家里使用 nas 以及串流 XBOX 玩游戏（实测延迟 16ms 左右）。其实早在上学时就已经用上 tailscale 了，不过今年开始正经自组 nas 才真正感受到它的好用，在用公司 wifi 的时候开 tailscale 连回家里再用上 exit node 不但能用连通家里所有东西还能规避公司的流量审计，就跟在家里摸鱼一样。

##### [Better-xCloud](https://github.com/redphx/better-xcloud) 和 [Region Unlocker](https://greasyfork.org/en/scripts/473984-better-xcloud-no-vpn-xbox-cloud-gaming-region-unlocker)

上面提到了串流玩 XBOX，其实我试过了很多方案，包括官方的 XBOX app、Android 上的 xbxplay、xbplay、Windows 上的 Greenlight 等第三方客户端，结果最好用的还是最简单的 userscript Better-xCloud。这个脚本配上另一个 Region Unlocker（作者因为安全原因不想集成解锁功能），就可以用浏览器直接串流玩了，比起官方 app 可以在后台切换时不断连，比起 xbxplay、xbplay 来开源免费还不用额外客户端（当然在 Android 上需要 kiwi browser 这样能装扩展的浏览器）。我还配了一个手柄支架来玩：

![](https://s2.loli.net/2024/02/15/fGWIEyYFcimxlg9.png)

#### Windows

比起 Android 上的百花齐放来，今年我在 Windows 上新用上的开源灵车屈指可数。

##### [Nekoray](https://github.com/MatsuriDayo/nekoray)

换到 Nekoray 的最大原因是 QV2ray 停更太久了。Nekobox 相同作者的 Windows 版客户端，也使用了 sing-box 核心，不过 UI 嘛就更简陋了。这不重要，这种代理工具只要在后台好好待着，需要订阅链接和切换节点的时候比 CLI 方便点就够了。

##### [PowerToys](https://github.com/microsoft/PowerToys)

PowerToys 是微软自己出的工具箱，其实也早就在用了不过 Windows 这边东西太少了撑撑场面，集成了像是快捷分屏、窗口置顶、批量正则表达式重命名这样原本需要第三方小工具或者自己写 AHK 脚本实现的小功能，总的来说还是挺不错的。不过随着更新 GUI 界面也越来越卡了。。。

##### [Greenlight](https://github.com/unknownskl/greenlight)

上面提到过的 XBOX 串流客户端，仅做记录，个人感觉不如浏览器 + Better-xCloud

Linux 和开源硬件篇待续。