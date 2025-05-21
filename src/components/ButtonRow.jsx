import Button from './Button';

export default function ButtonRow({ row, onButtonClick }) {
	const buttons = row.map((item, index) =>
		<Button 
			key={index}
			item={item}
			onClick={onButtonClick}
		/>
	);

	return (
		<div className="button-row">
			{buttons}
		</div>
	);
}
