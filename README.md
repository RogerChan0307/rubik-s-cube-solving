# rubik-s-cube-solving
## Introduction
- This project is to find some methods to solve a specific form of Rubik's Cube.
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
