import { test, expect } from '@playwright/test';


test('markattendence', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await page.getByRole('button', { name: 'Mark attendance' }).click();
});


test('createSession', async ({ page }) => {
  await page.goto('http://localhost:4173/dashboard');
  await page.goto('http://localhost:4173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('192837465');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('div').filter({ hasText: /^From:$/ }).getByRole('textbox').fill('2024-06-01');
  await page.locator('div').filter({ hasText: /^To:$/ }).getByRole('textbox').fill('2024-06-01');
  await page.locator('div').filter({ hasText: /^Session:ForenoonAfternoonNight$/ }).getByRole('combobox').selectOption('3');
  await page.getByRole('button', { name: 'Submit ->' }).click();
});


test('deleteSession', async ({ page }) => {
  await page.goto('http://localhost:4173/dashboard');
  await page.goto('http://localhost:4173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@kc');
  await page.getByPlaceholder('name@example.com').press('ControlOrMeta+a');
  await page.getByPlaceholder('name@example.com').fill('');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('192837465');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('div').filter({ hasText: /^From:$/ }).getByRole('textbox').fill('2024-06-01');
  await page.locator('div').filter({ hasText: /^To:$/ }).getByRole('textbox').fill('2024-06-01');
  await page.locator('div').filter({ hasText: /^Session:ForenoonAfternoonNight$/ }).getByRole('combobox').selectOption('3');
  await page.locator('div').filter({ hasText: /^Action:AddDelete$/ }).getByRole('combobox').selectOption('delete');
  await page.getByRole('button', { name: 'Submit ->' }).click();
});



test('checkLog', async ({ page }) => {
  await page.goto('http://localhost:4173/dashboard');
  await page.goto('http://localhost:4173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('192837465');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Attendance Log' }).click();
  await page.getByRole('textbox').fill('2024-06-01');
  await page.getByRole('combobox').selectOption('2');
  await page.getByRole('combobox').selectOption('3');
  await page.getByRole('textbox').fill('2024-06-02');
  await page.getByRole('combobox').selectOption('2');
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('textbox').fill('2024-06-01');
  await page.getByRole('combobox').selectOption('3');
});


test('checkSession', async ({ page }) => {
  await page.goto('http://localhost:4173/dashboard');
  await page.goto('http://localhost:4173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('192837465');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('combobox').nth(2).selectOption('5');
  await page.getByRole('combobox').nth(2).selectOption('6');
  await page.getByRole('combobox').nth(3).selectOption('2025');
  await page.getByRole('combobox').nth(3).selectOption('2024');
});


test('addEmployee', async ({ page }) => {
  await page.goto('http://localhost:4173/dashboard');
  await page.goto('http://localhost:4173/login');
  await page.getByPlaceholder('name@example.com').click();
  await page.getByPlaceholder('name@example.com').fill('elangovan.21ad@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('192837465');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Add Employee' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('gedr');
  await page.getByPlaceholder('Gender').click();
  await page.getByPlaceholder('Gender').fill('male');
  await page.getByPlaceholder('Emp ID').click();
  await page.getByPlaceholder('Emp ID').fill('2342');
  await page.getByPlaceholder('Role').click();
  await page.getByPlaceholder('Role').fill('main');
  await page.getByRole('button', { name: 'Add employee', exact: true }).click()
})