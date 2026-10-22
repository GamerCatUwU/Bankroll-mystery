(() => {
  const popupLayer = document.querySelector("#popup-layer");
  const cursor = document.querySelector("#cursor");
  const toast = document.querySelector("#toast");
  const pauseButton = document.querySelector("#pause-button");
  const popupStatus = document.querySelector("#popup-status");
  let paused = false;
  let nextPopup;
  let toastTimer;
  let cursorStarted = false;
  let lastTrailTime = 0;
  let lastCursorX = 0;
  let lastCursorY = 0;
  let count = 7318 + Math.floor(Math.random() * 90);
  document.querySelector("#visitor-count").textContent = String(count).padStart(8, "0");

  const popups = [
    ["🚨", "YOU HAVE BEEN SELECTED!!!", "The computer has selected you for a prize of one (1) extremely excited hamster.", ["WOW!!!", "NOT NOW"]],
    ["🤑", "BANKROLL ALERT!!!", "The bankroll train has arrived and is asking you to sign the guestbook before it unloads.", ["GIMME!!!", "ASK LATER"]],
    ["🦆", "DUCK SAYS CLICK OK", "The duck is wearing sunglasses indoors. It says the invite code is probably under the couch.", ["OK DUCK", "QUACK"]],
    ["🎰", "JACKPOT ALERT!!!", "The wheel landed on Steve's lucky number. Steve is very excited and has found one of his shoes.", ["CLAIM IT!!!", "STEVE? WHO?"]],
    ["💸", "FREE MONEY ALERT!!!", "The dollar sign is wearing a tiny hat and has requested its own guestbook page!!!", ["TINY HAT!!!", "CLOSE"]],
    ["📢", "IMPORTANT INTERNET NEWS", "A website has put a blinking message inside another blinking message. The year is 2008 again.", ["INCREDIBLE", "MAKE IT STOP"]],
    ["🐸", "FROG WANTS YOUR OPINION", "Would you rather fight one giant frog or 100 tiny frogs with tiny briefcases?", ["GIANT FROG", "BRIEFCASE FROGS"]],
    ["🛸", "MYSTERY INVITE DETECTED", "A suspiciously shiny envelope is orbiting your mouse pointer. Click the big green button to inspect it.", ["INSPECT!!!", "NOPE"]],
  ];

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("on"), 2600);
  }

  function closePopup() { popupLayer.replaceChildren(); }

  function showPopup(item = popups[Math.floor(Math.random() * popups.length)]) {
    closePopup();
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", item[1]);
    const maxLeft = Math.max(8, window.innerWidth - 326);
    const maxTop = Math.max(65, window.innerHeight - 265);
    popup.style.left = `${8 + Math.random() * Math.max(0, maxLeft - 8)}px`;
    popup.style.top = `${65 + Math.random() * Math.max(0, maxTop - 65)}px`;
    popup.innerHTML = `<div class="popup-title"><span>INTERNET EXPLORER — MESSAGE!!!</span><button type="button" aria-label="Close popup">X</button></div><div class="popup-content"><div class="popup-icon" aria-hidden="true">${item[0]}</div><h3></h3><p></p><div class="popup-actions"></div></div>`;
    popup.querySelector("h3").textContent = item[1];
    popup.querySelector(".popup-content p").textContent = item[2];
    popup.querySelector(".popup-title button").addEventListener("click", closePopup);
    const actions = popup.querySelector(".popup-actions");
    item[3].forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        closePopup();
        if (label.includes("COPY")) return copyCode();
        showToast(label.includes("STOP") || label === "NOT NOW" ? "Popup paused for approximately 0.8 seconds!!!" : "EXCELLENT CHOICE!!! The computer is impressed.");
      });
      actions.append(button);
    });
    popupLayer.append(popup);
  }

  function schedulePopup() {
    clearTimeout(nextPopup);
    if (paused || document.hidden) return;
    nextPopup = setTimeout(() => {
      if (!paused && !document.hidden) showPopup();
      schedulePopup();
    }, 5200 + Math.random() * 3800);
  }

  async function copyCode() {
    const code = document.querySelector("#invite-code").textContent;
    try {
      await navigator.clipboard.writeText(code);
      showToast(`CODE COPIED!!! ${code} — paste your real invite destination in before launch.`);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = code;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.left = "-9999px";
      document.body.append(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      showToast(`CODE COPIED!!! ${code}!!!`);
    }
  }

  document.querySelector("#copy-code").addEventListener("click", copyCode);
  document.querySelector("#claim-button").addEventListener("click", copyCode);
  document.querySelector("#header-join").addEventListener("click", () => showPopup(["💸", "YOUR INVITE IS ALMOST HERE!!!", "The invite code is on its way. Steve is watching the mailbox very carefully.", ["COPY THE CODE", "I WILL!!!"]]));
  document.querySelector("#steve-button").addEventListener("click", () => showPopup(["🧔", "STEVE SAYS...", "The invite code is nearly here. He is guarding the modem until it arrives.", ["THANKS STEVE", "ASK AGAIN"]]));
  document.querySelector("#sign-button").addEventListener("click", () => showPopup(["📖", "GUESTBOOK SIGNED!!!", "Your name has been written in invisible ink. You are now internet famous in this browser tab.", ["I'M FAMOUS", "SHOW MY MUM"]]));
  document.querySelector("#spin-button").addEventListener("click", () => {
    showPopup(["🎰", "THE WHEEL HAS SPOKEN!!!", "It landed on Steve's lucky number. Steve is very excited and has found one of his shoes.", ["WOOHOO!!!", "SPIN AGAIN"]]);
  });
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseButton.textContent = paused ? "RESUME" : "PAUSE";
    pauseButton.setAttribute("aria-pressed", String(paused));
    popupStatus.textContent = paused ? "PAUSED" : "ON";
    if (paused) closePopup();
    schedulePopup();
  });
  document.addEventListener("visibilitychange", schedulePopup);

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const hadPreviousPosition = cursorStarted;
    const previousX = lastCursorX;
    const previousY = lastCursorY;
    if (!cursorStarted) {
      cursorStarted = true;
      document.body.classList.add("mouse-mode");
      cursor.classList.add("visible");
    }
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    const now = performance.now();
    if (hadPreviousPosition && now - lastTrailTime > 75) {
      lastTrailTime = now;
      const trail = document.createElement("span");
      trail.className = "cursor-trail";
      trail.textContent = "PM";
      trail.style.left = `${previousX + 8}px`;
      trail.style.top = `${previousY + 10}px`;
      trail.style.setProperty("--twist", `${Math.round(Math.random() * 30 - 15)}deg`);
      document.body.append(trail);
      setTimeout(() => trail.remove(), 2100);
    }
    lastCursorX = event.clientX;
    lastCursorY = event.clientY;
  });
  window.addEventListener("blur", () => cursor.classList.remove("visible"));
  setTimeout(schedulePopup, 1800);
})();
