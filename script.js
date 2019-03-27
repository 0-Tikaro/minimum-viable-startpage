let $container = document.getElementById("content");
let getUrl = {};

let $shortcutDisplayList = document.getElementsByClassName("shortcut");
let listeningForShortcut = false;
let listenerTimeout;

function setBackgroundImage() {
    let imgUrl = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    let beforeContainer = document.getElementById('beforeContainer');
    beforeContainer.style.backgroundImage = "url('" + imgUrl + "')";
}

function hideCredits() {
    if (HIDE_CREDITS == true) { document.getElementById('credits').style.display = 'none'; }
}

function setupWelcomeMessage() {
    let curHours = new Date().getHours();
    curHours = Math.floor(curHours / 6); // Simply dividing current hours by 6 proves to be a good enough aproximation.
    if (curHours == 4) curHours = 3;
    let welcome = "Good " + WELCOME_MESSAGE_TEMPLATE[curHours] + ", " + NAME;
    document.getElementById("welcome-string").innerHTML = welcome;
}

function setupGroups() {
    for (let i = 0; i < MASTER_MAP.length; i++) {
        let curGroupData = MASTER_MAP[i];

        let group = document.createElement("div");
        group.className = "group";
        $container.appendChild(group);

        let header = document.createElement("h1");
        header.innerHTML = curGroupData.groupName;
        group.appendChild(header);

        for (let j = 0; j < curGroupData.items.length; j++) {
            let curItemData = curGroupData.items[j];

            let pContainer = document.createElement("p");
            group.appendChild(pContainer);

            if (curItemData.divider == true) {
                let hr = document.createElement("hr");
                pContainer.appendChild(hr);
            } else {
                let link = document.createElement("a");
                link.innerHTML = curItemData.name;
                link.setAttribute("href", curItemData.url);
                pContainer.appendChild(link);

                let shortcutDisplay = document.createElement("span");
                shortcutDisplay.innerHTML = curItemData.shortcutKey;
                shortcutDisplay.className = "shortcut";
                shortcutDisplay.style.animation = "none";
                pContainer.appendChild(shortcutDisplay);

                getUrl[curItemData.shortcutKey] = curItemData.url
            }
        }
    }
}

function shortcutListener(e) {
    let key = e.key.toLowerCase();

    if (listeningForShortcut && getUrl.hasOwnProperty(key)) {
        window.location = getUrl[key];
    }

    if (key === SHORTCUT_STARTER) {
        clearTimeout(listenerTimeout);
        listeningForShortcut = true;

        // Animation reset
        for (let i = 0; i < $shortcutDisplayList.length; i++) {
            $shortcutDisplayList[i].style.animation = "none";
            setTimeout(function () { $shortcutDisplayList[i].style.animation = ''; }, 10);
        }

        listenerTimeout = setTimeout(function () { listeningForShortcut = false; }, SHORTCUT_TIMEOUT);
    }
}

function main() {
    setBackgroundImage();
    hideCredits();
    setupWelcomeMessage();
    setupGroups();
    document.addEventListener('keyup', shortcutListener, false);
}

main();
