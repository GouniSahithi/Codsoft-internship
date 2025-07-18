document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitForSecondOperand = false;
        updateDisplay();
    }

    function inputDigit(digit) {
        if (waitForSecondOperand) {
            currentInput = digit;
            waitForSecondOperand = false;
        } else {
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else {
                currentInput += digit;
            }
        }
        updateDisplay();
    }

    function inputDecimal(dot) {
        if (!currentInput.includes(dot)) {
            currentInput += dot;
            updateDisplay();
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '%': (firstOperand, secondOperand) => firstOperand % secondOperand
    };

    function handleDelete() {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { target } = event;

            if (target.classList.contains('clear')) {
                resetCalculator();
                return;
            }

            if (target.classList.contains('operator')) {
                if (target.textContent === 'DEL') {
                    handleDelete();
                } else {
                    handleOperator(target.textContent);
                }
                return;
            }

            if (target.classList.contains('number')) {
                if (target.textContent === '.') {
                    inputDecimal(target.textContent);
                } else {
                    inputDigit(target.textContent);
                }
                return;
            }

            if (target.classList.contains('equals')) {
                if (operator && firstOperand !== null) {
                    const inputValue = parseFloat(currentInput);
                    const result = performCalculation[operator](firstOperand, inputValue);
                    currentInput = String(result);
                    firstOperand = null;
                    operator = null;
                    waitForSecondOperand = false;
                    updateDisplay();
                }
                return;
            }
        });
    });

    updateDisplay();
});