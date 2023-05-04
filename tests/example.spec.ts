import { test, expect } from '@playwright/test';

test('宿泊予約の価格が合っているか確認', async ({ page }) => {
  await page.goto('https://hotel.testplanisphere.dev/');
  await page.screenshot({ path: `test1.png` });
  // 日本語トップをクリック
  await page.getByRole('link', { name: 'トップページへ' }).click();
  await page.screenshot({ path: `test2.png` });

  // 宿泊予約ページをクリック
  await page.getByRole('link', { name: '宿泊予約' }).click();
  await page.screenshot({ path: `test3.png` });

  // 「お得な特典付きプラン」をクリック
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('.card-body > .btn').first().click()
  ]);

  // 予約フォーム入力
  // 宿泊日を当月の24日に設定
  await page1.getByLabel('宿泊日 必須').click();
  await page1.getByRole('link', { name: '24' }).click();

  // 宿泊数を入力
  await page1.getByLabel('宿泊数 必須').fill('1');

  // 人数を入力
  await page1.getByLabel('人数 必須').fill('1');

  // オプションを設定
  await page1.getByLabel('朝食バイキング').check();

  // 氏名を入力
  await page1.getByLabel('氏名 必須').fill('さくら　たろう');

  // 確認の連絡の入力
  await page1.getByRole('combobox', { name: '確認のご連絡 必須' }).selectOption('no');
  await page1.screenshot({ path: `test4.png`, fullPage: true });

  // 予約内容を確認ボタンをクリック
  await page1.locator('[data-test="submit-button"]').click();

  // 価格をアサーション
  await expect(page1.locator('id=total-bill')).toContainText('8,000円');
  await page1.screenshot({ path: `test5.png` });

});