(function (){
  console.log("bookmarklet starting");
  let paragraphs = document.getElementsByTagName
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].innerHTML = 'kitten';
  }
}) ();
//script.src = url + "?" + new Date().getTime();

// loading failed with socket
// still getting message that 'paragraphs[i]' is not defined
