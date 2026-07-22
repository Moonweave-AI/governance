# Governanceされたエンジニアリング実装：ポータブルGovernance契約

## コア制約

- リスク：S0 ドキュメント、S1 実験、S2 コンポーネント、S3 サービス、S4 AI/Agent、S5 Embodiment、BLOCKED は推進を禁止。
- 品質：QA-L0 ドラフト、L1 実験、L2 保守コンポーネント、L3 本番サービス、L4 AI/Agent、L5 Embodiment/安全クリティカル。
- 責任：正式資産にはOwner、活発な推進にはDRI、重要/高リスク資産にはBackup Ownerがある。
- 事実：GitHubはエンジニアリング事実、RFC/ADRは意思決定、ナレッジベースは組織記憶、チャットは調整のみを担う。
- 証拠：未実行テスト、未完了Review、未取得承認、未観察実行結果を主張しない。
- Security：能力は権限ではない。高リスクアクションは最小権限、監査可能、可逆、人間引き継ぎがある。

## 本スキルの焦点

- mainに直接pushしない
- CI/Reviewは口頭で回避できない
- Agent/Embodiment高リスク能力は特化検証が必須
