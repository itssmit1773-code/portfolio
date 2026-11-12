(() => {
  // Content stays visible with or without scripting.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reduced.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reduced.matches) entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.16 });
    document.querySelectorAll("[data-reveal]").forEach(item => observer.observe(item));
  }

  const preview = document.querySelector("[data-preview]");
  const dialog = document.querySelector(".preview-dialog");
  if (!preview || typeof dialog?.showModal !== "function") return;

  const fullImage = dialog.querySelector(".full-image");
  const frame = dialog.querySelector(".dialog-image");
  const close = dialog.querySelector("button");
  preview.setAttribute("aria-haspopup", "dialog");
  preview.addEventListener("click", event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!frame.firstElementChild) {
      const image = preview.querySelector("img").cloneNode();
      image.removeAttribute("loading");
      frame.append(image);
      fullImage.href = preview.href;
    }
    dialog.showModal();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const atBoundary = event.shiftKey ? event.target === fullImage : event.target === close;
    if (!atBoundary) return;
    event.preventDefault();
    (event.shiftKey ? close : fullImage).focus();
  });
  dialog.addEventListener("close", () => preview.focus({ preventScroll: true }));
})();
