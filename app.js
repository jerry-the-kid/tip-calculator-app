const inputContainer = document.querySelectorAll("input[type='text']");
const tipsContainer = document.querySelector(".splitter__tips");
const tipBtns = document.querySelectorAll(".splitter__tip");
const tipResult = document.querySelector(".tip-result");
const totalResult = document.querySelector(".total-result");
const btnReset = document.querySelector(".button");
const notifications = document.querySelectorAll(".notification");

let currentFocusInput;
let currentInput, bill, percent, people;

const checkInvalid = function (number) {
  if (isNaN(number) || number <= 0) return true;
  return false;
};

const addNotify = function (target, notify) {
  const inputValue = target.dataset.type;
  const notification = document.querySelector(`.notification-${inputValue}`);
  currentInput = +target.value;

  target.style.border = "2px solid #FF8303";
  notification.style.opacity = 1;
  notification.textContent = notify;
};

const valued = function (type) {
  return checkInvalid(type) ? 0 : type;
};

const showResult = function () {
  let tipAmount = +((bill / people) * (percent / 100));
  if (isNaN(tipAmount) || !isFinite(tipAmount)) return;

  tipResult.textContent = `$${tipAmount.toFixed(2)}`;
  totalResult.textContent = `$${(bill / people + tipAmount).toFixed(2)}`;
};

const reset = function () {
  inputContainer.forEach((input) => {
    input.value = "";
    input.style.border = 0;
  });
  notifications.forEach((notify) => (notify.style.opacity = 0));

  bill = percent = people = 0;
  totalResult.textContent = tipResult.textContent = "$0.00";
};

btnReset.addEventListener("click", function () {
  reset();
});

tipsContainer.addEventListener("click", function (e) {
  const target = e.target.closest(".splitter__tip");

  tipBtns.forEach(function (btn) {
    if (btn != target) {
      btn.classList.remove("splitter__tip--active");
    }
  });
  if (!target) return;
  target.classList.add("splitter__tip--active");
  let tipChoice = [...target.textContent];
  tipChoice.pop();
  percent = +tipChoice.join("");
  showResult();
});

inputContainer.forEach(function (input) {
  input.addEventListener("blur", function (e) {
    const target = e.target;
    currentInput = +e.target.value;
    const relateTarget = e.relatedTarget;

    if (
      (e.target.dataset.type === "percent" &&
        relateTarget?.classList.contains("splitter__tip")) ||
      relateTarget?.classList.contains("button")
    ) {
      target.style.border = 0;
      return;
    }

    if (isNaN(currentInput) || currentInput < 0) {
      addNotify(target, "Invalid value");
    } else if (currentInput === 0 && e.target.dataset.type !== "percent") {
      addNotify(target, "Cant' be zero");
    } else {
      target.style.border = 0;
    }
  });

  input.addEventListener("focus", function (e) {
    const inputValue = e.target.dataset.type;
    currentFocusInput = e.target.dataset.type;
    const notification = document.querySelector(`.notification-${inputValue}`);
    e.target.style.border = "2px solid hsl(172, 67%, 45%)";
    notification.style.opacity = 0;
    if (checkInvalid(e.target.value)) {
      e.target.value = "";
    }
  });

  input.addEventListener("input", function (e) {
    const type = e.target.dataset.type;
    if (type !== "percent") {
      type === "bill" ? (bill = e.target.value) : (people = e.target.value);
    } else {
      percent = e.target.value;
    }

    percent = valued(percent);
    bill = valued(bill);
    people = valued(people);
    showResult();
  });
});

document.querySelector(".percent").addEventListener("click", function () {
  percent = +this.value;
  showResult();
});
