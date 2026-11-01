import { test, expect } from '@playwright/test';

test('original home palette, five tabs and responsive app width', async ({ page }) => {
 const errors: string[]=[]; page.on('pageerror', e => errors.push(e.message));
 await page.goto('/home');
 await expect(page.getByText('10월 총 구독료')).toBeVisible();
 await expect(page.getByRole('tab')).toHaveCount(5);
 await expect(page.getByText('61,690원')).toBeVisible();
 const color = await page.getByText('61,690원').evaluate(el => getComputedStyle(el).color);
 expect(color).toBe('rgb(91, 91, 214)');
 for (const width of [360,390,1440]) {
   await page.setViewportSize({width,height:900});
   const bounds = await page.locator('.app-frame').boundingBox();
   expect(bounds?.width).toBe(Math.min(width,390));
   expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 }
 for (const label of ['캘린더','통계','커뮤니티','마이','구독 목록']) {await page.getByRole('tab', {name:label,exact:true}).click(); await expect(page.getByRole('tab',{name:label,exact:true})).toHaveAttribute('aria-selected','true');}
 expect(errors).toEqual([]);
});

test('manual subscription persists and updates home, calendar and stats', async ({page}) => {
 await page.goto('/home');
 await page.getByRole('button',{name:'구독 추가',exact:true}).click();
 await page.getByText('직접 입력', {exact:true}).click();
 await expect(page.getByRole('button',{name:'구독 저장'})).toBeDisabled();
 await page.getByPlaceholder('예: 왓챠').fill('테스트 구독');
 await page.getByRole('button',{name:'카테고리 선택'}).click();
 await page.getByRole('button',{name:'OTT',exact:true}).click();
 await page.getByRole('textbox',{name:'결제 금액',exact:true}).fill('12000');
 await page.getByRole('textbox',{name:'시작일',exact:true}).fill('20261012');
 await page.getByRole('button',{name:'결제 수단 선택'}).click();
 await page.getByRole('button',{name:/신한/}).click();
 await page.getByRole('button',{name:'구독 저장',exact:true}).click();
 await expect(page).toHaveURL(/\/home$/);
 await expect(page.getByText('73,690원')).toBeVisible();
 await page.reload();
 await expect(page.getByText('이용 중 7개')).toBeVisible();
 await page.getByRole('tab',{name:'통계',exact:true}).click();
 await expect(page.getByText('73,690원')).toBeVisible();
 await page.getByRole('tab',{name:'캘린더',exact:true}).click();
 await expect(page.getByText('73,690원')).toBeVisible();
});

test('calendar month navigation and expanded mode', async ({page}) => {
 await page.goto('/calendar');
 await page.getByRole('button',{name:'달력 펼치기'}).click();
 await expect(page.getByRole('button',{name:'달력 접기'})).toBeVisible();
 await page.getByRole('button',{name:'달력 접기'}).click();
 await page.getByRole('button',{name:'다음 달'}).click();
 await expect(page.getByText('2026년 11월')).toBeVisible();
 await page.goto('/calendar?date=2026-10-12');
 await expect(page.getByText('결제 예정 2개')).toBeVisible();
 await page.getByRole('button',{name:'닫기',exact:true}).click();
});

test('community post and comment are retained after reload', async ({page}) => {
 await page.goto('/community');
 await page.getByRole('button',{name:'글쓰기',exact:true}).click();
 await page.getByRole('button',{name:'서비스 선택'}).click();
 await page.getByRole('button',{name:'넷플릭스',exact:true}).click();
 await page.getByPlaceholder('제목을 입력해주세요').fill('테스트 모집 글');
 // Form placeholders and membership fields are checked against the original screen.
 await page.getByPlaceholder('2', {exact:true}).fill('1');
 await page.getByPlaceholder('4', {exact:true}).fill('4');
 await page.getByPlaceholder('모집 조건, 정산 방법 등을 자유롭게 적어주세요.').fill('함께 구독료를 나눠요.');
 await page.getByRole('checkbox').click();
 await page.getByRole('button',{name:'게시하기',exact:true}).click();
 await expect(page.getByText('테스트 모집 글')).toBeVisible();
 await page.reload();
 await page.getByText('테스트 모집 글').click();
 await page.getByRole('button',{name:/댓글/}).click();
 await page.getByRole('textbox',{name:'댓글 내용'}).fill('참여하고 싶어요');
 await page.getByRole('button',{name:'댓글 등록'}).click();
 await expect(page.getByRole('dialog').getByText('참여하고 싶어요')).toBeVisible();
 await page.getByRole('button',{name:'닫기',exact:true}).click();
 await page.reload();
 await expect(page.getByText('참여하고 싶어요')).toBeVisible();
});

test('profile, budget and export', async ({page}) => {
 await page.goto('/my');
 await page.getByRole('button',{name:'프로필 편집',exact:true}).click();
 await page.getByRole('textbox',{name:'이름',exact:true}).fill('웹 사용자');
 await page.getByRole('button',{name:'저장',exact:true}).click();
 await page.reload();
 await expect(page.getByText('웹 사용자')).toBeVisible();
 await page.getByRole('button',{name:/월 예산/}).click();
 await page.getByRole('spinbutton').fill('150000');
 await page.getByRole('button',{name:'저장',exact:true}).click();
 await expect(page.getByText('150,000원')).toBeVisible();
 const download = page.waitForEvent('download');
 await page.getByRole('button',{name:/데이터 내보내기/}).click();
 expect((await download).suggestedFilename()).toBe('routineslim-subscriptions.csv');
});

test('all original routes render without browser errors', async ({page}) => {
 const errors: string[]=[]; page.on('pageerror', e=>errors.push(e.message));
 for (const path of ['/onboarding','/login','/subscription/add','/subscription/manual','/subscription/scan','/subscription/scan-result','/usage','/usage/cleanup?ids=netflix,disney-plus','/usage/compare?selection=netflix:cancel','/community/write','/community/post-1']) {
   await page.goto(path); await expect(page.locator('.app-content')).not.toBeEmpty();
   await page.waitForTimeout(120);
 }
 expect(errors).toEqual([]);
});

test('scan accepts a real image and clearly labels demo recognition', async ({page}) => {
 await page.goto('/subscription/scan');
 await page.locator('input[type=file]').setInputFiles({name:'receipt.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=','base64')});
 await expect(page).toHaveURL(/scan-result/);
 await expect(page.getByText('체험용 예시 결과예요')).toBeVisible();
 await expect(page.getByText('receipt.png')).toBeVisible();
 await page.getByRole('button',{name:'원본 이미지 크게 보기'}).click();
 await expect(page.getByRole('img',{name:'선택한 영수증'})).toBeVisible();
 await page.getByRole('button',{name:'닫기',exact:true}).click();
 await page.getByRole('textbox',{name:'서비스 이름',exact:true}).fill('테스트 이미지 구독');
 await page.getByRole('button',{name:/저장|업데이트/}).click();
 await expect(page).toHaveURL(/\/home$/);
 await page.getByText('전체 7개 보기 ›').click();
 await expect(page.getByText('테스트 이미지 구독')).toHaveCount(2);
 await expect(page.getByText('테스트 이미지 구독').first()).toBeVisible();
});

test('cleanup plan is saved without cancelling actual subscriptions', async ({page}) => {
 await page.goto('/usage/compare?selection=netflix:cancel');
 await page.getByRole('button',{name:'정리 목록에 담기',exact:true}).click();
 await expect(page).toHaveURL(/\/home$/);
 expect(await page.evaluate(() => JSON.parse(localStorage.getItem('routineslim.cleanup.v1')!))).toEqual({netflix:'cancel'});
 await expect(page.getByText('이용 중 6개')).toBeVisible();
});

test('onboarding and demo login preserve browser navigation and do not store passwords', async ({page}) => {
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 await expect(page).toHaveURL(/onboarding/);
 await page.getByRole('button',{name:'건너뛰기',exact:true}).click();
 await expect(page.getByText(/체험 모드 ·/)).toBeVisible();
 await page.getByPlaceholder('이메일 또는 아이디').fill('sample-user');
 await page.getByPlaceholder('비밀번호 입력').fill('never-save-this');
 await page.getByRole('button',{name:'로그인',exact:true}).click();
 await expect(page).toHaveURL(/\/home$/);
 await page.goto('/');
 await expect(page).toHaveURL(/\/home$/);
 expect(await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage}))).not.toContain('never-save-this');
});
