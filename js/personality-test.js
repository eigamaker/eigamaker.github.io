// 性格診断メインロジック

class PersonalityTest {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.questions = sharedQuestions;
    this.profilecodeCalculator = new ProfilecodeCalculator();
    this.fourIndicatorCalculator = new FourIndicatorCalculator();
  }

  // 現在の質問を取得
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  // 回答を保存
  saveAnswer(value) {
    const question = this.getCurrentQuestion();
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

    // 4指標診断（参考）
    const fourIndicatorResults = this.fourIndicatorCalculator.calculate(
      this.answers,
      this.questions
    );

    return {
      profilecode: profilecodeResults,
      fourIndicator: fourIndicatorResults
    };
  }

  // 回答をリセット
  reset() {
    this.currentQuestionIndex = 0;
    this.answers = [];
    localStorage.removeItem('personalityTestAnswers');
  }

  // 保存された回答を読み込み
  loadAnswers() {
    const saved = localStorage.getItem('personalityTestAnswers');
    if (saved) {
      this.answers = JSON.parse(saved);
      this.currentQuestionIndex = this.answers.length;
    }
  }
}

