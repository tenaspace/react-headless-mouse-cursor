import React, { ReactNode, useRef, useState } from 'react'
import { useEventListener } from './hooks'

interface IMouseCursor {
  showDefaultCursor?: boolean
  children: ({ mouseOverValue }: { mouseOverValue?: string }) => ReactNode
}

const MouseCursor = ({ showDefaultCursor = true, children }: IMouseCursor) => {
  const [isMoved, setIsMoved] = useState<boolean>(false)

  const [mouseOverValue, setMouseOverValue] = useState<string>(``)

  const ref = useRef<HTMLDivElement>(null)

  useEventListener(`mousemove`, (event) => {
    if (!isMoved) {
      setIsMoved(true)
    }
    if (ref && ref.current) {
      if (event.clientX && event.clientY) {
        ref.current.style.transform = `translate3d(calc(${event.clientX.toString()}px - 50%), calc(${event.clientY.toString()}px - 50%), 0)`
      }
    }
  })

  useEventListener(`mouseout`, (event) => {
    if (
      event.clientY <= 0 ||
      event.clientX <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight
    ) {
      setIsMoved(false)
    }
  })

  useEventListener(`mouseover`, (event) => {
    if (event.target instanceof HTMLElement) {
      setMouseOverValue(event.target.dataset.mouseover ?? ``)
    }
  })
  return (
    <>
      {!showDefaultCursor && (
        <style>
          {`
          html,
          html * {
            cursor: none !important;
          }
        `}
        </style>
      )}
      <div
        ref={ref}
        style={{
          position: `fixed`,
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: `none`,
          display: isMoved ? `block` : `none`,
        }}
      >
        {children({ mouseOverValue })}
      </div>
    </>
  )
}

export const HeadlessMouseCursor = MouseCursor
