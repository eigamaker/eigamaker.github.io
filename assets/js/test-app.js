// Extracted verbatim from test.html inline <script> (P3a).
let test = new PersonalityTest();
let currentAnswer = null;

const t = (key, params = {}) => (typeof i18n !== 'undefined' ? i18n.t(key, params) : key);
const getLang = () => (typeof i18n !== 'undefined' ? i18n.getCurrentLanguage() : 'ja');
const getScoreLabel = (score) => `${score}${t('scoreUnit')}`;
const joinList = (items) => items.join(getLang() === 'ja' ? '、' : ', ');

// 言語切り替え関数
async function refreshQuestionsForLanguage(lang = null) {
    if (typeof getQuestionsFromCSV === 'function') {
        try {
            const csvQuestions = await getQuestionsFromCSV(lang);
            if (csvQuestions && csvQuestions.length > 0) {
                sharedQuestions = csvQuestions;
                test.questions = csvQuestions;
                return csvQuestions;
            }
        } catch (error) {
            console.warn('CSV questions load failed:', error);
        }
    }
    // フォールバック（question id 1～40のみ）
    if (typeof getSharedQuestions === 'function') {
        sharedQuestions = getSharedQuestions();
        sharedQuestions = sharedQuestions.filter(q => q.id >= 1 && q.id <= 40);
    }
    test.questions = sharedQuestions;
    return sharedQuestions;
}

function toggleLangDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
}

// ドロップダウン外クリックで閉じる
document.addEventListener('click', function(event) {
    const langSwitcher = document.querySelector('.lang-switcher');
    const dropdown = document.getElementById('langDropdown');
    if (!langSwitcher || !dropdown) return;
    if (!langSwitcher.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

function switchLanguage(lang) {
    i18n.setLanguage(lang);
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

// リセット関数
function resetTest() {
    const confirmText = t('resetConfirm');
    if (confirm(confirmText)) {
        test.reset();
        currentAnswer = null;
        displayQuestion();
    }
}

// ページコンテンツを更新
function updatePageContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18n.t(key);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else if (element.tagName === 'BUTTON' && element.classList.contains('lang-btn')) {
            // 言語切り替えボタンの場合はテキストのみ更新（data-lang属性は保持）
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    });

    // メタタグを更新（i18n.jsで自動更新されるが、念のため）
    i18n.updateMetaTags();
    
    // 言語ボタンの状態を更新
    i18n.updateLanguageButtons();
    
    // HTMLのlang属性を更新（i18n.jsで既に更新されているが、念のため）
    document.documentElement.lang = i18n.getCurrentLanguage();
}

// 言語変更イベントをリッスン
document.addEventListener('languageChanged', function() {
    updatePageContent();
    refreshQuestionsForLanguage().then(() => {
        // 現在の質問を再表示
        if (document.getElementById('questionSection').classList.contains('active')) {
            displayQuestion();
        }
        if (document.getElementById('resultSection').classList.contains('active')) {
            const activeTab = getActiveResultTabId();
            let results;
            try {
                results = test.calculateResults();
            } catch (error) {
                console.error('Result recalculation error:', error);
                return;
            }
            renderResults(results, activeTab);
        }
    });
});

// 質問を表示
function displayQuestion() {
    const question = test.getCurrentQuestion();
    if (!question) {
        showResults();
        return;
    }

    document.getElementById('questionText').textContent = question.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // 「どちらでもない」の場合は特別なクラスを追加
        if (option.value === 0) {
            btn.classList.add('neutral');
        }
        btn.textContent = option.text;
        btn.onclick = () => selectOption(index, option.value);
        btn.setAttribute('data-value', option.value);
        optionsDiv.appendChild(btn);
    });

    // 進捗を更新
    const progress = test.getProgress();
    document.getElementById('progressText').textContent = i18n.t('questionProgress', {
        current: progress.current,
        total: progress.total
    });
    document.getElementById('progressFill').style.width = `${progress.percentage}%`;

    // 前へボタンの状態
    document.getElementById('btnPrev').disabled = test.currentQuestionIndex === 0;

    // 既に回答済みの場合は選択状態を復元
    const existingAnswer = test.answers.find(a => a.questionId === question.id);
    if (existingAnswer) {
        const optionIndex = question.options.findIndex(o => o.value === existingAnswer.value);
        if (optionIndex !== -1) {
            selectOption(optionIndex, existingAnswer.value, true);
        }
    } else {
        currentAnswer = null;
    }
}

// オプションを選択
function selectOption(index, value, silent = false) {
    currentAnswer = value;
    
    // UIを更新
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
            // 選択時のアニメーション効果
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        } else {
            btn.classList.remove('selected');
        }
    });

    if (!silent) {
        // 回答を保存
        test.saveAnswer(value);
        
        // 自動で次に進む（最後の質問でない場合）
        // 「どちらでもない」を選んだ場合は少し長めの遅延を設ける
        const delay = value === 0 ? 500 : 300;
        setTimeout(() => {
            if (test.currentQuestionIndex < test.questions.length - 1) {
                test.nextQuestion();
            } else {
                // 最後の質問の場合は結果を表示
                showResults();
            }
        }, delay);
    }
}

// 次の質問へ
PersonalityTest.prototype.nextQuestion = function() {
    // currentAnswerがnullの場合は次に進めない（0は有効な回答）
    if (currentAnswer === null) return;
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        displayQuestion();
    } else {
        // 最後の質問の場合は結果を表示
        showResults();
    }
};

// 前の質問へ
PersonalityTest.prototype.previousQuestion = function() {
    if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        displayQuestion();
    }
};

function getActiveResultTabId() {
    const activeContent = document.querySelector('.result-tab-content.active');
    if (!activeContent) {
        return 'profilecode';
    }
    return activeContent.id.replace('tab-', '');
}

function renderResults(results, activeTabId = 'profilecode') {
    const resultsDiv = document.getElementById('results');
    const tabsDiv = document.getElementById('resultTabs');
    resultsDiv.innerHTML = '';
    tabsDiv.innerHTML = '';

    const tabs = [
        { id: 'profilecode', name: i18n.t('tabProfilecode') },
        { id: 'mbti', name: i18n.t('tabMBTI') },
        { id: 'sixteenFactor', name: i18n.t('tab16PF') },
        { id: 'disc', name: i18n.t('tabDISC') }
    ];

    const normalizedActiveTab = tabs.some(tab => tab.id === activeTabId) ? activeTabId : 'profilecode';

    tabs.forEach((tab) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `result-tab ${tab.id === normalizedActiveTab ? 'active' : ''}`;
        tabBtn.textContent = tab.name;
        tabBtn.onclick = () => switchTab(tab.id);
        tabsDiv.appendChild(tabBtn);
    });

    const profilecodeContent = document.createElement('div');
    profilecodeContent.className = `result-tab-content ${normalizedActiveTab === 'profilecode' ? 'active' : ''}`;
    profilecodeContent.id = 'tab-profilecode';
    profilecodeContent.innerHTML = generateProfilecodeResult(results.profilecode);
    resultsDiv.appendChild(profilecodeContent);

    const mbtiContent = document.createElement('div');
    mbtiContent.className = `result-tab-content ${normalizedActiveTab === 'mbti' ? 'active' : ''}`;
    mbtiContent.id = 'tab-mbti';
    mbtiContent.innerHTML = generateMBTIResult(results.mbti);
    resultsDiv.appendChild(mbtiContent);

    const sixteenFactorContent = document.createElement('div');
    sixteenFactorContent.className = `result-tab-content ${normalizedActiveTab === 'sixteenFactor' ? 'active' : ''}`;
    sixteenFactorContent.id = 'tab-sixteenFactor';
    sixteenFactorContent.innerHTML = generateSixteenFactorResult(results.sixteenFactor);
    resultsDiv.appendChild(sixteenFactorContent);

    const discContent = document.createElement('div');
    discContent.className = `result-tab-content ${normalizedActiveTab === 'disc' ? 'active' : ''}`;
    discContent.id = 'tab-disc';
    discContent.innerHTML = generateDISCRresult(results.disc);
    resultsDiv.appendChild(discContent);
}

// 結果を表示
async function showResults() {
    document.getElementById('questionSection').classList.remove('active');
    document.getElementById('resultSection').classList.add('active');

    // SEO: 結果ページにnoindex,followを追加
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex,follow');
    
    let googlebotMeta = document.querySelector('meta[name="googlebot"]');
    if (!googlebotMeta) {
        googlebotMeta = document.createElement('meta');
        googlebotMeta.setAttribute('name', 'googlebot');
        document.head.appendChild(googlebotMeta);
    }
    googlebotMeta.setAttribute('content', 'noindex,follow');
    
    // canonicalを追加
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://profilecode.codes/test.html');

    let results;
    try {
        results = test.calculateResults();
        // デバッグ: 結果が正しく計算されているか確認
        console.log('診断結果:', results);
        console.log('16PF結果:', results.sixteenFactor);
        console.log('DISC結果:', results.disc);
    } catch (error) {
        console.error('診断結果の計算エラー:', error);
        alert(t('resultsError'));
        return;
    }
    
    // 診断完了イベント
    gtag('event', 'test_completed', {
        'event_category': '診断',
        'event_label': '性格診断',
        'value': 1,
        'total_questions': test.questions.length,
        'answered_questions': test.answers.length
    });
    
    // 結果表示イベント（Profilecode診断）
    gtag('event', 'result_viewed', {
        'event_category': '診断',
        'event_label': 'Profilecode診断',
        'result_type': results.profilecode.career.type,
        'career_type': results.profilecode.career.typeInfo.name,
        'learning_type': results.profilecode.learning.typeInfo.name
    });
    
    // 結果表示イベント（MBTI）
    gtag('event', 'result_viewed', {
        'event_category': '診断',
        'event_label': 'MBTI',
        'mbti_type': results.mbti.type
    });
    
    // 結果表示イベント（16PF）
    gtag('event', 'result_viewed', {
        'event_category': '診断',
        'event_label': '16PF'
    });
    
    // 結果表示イベント（DISC）
    gtag('event', 'result_viewed', {
        'event_category': '診断',
        'event_label': 'DISC',
        'disc_style': results.disc.primaryStyle
    });
    
    renderResults(results);
    renderShareCard(results);

    // ログイン状態をチェックして保存提案UIを表示
    await showSaveOption(results);
}

// 保存提案UIを表示
async function showSaveOption(results) {
    const saveOptionDiv = document.getElementById('saveOption');
    if (!saveOptionDiv) return;
    
    // ログイン状態をチェック
    const authStatus = await checkAuthStatus();
    
    if (authStatus.isLoggedIn) {
        // ログイン済みの場合、自動保存を試みる
        saveOptionDiv.innerHTML = `
            <div class="save-option-card">
                <p>${t('saveInProgress')}</p>
            </div>
        `;
        
        try {
            const saveResult = await saveDiagnosisResultsToSupabase(
                results,
                test.answers,
                test.questions
            );
            
            if (saveResult.success) {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card success">
                        <p>${t('saveSuccess')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            } else if (saveResult.code === 'DUPLICATE') {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card info">
                        <p>${t('saveExists')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            } else {
                const saveErrorMessage = saveResult.error ? `: ${saveResult.error}` : '';
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card error">
                        <p>${t('saveFailed', { error: saveErrorMessage })}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('?????:', error);
            const errorMessage = error && error.message ? `: ${error.message}` : '';
            saveOptionDiv.innerHTML = `
                <div class="save-option-card error">
                    <p>${t('saveFailed', { error: errorMessage })}</p>
                </div>
            `;
        }
    } else {
        // 未ログインの場合、保存提案を表示
        saveOptionDiv.innerHTML = `
            <div class="save-option-card">
                <h3>${i18n.t('saveOptionTitle')}</h3>
                <p>${i18n.t('saveOptionMessage')}</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                    ${i18n.t('saveOptionDescription')}
                </p>
                <button class="save-btn" onclick="showRegisterModal()">${i18n.t('createAccount')}</button>
                <button class="save-btn" onclick="showLoginModal()" style="background: #f0f0f0; color: #333; margin-left: 10px;">${i18n.t('login')}</button>
                <button class="skip-btn" onclick="hideSaveOption()">${i18n.t('skipForNow')}</button>
            </div>
        `;
    }
}

// 保存提案を非表示
function hideSaveOption() {
    const saveOptionDiv = document.getElementById('saveOption');
    if (saveOptionDiv) {
        saveOptionDiv.innerHTML = '';
    }
}

// メールアドレス登録モーダルを表示
function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'flex';
        // フォームをリセット
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const errorDiv = document.getElementById('registerError');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
    }
}

// メールアドレス登録モーダルを非表示
function hideRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ログインモーダルを表示
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        // フォームをリセット
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const errorDiv = document.getElementById('loginError');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
    }
}

// ログインモーダルを非表示
function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ログイン処理
async function handleLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const errorDiv = document.getElementById('loginError');
    const submitBtn = document.getElementById('loginSubmitBtn');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        if (errorDiv) {
            errorDiv.textContent = t('loginErrorMissing');
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    // ボタンを無効化
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('loginProcessing');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    try {
        // ログイン
        const loginResult = await loginWithEmail(email, password);
        
        if (!loginResult.success) {
            if (errorDiv) {
                errorDiv.textContent = loginResult.error || t('loginError');
                errorDiv.style.display = 'block';
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = t('login');
            }
            return;
        }
        
        // ログイン成功後、Supabaseから解答履歴を同期
        if (typeof syncAnswersFromSupabase === 'function') {
            try {
                const syncResult = await syncAnswersFromSupabase();
                if (syncResult.success && syncResult.answers && syncResult.answers.length > 0) {
                    // 解答履歴を同期した場合、testオブジェクトを更新
                    test.answers = syncResult.answers;
                    test.currentQuestionIndex = syncResult.answers.length;
                    localStorage.setItem('personalityTestAnswers', JSON.stringify(syncResult.answers));
                    console.log('Supabaseから解答履歴を同期しました:', syncResult.answers.length, '件');
                }
            } catch (e) {
                console.warn('解答履歴の同期に失敗しました:', e);
            }
        }
        
        // ??????????????????
        let saveResult = { success: false };
        if (test.answers.length > 0) {
            const results = test.calculateResults();
            saveResult = await saveDiagnosisResultsToSupabase(
                results,
                test.answers,
                test.questions
            );
        }
        
        // モーダルを閉じて、保存完了メッセージを表示
        hideLoginModal();
        
        const saveOptionDiv = document.getElementById('saveOption');
        if (saveOptionDiv) {
            if (saveResult.success) {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card success">
                        <p>${t('loginSuccessSaved')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            } else if (saveResult.code === 'DUPLICATE') {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card info">
                        <p>${t('loginSuccessExists')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            } else {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card info">
                        <p>${t('loginSuccessSaveFailed')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('ログイン処理エラー:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || t('loginErrorGeneric');
            errorDiv.style.display = 'block';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t('login');
        }
    }
}

// ログアウト処理
async function handleLogout() {
    try {
        const result = await logout();
        if (result.success) {
            // 保存提案UIを更新
            const saveOptionDiv = document.getElementById('saveOption');
            if (saveOptionDiv) {
                const results = test.calculateResults();
                await showSaveOption(results);
            }
        }
    } catch (error) {
        console.error('ログアウト処理エラー:', error);
        alert(t('logoutFailed', { error: error.message }));
    }
}

// メールアドレス登録処理
async function handleRegister() {
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const errorDiv = document.getElementById('registerError');
    const submitBtn = document.getElementById('registerSubmitBtn');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        if (errorDiv) {
            errorDiv.textContent = t('registerErrorMissing');
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    if (password.length < 6) {
        if (errorDiv) {
            errorDiv.textContent = t('registerErrorPasswordLength');
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    // ボタンを無効化
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('registerProcessing');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    try {
        // 1. アカウント作成
        const registerResult = await registerWithEmail(email, password);
        
        if (!registerResult.success) {
            if (errorDiv) {
                errorDiv.textContent = registerResult.error || t('registerError');
                errorDiv.style.display = 'block';
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = t('createAccount');
            }
            return;
        }
        
        // 2. データ移行
        const results = test.calculateResults();
        const migrateResult = await migrateLocalStorageToSupabase(
            registerResult.user.id,
            test.answers,
            test.questions
        );
        
        if (migrateResult.success && migrateResult.migrated) {
            // 3. スコアを保存
            const externalResponseId = crypto.randomUUID();
            await saveDiagnosisScoresToSupabase(
                registerResult.user.id,
                externalResponseId,
                test.answers,
                test.questions,
                results
            );
        }
        
        // 4. 診断結果を保存
        const saveResult = await saveDiagnosisResultsToSupabase(
            results,
            test.answers,
            test.questions
        );
        
        // 5. モーダルを閉じて、保存完了メッセージを表示
        hideRegisterModal();
        
        const saveOptionDiv = document.getElementById('saveOption');
        if (saveOptionDiv) {
            if (saveResult.success) {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card success">
                        <p>${t('registerSuccessSaved')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            } else {
                saveOptionDiv.innerHTML = `
                    <div class="save-option-card info">
                        <p>${t('registerSuccessSaveFailed')}</p>
                        <button class="skip-btn" onclick="handleLogout()" style="margin-top: 10px;">${t('logout')}</button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('登録処理エラー:', error);
        if (errorDiv) {
            errorDiv.textContent = error.message || t('registerErrorGeneric');
            errorDiv.style.display = 'block';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = t('createAccount');
        }
    }
}

// タブ切り替え
function switchTab(tabId) {
    if (typeof pcTrack === 'function') {
        pcTrack('result_tab_viewed', { tab: tabId });
    }
    // タブボタンの状態を更新
    const tabIndexMap = {
        'profilecode': 0,
        'mbti': 1,
        'sixteenFactor': 2,
        'disc': 3
    };
    
    document.querySelectorAll('.result-tab').forEach((tab, index) => {
        if (index === tabIndexMap[tabId]) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // コンテンツの表示を切り替え
    document.querySelectorAll('.result-tab-content').forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Profilecode診断結果を生成
function generateProfilecodeResult(profilecodeResults) {
    const career = profilecodeResults.career;
    const learning = profilecodeResults.learning;
    const careerAdvice = career.typeInfo.advice || t('careerAdviceFallback');
    const learningAdvice = learning.typeInfo.advice || t('learningAdviceFallback');

    return `
        <div class="result-hero t-career-${career.type}">
            <img class="result-hero-avatar" src="/assets/img/characters/career-${career.type}.svg" alt="" width="150" height="150">
            <div class="result-hero-text">
                <div class="result-hero-label">${t('careerAptitude')}</div>
                <h2 class="result-hero-name">${career.typeInfo.name}</h2>
                <span class="result-hero-sub">${t('learningStyle')}: ${learning.typeInfo.name}</span>
            </div>
        </div>
        <div class="result-card">
            <h3>${t('careerAptitude')}: ${career.typeInfo.name}</h3>
            <p style="font-size: 1.1em; margin-bottom: 20px;">${career.typeInfo.description}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('suitableJobs')}</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
                ${career.typeInfo.jobTypes.map(job => `<li>${job}</li>`).join('')}
            </ul>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('workStyle')}</h4>
            <p style="margin-bottom: 20px;">${career.typeInfo.workStyle}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('values')}</h4>
            <p style="margin-bottom: 20px;">${career.typeInfo.values}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('careerAdvice')}</h4>
            <p style="margin-bottom: 20px;">${careerAdvice}</p>
        </div>
        
        <div class="result-card" style="margin-top: 30px;">
            <h3>${t('learningStyle')}: ${learning.typeInfo.name}</h3>
            <p style="font-size: 1.1em; margin-bottom: 20px;">${learning.typeInfo.description}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('optimalLearning')}</h4>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
                ${learning.typeInfo.methods.map(method => `<li>${method}</li>`).join('')}
            </ul>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('learningEnvironment')}</h4>
            <p style="margin-bottom: 20px;">${learning.typeInfo.environment}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('learningTips')}</h4>
            <p style="margin-bottom: 20px;">${learning.typeInfo.tips}</p>
            
            <h4 style="margin-top: 25px; color: #667eea;">${t('learningAdvice')}</h4>
            <p style="margin-bottom: 20px;">${learningAdvice}</p>
        </div>
    `;
}

// MBTI診断結果を生成
function generateMBTIResult(mbtiResults) {
    const typeDescription = mbtiResults.typeDescription || t('mbtiDetailFallback');
    const strengths = mbtiResults.strengths || t('mbtiStrengthsFallback');
    const growthTips = mbtiResults.growthTips || t('mbtiGrowthFallback');
    const careerAdvice = mbtiResults.careerAdvice || t('mbtiCareerFallback');
    const relationships = mbtiResults.relationships || t('mbtiRelationshipsFallback');
    const extroIntroLabel = `${t('extroversion')} / ${t('introversion')}`;
    const sensingIntuitionLabel = `${t('sensing')} / ${t('intuition')}`;
    const thinkingFeelingLabel = `${t('thinking')} / ${t('feeling')}`;
    const judgingPerceivingLabel = `${t('judging')} / ${t('perceiving')}`;

    const mbtiKey = mbtiResults.type.toLowerCase();
    return `
        <div class="reference-result">
            <div class="result-hero result-hero--compact t-mbti-${mbtiKey}">
                <img class="result-hero-avatar" src="/assets/img/characters/mbti-${mbtiKey}.svg" alt="" width="110" height="110">
                <div class="result-hero-text">
                    <div class="result-hero-label">${t('mbtiResult')}</div>
                    <h2 class="result-hero-name">${mbtiResults.type} (${mbtiResults.typeName})</h2>
                </div>
            </div>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('fourIndicators')}</h4>
            <div class="bar-chart" style="margin: 20px 0;">
                <div class="bar-item">
                    <div class="bar-label">
                        <span class="bar-label-name">${extroIntroLabel}</span>
                        <span class="bar-label-value">E: ${Math.round(mbtiResults.scores.E)} | I: ${Math.round(mbtiResults.scores.I)}</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.E / (mbtiResults.scores.E + mbtiResults.scores.I)) * 100}%;">E</div>
                    </div>
                    <div class="bar-container" style="margin-top: 5px;">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.I / (mbtiResults.scores.E + mbtiResults.scores.I)) * 100}%;">I</div>
                    </div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">
                        <span class="bar-label-name">${sensingIntuitionLabel}</span>
                        <span class="bar-label-value">S: ${Math.round(mbtiResults.scores.S)} | N: ${Math.round(mbtiResults.scores.N)}</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.S / (mbtiResults.scores.S + mbtiResults.scores.N)) * 100}%;">S</div>
                    </div>
                    <div class="bar-container" style="margin-top: 5px;">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.N / (mbtiResults.scores.S + mbtiResults.scores.N)) * 100}%;">N</div>
                    </div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">
                        <span class="bar-label-name">${thinkingFeelingLabel}</span>
                        <span class="bar-label-value">T: ${Math.round(mbtiResults.scores.T)} | F: ${Math.round(mbtiResults.scores.F)}</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.T / (mbtiResults.scores.T + mbtiResults.scores.F)) * 100}%;">T</div>
                    </div>
                    <div class="bar-container" style="margin-top: 5px;">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.F / (mbtiResults.scores.T + mbtiResults.scores.F)) * 100}%;">F</div>
                    </div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">
                        <span class="bar-label-name">${judgingPerceivingLabel}</span>
                        <span class="bar-label-value">J: ${Math.round(mbtiResults.scores.J)} | P: ${Math.round(mbtiResults.scores.P)}</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.J / (mbtiResults.scores.J + mbtiResults.scores.P)) * 100}%;">J</div>
                    </div>
                    <div class="bar-container" style="margin-top: 5px;">
                        <div class="bar-fill" style="width: ${(mbtiResults.scores.P / (mbtiResults.scores.J + mbtiResults.scores.P)) * 100}%;">P</div>
                    </div>
                </div>
            </div>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('typeCharacteristics')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${typeDescription}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('strengths')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${strengths}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('growthTips')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${growthTips}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('careerAdvice')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${careerAdvice}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('relationships')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${relationships}</p>
            
            <p class="trademark-notice" style="margin-top: 30px;">⚠️ ${mbtiResults.trademark}</p>
        </div>
    `;
}

// 16PF診断結果を生成
function generateSixteenFactorResult(sixteenFactorResults) {
    if (!sixteenFactorResults || !sixteenFactorResults.topFactors || !sixteenFactorResults.allFactors) {
        console.error('16PF結果が不正です:', sixteenFactorResults);
        return `<div class="reference-result"><p>${t('sixteenFactorError')}</p></div>`;
    }
    
    const topFactorsList = sixteenFactorResults.topFactors.map(factor => {
        const isHigh = factor.score >= 60;
        const barClass = factor.score >= 60 ? 'high' : factor.score >= 40 ? 'medium' : 'low';
        return `
            <div style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div class="bar-label" style="margin-bottom: 10px;">
                    <span class="bar-label-name" style="font-size: 1.1em;">${factor.name}</span>
                    <span class="bar-label-value" style="font-size: 1.1em;">${getScoreLabel(factor.score)}</span>
                </div>
                <div class="bar-container" style="margin-bottom: 10px;">
                    <div class="bar-fill ${barClass}" style="width: ${factor.score}%;">${factor.score}</div>
                </div>
                <p style="margin: 10px 0 5px 0; font-size: 0.95em; color: #666;">${factor.description}</p>
                <p style="margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; font-size: 0.9em; border-left: 3px solid ${isHigh ? '#4CAF50' : '#2196F3'};">
                    ${isHigh ? factor.high : factor.low}
                </p>
                <p style="margin: 10px 0; padding: 10px; background-color: #e8f4f8; border-radius: 5px; font-size: 0.9em;">
                    <strong>${t('adviceLabel')}:</strong> ${factor.advice}
                </p>
            </div>
        `;
    }).join('');

    return `
        <div class="reference-result">
            <h4>${t('sixteenFactorResult')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${t('sixteenFactorOverview')}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('topFactors')}</h4>
            <ul style="margin: 20px 0; line-height: 1.8; list-style: none; padding: 0;">
                ${topFactorsList}
            </ul>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('allFactorsChart')}</h4>
            <div class="radar-container">
                ${sixteenFactorResults.allFactors.map(factor => {
                    const radarClass = factor.score >= 60 ? 'high' : factor.score >= 40 ? 'medium' : 'low';
                    return `
                        <div class="radar-item ${radarClass}">
                            <div class="radar-name">${factor.name}</div>
                            <div class="radar-score">${factor.score}</div>
                            <div class="radar-description">${factor.description}</div>
                            <div class="bar-container" style="margin-top: 15px;">
                                <div class="bar-fill ${radarClass}" style="width: ${factor.score}%;">${getScoreLabel(factor.score)}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('allFactorsBar')}</h4>
            <div class="bar-chart" style="margin: 20px 0;">
                ${sixteenFactorResults.allFactors.map(factor => {
                    const barClass = factor.score >= 60 ? 'high' : factor.score >= 40 ? 'medium' : 'low';
                    return `
                        <div class="bar-item">
                            <div class="bar-label">
                                <span class="bar-label-name">${factor.name}</span>
                                <span class="bar-label-value">${getScoreLabel(factor.score)}</span>
                            </div>
                            <div class="bar-container">
                                <div class="bar-fill ${barClass}" style="width: ${factor.score}%;">${factor.score}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('howToUse')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${t('sixteenFactorHowToUseDetail')}</p>
            
            <p class="trademark-notice" style="margin-top: 30px;">⚠️ ${sixteenFactorResults.trademark}</p>
        </div>
    `;
}

// DISC診断結果を生成
function generateDISCRresult(discResults) {
    if (!discResults || !discResults.allStyles || !discResults.styleInfo) {
        return `<div class="reference-result"><p>${t('discError')}</p></div>`;
    }

    return `
        <div class="reference-result">
            <h4>${t('discResult')}</h4>
            <p style="font-size: 1.3em; font-weight: bold; margin: 20px 0;">${t('primaryStyle')}: ${discResults.styleInfo.name}</p>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.description}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('fourStyles')}</h4>
            <div class="disc-chart">
                ${discResults.allStyles.map(style => `
                    <div class="disc-item">
                        <div class="disc-circle ${style.style}">${style.style}</div>
                        <div class="disc-label">${style.name}</div>
                        <div class="disc-score">${getScoreLabel(style.score)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="bar-chart" style="margin: 20px 0;">
                ${discResults.allStyles.map(style => {
                    const barClass = style.score >= 70 ? 'high' : style.score >= 50 ? 'medium' : 'low';
                    return `
                        <div class="bar-item">
                            <div class="bar-label">
                                <span class="bar-label-name">${style.name}</span>
                                <span class="bar-label-value">${getScoreLabel(style.score)}</span>
                            </div>
                            <div class="bar-container">
                                <div class="bar-fill ${barClass}" style="width: ${style.score}%;">${style.score}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('styleCharacteristics')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;"><strong>${t('traits')}:</strong> ${joinList(discResults.styleInfo.traits)}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('strengths')}</h4>
            <ul style="margin: 20px 0; line-height: 1.8;">
                ${discResults.styleInfo.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('weaknesses')}</h4>
            <ul style="margin: 20px 0; line-height: 1.8;">
                ${discResults.styleInfo.weaknesses.map(w => `<li>${w}</li>`).join('')}
            </ul>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('workStyle')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.workStyle}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('communicationStyle')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.communication}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('careerAdvice')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.careerAdvice}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('relationships')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.relationships}</p>
            
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('growthTips')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;">${discResults.styleInfo.growthTips}</p>
            
            ${discResults.secondaryStyleInfo ? `
            <h4 style="margin-top: 25px; color: #ff8c00;">${t('secondaryStyle')}</h4>
            <p style="margin: 20px 0; line-height: 1.8;"><strong>${discResults.secondaryStyleInfo.name}:</strong> ${discResults.secondaryStyleInfo.description}</p>
            <p style="margin: 20px 0; line-height: 1.8;">${t('discSecondaryStyleNote')}</p>
            ` : ''}
            
            <p class="trademark-notice" style="margin-top: 30px;">⚠️ ${discResults.trademark}</p>
        </div>
    `;
}

// リセットして再開
PersonalityTest.prototype.resetAndRestart = function() {
    this.reset();
    currentAnswer = null;
    document.getElementById('resultSection').classList.remove('active');
    document.getElementById('questionSection').classList.add('active');
    document.getElementById('results').innerHTML = '';
    displayQuestion();
};

// 診断開始イベント（初回のみ）
let testStartedTracked = false;

// 初期化（ログイン時はSupabaseから解答履歴を同期）
async function initializeTest() {
    // ログイン状態をチェック
    const authStatus = await checkAuthStatus();
    
    if (authStatus.isLoggedIn) {
        // ログイン済みの場合、Supabaseから解答履歴を同期
        if (typeof syncAnswersFromSupabase === 'function') {
            try {
                const syncResult = await syncAnswersFromSupabase();
                if (syncResult.success && syncResult.answers && syncResult.answers.length > 0) {
                    console.log('Supabaseから解答履歴を同期しました:', syncResult.answers.length, '件');
                }
            } catch (e) {
                console.warn('解答履歴の同期に失敗しました:', e);
            }
        }
    }
    
    await refreshQuestionsForLanguage();
    
    // LocalStorageから解答を読み込み
    test.loadAnswers();
    
    // ページコンテンツを初期化
    updatePageContent();
    
    // 診断開始をトラッキング（初回質問表示時）
    if (test.answers.length === 0 && !testStartedTracked) {
        gtag('event', 'test_started', {
            'event_category': '診断',
            'event_label': '性格診断',
            'value': 1
        });
        testStartedTracked = true;
    }
    
    displayQuestion();
}

// キーボード 1-5 で回答を選択(質問画面のみ)
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('questionSection').classList.contains('active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 5) {
        const btns = document.querySelectorAll('#options .option-btn');
        if (btns[n - 1]) btns[n - 1].click();
    }
});

// 結果の共有カード(P5で相性診断リンクに拡張予定)
function buildResultSummary(results) {
    const lines = [
        `Profilecode ${t('results')}`,
        `${t('careerAptitude')}: ${results.profilecode.career.typeInfo.name}`,
        `${t('learningStyle')}: ${results.profilecode.learning.typeInfo.name}`,
        `MBTI: ${results.mbti.type} (${results.mbti.typeName})`,
        'https://profilecode.codes/'
    ];
    return lines.join('\n');
}

function renderShareCard(results) {
    const el = document.getElementById('shareCard');
    if (!el) return;
    window.__pcLastResults = results;
    const canShare = typeof navigator.share === 'function';

    // 相性診断への導線: ?return=compat で来た場合は「相性診断にもどる」を最優先表示
    const returnCompat = new URLSearchParams(location.search).get('return') === 'compat';
    const compatReturnHtml = returnCompat ? `
        <div class="share-card share-card--compat">
            <h3>${t('compatReturnTitle')}</h3>
            <p>${t('compatReturnDesc')}</p>
            <div class="share-card-buttons">
                <a class="action-btn btn-share" href="/compatibility/" onclick="pcTrack('compat_gate_test_started', {step: 'returned'})">${t('compatReturnButton')}</a>
            </div>
        </div>` : '';

    el.innerHTML = `
        ${compatReturnHtml}
        <div class="share-card">
            <h3>${t('shareResultTitle')}</h3>
            <p>${t('shareResultDesc')}</p>
            <div class="share-card-buttons">
                <a class="action-btn btn-share" href="/compatibility/" onclick="pcTrack('compat_share_opened', {method: 'result_card'})">${t('compatOpenButton')}</a>
                ${canShare ? `<button class="action-btn btn-share-copy" onclick="shareResult()">${t('shareButton')}</button>` : ''}
                <button class="action-btn btn-share-copy" onclick="copyResultSummary(this)">${t('copyButton')}</button>
            </div>
        </div>`;
}

async function shareResult() {
    if (!window.__pcLastResults) return;
    if (typeof pcTrack === 'function') pcTrack('compat_share_opened', { method: 'webshare' });
    try {
        await navigator.share({ text: buildResultSummary(window.__pcLastResults) });
    } catch (e) {
        /* user cancelled */
    }
}

async function copyResultSummary(btn) {
    if (!window.__pcLastResults) return;
    if (typeof pcTrack === 'function') pcTrack('compat_share_opened', { method: 'copy' });
    try {
        await navigator.clipboard.writeText(buildResultSummary(window.__pcLastResults));
        const original = btn.textContent;
        btn.textContent = t('copiedToast');
        setTimeout(() => { btn.textContent = original; }, 1600);
    } catch (e) {
        /* clipboard unavailable (http) — silently ignore */
    }
}

// 初期化を実行
initializeTest();
