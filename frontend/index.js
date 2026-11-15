document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("validationForm");
    const responseContainer = document.getElementById("responseContainer");
    const validateBtn = document.getElementById("validateBtn");

    // Define endpoints
    const endpoints = {
        nodejs: "http://localhost:3000/login", // Updated to match your Express POST route
        python: "http://localhost:3001/login",
        php: "http://localhost:3002/login",
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const backendSelect = document.getElementById("backendSelect").value;
        const targetEndpoint = endpoints[backendSelect];
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        // UI Update: Show loader, disable button, hide previous response
        const originalBtnText = validateBtn.innerHTML;
        validateBtn.disabled = true;
        validateBtn.innerHTML = '<span class="loader"></span> Validating...';
        responseContainer.className = "response-container hidden";

        try {
            const response = await fetch(targetEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            // Clear previous color classes
            responseContainer.className = "response-container";

            // Apply color based on HTTP status
            if (response.status === 200) {
                responseContainer.classList.add("status-green");
            } else if (response.status === 401) {
                responseContainer.classList.add("status-orange");
            } else if (response.status === 400 || response.status >= 500) {
                responseContainer.classList.add("status-red");
            } else {
                // Fallback for logical errors if your backend always returns 200
                if (data.success === false)
                    responseContainer.classList.add("status-red");
                else responseContainer.classList.add("status-green");
            }

            // Display ONLY the message
            responseContainer.textContent =
                data.message || "Request completed.";
        } catch (error) {
            responseContainer.className = "response-container status-red";
            responseContainer.textContent =
                "Network Error: Could not reach the server.";
        } finally {
            // Restore button state
            validateBtn.disabled = false;
            validateBtn.innerHTML = originalBtnText;
        }
    });
});
