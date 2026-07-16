// 性格診断メインロジック

class PersonalityTest {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.questions = sharedQuestions;
    this.profilecodeCalculator = new ProfilecodeCalculator();
    this.fourIndicatorCalculator = new FourIndicatorCalculator();
    this.sixteenFactorCalculator = new SixteenFactorCalculator();
    this.discCalculator = new DISCCalculator();
  }

  // 現在の質問を取得
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  // 回答を保存(同じ質問への再回答は上書き。追記だと戻って回答し直した際に
  // 重複が溜まり、スコア計算で二重カウントされるバグがあった)
  saveAnswer(value) {
    const question = this.getCurrentQuestion();
    this.answers = this.answers.filter(a => a.questionId !== question.id);
    this.answers.push({
      questionId: question.id,
      value: value
    });

    // LocalStorageに保存
    localStorage.setItem('personalityTestAnswers', JSON.stringify(this.answers));
  }

  // 次の質問へ
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  // 前の質問へ
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  // 進捗を取得
  getProgress() {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length,
      percentage: Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100)
    };
  }

  // 診断結果を計算
  calculateResults() {
    // Profilecode診断（独自）
    const profilecodeResults = this.profilecodeCalculator.calculateAll(
      this.answers,
      this.questions
    );

    // MBTI診断（参考）
    const mbtiResults = this.fourIndicatorCalculator.calculate(
      this.answers,
      this.questions
    );

    // 16PF診断（参考）
    const sixteenFactorResults = this.sixteenFactorCalculator.calculate(
      this.answers,
      this.questions
    );

    // DISC診断（参考）
    const discResults = this.discCalculator.calculate(
      this.answers,
      this.questions
    );

    return {
      profilecode: profilecodeResults,
      mbti: mbtiResults,
      sixteenFactor: sixteenFactorResults,
      disc: discResults
    };
  }

  // 回答をリセット
  reset() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    localStorage.removeItem('personalityTestAnswers');
  }

  // 保存された回答を読み込み(旧バージョンが残した重複は最後の回答を有効として除去)
  loadAnswers() {
    const saved = localStorage.getItem('personalityTestAnswers');
    if (saved) {
      const raw = JSON.parse(saved);
      const byId = {};
      raw.forEach(a => { byId[a.questionId] = a; });
      this.answers = Object.values(byId);
      this.currentQuestionIndex = this.answers.length;
    }
  }
}

