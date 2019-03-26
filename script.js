const NAME = "Carl";
const WELCOME_MESSAGE_TEMPLATE = ["night", "morning", "afternoon", "evening"];

// All shortcuts are in a `SHORTCUT_STARTER+shortcutKey` format.
// So, for example, pressing `tab+q` would redirect you to https://google.com/?q=q
const SHORTCUT_STARTER = 'tab'

// How much time (in milliseconds) you have to press shortcutKey after pressing SHORTCUT_STARTER.
// Also change --SHORTCUT_TIMEOUT in styles.css if you change this option.
const SHORTCUT_TIMEOUT = 1500;

// A list of background images to be displayed at random. Find images you like at: https://source.unsplash.com/random/1920×1080
const BACKGROUND_IMAGES = [
    "https://images.unsplash.com/photo-1551634039-774fb4acf042?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9",
    "https://images.unsplash.com/photo-1551432434-d5f2bdc62ce9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9",
    "https://images.unsplash.com/photo-1552400778-ef424af551f7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9",
    "https://images.pexels.com/photos/1832328/pexels-photo-1832328.jpeg?cs=srgb&dl=adventure-agriculture-asia-1832328.jpg&fm=jpg?dl&fit=crop&crop=entropy&w=1920&h=1280",
    "assets/bg.jpg"
]

// The groups of links are generated from this object. Edit it to edit the page's contents.
// shortcutKey must hold an all-lowercase single button. Theoretically should work with values like `esc` and `f1`,
// but intended to be used with just regular latin letters.
const MASTER_MAP = [
    {
        "groupName": "Stock & Crypto",
        "items":[
            {"name": "WSJ", "shortcutKey": "w", "url": "https://wsj.com"},
            {"name": "CNBC", "shortcutKey": "c", "url": "https://cnbc.com"},
            {"name": "Sharesight", "shortcutKey": "e", "url": "https://sharesight.com"},
            { "divider": true },
            { "name": "CoinMarketCap", "shortcutKey": "a", "url": "https://coinmarketcap.com" },
            { "name": "CoinTracking.info", "shortcutKey": "s", "url": "https://cointracking.info" },

        ]
    },
    {
        "groupName": "Lab",
        "items":[
            { "name": "HomeAssistant", "shortcutKey": "h", "url": "http://hass.local:8123/"},
            { "name": "pfSense", "shortcutKey": "x", "url": "http://10.0.0.1/"},
            { "name": "Proxmox", "shortcutKey": "x", "url": "https://proxmox.piggerbok.com/"},
            { "name": "Rancher", "shortcutKey": "x", "url": "https://rancher.piggerbok.com/" },
            { "name": "CloudCommander", "shortcutKey": "x", "url": "http://10.0.0.4:8765/" }
        ]
    },
    {
        "groupName": "Media",
        "items": [
            { "name": "Ombi", "shortcutKey": "o", "url": "https://home.piggerbok.com/ombi" },
            { "name": "Sonarr", "shortcutKey": "t", "url": "https://home.piggerbok.com/sonarr" },
            { "name": "Radarr", "shortcutKey": "m", "url": "https://home.piggerbok.com/radarr" },
            { "name": "SABnzbd", "shortcutKey": "s", "url": "https://home.piggerbok.com/sabnzbd" },
        "groupName": "Personal",
        "items":[
            {"name": "Item I", "shortcutKey": "z", "url": "https://google.com/?q=z"},
            {"name": "Item J", "shortcutKey": "x", "url": "https://google.com/?q=x"},
            {"name": "Item K", "shortcutKey": "c", "url": "https://google.com/?q=c"}


        ]
    }

]

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

function setupWelcomeMessage(){
    let curHours = new Date().getHours();
    curHours = Math.floor(curHours/6); // Simply dividing current hours by 6 proves to be a good enough aproximation.
    if (curHours == 4) curHours = 3;
    let welcome = "Good " + WELCOME_MESSAGE_TEMPLATE[curHours] + ", " + NAME;
    document.getElementById("welcome-string").innerHTML = welcome;
}

function setupGroups(){
    for (let i = 0; i < MASTER_MAP.length; i++){
        let curGroupData = MASTER_MAP[i];

        let group = document.createElement("div");
        group.className = "group";
        $container.appendChild(group);

        let header = document.createElement("h1");
        header.innerHTML = curGroupData.groupName;
        group.appendChild(header);

        for (let j = 0; j < curGroupData.items.length; j++){
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

    if (listeningForShortcut && getUrl.hasOwnProperty(key)){
        window.location = getUrl[key];
    }

    if (key === SHORTCUT_STARTER) {
        clearTimeout(listenerTimeout);
        listeningForShortcut = true;

        // Animation reset
        for (let i = 0; i < $shortcutDisplayList.length; i++){
            $shortcutDisplayList[i].style.animation = "none";
            setTimeout(function() { $shortcutDisplayList[i].style.animation = ''; }, 10);
        }

        listenerTimeout = setTimeout(function(){ listeningForShortcut = false; }, SHORTCUT_TIMEOUT);
    }
}

function main(){
    setBackgroundImage();
    setupWelcomeMessage();
    setupGroups();
    document.addEventListener('keyup', shortcutListener, false);
}

main();
