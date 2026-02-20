import { test, expect } from '@playwright/test';

import { gerarOrderNumber } from '../support/helpers';
/// AAA - Arrange, Act, Assert



test.describe('Consulta de Pedido', () => {


  test.beforeEach(async ({ page }) => {
    console.log('beforeEach: roda antes de cada teste')
    //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  })


  test('deve consultar um pedido aprovado', async ({ page }) => {
    //Test Data
    const orderNumber = 'VLO-XH9EB0';

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    //Assert
    await expect(page.getByTestId(`order-result-${orderNumber}`)).toMatchAriaSnapshot(`
      - img 
      - paragraph: Pedido
      - paragraph: ${orderNumber}
      - img
      - text: APROVADO
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: Midnight Black
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: sport Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: Francisco Bandeira
      - paragraph: Email
      - paragraph: bandeira@velo.dev
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
  })

  test('deve consultar um pedido nao encontrado', async ({ page }) => {
    //Test Data
    const orderNumber = gerarOrderNumber();

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    //Assert
    await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible();
    await expect(page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente`);
  });

})


