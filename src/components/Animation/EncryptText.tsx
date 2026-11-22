import { useState, useEffect } from "react";

export default function EncryptText({
  target,
  shuffleTime,
  customPart,
  customClass,
}: {
  target: string;
  shuffleTime?: number;
  customPart?: string;
  customClass?: string;
}) {
  const CYCLES_PER_LETTER = 2;
  const SHUFFLE_TIME = shuffleTime ?? 80;
  const CHARS = "!@#$%^&*():{};|,.<>/?";

  const [text, setText] = useState(target);

  useEffect(() => {
    let pos = 0;

    const interval = setInterval(() => {
      const scrambled = target
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          return CHARS[randomCharIndex];
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= target.length * CYCLES_PER_LETTER) {
        clearInterval(interval);
        setText(target);
      }
    }, SHUFFLE_TIME);

    return () => clearInterval(interval);
  }, [SHUFFLE_TIME, target]);

  const parts = text.split(new RegExp(`(${customPart})`, "gi"));

  return (
    <span>
      {customPart
        ? parts.map((part, index) =>
            part.toLowerCase() === customPart.toLowerCase() ? (
              <span key={index + "part"} className={customClass}>
                {part}
              </span>
            ) : (
              part
            )
          )
        : text}
    </span>
  );
}
