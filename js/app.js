/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const TIMER_INPUT_EL = document.querySelector(".timer__input"),
  BUTTON_EL = document.querySelector("button"),
  TIMER_CIRCLES_EL = document.querySelectorAll(".timer__circle"),
  TIMER_SECONDS_EL = document.querySelector(".timer__seconds"),
  INTERVALS = [];

BUTTON_EL.addEventListener("click", function () {
  const END_DATE = new Date(TIMER_INPUT_EL.value);
  if (
    END_DATE.toString() !== "Invalid Date" &&
    END_DATE - new Date() > 0 &&
    getTimeDifference(new Date(), END_DATE).days <= 999
  ) {
    if (INTERVALS.length) clearInterval(INTERVALS.pop());
    INTERVALS.push(initInterval(END_DATE));
    displayMsg("Enter upcoming date");
  } else displayMsg("INVALID DATE!");
  TIMER_INPUT_EL.value = "";
});

function displayMsg(msg) {
  TIMER_INPUT_EL.setAttribute("placeholder", msg);
}

for (const ELE of TIMER_CIRCLES_EL) {
  for (let i = 0; i < 36; i++) {
    const SPAN = document.createElement("span");
    SPAN.classList.add("--dot");
    SPAN.classList.add(`dot${i}`);
    SPAN.style.transform = `rotate(${i * 10}deg) translateX(${60 / 16}rem)`;
    ELE.appendChild(SPAN);
  }
}

function initInterval(endDate) {
  const COUNT = setInterval(() => {
    let timeFormats = getTimeDifference(new Date(), endDate);
    if (Object.keys(timeFormats).some(t => timeFormats[t] < 0)) {
      for (const T of Object.keys(timeFormats)) timeFormats[T] = 0;
      clearInterval(COUNT);
    }
    updateTime(TIMER_SECONDS_EL, timeFormats);
  }, 1000);
  return COUNT;
}

function getTimeDifference(startDate, endDate) {
  let seconds = (endDate - startDate) / 1000,
    minutes = seconds / 60,
    hours = minutes / 60,
    days = Math.floor(hours / 24);
  hours = Math.floor(hours - days * 24);
  minutes = Math.floor(minutes - hours * 60 - days * 24 * 60);
  seconds = Math.floor(
    seconds - minutes * 60 - hours * 60 * 60 - days * 24 * 60 * 60
  );
  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function updateTime(ele, timeFormats) {
  if (!ele) return;
  const DIGITS = Number(ele.getAttribute("data-digits")),
    CHILD = ele.firstElementChild;
  let newContent = String(timeFormats[ele.getAttribute("data-type")]);
  while (newContent.length < DIGITS) newContent = "0" + newContent;
  CHILD.setAttribute("data-time", newContent);
  doAnimation(CHILD);
  updateTime(ele.previousElementSibling, timeFormats);
}

function doAnimation(ele) {
  const PERCENTAGE =
    Number(ele.getAttribute("data-time")) /
    Number(ele.parentNode.getAttribute("data-base"));
  for (let i = 0; i < 36; i++) {
    if (i < Math.floor(PERCENTAGE * 36))
      ele.querySelector(`.dot${i}`).classList.remove("--fade");
    else ele.querySelector(`.dot${i}`).classList.add("--fade");
  }
}
