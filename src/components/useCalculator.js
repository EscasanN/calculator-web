import { useState } from 'react';

export function useCalculator() {
	const [total, setTotal] = useState(0);
	const [num1, setNum1] = useState('0');
	const [num2, setNum2] = useState('0');
	const [op, setOp] = useState(0);
	const [shown, setShown] = useState('0');
	const [waitingForNum2, setWaitingForNum2] = useState(false);
	const [error, setError] = useState(false);

	const MAX_DISPLAY_LENGTH = 9;
	const MAX_VALUE = 999999999;

	const rows = [
		[
			{ sign: 'C',    type: 'delete-button' },
			{ sign: '+/-',  type: 'operator'       },
			{ sign: '%',    type: 'operator'       },
			{ sign: 'DEL',  type: 'delete-button' }
		],
		[
			{ sign: '7',    type: 'number'         },
			{ sign: '8',    type: 'number'         },
			{ sign: '9',    type: 'number'         },
			{ sign: '+',    type: 'operator'       }
		],
		[
			{ sign: '4',    type: 'number'         },
			{ sign: '5',    type: 'number'         },
			{ sign: '6',    type: 'number'         },
			{ sign: '-',    type: 'operator'       }
		],
		[
			{ sign: '1',    type: 'number'         },
			{ sign: '2',    type: 'number'         },
			{ sign: '3',    type: 'number'         },
			{ sign: '*',    type: 'operator'       }
		],
		[
			{ sign: '0',    type: 'number'         },
			{ sign: '.',    type: 'number'         },
			{ sign: '=',    type: 'operator'       },
			{ sign: '/',    type: 'operator'       }
		]
	];

	function cleanCalc() {
		setTotal(0);
		setNum1('0');
		setNum2('0');
		setOp(0);
		setShown('0');
		setWaitingForNum2(false);
		setError(false);
	}

	function appendNum(n) {
		if (error) return;
		const target = waitingForNum2 ? num2 : num1;
		if (target.replace('.', '').length >= MAX_DISPLAY_LENGTH && !target.includes('.')) return;
		const updated = target === '0' ? String(n) : target + n;
		if (updated.replace('.', '').length <= MAX_DISPLAY_LENGTH) {
			waitingForNum2 ? setNum2(updated) : setNum1(updated);
			setShown(updated);
		}
	}

	function handleDecimalPoint() {
		if (error) return;
		if (!waitingForNum2) {
			if (!num1.includes('.')) {
				setNum1(num1 + '.');
				setShown(num1 + '.');
			}
		} else {
			if (!num2.includes('.')) {
				setNum2(num2 + '.');
				setShown(num2 + '.');
			}
		}
	}

	function handleOperator(operator) {
		if (waitingForNum2 && num2 !== '0') {
			operate();
			setOp(
				operator === '+'  ? 1 :
				operator === '-'  ? 2 :
				operator === '*'  ? 3 :
				operator === '/'  ? 4 :
				operator === '%'  ? 5 :
				op
			);
			setWaitingForNum2(true);
			return;
		}
		if (operator === '+/-') {
			toggleSign();
			return;
		}
		setOp(
			operator === '+'  ? 1 :
			operator === '-'  ? 2 :
			operator === '*'  ? 3 :
			operator === '/'  ? 4 :
			operator === '%'  ? 5 :
			op
		);
		setWaitingForNum2(true);
	}

	function toggleSign() {
		if (error) return;
		const [value, setter] = waitingForNum2 ? [num2, setNum2] : [num1, setNum1];
		if (value === '0') return;
		const newValue = parseFloat(value) * -1;
		if (newValue < 0) {
			setError(true);
			setShown('ERROR');
			return;
		}
		const newStr = String(newValue);
		setter(newStr);
		setShown(newStr);
	}

	function operate() {
		if (error) return;
		const a = parseFloat(num1);
		const b = parseFloat(num2);
		let result = (
			op === 1 ? a + b :
			op === 2 ? a - b :
			op === 3 ? a * b :
			op === 4 && b !== 0 ? a / b :
			op === 5 && b !== 0 ? a % b :
			op === 4 || op === 5 ? null : a
		);
		if (result === null || result < 0) {
			setError(true);
			setShown('ERROR');
			return;
		}
		let resultStr = String(result);
		let display = resultStr;
		const plainLength = resultStr.replace('.', '').length;
		if (plainLength > MAX_DISPLAY_LENGTH) {
			const [integer] = resultStr.split('.');
			if (integer.length >= MAX_DISPLAY_LENGTH) {
				display = integer.substring(0, MAX_DISPLAY_LENGTH);
			} else {
				const decimalPlaces = MAX_DISPLAY_LENGTH - integer.length - 1;
				display = result.toFixed(decimalPlaces);
			}
		}
		setTotal(result);
		setNum1(display);
		setNum2('0');
		setWaitingForNum2(false);
		setShown(display);
	}

	function deleteLastDigit() {
		if (error) return;
		const target = waitingForNum2 ? num2 : num1;
		if (target.length === 1) {
			waitingForNum2 ? setNum2('0') : setNum1('0');
			setShown('0');
		} else {
			const trimmed = target.slice(0, -1);
			waitingForNum2 ? setNum2(trimmed) : setNum1(trimmed);
			setShown(trimmed);
		}
	}

	function onButtonClick(item) {
		const { sign, type } = item;
		if (type === 'number') {
			sign === '.' ? handleDecimalPoint() : appendNum(parseInt(sign));
		} else if (type === 'operator') {
			sign === '=' ? operate() : handleOperator(sign);
		} else if (type === 'delete-button') {
			sign === 'C' ? cleanCalc() : deleteLastDigit();
		}
	}

	return { shown, rows, onButtonClick };
}
