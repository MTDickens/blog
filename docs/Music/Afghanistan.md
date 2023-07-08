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

## 1926-1943

<audio
    id="1"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)afghan_anthem_1926_1943.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("1").volume=0.05;
    </script>
</audio>

## 1943-1973

<audio
    id="2"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)afghan_anthem_1943_1973.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("2").volume=0.05;
    </script>
</audio>

## 1972-1978

<audio
    id="3"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)afghan_anthem_1972_1978.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("3").volume=0.05;
    </script>
</audio>

## 1978-1992

<audio
    id="4"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)Former_national_anthem_of_Afghanistan%2C_1978%E2%80%931992.oga.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("4").volume=0.05;
    </script>
</audio>

## 1992-2006

### 纯音乐版

<audio
    id="51"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)Afghanistan+%5BFortress+of+Islam%2C+heart+of+Asia%5D+(1992-2006).mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("51").volume=0.05;
    </script>
</audio>

### 演唱版

<audio
    id="52"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)National Anthem of Islamic State of Afghanistan - Qal'a-ye Islam Qalb-e Asiya - (FA_EN)..mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("52").volume=0.05;
    </script>
</audio>

## 2006-2021

<audio
    id="6"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(AF)afghanistan_milli_surood_national_anthem_this_land_is_afghanistan_2006_onwards_3140960299252766191.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("6").volume=0.05;
    </script>
</audio>

## 2021 onwards

*TODO*