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
    //const orderNumber = 'VLO-XH9EB0';
    const order = {
      number: 'VLO-XH9EB0',
      status:'APROVADO',
      wheels: 'sport Wheels',
      color: 'Midnight Black',
      customer: {
        name: 'Francisco Bandeira',
        email: 'bandeira@velo.dev'
      },
      payment: 'À Vista'
    }

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    //Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img 
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    //Test Data
    // const orderNumber = 'VLO-RDOEEI';
    const order = {
      number: 'VLO-RDOEEI',
      status:'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@dev.com'
      },
      payment: 'À Vista'
    }
    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    //Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - img
    - text: ${order.status}
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
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


