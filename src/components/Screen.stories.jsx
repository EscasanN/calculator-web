import Screen from './Screen';

export default {
  title: 'Calculadora/Screen',
  component: Screen,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' }
  }
};

const Template = (args) => <Screen {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: '123'
};

export const Empty = Template.bind({});
Empty.args = {
  value: ''
};

export const MaxDigits = Template.bind({});
MaxDigits.args = {
  value: '999999999'
};
