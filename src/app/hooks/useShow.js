import { useState } from "react";

export default function useShow() {
  const [show, setShow] = useState(false);

  const toggleShowVisibility = () => {
    setShow((prev) => !prev);
  };

  return [show, toggleShowVisibility];
}
