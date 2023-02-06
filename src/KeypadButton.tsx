import { PropsWithChildren } from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  font-size: 24pt;
  width: 100%;
  height: 100%;
  border: 1px #999 solid;
  background: #eee;
  color: #333;
  font-weight: bold;
  padding: 0;
`

export default function KeypadButton(props: PropsWithChildren<{
  className?: string,
  onClick: () => void,
}>) {
  return <StyledButton
    className={props.className}
    onClick={() => props.onClick()}
  >
    {props.children}
  </StyledButton>
}
