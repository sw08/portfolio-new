window.addEventListener("wheel", function(e){
    e.preventDefault();
}, {passive: false});

function get(id) {
    return document.getElementById(id);
}

function withoutTransition(ids, callback) {
    for (const id of ids) {
        get(id).classList.add('no-transition');
    }
    callback();
    for (const id of ids) {
        get(id).classList.remove('no-transition');
    }
}

function previous() {
    window.onwheel({deltaY: -1});
}

function next() {
    window.onwheel({deltaY: 1});
}

function hide(id) {
    if (id == document.sections) {
        get("next2").style.opacity = '1';
    }
    get(`c${id}`).style.opacity = '0';
    withoutTransition([`s${id}`, `a${id}`], function () {
        get(`s${id}`).style.opacity = '0';
        get(`s${id}`).style.zIndex = '0';
        get(`a${id}`).style.height = '0';
    });
    if (id === 1) {
        withoutTransition(['nextBtnMain'], function () {
            get("nextBtnMain").style.maxHeight = 0;
            get("nextBtnMain").style.opacity = 0;
        })
    }
}
function show(id) { 
    if (id == document.sections) {
        get("next2").style.opacity = '0';
    }
    get(`s${id}`).style.opacity = '1';
    get(`s${id}`).style.zIndex = '1';
    setTimeout(function () {
        if (id === 1) {
            get('nextBtnMain').style.maxHeight = '19vh';
            setTimeout(function () {
                get('nextBtnMain').style.opacity = '1';
            }, 750);
        } else {
            get(`a${id}`).style.height = 'calc(90vh - 3.2em)';
            setTimeout(function () {
                get(`c${id}`).style.opacity = '1';
            }, 1500);
        }
    }, 750);
}

window.addEventListener('load', function(e) {
    const sections = [...document.getElementsByClassName('section')];
    document['section'] = 1;
    document['sections'] = sections.length;
    document['scrolled'] = Date.now();
    const page = Number(window.location.hash.slice(1));
    if (page > sections || page === 0) {
        show(1);
    } else {
        moveTo(page);
    }
});

function moveTo(page) {
    if (page === 1) { // 2 to 1
        get('navbar').style.left = '-150%';
        get('second').style.width = '60vw';
        get('first').style.width = '40vw';
        setTimeout(function() {
            get('profile').style.scale = '1';
            get('profile').style.opacity = '1';
        }, 250);
    } else if (document.section === 1 && page !== 1) {
        get('profile').style.scale = '0.5';
        get('second').style.width = '95vw';
        get('navbar').style.left = '0';
        get('profile').style.opacity = '0';
        get('first').style.width = '5vw';
    }
    hide(document.section);
    setTimeout(function () {
        show(page);
    }, 500);
    document.section = page;
    window.location.hash = `#${page}`;
}

function change(direction) {
    if (!((document.section === 1 && !direction) || (document.section === document.sections && direction))) {
        moveTo(document.section + 2 * direction - 1);
    }
}

window.onwheel = function(e) {
    const now = Date.now();
    if (now - document.scrolled >= 2000) {
        document.scrolled = now;
        change(e.deltaY > 0);
    }
};