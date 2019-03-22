import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputBox from '../components/InputBox'

class Fieldset extends Component {
	render() {
		const { showError, cssc, legend, type, name, inputs, cleanInput, onInputChange } = this.props
		let displayError

		if (showError) {
			displayError = (
				<div className='error-box' key={ cssc }>
					<p className='error-box-message'><span className='error-box-icon'></span>The field is required.</p>
				</div>
			)
		}

		return (
			<fieldset className={ cssc }>
				<legend>{ legend }</legend>
				<InputBox
					cssc			= { cssc }
					type    		= { type }
					name			= { name }
					inputs  		= { inputs }
					showError		= { showError }
					cleanInput 		= { cleanInput }
					onInputChange 	= { onInputChange }
				/>
				{ displayError }
			</fieldset>
		)
	}
}
Fieldset.propTypes = {
	showError: PropTypes.bool,
	cssc: PropTypes.string,
	legend: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	inputs: PropTypes.object,
	cleanInput: PropTypes.func,
	onInputChange: PropTypes.func
}

export default Fieldset
