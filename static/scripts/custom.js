function toggleNavActive() {
    var navs = document.querySelectorAll("#header-navigation li");
    for (var nav of navs) {
        var link = nav.querySelector("a")
        var href = link.getAttribute('href')
        var pathname = window.location.pathname

        if (pathname === '/') {
            break
        }

        if (href.substring(1) && pathname.includes(href.substring(1))) {
            nav.setAttribute('aria-current', 'page');
            link.setAttribute('aria-current', 'page');
        } else {
            nav.removeAttribute('aria-current');
            link.removeAttribute('aria-current');
        }
    }
}

window.onload = toggleNavActive;
