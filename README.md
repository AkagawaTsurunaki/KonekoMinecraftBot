这是一个正在开发的Minecraft AI 机器人Koneko，使用有限状态机进行计算。

Node.js v20.17.0

```mermaid
stateDiagram
    IdleState --> AttackHostilesState
    IdleState --> AttackPlayerState
    AttackHostilesState --> IdleState
    AttackPlayerState --> IdleState
    AttackPlayerState --> AttackHostilesState
```