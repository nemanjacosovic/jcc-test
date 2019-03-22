import React from 'react'
import PropTypes from 'prop-types'

const InputBox = (props) => {
	const { cssc, type, name, inputs, showError, setValue, onInputChange } = props
	const inputsData = Object.keys(inputs)
	let inputOutput = []
	let inputMint = {}

	const inputRegular = (type, inputsData) => {
		inputsData.map( (inputsDataKey, i) => {
			const { placeholder, minValue, maxValue, label, isFaulty } = inputs[inputsDataKey]

			// Only numbers have a label
			if (label) {
				// Numbers
				inputMint = <label key = { i }>{ label }
					<input
						type        = { type }
						min         = { minValue }
						max         = { maxValue }
						placeholder = { placeholder }
						className	= { isFaulty ? 'error' : '' }
						value       = { setValue ? setValue : inputs[i].value }
						onChange    = { (event) => onInputChange(event, type, i, cssc) }
					/>
				</label>
			} else {
				// Text
				inputMint = <input
					key         = { i }
					type        = { type }
					placeholder = { placeholder }
					className	= { isFaulty ? 'error' : '' }
					value       = { setValue ? setValue : inputs[i].value }
					onChange    = { (event) => onInputChange(event, type, i, cssc) }
				/>
			}

			return inputOutput.push(inputMint)
		})

		return inputOutput
	}

	const inputCheckbox = (type, name, inputsData) => {
		inputsData.map( (inputsDataKey, i) => {
			const { label, checked } = inputs[inputsDataKey]

			inputMint = <label
				className = { showError ? 'error' : '' }
				key = { i }>
					<input
						type		= { type }
						name		= { name }
						value		= { label }
						checked		= { inputs[inputsDataKey].checked }
						onChange	= { (event) => onInputChange(event, type, i, cssc, checked) }
					/><span>{ label }</span>
				</label>

			inputOutput.push(inputMint)

			return (
				inputOutput
			)
		})
	}

	switch(type) {
		case 'text' :
			// Text
			inputRegular(type, inputsData)
			break
		case 'checkbox' :
			// Checkboxes
			inputCheckbox(type, name, inputsData)
			break
		case 'number' :
			// Number
			inputRegular(type, inputsData)
			break
		default :
			inputOutput = null
	}

	return (
		inputOutput
	)
}

InputBox.propTypes = {
	showError: PropTypes.bool,
	cssc: PropTypes.string,
	legend: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	inputs: PropTypes.object,
	cleanInput: PropTypes.func,
	onInputChange: PropTypes.func
}

export default InputBox
