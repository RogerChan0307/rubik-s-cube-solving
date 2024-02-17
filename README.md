# rubik-s-cube-solving
## Project URL
- https://rogerchan0307.github.io/rubik-s-cube-solving/
## Introduction
- In this project, I will create an interactive virtual 2x2 cube using Javascript and the HTML canvas element. The goals are to render a graphical cube interface, enabling rotating the faces by clicking, dragging, and 90 degree turns to randomly scramble then solve the cube.

## Future works and improvements
1. Expand to larger cube sizes:
Support 3x3, 4x4 or higher order Rubik's cubes. This would require modeling more complex cubie mechanics. A generalized class could be created to work for Rubik's cubes of any size.
2. Mobile/touch support: 
Make the simulator responsive for mobile devices and add touch/swipe functionality instead of click/drag for rotations.
3. Multiplayer features: 
Add real-time multiplayer support to race against other players scrambling/solving remote cubes. Leaderboards could track fastest times.
4. Virtual Reality mode:
Enable a VR experience where puzzles can be manipulated and explored in an immersive 3D environment for extra engagement.
## Conclusion
- Working on this Rubik's cube project ended up being more challenging than I initially anticipated, but ultimately a rewarding learning experience. I had thought that modeling a simple 2x2 cube would be fairly straightforward. However, I gained a new appreciation for the complexity of mapping out all the possible cube states and implementing the rotation logic.
The most difficult part was conceptualizing how each cube twist transforms the positions of the individual cubes in three-dimensional space. I learned that every rotation needs to account for all 8 cubes and properly swap their ordering. My first attempts had various bugs - cubes disappearing, duplicates appearing, or movements not matching a real puzzle. Visualizing the transformations and correctly applying matrix operations took some time grasping.
On the positive side, I'm proud of the final working simulator with its colorful graphical animation. The interface allows intuitive play just like a physical Rubik's cube. I also managed to add a scramble function and automated solving using an algorithm I researched. The project improved my skills in Javascript animations, math visualization, and most importantly taking a complex system and breaking it down into logical steps.
---
# Other Notes

## Tasks
- building simulation models
 <img width="309" alt="Screenshot 2023-11-04 at 18 29 30" src="https://github.com/RogerChan0307/rubik-s-cube-solving/assets/140886171/f65a80f3-61f0-4a4d-859a-289aa4301fc6">

## Issues
### 1.尋找成功的結果
 - 在跑完約25幾萬次模擬後檢視20萬筆的方塊狀態 只有一筆是完整的 而那一次是最初還沒shuffle的時候 後來發現因為程式的寫法導致八顆角塊有一顆不管怎麼轉都不會移動 因此只會有一種完成的結果
 - 轉移的結果沒有記錄到成功的狀態
   - 調整shuffle的程式 讓成功數增加


## Simulation analysis
### 1st simulation : 250K random shuffles
- node的數次還持續增加
- 連結到成功頁面的機率太低
- 調整shuffle的程式 讓成功數增加

| node  | edge | edge( connected to success-node)  | Forth Header |
| ------------- | ------------- | ------------- | ------------- |
| 206015  | 255330  | 3  | kkk  |
| Content Cell  | Content Cell  |
 
## Log 
- Project creation -Jul.29.2023
- Complete of 3D model -Nov.03.2023
- Generating random surfaces -Nov.03.2023
- Autimatic problem solving(In progress)
