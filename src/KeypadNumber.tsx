import styled from "styled-components"
import KeypadButton from "./KeypadButton"

const StyledKeypadButton = styled(KeypadButton)`
  background: #c1e1c1;

  ${({disabled}) => disabled && `
    background: #999;
  `}
`

export default function KeypadNumber(props: {
  className?: string,
  disabled: boolean,
  number: number,
  onClick: (number: number) => void,
}) {
  return <StyledKeypadButton
    className={props.className}
    disabled={props.disabled}
    onClick={() => props.onClick(props.number)}
  >
    {props.number}
  </StyledKeypadButton>
}
