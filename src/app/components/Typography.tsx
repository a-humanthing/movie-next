import React from "react";

export function HeadingOne({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="heading-one">
      {children}
    </h1>
  );
}
export function HeadingTwo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="heading-two">
      {children}
    </h2>
  );
}
export function HeadingThree({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="heading-three">
      {children}
    </h3>
  );
}
export function HeadingFour({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="heading-four">
      {children}
    </h4>
  );
}
export function HeadingFive({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="heading-five">
      {children}
    </h5>
  );
}
export function HeadingSix({ children }: { children: React.ReactNode }) {
  return (
    <h6 className="heading-six">
      {children}
    </h6>
  );
}
export function BodyLarge({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-large">
      {children}
    </div>
  );
}
export function BodyRegular({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-regular">
      {children}
    </div>
  );
}
export function BodySmall({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-small">
      {children}
    </div>
  );
}
export function BodyXS({ children }: { children: React.ReactNode }) {
  return (
    <div className="body-xs">
      {children}
    </div>
  );
}
export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="caption">
      {children}
    </div>
  );
} 