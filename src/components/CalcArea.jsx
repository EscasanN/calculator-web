import Screen    from './Screen'
import ButtonRow from './ButtonRow'
import { useCalculator } from './useCalculator'

export default function CalcArea() {
	const { shown, rows, onButtonClick } = useCalculator()

	return (
		<div className="calc-area">
		<Screen value={shown} />
		<div className="button-area">
		{rows.map((row, i) =>
			<ButtonRow key={i} row={row} onButtonClick={onButtonClick}/>
		)}
		</div>
		</div>
	)
}
