function havenInit() {
  window.haven = (title, message, x, y, audio) => {
    $(".haven").html(`<button onclick="this.parentElement.style.display='none';" style='position:absolute; top:10pt; right:10pt; font-size:10pt; padding:5px; width:24pt; cursor: pointer;' class='button'><img width='12pt' src='Assets/Icons/Close@2x.png'></button>
    <img style='float:left; height:100pt; margin-right:10pt;' src='Assets/Haven/haven_standard.png'><h1>${title}</h1><hr><p>"${message}"</p>`);
    $(".haven").css({
      "position":"absolute",
      "left":x,
      "top":y,
    });
  }
}

export default havenInit;