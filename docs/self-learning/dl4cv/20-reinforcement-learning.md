# Basics

Reinforcement learning 的基本流程就是：

1. input the state
2. do some action
3. output the reward/regret
4. you learn from the reward/regret, and continue on step 1

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_12_1_2_202405211201934.png" alt="image-20240521120100633" style="zoom:33%;" />

## Q-Policy

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_12_4_6_202405211204911.png" alt="image-20240521120404230" style="zoom:50%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_12_1_23_202405211201330.png" alt="image-20240521120120525" style="zoom:50%;" />

如图，bellman function 解读：

- $Q(s,a)$: 就是在 s 状态下做出 a 动作的（当前的）**estimated total reward**。
- $\pi^\ast(s) = \mathop{\max \arg}_{a'}Q(s,a')$: 就是**根据*当前*的估计函数**，我们在 s 状态下做出的最优动作
    - 也就是**当前的 $Q(s,a)$​ 下，我们的策略**
- $Q^\ast(s,a)$: 就是如果以后都按照最优策略行动，那么在 s 状态下做出 a 动作的 **total reward**。

因此，Bellman 方程本质上就是在说：如果一个 $Q$ 是（最优的）$Q^\ast$，那么必须满足的条件。

- 在我们这个版本的 Bellman 方程中，完全没有 $\pi^\ast$
- 因此，$\pi^\ast$ 是由 $Q$ 算出来的，而 $Q^\ast$ 是可以通过迭代等等算法来逐渐逼近的 

由于如果 $Q$ 满足 Bellman 方程，那么 $Q = Q^\ast$。因此，我们的目标就是让 Q 逐渐满足这个方程。比如说可以采用上图中的迭代法。

---

**问题：**如果状态空间和动作空间太大，那么计算量就会非常大；甚至，如果状态和动作是连续而不是离散的，那么根本无从计算。

# Deep Q-Learning

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_12_40_35_202405211240412.png" alt="image-20240521124032494" style="zoom:50%;" />

通过深度学习来拟合 Q 函数。具体流程大概是：

1. 给定某一个 (s,a)，我们可以在其中抽样 r 以及 s，然后就可以估计出 $y_{s,a,\theta}$
2. 然后，计算出 $y_{s,a,\theta}$ 和 $Q(s,a;\theta)$ 之间的距离平方，就可以使用梯度下降来进行优化

## Example: Playing Atari Games

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_12_51_8_202405211251389.png" alt="image-20240521125103956" style="zoom: 50%;" />

如图，网络的输入是 4x84x84 的 4 帧图片，可以视作 $s$；输出的是 4 actions 分别对应的分数，可以视作 $a$。

# Policy Gradient

我们发现，与其制造一个价值估计函数 $Q(s,a)$，然后间接得到策略，不如直接让函数给出策略。

- i.e. 给出**在一个状态 $s$ 下，我们做出动作 $a$ 的概率** $p(a|s)$

我们可以使用 $\theta$ 来参数化这个策略，从而记作 $p_\theta$。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_13_5_13_202405211305097.png" alt="image-20240521130510321" style="zoom: 33%;" />

如上图，我们的目标直截了当：**找到可以最大化收益的策略函数**。因此，一个简单的想法就是梯度上升。

但是，**虽然 $J(\theta)$ 这个函数性质良好（i.e. 可微）**，但是我们**无法直接通过 $\theta$，求出 $J(\theta)$ 的导数**。

- 这大概是因为：$p_\theta$​ 是概率的，因此必须将每一种可能加起来，然后不出几步，就会导致组合爆炸
- *由于需要求关于* $\theta$ 的导数，因此也不能使用蒙特卡洛估计 $J(\theta)$

因此，就采用一个巧妙的变形：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_13_11_11_202405211311941.png" alt="image-20240521131108951" style="zoom:33%;" />

然后，我们可以在 $x \sim p_\theta$ 中采样，然后近似这个导数。

目前的问题就是：$\frac{\partial} {\partial \theta} \log p_\theta (x)$ 如何计算？

---

我们令 $x = (s_0, a_0, s_1, a_1, \dots)$，这就是遵循 $\pi_\theta(a|s)$ 策略之后的轨迹，也是一个随机向量。

那么：
$$
\begin{aligned}
\log p_\theta(x) &= \log \prod_i P(s_{i+1} | s_i, a_i) \pi_\theta(a_i | s_i) \newline 
&= \sum_i \log P(s_{i+1} | s_i, a_i) + \log \pi_\theta(a_i | s_i) \newline
\end{aligned}
$$
由于 $\log P(s_{i+1} | s_i, a_i)$ 与 $\theta$ 无关，因此：
$$
\frac{\partial} {\partial \theta} \log p_\theta (x) = \frac{\partial} {\partial \theta} \sum_i \log \pi_\theta(a_i | s_i) = \sum_i \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i)
$$
从而：
$$
\frac{\partial J} {\partial \theta} = \mathbb E_{x \sim p_\theta}[\left(\sum_{j \geq 0} r_j\right) \left(\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i) \right)]
$$

---

我们要做的，就是

1. 通过 $\pi(a_i | s_i)$，在 $x \sim p_\theta$ 中选取若干的 $(s_0, a_0, s_1, a_1, \dots)$
2. 对于每一个 $x$，计算出 $\sum_{j \geq 0} r_j$ 以及 $\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i)$，并相乘得到 $\left(\sum_{j \geq 0} r_j\right) \left(\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i) \right)$
3. 将每一个 $x$ 的 $\left(\sum_{j \geq 0} r_j\right) \left(\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i) \right)$ 平均起来，就得到了我们最终的导数
4. 最后使用梯度进行更新即可

# Other Approaches of RL

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_17_31_10_202405211731503.png" alt="image-20240521173108606" style="zoom:50%;" />

## 1. Actor-Critic 方法

### 概念
Actor-Critic 是一种结合了策略（Actor）和价值（Critic）两种方法的强化学习算法。Actor 负责选择动作，Critic 负责评估选择的动作有多好（通过计算价值函数）。

### 实例
假设我们有一个智能体在迷宫中寻找出口。

- **Actor（策略网络）**：根据当前的状态选择一个动作，比如“向上”、“向下”、“向左”或“向右”。
- **Critic（价值网络）**：根据当前的状态和 Actor 选择的动作，评估这个动作的好坏。

在训练过程中，Actor 会尝试选择不同的动作，Critic 会给出这些动作的反馈。Actor 使用 Critic 的反馈来调整自己的策略，以便在未来选择更优的动作。

### 代码示例
```python
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers

# 环境初始化
num_states = 5
num_actions = 2

# 构建 Actor 模型
actor_model = tf.keras.Sequential([
    layers.Dense(24, activation='relu'),
    layers.Dense(24, activation='relu'),
    layers.Dense(num_actions, activation='softmax')
])

# 构建 Critic 模型
critic_model = tf.keras.Sequential([
    layers.Dense(24, activation='relu'),
    layers.Dense(24, activation='relu'),
    layers.Dense(1)  # 输出状态值
])

# 示例状态
state = np.random.rand(1, num_states)

# Actor 选择动作
action_probs = actor_model(state)
action = np.argmax(action_probs[0])

# Critic 评估动作
value = critic_model(state)

print(f"选择的动作: {action}, 评估的价值: {value.numpy()[0][0]}")
```

## 2. Model-Based 方法

### 概念
Model-Based RL 使用一个环境模型来预测行动的结果。这种方法与 Model-Free 方法（直接与环境交互而不构建模型）不同。通过环境模型，智能体可以进行前瞻性思考和规划。

### 实例
在自驾车系统中，Model-Based RL 可以通过建立环境模型来预测道路和障碍物的变化，从而规划最优路径。

### 代码示例
```python
import gym
import numpy as np

env = gym.make("CartPole-v1")

# 环境模型（假设为线性模型）
def predict_next_state(state, action):
    # 简单假设，实际环境模型会更复杂
    return state + action

state = env.reset()
action = 1  # 向右推杆
predicted_state = predict_next_state(state, action)

print(f"当前状态: {state}, 预测的下一个状态: {predicted_state}")
```

## 3. Imitation Learning（模仿学习）

### 概念
模仿学习是通过模仿专家（人类或其他智能体）的行为来学习策略。它不需要显式的奖励函数。

### 实例
在模仿驾驶中，通过观察人类司机的驾驶行为，智能体学习如何驾驶。

### 代码示例
```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# 生成模拟专家数据
expert_states = np.random.rand(100, 4)  # 100 个状态
expert_actions = np.random.randint(2, size=100)  # 100 个动作 (0 或 1)

# 训练模仿学习模型
model = RandomForestClassifier()
model.fit(expert_states, expert_actions)

# 新状态
new_state = np.random.rand(1, 4)
predicted_action = model.predict(new_state)

print(f"新状态: {new_state}, 预测的动作: {predicted_action[0]}")
```

## 4. Inverse Reinforcement Learning（逆向强化学习）

### 概念
逆向强化学习通过观察智能体的行为推断出其潜在的奖励函数。换句话说，通过观察智能体的动作，推测其目标是什么。

### 实例
通过观察一个工人在工厂中的操作，可以推测出其工作的奖励机制，比如完成任务的效率和准确性。

### 代码示例
```python
import numpy as np
from sklearn.linear_model import LinearRegression

# 假设我们有一些观察到的状态-动作对和对应的假设奖励
states = np.random.rand(100, 4)
actions = np.random.randint(2, size=100)
rewards = np.random.rand(100)

# 逆向强化学习：根据状态和动作推测奖励函数
model = LinearRegression()
model.fit(np.hstack([states, actions.reshape(-1, 1)]), rewards)

# 新的状态-动作对
new_state = np.random.rand(1, 4)
new_action = np.array([[1]])
predicted_reward = model.predict(np.hstack([new_state, new_action]))

print(f"新状态: {new_state}, 新动作: {new_action}, 预测的奖励: {predicted_reward[0]}")
```

## 5. Adversarial Learning（对抗学习）

### 概念
对抗学习通常用于生成对抗网络（GANs），但在 RL 中也有应用。智能体（生成器）与环境或其他智能体（判别器）进行对抗，以提高策略的鲁棒性。

### 实例
在游戏 AI 中，一个智能体尝试赢得游戏（生成器），而另一个智能体尝试阻止其获胜（判别器），通过这种对抗训练，智能体不断改进。

### 代码示例
```python
import numpy as np

# 简单对抗环境
class SimpleEnv:
    def __init__(self):
        self.state = 0

    def step(self, action):
        self.state += action
        reward = -abs(self.state)  # 判别器的目标是让状态接近0
        return self.state, reward

env = SimpleEnv()
state = env.state
for _ in range(10):
    action = np.random.randint(-1, 2)  # -1, 0, 1
    state, reward = env.step(action)
    print(f"动作: {action}, 新状态: {state}, 奖励: {reward}")
```

# Stochastic Computation Graphs

​                                                            