import { useState } from "react";

export default function useInput() {
  const [value, setValue] = useState("");

  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };
  return [value, onValueChangeHandler];
}
