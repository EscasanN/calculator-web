import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalcArea from './CalcArea';

describe('CalcArea integration', () => {
  it('muestra 0 al iniciar', () => {
    render(<CalcArea />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('puede mostrar un solo número', async () => {
    render(<CalcArea />);
    await userEvent.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('puede hacer una suma: 2 + 3 = 5', async () => {
    render(<CalcArea />);
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    await userEvent.click(screen.getByRole('button', { name: '+' }));
    await userEvent.click(screen.getByRole('button', { name: '3' }));
    await userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('muestra ERROR al dividir entre 0', async () => {
    render(<CalcArea />);
    await userEvent.click(screen.getByRole('button', { name: '8' }));
    await userEvent.click(screen.getByRole('button', { name: '/' }));
    await userEvent.click(screen.getByRole('button', { name: '0' }));
    await userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('ERROR')).toBeInTheDocument();
  });

  it('botón C reinicia la pantalla a 0', async () => {
    render(<CalcArea />);
    await userEvent.click(screen.getByRole('button', { name: '9' }));
    await userEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
