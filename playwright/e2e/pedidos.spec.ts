import { test, expect } from '@playwright/test';

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  
  //Test Data
  const orderNumber = 'VLO-XH9EB0';
  
  //arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
  //act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  
  
  //assert
  // await expect(page.getByTestId('order-result-id')).toBeVisible({ timeout: 30000 });
  // await expect(page.getByTestId('order-result-id')).toContainText('VLO-XH9EB0');
  // await expect(page.getByTestId('order-result-status')).toBeVisible()
  // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');

  await expect(page.getByText(orderNumber)).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId(`order-result-${orderNumber}`)).toContainText(orderNumber);
  await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId(`order-result-${orderNumber}`)).toContainText('APROVADO');
});

test('deve consultar um pedido nao encontrado', async ({ page }) => {
  //Test Data
  const orderNumber = 'VLO-ABC123';
  
  //arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
  //act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  //assert
  await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible();
  await expect(page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible();
});