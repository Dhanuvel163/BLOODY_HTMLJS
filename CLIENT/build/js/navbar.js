window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.background= "linear-gradient(45deg,rgba(72, 44, 191, 1) 0%,rgba(106, 198, 240, 1) 100%)"
    document.getElementById("navbar").style.boxShadow= "0 0 10px #000000"
    document.getElementById("navbar").style.padding = "30px 10px";
    document.getElementById("navbar").style.height= "80px"
  } else {
    document.getElementById("navbar").style.background= "none"
    document.getElementById("navbar").style.height= "100px"
    document.getElementById("navbar").style.padding = "80px 10px";
    document.getElementById("navbar").style.boxShadow= "none"
  }
}