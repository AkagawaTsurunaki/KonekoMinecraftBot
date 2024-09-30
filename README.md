这是一个正在开发的Minecraft AI 机器人Koneko，使用有限状态机进行计算。

Node.js v20.17.0

```mermaid
stateDiagram
    Main(Idle) --> SearchFood
    SearchFood  --> Eat
    SearchFood --> Hunting
    Hunting --> Cooking
    Cooking --> SearchFood
    SearchFood --> Harvest
    Harvest --> Crafting
    Crafting --> Eat
    Main(Idle) --> FollowPlayer
    Main(Idle) --> FindHostile
    FindHostile --> AttackHostile
    AttackHostile --> FindHostile
    FindHostile --> FindPlayer
    FindPlayer --> GoHome
    FindPlayer --> FollowPlayer
    GoHome --> FollowPlayer
    FollowPlayer --> Main(Idle)
    Main(Idle) --> Dive
    Dive --> Main(Idle)
```