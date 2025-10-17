let Lightmod = false

function ChangeToDarkMod(){
    if(Lightmod){
        Lightmod = false;
        document.documentElement.style.setProperty("--text-color", "black");
        document.documentElement.style.setProperty("--background-color", "#efe7e5");
        document.getElementById("Dark-Light-Mode").innerHTML = "🌙";
    }else{
        //Dark Mod
        Lightmod = true;
        document.documentElement.style.setProperty("--text-color", "rgba(255, 255, 255, 1)");
        document.documentElement.style.setProperty("--background-color", "rgb(61, 61, 61)");
        document.getElementById("Dark-Light-Mode").innerHTML = "☀️";
    }
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});