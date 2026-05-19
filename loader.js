(function() {
    // 1. Crear el contenedor del reproductor si no existe
    document.write('<div id="player-wrapper" style="position:relative; width:640px; height:360px; background:#000;"></div>');
    
    const wrapper = document.getElementById('player-wrapper');

    // 2. Función para detectar AdBlock
    async function checkAdBlock() {
        let adBlockEnabled = false;
        const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        try {
            await fetch(new Request(googleAdUrl, { method: 'HEAD', mode: 'no-cors' }));
        } catch (e) {
            adBlockEnabled = true;
        }
        return adBlockEnabled;
    }

    // 3. Lógica principal
    checkAdBlock().then(isBlocked => {
        if (isBlocked) {
            wrapper.innerHTML = `
                <div style="color:white; text-align:center; padding-top:100px; font-family:sans-serif;">
                    <h3 style="color:#ff4444;">¡Bloqueador detectado!</h3>
                    <p>Para ver este video gratuito, por favor desactiva tu AdBlock <br> y recarga la página.</p>
                    <button onclick="location.reload()" style="padding:10px 20px; cursor:pointer;">Ya lo desactivé, recargar</button>
                </div>`;
        } else {
            // Si NO hay AdBlock, cargamos el reproductor con el anuncio VAST
            wrapper.innerHTML = `
                <video id="video_player" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360">
                    <source src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" type="application/x-mpegURL">
                </video>`;
            
            // Cargar scripts necesarios dinámicamente
            loadScripts();
        }
    });

    function loadScripts() {
        const scripts = [
            "https://vjs.zencdn.net/7.20.3/video.min.js",
            "https://imasdk.googleapis.com/js/sdkloader/ima3.js",
            "https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.7.0/videojs.ads.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/1.11.0/videojs.ima.js"
        ];

        let loadedCount = 0;
        scripts.forEach(src => {
            let s = document.createElement('script');
            s.src = src;
            s.onload = () => {
                loadedCount++;
                if(loadedCount === scripts.length) initPlayer();
            };
            document.head.appendChild(s);
        });
        
        // Cargar CSS
        let l1 = document.createElement('link'); l1.rel = "stylesheet"; l1.href = "https://vjs.zencdn.net/7.20.3/video-js.css";
        document.head.appendChild(l1);
    }

    function initPlayer() {
        var player = videojs('video_player');
        player.ima({
            adTagUrl: 'https://cdn.jsdelivr.net/gh/corpsrtony/vast-control@main/vast.xml'
        });
        player.one('click', function() {
            player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            player.play();
        });
    }
})();
