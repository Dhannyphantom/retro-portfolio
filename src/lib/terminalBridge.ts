// Small DOM-level bridge so the top menu bar (which lives on every page) can
// drive the homepage without prop-drilling or touching RetroHome's state.

export const PENDING_KEY = "retro-pending-action";
export type PendingAction = { type: "scroll"; id: string } | { type: "help" };

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function setNativeValue(input: HTMLInputElement, value: string) {
  // React tracks the value itself, so a plain `input.value = x` is ignored.
  // Going through the prototype setter + a real "input" event makes the
  // controlled <input> in the terminal pick the change up.
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

let busy = false;

/**
 * Scrolls to the homepage terminal, types `cmd` into it one character at a
 * time (the terminal draws its own retro prompt + caret from that input), then
 * presses Enter. Does not focus the input, so mobile keyboards stay closed.
 */
export async function runTerminalCommand(cmd: string, typeDelay = 95) {
  if (busy) return;
  const input = document.querySelector<HTMLInputElement>('input[aria-label="Terminal input"]');
  if (!input) return;
  busy = true;
  try {
    (input.parentElement ?? input).scrollIntoView({ behavior: "smooth", block: "center" });
    await sleep(750); // let the smooth scroll land
    setNativeValue(input, "");
    for (let i = 1; i <= cmd.length; i++) {
      setNativeValue(input, cmd.slice(0, i));
      await sleep(typeDelay + Math.random() * 45);
    }
    await sleep(450);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  } finally {
    busy = false;
  }
}
