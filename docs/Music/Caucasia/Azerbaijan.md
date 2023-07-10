<style>
audio:hover, audio:focus, audio:active
    {
    -webkit-box-shadow: 15px 15px 20px rgba(0,0, 0, 0.4);
    -moz-box-shadow: 15px 15px 20px rgba(0,0, 0, 0.4);
    box-shadow: 15px 15px 20px rgba(0,0, 0, 0.4);
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    transform: scale(1.05);
    }

audio
    {
    -webkit-transition:all 0.5s linear;
    -moz-transition:all 0.5s linear;
    -o-transition:all 0.5s linear;
    transition:all 0.5s linear;
    -moz-box-shadow: 2px 2px 4px 0px #006773;
    -webkit-box-shadow:  2px 2px 4px 0px #006773;
    box-shadow: 2px 2px 4px 0px #006773;
    -moz-border-radius:7px 7px 7px 7px ;
    -webkit-border-radius:7px 7px 7px 7px ;
    border-radius:7px 7px 7px 7px ;
    }
</style>


<!-- auto stop other when current is playing with javascript -->
<script>
document.addEventListener("play", function(evt) {
    if(this.$AudioPlaying && this.$AudioPlaying !== evt.target) {
        this.$AudioPlaying.pause();
    }
    this.$AudioPlaying = evt.target;
}, true);
</script>


# 国歌

## 苏联时期

<audio
    id="ee"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AZ)Az%C9%99rbaycan+Sovet+Sosialist+Respublikas%C4%B1n%C4%B1n+Himni!+Anthem+of+the+Azerbaijan+SSR!+(English+Lyrics)+%5BGartH61hzZA%5D.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("ee").volume=0.05;
    </script>
</audio>


## 独立后

### 纯乐器

<audio
    id="ee"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AZ)Azərbaycan_marşı_instrumental.ogg.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("ee").volume=0.05;
    </script>
</audio>

### 演唱版

<audio
    id="ee"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AZ)National Anthem of Azerbaijan - _Azərbaycan marşı_.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("ee").volume=0.05;
    </script>
</audio>