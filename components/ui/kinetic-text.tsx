import React from "react"
import styles from "./kinetic-text.module.css"

type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"

type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text: string
  as?: As
}

export function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}: KineticTextProps) {
  const mergedStyle = {
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties

  const words = text.split(" ")

  return (
    <Tag
      {...rest}
      className={`${styles.wrapper} ${className}`}
      style={mergedStyle}
    >
      {words.map((word, wi) => (
        <span key={wi} className={styles.word}>
          {word.split("").map((letter, li) => (
            <span
              key={li}
              aria-hidden="true"
              className={styles.letter}
            >
              {letter}
            </span>
          ))}
          {wi < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  )
}
