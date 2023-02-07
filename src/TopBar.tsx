import styled from 'styled-components'

interface Props {
  onOpenMap: () => void
  onOpenSettings: () => void
  accuracy: number | undefined
  lastActions: string[]
}

const StyledAccuracy = styled.span<Pick<Props, 'accuracy'>>`
  color: ${({ accuracy }) => {
    if (accuracy === undefined) {
      return '#333'
    }

    if (accuracy < 10) {
      return '#c1e1c1'
    }

    if (accuracy < 20) {
      return '#ffb347'
    }

    return '#ff6961'
  }};
`

export default function TopBar(props: Props) {
  return (
    <div className="row">
      <div className="info" onClick={() => props.onOpenMap()}>
        <img className="info-icon" src="icons/map_black_24dp.svg" />
        <StyledAccuracy accuracy={props.accuracy}>
          {props.accuracy === undefined
            ? 'N/A'
            : `${Math.round(props.accuracy)}m`}
        </StyledAccuracy>
      </div>
      <div className="info">
        <img className="info-icon" src="icons/history_black_24dp.svg" />
        <ul id="history">
          {/* todo use id */}
          {props.lastActions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="info" onClick={() => props.onOpenSettings()}>
        <img className="info-icon" src="icons/settings_black_24dp.svg" />
      </div>
    </div>
  )
}
