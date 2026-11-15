
import type { MouseEvent } from "react";
import type { NavigateFunction } from "react-router";

type PageTransitionOptions = {
  event: MouseEvent<HTMLAnchorElement>;
  navigate: NavigateFunction;
  destination: string;
};

export const navigateWithTransition = ({
  event,
  navigate,
  destination,
}: PageTransitionOptions) => {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();

  const homePage = document.querySelector(".home-page-transition");

  if (!homePage) {
    console.warn("Homepage transition wrapper was not found.");
    navigate(destination);
    return;
  }

  // Restart the animation if the class was already applied.
  homePage.classList.remove("home-page-exit");
  void (homePage as HTMLElement).offsetWidth;
  homePage.classList.add("home-page-exit");

  window.setTimeout(() => {
    navigate(destination);
  }, 350);
};
