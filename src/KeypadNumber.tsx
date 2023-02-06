import styled from "styled-components"
import KeypadButton from "./KeypadButton"

const StyledKeypadButton = styled(KeypadButton)`
  background: #c1e1c1;
`

export default function KeypadNumber(props: {
  className?: string,
  number: number,
  onClick: (number: number) => void,
}) {
  return <StyledKeypadButton
    className={props.className}
    onClick={() => props.onClick(props.number)}
  >
    {props.number}
  </StyledKeypadButton>
}
