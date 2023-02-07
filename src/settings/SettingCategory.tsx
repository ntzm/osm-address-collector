import { PropsWithChildren } from 'react'

export default function SettingCategory(
  props: PropsWithChildren<{
    heading: string
    help?: string
  }>,
) {
  return (
    <div className="setting-category">
      <h2
        className="setting-category__heading"
        onClick={() => props.help && alert(props.help)}
      >
        {props.help && <span className="setting-category__info">ⓘ</span>}
        {props.heading}
      </h2>

      {props.children}
    </div>
  )
}
