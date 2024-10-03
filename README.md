这是一个正在开发的Minecraft AI 机器人Koneko，使用有限状态机进行计算。

Node.js v20.17.0

```mermaid
stateDiagram
    Idle --> AttackHostiles
    Idle --> Dive
    Idle --> FollowPlayer
    Idle --> AttackPlayer

    FollowPlayer --> Idle
    FollowPlayer --> AttackHostiles
    FollowPlayer --> AttackPlayer

    AttackHostiles --> Idle
    AttackHostiles --> Dive
    
    AttackPlayer --> Idle
    AttackPlayer --> AttackHostiles
    
    Dive --> Idle
    Dive --> AttackHostiles
```