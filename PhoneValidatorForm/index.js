// Target endpoint
const API_ENDPOINT =
  "http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT/api/phonevalidator/isvalid";

// Query parameter name the endpoint expects for the phone number
const PHONE_PARAM = "pNum";

const form = document.getElementById("validate-form");
const input = document.getElementById("phone");
const button = document.getElementById("validate-btn");
const output = document.getElementById("output");
const outputBody = document.getElementById("output-body");
const outputStatus = document.getElementById("output-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const phone = input.value.replace(/\s+/g, "");
  if (!phone) {
    input.focus();
    return;
  }

  setLoading(true);

  try {
    const url = new URL(API_ENDPOINT);
    url.searchParams.set(PHONE_PARAM, phone);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "*/*" },
    });

    const data = await parseBody(response);

    if (!response.ok) {
      throw new Error(`The server responded with status ${response.status}.`);
    }

    renderSuccess(data);
  } catch (error) {
    renderError(error);
  } finally {
    setLoading(false);
  }
});

/* ---------- Helpers ---------- */

async function parseBody(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function setLoading(isLoading) {
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.querySelector(".btn-text").textContent = isLoading
    ? "Validating"
    : "Validate";

  if (isLoading) {
    setState("loading", "Checking");
    outputBody.replaceChildren(textNode("Contacting the validation service…"));
  }
}

function setState(state, label) {
  output.dataset.state = state;
  outputStatus.textContent = label;
}

function textNode(text) {
  const p = document.createElement("p");
  p.className = "message";
  p.textContent = text;
  return p;
}

function renderSuccess(data) {
  const verdict = findVerdict(data);
  const nodes = [];

  if (verdict === true) {
    setState("success", "Valid");
    nodes.push(textNode("This phone number is valid."));
  } else if (verdict === false) {
    setState("error", "Invalid");
    nodes.push(
      textNode(
        "This phone number is not valid. Check the digits and country code.",
      ),
    );
  } else {
    setState("success", "Received");
    nodes.push(textNode("The service returned a response."));
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    nodes.push(buildRows(data));
  }

  nodes.push(buildRaw(data));
  outputBody.replaceChildren(...nodes);
}

function renderError(error) {
  setState("error", "Failed");

  const isNetwork = error instanceof TypeError;
  const message = isNetwork
    ? "Could not reach the server. Check your connection and the endpoint URL, then try again."
    : error.message;

  outputBody.replaceChildren(textNode(message));
}

// Looks for a boolean validity flag in common key names
function findVerdict(data) {
  if (typeof data === "boolean") return data;
  if (typeof data === "string") {
    const value = data.trim().toLowerCase();
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
  }
  if (!data || typeof data !== "object") return null;
  for (const key of ["valid", "isValid", "is_valid"]) {
    if (typeof data[key] === "boolean") return data[key];
  }
  return null;
}

function buildRows(data) {
  const list = document.createElement("dl");
  list.className = "rows";

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement("div");
    row.className = "row";

    const dt = document.createElement("dt");
    dt.textContent = key;

    const dd = document.createElement("dd");
    dd.textContent =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : String(value);

    row.append(dt, dd);
    list.append(row);
  }

  return list;
}

function buildRaw(data) {
  const pre = document.createElement("pre");
  pre.className = "raw";
  pre.textContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return pre;
}
