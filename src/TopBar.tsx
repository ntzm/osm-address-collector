interface TopBarProps {
  onOpenMap: () => void
  onOpenSettings: () => void
  accuracy: number
  history: string[]
}

export default function TopBar(props: TopBarProps) {
  return (
    <div className="row">
      <div className="info" onClick={() => props.onOpenMap()}>
        <img className="info-icon" src="icons/map_black_24dp.svg" />
        {/* todo colours */}
        <span id="accuracy">{props.accuracy}m</span>
      </div>
      <div className="info">
        <img className="info-icon" src="icons/history_black_24dp.svg" />
        <ul id="history">
          {/* todo use id */}
          {props.history.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="info" onClick={() => props.onOpenSettings()}>
        <img className="info-icon" src="icons/settings_black_24dp.svg" />
      </div>
    </div>
  )
}
