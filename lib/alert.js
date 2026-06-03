const alertVariants = {
  info: "bg-blue-50 text-blue-800 border border-blue-200",

  success: "bg-green-50 text-green-800 border border-green-200",

  warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",

  danger: "bg-red-50 text-red-800 border border-red-200",
};

const createAlertContainer = () => {
  let container = document.querySelector(".alertContainer");

  if (!container) {
    container = document.createElement("div");
    container.className = "alertContainer";
    document.body.appendChild(container);
  }

  return container;
};

const showAlert = (type, message, duration = 3000) => {
  const alertContainer = createAlertContainer();
  const alertElem = document.createElement("div");

  alertElem.innerHTML = `
    <section class="flex items-start gap-3 rounded-lg p-3 text-sm ${alertVariants[type]} mb-4 mx-2 absolute min-w-100 top-20 right-0 z-100">
      ${message}
    </section>`;
  alertContainer.appendChild(alertElem);
  const timeout = setInterval(() => {
    alertContainer.remove();
  }, duration);

  return () => clearTimeout(timeout);
};

export default showAlert;
