const NAME = "John";
const WELCOME_MESSAGE_TEMPLATE = ["night", "morning", "afternoon", "evening"];

// Setup welcome message
// Simply dividing current hours by 6 proves to be a good enough aproximation of how late it is.
let curHours = new Date().getHours();
curHours = Math.floor(curHours/6);
if (curHours == 4) curHours = 3;

let welcome = "Good " + WELCOME_MESSAGE_TEMPLATE[curHours] + ", " + NAME;
document.getElementById("welcome-string").innerHTML = welcome;
