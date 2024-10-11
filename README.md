这是一个正在开发的Minecraft AI 机器人Koneko，使用有限状态机进行计算。

Node.js v20.17.0

```mermaid
stateDiagram
    IdleState --> AttackHostilesState
    IdleState --> AttackPlayerState
    IdleState --> DiveState
    IdleState --> FollowPlayerState
    IdleState --> SleepState
    IdleState --> HarvestState
    IdleState --> LoggingState
    AttackHostilesState --> IdleState
    AttackHostilesState --> HarvestState
    AttackPlayerState --> IdleState
    AttackPlayerState --> AttackHostilesState
    DiveState --> IdleState
    DiveState --> FollowPlayerState
    FollowPlayerState --> IdleState
    FollowPlayerState --> DiveState
    FollowPlayerState --> AttackHostilesState
    SleepState --> IdleState
    HarvestState --> IdleState
    LoggingState --> IdleState
```