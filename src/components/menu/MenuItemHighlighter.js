"use client";

import { useEffect } from "react";

const highlightClass = "menu-item-anchor-highlight";
const highlightDurationMs = 3000;

function getTargetElement(hash) {
  if (!hash || hash === "#") {
    return null;
  }

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function highlightElement(element) {
  if (!element?.classList.contains("menu-item-anchor")) {
    return;
  }

  window.clearTimeout(Number(element.dataset.highlightTimeout || 0));
  element.classList.remove(highlightClass);
  void element.offsetWidth;
  element.classList.add(highlightClass);

  const timeout = window.setTimeout(() => {
    element.classList.remove(highlightClass);
    delete element.dataset.highlightTimeout;
  }, highlightDurationMs);

  element.dataset.highlightTimeout = String(timeout);
}

function scrollAndHighlight(hash, behavior = "smooth") {
  const element = getTargetElement(hash);

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior,
    block: "start",
  });

  window.setTimeout(() => highlightElement(element), behavior === "smooth" ? 450 : 80);
  return true;
}

export default function MenuItemHighlighter() {
  useEffect(() => {
    if (window.location.hash) {
      window.setTimeout(() => scrollAndHighlight(window.location.hash, "auto"), 80);
    }

    function handleHashChange() {
      scrollAndHighlight(window.location.hash);
    }

    function handleClick(event) {
      const link = event.target.closest?.("a[href*='#']");

      if (!link) {
        return;
      }

      const targetUrl = new URL(link.href, window.location.href);

      if (targetUrl.pathname !== window.location.pathname || !targetUrl.hash) {
        return;
      }

      const element = getTargetElement(targetUrl.hash);

      if (!element?.classList.contains("menu-item-anchor")) {
        return;
      }

      event.preventDefault();

      const clearedUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", clearedUrl);

      window.requestAnimationFrame(() => {
        window.history.pushState(null, "", `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
        scrollAndHighlight(targetUrl.hash);
      });
    }

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
