document.addEventListener("DOMContentLoaded", () => {
  const message = document.querySelector(".autho-message");
  const messageBox = document.querySelector(".autho-message-box");
  const registrationForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");

  const showMessage = () => {
    messageBox.classList.add("show");
    setTimeout(() => messageBox.classList.remove("show"), 3000);
  };

  const handleFormSubmit = async (form, url) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const requestBody = Object.fromEntries(formData.entries());
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const responseData = await response.json();
        if (response.ok) {
          message.textContent = responseData.message || "Success";
          showMessage();
          form.reset();
          // window.location.href = redirectUrl;
        } else {
          throw new Error(responseData.message || "Failed");
        }
      } catch (error) {
        console.error(error.message);
        message.textContent = error.message || "Failed";
        showMessage();
      }
    });
  };

  if (registrationForm) {
    handleFormSubmit(registrationForm, "/api/v1/user/register");
  }

  if (loginForm) {
    handleFormSubmit(loginForm, "/api/v1/user/login");
  }

  const currentURL = window.location.pathname;
  const loginBtn = document.getElementById("login");
  const sigUpBtn = document.getElementById("register");

  if (currentURL === "/login") {
    loginBtn.classList.add("atho-btn-active");
    sigUpBtn.classList.remove("atho-btn-active");
  }
});
