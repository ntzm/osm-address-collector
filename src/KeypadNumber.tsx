import KeypadButton from "./KeypadButton"

export default function KeypadNumber(props: {
  className?: string,
  disabled: boolean,
  number: number,
  onClick: (number: number) => void,
}) {
  return <KeypadButton
    className={props.className}
    disabled={props.disabled}
    colour="#c1e1c1"
    onClick={() => props.onClick(props.number)}
  >
    {props.number}
  </KeypadButton>
}
