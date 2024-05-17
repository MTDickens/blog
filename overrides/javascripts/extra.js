(function () {
    window.counterscale = {
        q: [["set", "siteId", "blog-cc98-site"], ["trackPageview"]],
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    var script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://counterscale.workers.cc98.site/tracker.js';
    document.head.appendChild(script);
});