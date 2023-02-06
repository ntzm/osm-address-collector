import { PropsWithChildren } from "react"
import styled from "styled-components"

type Props = PropsWithChildren<{
  className?: string,
  disabled?: boolean,
  colour?: string,
  touchStart?: boolean
  onClick: () => void,
}>

const StyledButton = styled.button<Pick<Props, 'colour' | 'disabled'>>`
  font-size: 24pt;
  width: 100%;
  height: 100%;
  border: 1px #999 solid;
  background: ${({colour}) => colour ?? '#eee'};
  color: #333;
  font-weight: bold;
  padding: 0;

  ${({disabled}) => disabled && `
    background: #999;
  `}
`

export default function KeypadButton(props: Props) {
  return <StyledButton
    className={props.className}
    disabled={props.disabled}
    colour={props.colour}
    onClick={() => props.onClick()}
    {...(props.touchStart ? {
      onTouchStart: () => props.onClick(),
      onTouchEnd: e => e.preventDefault(),
    } : {} )}
  >
    {props.children}
  </StyledButton>
}
