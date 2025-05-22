import Button from './Button';

export default {
  title: 'Calculadora/Button',
  component: Button,
  tags: ['autodocs']
};

const Template = (args) => <Button {...args} />;

export const Numero = Template.bind({});
Numero.args = {
  item: {
    sign: '7',
    type: 'number'
  },
  onClick: (item) => alert(`Clic en el boton: ${item.sign}`),
};

export const Operador = Template.bind({});
Operador.args = {
  item: {
    sign: '+',
    type: 'operator'
  },
  onClick: (item) => alert(`Clic en el boton: ${item.sign}`),
};
