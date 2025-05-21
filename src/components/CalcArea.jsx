import { useState } from 'react';
import ButtonRow from './ButtonRow';
import Screen from './Screen';

export default function CalcArea() {
	const [total, setTotal] = useState(0);
	const [num1, setNum1] = useState("0");
	const [num2, setNum2] = useState("0");
	const [op, setOp] = useState(0);
	const [shown, setShown] = useState("0");
	const [waitingForNum2, setWaitingForNum2] = useState(false);
	const [error, setError] = useState(false);

	const MAX_DISPLAY_LENGTH = 9;
	const MAX_VALUE = 999999999;

	const row0 = [
		{ sign:"C", type:"delete-button" },
		{ sign:"+/-", type:"operator" },
		{ sign:"%", type:"operator" },
		{ sign:"DEL", type:"delete-button" },
	];
	
	const row1 = [
		{ sign:"7", type:"number" },
		{ sign:"8", type:"number" },
		{ sign:"9", type:"number" },
		{ sign:"+", type:"operator" },
	];
	
	const row2 = [
		{ sign:"4", type:"number" },
		{ sign:"5", type:"number" },
		{ sign:"6", type:"number" },
		{ sign:"-", type:"operator" },
	];
	
	const row3 = [
		{ sign:"1", type:"number" },
		{ sign:"2", type:"number" },
		{ sign:"3", type:"number" },
		{ sign:"*", type:"operator" },
	];

	const row4 = [
		{ sign:"0", type:"number" },
		{ sign:".", type:"number" },
		{ sign:"=", type:"operator" },
		{ sign:"/", type:"operator" },
	];
	
	function cleanCalc() {
		setTotal(0);
		setNum1("0");
		setNum2("0");
		setOp(0);
		setShown("0");
		setWaitingForNum2(false);
		setError(false);
	}

	function appendNum(num) {
		if (error) return;

		if (!waitingForNum2) {
			if (num1.replace('.', '').length >= MAX_DISPLAY_LENGTH && num1.indexOf('.') === -1) {
				return;
			}

			const newNum = num1 === "0" ? String(num) : num1 + num;

			if (newNum.replace('.','').length <= MAX_DISPLAY_LENGTH) {
				setNum1(newNum);
				setShown(newNum);
			}

		} else {
			if (num2.replace('.', '').length >= MAX_DISPLAY_LENGTH && num2.indexOf('.') === -1) {
				return;
			}

			const newNum = num2 === "0" ? String(num) : num2 + num;

			if (newNum.replace('.','').length <= MAX_DISPLAY_LENGTH) {
				setNum2(newNum);
				setShown(newNum);
			}

		}
	}

	function handleDecimalPoint() {
		if (error) return;

		if (!waitingForNum2) {
			if (num1.includes('.')) return;

			const newNum = num1 + '.';
			setNum1(newNum);
			setShown(newNum);
		} else {
			if (num2.includes('.')) return;

			const newNum = num2 + '.';
			setNum2(newNum);
			setShown(newNum);
		}
	}

	function handleOperator(operator) {
		if (waitingForNum2 && num2 !== "0") {
			operate();

			if (operator === "%") {
				setOp(5);
			} else if (operator === "+") {
				setOp(1);
			} else if (operator === "-") {
				setOp(2);
			} else if (operator === "*") {
				setOp(3);
			} else if (operator === "/") {
				setOp(4);
			} else if (operator === "+/-") {
				toggleSign();
				return;
			}

			setWaitingForNum2(true);
			return;
		}

		if (operator === "%") {
			setOp(5);
		} else if (operator === "+") {
			setOp(1);
		} else if (operator === "-") {
			setOp(2);
		} else if (operator === "*") {
			setOp(3);
		} else if (operator === "/") {
			setOp(4);
		} else if (operator === "+/-") {
			toggleSign();
			return;
		}

		setWaitingForNum2(true);
	}

	function toggleSign() {
		if (error) return;

		if (!waitingForNum2) {
			if (num1 === "0") return;

			const newValue = parseFloat(num1) * -1;

			if (newValue < 0) {
				setError(true);
				setShown("ERROR");
				return;
			}

			setNum1(String(newValue));
			setShown(String(newValue));
		} else {
			if (num2 === "0") return;

			const newValue = parseFloat(num2) * -1;

			if (newValue < 0) {
				setError(true);
				setShown("ERROR");
				return;
			}

			setNum2(String(newValue));
			setShown(String(newValue));
		}
	}

	function operate() {
		if (error) return;

		const n1 = parseFloat(num1);
		const n2 = parseFloat(num2);
		let result = 0;

		switch (op) {
			case 1:
				result = n1 + n2;
				break;
			case 2:
				result = n1 - n2;
				break;
			case 3:
				result = n1 * n2;
				break;
			case 4:
				if (n2 === 0) {
					setError(true);
					setShown("ERROR");
					return;
				}

				result = n1 / n2;
				break;
			case 5:
				if (n2 === 0) {
					setError(true);
					setShown("ERROR");
					return;
				}

				result = n1 % n2;
				break;
			default:
				result = n1;
		}

		if (result < 0) {
			setError(true);
			setShown("ERROR");
			return;
		}

		const resultStr = String(result);
		let displayResult = resultStr;

		if (resultStr.includes('.') && resultStr.length > MAX_DISPLAY_LENGTH) {
			const integerPart = resultStr.split('.')[0];

			if (integerPart.length >= MAX_DISPLAY_LENGTH) {
				displayResult = result.toFixed(decimalPlaces);
			} else {
				const decimalPlaces = MAX_DISPLAY_LENGTH - integerPart.length - 1;
				displayResult = result.toFixed(decimalPlaces);
			}
		} else if (!resultStr.includes('.') && resultStr.length > MAX_DISPLAY_LENGTH) {
			displayResult = resultStr.substring(0, MAX_DISPLAY_LENGTH);
		}

		setTotal(result);
		setShown(String(displayResult));
		setNum1(String(displayResult));
		setNum2("0");
		setWaitingForNum2(false);
	}

	function deleteLastDigit() {
		if (error) return;

		if (!waitingForNum2) {
			if (num1.length === 1) {
				setNum1("0");
				setShown("0");
			} else {
				const newNum = num1.slice(0, -1);
				setNum1(newNum);
				setShown(newNum)
			}
		} else {
			if (num2.length === 1) {
				setNum2("0");
				setShown("0");
			} else {
				const newNum = num2.slice(0, -1);
				setNum2(newNum);
				setShown(newNum);
			}
		}
	}

	function handleButtonClick(item) {
		const { sign, type } = item;

		if (type === "number") {
			if (sign === ".") {
				handleDecimalPoint();
			} else {
				appendNum(parseInt(sign));
			}
		} else if (type	=== "operator") {
			if (sign === "=") {
				operate();
			} else {
				handleOperator(sign);
			}
		} else if (type === "delete-button") {
			if (sign === "C") {
				cleanCalc();
			} else if (sign === "DEL") {
				deleteLastDigit();
			}
		}
	}

	return (
		<div className="calc-area">
			<Screen value={shown} />
			<div className="button-area">
				<ButtonRow row={row0} onButtonClick={handleButtonClick} />
				<ButtonRow row={row1} onButtonClick={handleButtonClick} />
				<ButtonRow row={row2} onButtonClick={handleButtonClick} />
				<ButtonRow row={row3} onButtonClick={handleButtonClick} />
				<ButtonRow row={row4} onButtonClick={handleButtonClick} />
			</div>
		</div>
	);
}
