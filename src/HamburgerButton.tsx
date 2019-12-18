import { h } from "preact";

export function HamburgerButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <div className="hamburger-button" data-is-open={isOpen} onClick={onClick}>
      <div className="hamburger-button__bar1" />
      <div className="hamburger-button__bar2" />
      <div className="hamburger-button__bar3" />
    </div>
  );
}
