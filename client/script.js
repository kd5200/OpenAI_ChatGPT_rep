import bot from "./assets/bot.svg"; //importing bot file
import user from "./assets/user.svg"; //importing user file

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
} // creating a function that handles the loading prompt before responding to the user for our bot

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generationUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
} // creating a function to generate a

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
        <div class= "profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>


  
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  const uniqueId = generationUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch("https://chatgpt-clone-puxn.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    console.log({ parsedData });

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong! :/";

    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
