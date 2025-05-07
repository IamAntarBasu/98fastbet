const PUSHO = (function(FILE_URL, PUSHO_DEBUG,async = true) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);

  if(PUSHO_DEBUG){
    scriptEle.addEventListener("load", () => {
      console.log("Pusho Loaded Successfully")
    });
    scriptEle.addEventListener("error", (ev) => {
      console.error("Error on loading file", ev);
    });
  }
})("https://www.push.shrimatka.in/push/0.0.0/app.js?v=0.0.6", PUSHO_DEBUG);