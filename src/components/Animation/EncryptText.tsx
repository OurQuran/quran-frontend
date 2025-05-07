import { useRef, useState, useEffect } from "react";

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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [text, setText] = useState(target);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = target
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= target.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  useEffect(scramble, [SHUFFLE_TIME, target]);
  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(target);
  };

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
