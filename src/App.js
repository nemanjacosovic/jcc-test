import React, { Component } from 'react'
import DOMPurify from 'dompurify'
import Fieldset from './containers/Fieldset'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			title: 'Job criteria',
			titleSymbolIcon: 'default', // default, error, ok
			titleSymbolContent: '1',
			introText: 'We will use the data we collect here to better target your desired audience.',
			introErrorText: 'The number of errors in this form is too damn high! #toodamnhigh',
			inputOptions: {
				exp: {
					showError: false,
					legend: 'A minimum No. years of experience',
					type: 'text',
					cssc: 'exp',
					setValue: [],
					inputs: {
						0: {
							placeholder: 'e.g. 5+',
							isFaulty: false,
							value: ''
						}
					},
				},
				edu: {
					showError: false,
					legend: 'Level of education',
					type: 'checkbox',
					name: 'edu_lvl',
					cssc: 'edu',
					setValue: [],
					inputs: {
						0: {
							checked: '',
							label: 'Bachelor / Graduate',
							placeholder: 'e.g. 5+',
							value: ''
						},
						1: {
							checked: '',
							label: 'GCSE / A-Level / Highschool / GED',
							placeholder: 'e.g. 5+',
							value: ''
						},
						2: {
							checked: '',
							label: 'Master / Post-Graduate / PhD',
							placeholder: 'e.g. 5+',
							value: ''
						},
						3: {
							checked: '',
							label: 'Vocational / Diploma / Associates degree',
							placeholder: 'e.g. 5+',
							value: ''
						}
					}
				},
				hrs: {
					showError: false,
					legend: 'No. of working hours (per week)',
					type: 'number',
					cssc: 'hrs',
					setValue: [],
					inputs: {
						0: {
							placeholder: 'e.g. 32',
							isFaulty: false,
							label: 'Min.',
							value: null,
							minValue: 1,
							maxValue: 39,
							size: 2
						},
						1: {
							placeholder: 'e.g. 40',
							isFaulty: false,
							label: 'Max.',
							value: null,
							minValue: 1,
							maxValue: 40,
							size: 2
						}
					}
				}
			},
			button: 'Save',
			buttonError: 'Save and Continue',
			buttonEdit: 'Edit',
			formInitial: true,
			formEdit: false,
			formError: false,
			formCompleted: false
		}
	}

	// Washing the input field
	cleanInput = (dirty) => DOMPurify.sanitize(dirty, {ALLOWED_TAGS: []})



	/**************************

		INPUT CHANGED

	**************************/
	onInputChange = (event, type, i, cssc) => {
		// event = duh.
		// type = text, number, checkbox
		// i = index
		// cssc = exp, edu, hrs...
		const { cleanInput } = this
		let inputValue = cleanInput(event.target.value).replace(/^0+/, '')

		if (type === 'number') {
			if (i === 0) {
				if (inputValue > 39) {
					inputValue = 39
				}
			}

			if (i === 1) {
				if (inputValue > 40) {
					inputValue = 40
				}
			}
		}

		// Text or Number
		if (type === 'text' || type === 'number') {
			this.setState(prevState => ({
				...prevState,
				inputOptions: {
					...prevState.inputOptions,
					[cssc]: {
						...prevState.inputOptions[cssc],
						showError: false,
						inputs: {
							...prevState.inputOptions[cssc].inputs,
							[i]: {
								...prevState.inputOptions[cssc].inputs[i],
								value: inputValue,
								isFaulty: false
							}
						}
					}
				}
			}))
		}

		// Checkbox
		if (type === 'checkbox') {
			// check if already there
			const eduSetValue = this.state.inputOptions[cssc].setValue
			const eduValueIndex = eduSetValue.indexOf(inputValue)

			if (eduValueIndex === -1) {
				this.setState(prevState => ({
					...prevState,
					inputOptions: {
						...prevState.inputOptions,
						[cssc]: {
							...prevState.inputOptions[cssc],
							showError: false,
							setValue: [...prevState.inputOptions[cssc].setValue, inputValue],
							inputs: {
								...prevState.inputOptions[cssc].inputs,
								[i]: {
									...prevState.inputOptions[cssc].inputs[i],
									checked: 'checked'
								}
							}
						}
					}
				}))
			} else {
				const eduSetValueCleaned = this.state.inputOptions[cssc].setValue
				eduSetValueCleaned.splice(eduValueIndex, 1)

				this.setState(prevState => ({
					...prevState,
					inputOptions: {
						...prevState.inputOptions,
						[cssc]: {
							...prevState.inputOptions[cssc],
							setValue: eduSetValueCleaned,
							inputs: {
								...prevState.inputOptions[cssc].inputs,
								[i]: {
									...prevState.inputOptions[cssc].inputs[i],
									checked: ''
								}
							}
						}
					}
				}))
			}
		}
	}



	/**************************

		FORM SUBMITED

	**************************/
	onFormSubmit = (event) => {
		event.preventDefault()
		event.stopPropagation()
		
		// const { formInitial, formError, formCompleted, inputOptions } = this.state
		const { inputOptions } = this.state
		const { onFormError, showSummary } = this
		let expHasValue, eduHasValue, hrsHasValue // true/false

		Object.keys(inputOptions).forEach(key => {
			let hasValueRes = []

			// Text
			if (key === 'exp') {
				Object.keys(inputOptions[key].inputs).forEach( i => {
					if (inputOptions[key].inputs[i].value.length > 0) {
						hasValueRes.push(true)
						// Initial or Editing
						if (inputOptions[key].setValue[i]) {
							inputOptions[key].setValue.splice(i, 1, inputOptions[key].inputs[i].value)
						} else {
							inputOptions[key].setValue.push(inputOptions[key].inputs[i].value)
						}
					} else {
						hasValueRes.push(false)
						this.setState(prevState => ({
							...prevState,
							inputOptions: {
								...prevState.inputOptions,
								[key]: {
									...prevState.inputOptions[key],
									inputs: {
										...prevState.inputOptions[key].inputs,
										[i]: {
											...prevState.inputOptions[key].inputs[i],
											isFaulty: true
										}
									}
								}
							}
						}))
					}
				})

				// Roll out
				expHasValue = !hasValueRes.includes(false) // if it does contains 'false' then expHasValue must show 'false', thus using !
			}

			// Checkbox
			if (key === 'edu') {
				if (inputOptions[key].setValue.length > 0) {
					hasValueRes.push(true)
				} else {
					hasValueRes.push(false)
				}

				// Roll out
				eduHasValue = !hasValueRes.includes(false) // if it does contains 'false' then eduHasValue must show 'false', thus using !
			}

			// Numbers
			if (key === 'hrs') {
				Object.keys(inputOptions[key].inputs).forEach( i => {
					if (inputOptions[key].inputs[i].value !== 0 && inputOptions[key].inputs[i].value > 0) {
						hasValueRes.push(true)
						// Initial or Editing
						if (inputOptions[key].setValue[i]) {
							inputOptions[key].setValue.splice(i, 1, inputOptions[key].inputs[i].value)
						} else {
							inputOptions[key].setValue.push(inputOptions[key].inputs[i].value)
						}
					} else {
						hasValueRes.push(false)
						this.setState(prevState => ({
							...prevState,
							inputOptions: {
								...prevState.inputOptions,
								[key]: {
									...prevState.inputOptions[key],
									inputs: {
										...prevState.inputOptions[key].inputs,
										[i]: {
											...prevState.inputOptions[key].inputs[i],
											isFaulty: true
										}
									}
								}
							}
						}))
					}
				})

				// Roll out
				hrsHasValue = !hasValueRes.includes(false) // if it does contains 'false' then hrsHasValue must show 'false', thus using !
			}
		})

		if (expHasValue && eduHasValue && hrsHasValue) {
			// all good
			showSummary()
		} else {
			// show error
			setFormErrorKey()
		}

		function setFormErrorKey() {
			if (!expHasValue) {
				// showError
				onFormError('exp')
			}
			if (!eduHasValue) {
				// showError
				onFormError('edu')
			}
			if (!hrsHasValue) {
				// showError
				onFormError('hrs')
			}
		}
	}



	/**************************

		FORM EDIT (Here we go again)

	**************************/
	onFormEdit = () => {
		this.setState( prevState => ({
			...prevState,
			inputOptions: {
				...prevState.inputOptions,
				exp: {
					...prevState.inputOptions.exp,
					showError: false
				},
				edu: {
					...prevState.inputOptions.edu,
					showError: false
				},
				hrs: {
					...prevState.inputOptions.hrs,
					showError: false
				}
			},
			formInitial: false,
			formEdit: true,
			formError: false,
			formCompleted: false
		}))
	}



	/**************************

		FORM ERRORS (Kowalski analysis)

	**************************/
	onFormError = (key) => {
		this.setState( prevState => ({
			...prevState,
			inputOptions: {
				...prevState.inputOptions,
				[key]: {
					...prevState.inputOptions[key],
					showError: true
				}
			},
			formInitial: false,
			formEdit: false,
			formError: true,
			formCompleted: false
		}))
	}



	/**************************

		FORM COMPLETED

	**************************/
	showSummary = () => {
		this.setState( prevState => ({
			...prevState,
			inputOptions: {
				...prevState.inputOptions,
				exp: {
					...prevState.inputOptions.exp,
					showError: true
				},
				edu: {
					...prevState.inputOptions.edu,
					showError: true
				},
				hrs: {
					...prevState.inputOptions.hrs,
					showError: true
				}
			},
			formInitial: false,
			formEdit: false,
			formError: false,
			formCompleted: true
		}))
	}

	render() {
		const { title, introText, introErrorText, inputOptions, button, buttonError, buttonEdit, formInitial, formEdit, formError, formCompleted } = this.state
		const { exp, edu, hrs } = inputOptions
		const { cleanInput, onInputChange, onFormSubmit, onFormEdit } = this

		let applyHeader, applyForm, applySummary

		// --------------------
		// 		Initial
		// --------------------
		if (formInitial) {
			applyHeader = (
				<div className='vonq-jcc-masthead'>
					<h2><span>1</span> { title }</h2>
					<p>{ introText }</p>
				</div>
			)

			applyForm = (
				<div className='vonq-jcc-apply'>
					<Fieldset
						cssc			= { exp.cssc }
						legend 			= { exp.legend }
						type   			= { exp.type }
						inputs 			= { exp.inputs }
						showError		= { exp.showError }
						setValue		= { exp.setValue }
						cleanInput 		= { cleanInput }
						onInputChange	= { onInputChange }
					/>
					<Fieldset
						cssc			= { edu.cssc }
						legend  		= { edu.legend }
						type   			= { edu.type }
						name   			= { edu.name }
						inputs 			= { edu.inputs }
						showError		= { edu.showError }
						setValue		= { edu.setValue }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<Fieldset
						cssc			= { hrs.cssc }
						legend 			= { hrs.legend }
						type    		= { hrs.type }
						inputs  		= { hrs.inputs }
						showError		= { hrs.showError }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<button title={ formError ? buttonError : button } onClick={ onFormSubmit }>{ formError ? buttonError : button }</button>
				</div>
			)
		}


		// --------------------
		// 		Editing
		// --------------------
		if (formEdit) {
			applyHeader = (
				<div className='vonq-jcc-masthead'>
					<h2><span>1</span> { title }</h2>
					<p>{ introText }</p>
				</div>
			)

			applyForm = (
				<div className='vonq-jcc-apply'>
					<Fieldset
						cssc			= { exp.cssc }
						legend 			= { exp.legend }
						type   			= { exp.type }
						inputs 			= { exp.inputs }
						showError		= { exp.showError }
						setValue		= { exp.setValue }
						cleanInput 		= { cleanInput }
						onInputChange	= { onInputChange }
					/>
					<Fieldset
						cssc			= { edu.cssc }
						legend  		= { edu.legend }
						type   			= { edu.type }
						name   			= { edu.name }
						inputs 			= { edu.inputs }
						showError		= { edu.showError }
						setValue		= { edu.setValue }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<Fieldset
						cssc			= { hrs.cssc }
						legend 			= { hrs.legend }
						type    		= { hrs.type }
						inputs  		= { hrs.inputs }
						showError		= { hrs.showError }
						setValue		= { hrs.setValue }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<button title={ formError ? buttonError : button } onClick={ onFormSubmit }>{ formError ? buttonError : button }</button>
				</div>
			)
		}


		// --------------------
		// 		Error
		// --------------------
		if (formError) {
			applyHeader = (
				<div className='vonq-jcc-masthead error'>
					<h2><span>!</span> { title }</h2>
					<p>{ introErrorText }</p>
				</div>
			)

			applyForm = (
				<div className='vonq-jcc-apply'>
					<Fieldset
						cssc			= { exp.cssc }
						legend 			= { exp.legend }
						type   			= { exp.type }
						inputs 			= { exp.inputs }
						showError		= { exp.showError }
						setValue		= { exp.setValue }
						cleanInput 		= { cleanInput }
						onInputChange	= { onInputChange }
					/>
					<Fieldset
						cssc			= { edu.cssc }
						legend  		= { edu.legend }
						type   			= { edu.type }
						name   			= { edu.name }
						inputs 			= { edu.inputs }
						showError		= { edu.showError }
						setValue		= { edu.setValue }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<Fieldset
						cssc			= { hrs.cssc }
						legend 			= { hrs.legend }
						type    		= { hrs.type }
						inputs  		= { hrs.inputs }
						showError		= { hrs.showError }
						cleanInput 		= { cleanInput }
						onInputChange 	= { onInputChange }
					/>
					<button title={ formError ? buttonError : button } onClick={ onFormSubmit }>{ formError ? buttonError : button }</button>
				</div>
			)
		}


		// --------------------
		// 		Completed
		// --------------------
		if (formCompleted) {
			applyHeader = (
				<div className='vonq-jcc-masthead completed'>
					<h2><span></span> { title }</h2>
					<button title={ buttonEdit } onClick={ onFormEdit }>{ buttonEdit }</button>
				</div>
			)

			applySummary = (
				<div className='vonq-jcc-summary'>
					<p>A minimum No. years of experience: <span>{ exp.setValue }</span></p>
					<p>No. of working hours (per week): <span>{ hrs.setValue[0] } - { hrs.setValue[1] } hours</span></p>
					<h3>Level of education</h3>
					<ul>
						{
							edu.setValue.map( eduValue => {
								return (
									<li key={ eduValue }>{ eduValue }</li>
								)
							})
						}
					</ul>
				</div>
			)
		}

		return (
			<div className='vonq-jcc'>
				{ applyHeader }
				{ applyForm }
				{ applySummary }
			</div>
		)
	}
}

export default App