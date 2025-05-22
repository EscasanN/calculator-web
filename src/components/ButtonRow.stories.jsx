import ButtonRow from './ButtonRow';

export default {
  title: 'Calculadora/ButtonRow',
  component: ButtonRow,
  tags: ['autodocs'],
  argTypes: {
    row: { control: 'object' },
    onButtonClick: { action: 'clicked' }
  }
};

const Template = (args) => <ButtonRow {...args} />;

export const Digits = Template.bind({});
Digits.args = {
  row: [
    { sign: '1', type: 'number' },
    { sign: '2', type: 'number' },
    { sign: '3', type: 'number' },
    { sign: '+', type: 'operator' }
  ]
};

export const ClearRow = Template.bind({});
ClearRow.args = {
  row: [
    { sign: 'C', type: 'delete-button' },
    { sign: '+/-', type: 'operator' },
    { sign: '%', type: 'operator' },
    { sign: 'DEL', type: 'delete-button' }
  ]
};
