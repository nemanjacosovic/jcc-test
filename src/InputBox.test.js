import InputBox from './components/InputBox'

describe('InputBox', () => {
	it('renders without crashing given the required props', () => {
		const props = {
			key: 74,
			type: 'text',
			placeholder: 'Some text',
			className: 'text-for-text',
			value: '',
			onChange: jest.fn,
			inputs : {
				0: {
					placeholder: 'e.g. 5+',
					isFaulty: false,
					value: ''
				}
			}
		}
		const wrapper = shallow(
			<InputBox {...props} />
		)

		expect(wrapper).toMatchSnapshot()
	})
})