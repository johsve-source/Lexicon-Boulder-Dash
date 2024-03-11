import { useState } from "react"
import "./ControlsInfo.css"

const controls = {
	Upp: ["W", "🠉"],
	Down: ["S", "🠋"],
	Left: ["A", "🠈"],
	Right: ["D", "🠊"],
}

function ControlsInfo() {
	const [visible, setVisible] = useState(false)

	return (
		<button
			className={visible ? "controls-info visible" : "controls-info"}
			onClick={() => {
				setVisible(!visible)
			}}
		>
			Controls
			<div className="info">
				<table>
					{Object.entries(controls).map(([maping, keys], index) => (
						<tr key={index}>
							<td>{maping}:</td>
							{keys.map(key => (
								<td>
									<b>{key}</b>
								</td>
							))}
						</tr>
					))}
				</table>
			</div>
		</button>
	)
}

export default ControlsInfo
