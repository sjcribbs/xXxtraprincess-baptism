(function (){
  console.log("bookmarklet starting");
  let paragraphs = document.getElementsByTagName
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].innerHTML = 'kitten';
  }
}) ();

// loading failed with socket
//
