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

## Salâm-e Shâh (Royal Salute) (1873-1909)

<audio
    id="1"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)Sal%C4%81m-e+Sh%C4%81h+Vatanam+-+National+Anthem+of+Persia.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("1").volume=0.05;
    </script>
</audio>

## Salāmati-ye Dowlat-e Âlliye-ye Irān (Salute of the Sublime State of Iran) (1909-1925)

<audio
    id="2"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)Sarzamin-e Mâdari - Salute of the Sublime State of Persia.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("2").volume=0.05;
    </script>
</audio>

## Sorude Šâhanšâhiye Irân (Imperal Anthem of Iran) (1933-1979)

<audio
    id="3"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)Sorude Šâhanšâhiye Irân - Imperial Anthem of Iran - With Lyrics-192k.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("3").volume=0.05;
    </script>
</audio>

## Ey Irân (O Iran) (1979)

<audio
    id="3"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)Ey Irân (ای ایران_) Iranian patriotic song (1944).mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("3").volume=0.05;
    </script>
</audio>

## Pâyande Bâdâ Irân (Long Live Iran) (1980-1990)

<audio
    id="4"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)National+Anthem+of+Iran+(1980-1990)+-+%D9%BE%D8%A7%DB%8C%D9%86%D8%AF%D9%87+%D8%A8%D8%A7%D8%AF%D8%A7+%D8%A7%DB%8C%D8%B1%D8%A7%D9%86+(Payandeh+Bada+Iran)+%5B86G01KkQRqM%5D.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("4").volume=0.05;
    </script>
</audio>

## Sorude Melliye Jomhuriye Eslâmiye Irân (National Anthem of the Islamic Republic of Iran) (1990-now)

<audio
    id="51"
    controls
    preload="metadata"
    volume=0.1>
    <source src="https://b2.mtds.eu.org/file/mtdmusic/(IR)Sorud-e_Mellí-e_Yomhurí-e_Eslamí-e_Irán_(instrumental).oga.mp3" type="audio/mp3">
    抱歉，您的浏览器不支持 mp3 播放
    <script>
        document.getElementById("51").volume=0.05;
    </script>
</audio>