import { useState } from 'react';

export default function (defaultValue?: boolean | (() => boolean)) {
  const [content, setContent] = useState(defaultValue ?? false);

  function on() {
    setContent(true);
  }

  function off() {
    setContent(false);
  }

  function toggle() {
    setContent((pre) => !pre);
  }

  function update(value: boolean) {
    if (!!value) return on();
    off();
  }

  return [
    content,
    {
      on,
      off,
      toggle,
      update,
    },
  ] as const;
}
