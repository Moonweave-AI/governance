# エンジニアリングと品質の意味論コア

- エンジニアリング変更は追跡可能、再現可能、レビュー可能、検証可能、ロールバック可能であること。
- ライフサイクル：Engineering Ready → Brief → Technical Decision/ADR → 環境と足場 → 実装 → ローカル検証 → PR → CI Gates → Required Review → Merge → 成果物 → Staging/Preview/Simulation → Release Readiness → Rollout → Post-deploy Verification → フィードバックループ。
- プロトタイプは学習のため。Owner、テスト、ドキュメント、セキュリティレビュー、運用責任なしに暗黙に本番依存になってはならない。
- 品質は証拠であり感覚ではない。設計、実装、自動化、セキュリティ、サプライチェーン、データ、モデル、運用、ユーザー、身体性の証拠を網羅。
- 小さなテストは多く、大きなテストは少なく。重要パスはエンドツーエンド必須。Flaky test それ自体が欠陥。
- Merge は完了ではなく、Deploy は成功ではない。Done にはドキュメント、監視、ロールバック、Owner 受領、以降の問題記録が含まれる。
