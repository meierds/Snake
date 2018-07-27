let speedSlider = document.getElementById('speedSlider');
let sizeSlider = document.getElementById('sizeSlider');
let colorWell1 = document.getElementById('headColorWell');
let colorWell2 = document.getElementById('bodyColorWell');
let submit = document.getElementById('submitButton');

function restoreDefault(){
    slider1.value = slider1.defaultValue;
    slider2.value = slider2.defaultValue;
    colorWell1.value = colorWell1.defaultValue;
    colorWell2.value = colorWell2.defaultValue;
}

function hideScreen(hideScreen, showScreen) {
    let show = document.getElementById(showScreen);
    let hide = document.getElementById(hideScreen);

    hide.classList.add('fadeout');

    setTimeout(() => {
      hide.classList.remove('fadeout');
      hide.classList.add('hidden');
      show.classList.remove('hidden');
      show.classList.add('fadein');
    }, 500)

    setTimeout(() =>{
      show.classList.remove('fadein')
    },1000)

    if(showScreen === 'game'){
      Game.animate();
    }
  }