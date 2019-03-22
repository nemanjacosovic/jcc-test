import Fieldset from './containers/Fieldset'

 it("renders correctly", () => {
    const wrapper = shallow(
        <Fieldset
            cssc			= 'rock'
            legend 			= 'Some text'
            type   			= 'text'
            inputs 			= { {} }
            showError		= { false }
            setValue		= ''
            cleanInput 		= { () => {} }
            onInputChange	= { () => {} }
         />
    );

    expect(wrapper).toMatchSnapshot()
});