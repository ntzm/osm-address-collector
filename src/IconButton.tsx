import KeypadButton from "./KeypadButton";

export default function IconButton(props: {
  className?: string,
  disabled?: boolean,
  colour?: string,
  rotate?: number,
  src: string,
  onClick: () => void,
}) {
  return <KeypadButton
    className={props.className}
    disabled={props.disabled}
    colour={props.colour}
    onClick={props.onClick}
  >
    <img src={props.src} style={{transform: `rotate(${props.rotate ?? 0}deg)`}} />
  </KeypadButton>
}
