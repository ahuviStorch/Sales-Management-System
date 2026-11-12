import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PreviewV5 from "./PreviewV5";
import "./preview.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreviewV5 />
  </StrictMode>
);
